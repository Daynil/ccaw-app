'use strict';
// Google OAuth - can autofill some of the forms with oauth
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({
  email: String,
  password: String,
  admin: Boolean
});

userSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validatePassword = (enteredPass, actualPassHash) => {
  return bcrypt.compareSync(enteredPass, actualPassHash);
};

module.exports = mongoose.model('User', userSchema);