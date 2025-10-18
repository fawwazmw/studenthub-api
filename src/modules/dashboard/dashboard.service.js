const prisma = require('../../config/database');

const getDashboardData = async (userId) => {
  // Get user stats
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      totalPoints: true,
      currentStreak: true,
    },
  });

  // Get tasks count
  const totalTasks = await prisma.task.count({
    where: { userId },
  });

  const completedTasks = await prisma.task.count({
    where: { userId, isDone: true },
  });

  // Get recent notes
  const recentNotes = await prisma.note.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      title: true,
      category: true,
      createdAt: true,
    },
  });

  // Get upcoming tasks
  const upcomingTasks = await prisma.task.findMany({
    where: {
      userId,
      isDone: false,
      dueDate: {
        gte: new Date(),
      },
    },
    orderBy: { dueDate: 'asc' },
    take: 5,
  });

  // Get wellbeing trend (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const wellbeingEntries = await prisma.wellbeingEntry.findMany({
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
  });

  return {
    user,
    tasks: {
      total: totalTasks,
      completed: completedTasks,
      upcoming: upcomingTasks,
    },
    recentNotes,
    wellbeingTrend: wellbeingEntries,
  };
};

module.exports = {
  getDashboardData,
};
