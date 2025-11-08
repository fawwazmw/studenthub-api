const prisma = require('../../config/database');

const create = async (data) => {
  return await prisma.note.create({
    data,
  });
};

const findMany = async (where = {}) => {
  return await prisma.note.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

const findById = async (id) => {
  return await prisma.note.findUnique({
    where: { id },
  });
};

const update = async (id, data) => {
  return await prisma.note.update({
    where: { id },
    data,
  });
};

const deleteById = async (id) => {
  return await prisma.note.delete({
    where: { id },
  });
};

module.exports = {
  create,
  findMany,
  findById,
  update,
  delete: deleteById,
};
