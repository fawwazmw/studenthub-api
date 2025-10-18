const prisma = require('../../config/database');

const create = async (data) => {
  return await prisma.task.create({
    data,
  });
};

const findMany = async (where = {}, orderBy = { dueDate: 'asc' }) => {
  return await prisma.task.findMany({
    where,
    orderBy,
  });
};

const findById = async (id) => {
  return await prisma.task.findUnique({
    where: { id },
  });
};

const findUpcoming = async (userId, limit = 5) => {
  return await prisma.task.findMany({
    where: {
      userId,
      isDone: false,
      dueDate: {
        gte: new Date(),
      },
    },
    orderBy: { dueDate: 'asc' },
    take: limit,
  });
};

const update = async (id, data) => {
  return await prisma.task.update({
    where: { id },
    data,
  });
};

const deleteById = async (id) => {
  return await prisma.task.delete({
    where: { id },
  });
};

module.exports = {
  create,
  findMany,
  findById,
  findUpcoming,
  update,
  delete: deleteById,
};
