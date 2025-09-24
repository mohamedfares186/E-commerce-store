import User from "../../users/users.model";

const create = async (query) => {
  const newUser = new User(query);
  return newUser.save();
};

const findOne = async (query) => {
  return User.findOne(query);
};

const updateOne = async (identifier, query) => {
  return User.updateOne(identifier, query);
};

const deleteOne = async (query) => {
  return User.deleteOne(query);
};

export { create, findOne, updateOne, deleteOne };
