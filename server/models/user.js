'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        defaultValue: null
    }
});

UserSchema.methods.generateHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validatePassword = (enteredPass, actualPassHash) => {
    return bcrypt.compareSync(enteredPass, actualPassHash);
};

module.exports = mongoose.model('User', UserSchema);