import User from "../../users/users.model";

const create = async (query) => {
  const newUser = new User(query);
  return await newUser.save();
};

const findOne = async (query) => {
  return await User.findOne(query);
};

const updateOne = async (identifier, query) => {
  return await User.updateOne(identifier, query);
};

const deleteOne = async (query) => {
  return await User.deleteOne(query);
};

export { create, findOne, updateOne, deleteOne };
