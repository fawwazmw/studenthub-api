const prisma = require('../../config/database');

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
  findById,
  update,
};
