const prisma = require('../../config/database');

const create = async (data) => {
  return await prisma.user.create({
    data,
  });
};

const findByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

const findById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

const update = async (id, data) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

module.exports = {
  create,
  findByEmail,
  findById,
  update,
};
