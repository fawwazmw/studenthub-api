const prisma = require('../../config/database');

const calculateWellbeingScore = (aggregateResult) => {
  if (!aggregateResult || !aggregateResult._avg) {
    return null;
  }

  const values = ['mood', 'energy', 'sleep']
    .map((key) => aggregateResult._avg[key])
    .filter((value) => value !== null && value !== undefined)
    .map((value) => Number(value));

  if (!values.length) {
    return null;
  }

  const score = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Number(score.toFixed(1));
};

const getDashboardData = async (userId) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    user,
    totalTasks,
    completedTasks,
    totalNotes,
    recentNotes,
    upcomingTasks,
    wellbeingEntries,
    wellbeingAverages,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        totalPoints: true,
        currentStreak: true,
      },
    }),
    prisma.task.count({
      where: { userId },
    }),
    prisma.task.count({
      where: { userId, isDone: true },
    }),
    prisma.note.count({
      where: { userId },
    }),
    prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        category: true,
        createdAt: true,
      },
    }),
    prisma.task.findMany({
      where: {
        userId,
        isDone: false,
        dueDate: {
          gte: now,
        },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
    }),
    prisma.wellbeingEntry.findMany({
      where: {
        userId,
        date: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: { date: 'desc' },
      select: {
        date: true,
        mood: true,
        energy: true,
        sleep: true,
      },
    }),
    prisma.wellbeingEntry.aggregate({
      where: { userId },
      _avg: {
        mood: true,
        energy: true,
        sleep: true,
      },
    }),
  ]);

  const wellbeingScore = calculateWellbeingScore(wellbeingAverages) ?? 0;

  return {
    user,
    tasks: {
      total: totalTasks,
      completed: completedTasks,
      upcoming: upcomingTasks,
    },
    recentNotes,
    wellbeingTrend: wellbeingEntries,
    quickStats: {
      notes: totalNotes,
      wellbeingScore,
      streak: user?.currentStreak ?? 0,
      points: user?.totalPoints ?? 0,
    },
  };
};

module.exports = {
  getDashboardData,
};
