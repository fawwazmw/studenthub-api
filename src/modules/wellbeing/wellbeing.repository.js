const prisma = require('../../config/database');

const create = async (data) => {
  return await prisma.wellbeingEntry.create({
    data,
  });
};

const findMany = async (where = {}) => {
  return await prisma.wellbeingEntry.findMany({
    where,
    orderBy: { date: 'desc' },
  });
};

const findById = async (id) => {
  return await prisma.wellbeingEntry.findUnique({
    where: { id },
  });
};

const findByUserAndDate = async (userId, date) => {
  return await prisma.wellbeingEntry.findUnique({
    where: {
      userId_date: {
        userId,
        date,
      },
    },
  });
};

const update = async (id, data) => {
  return await prisma.wellbeingEntry.update({
    where: { id },
    data,
  });
};

module.exports = {
  create,
  findMany,
  findById,
  findByUserAndDate,
  update,
};
