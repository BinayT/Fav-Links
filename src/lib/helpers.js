const bcryptjs = require("bcryptjs");
const helpers = {};

helpers.encryptPassort = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(password, salt); //Final Password
  return hash;
};

helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcryptjs.compare(password, savedPassword);
  } catch (e) {
    console.log(e);
  }
};

module.exports = helpers;
