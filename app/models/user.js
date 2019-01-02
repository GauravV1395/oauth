const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    username: {
        type: String,
        minlength: 3,
        maxlength: 64,
        unique: true,
        requried: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: function() {
                return 'invalid email format';
            }
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128
    },

    tokens: [{
        token: {
            type: String
        }
    }]
});

// userSchema.pre('save', function(next) {
//     let user = this;
//     bcrypt.genSalt(10).then((salt) => {
//         bcrypt.hash(user.password, salt).then((hashed) => {
//             user.password = hashed;
//             next();
//         });
//     });
// })

userSchema.methods.shortInfo = function() {
    return {
        _id: this._id,
        username: this.username,
        email: this.email
    };
};

userSchema.methods.generateToken = function (next) { //instance method to generate a token.
    let user = this;
    let tokenData = {
        _id: user.id
    };

    let token = jwt.sign(tokenData, 'supersecret');
    user.tokens.push({
        token
    });

    return user.save().then(() => {

        return user;
    });
}

userSchema.statics.findByToken = function (token) { // static method created to define the function findByToken
    let User = this;
    let tokenData;
    try {
        tokenData = jwt.verify(token, 'supersecret');
    } catch (e) {
        return Promise.reject(e);
    }

    return User.findOne({
        '_id': tokenData._id,
        'tokens.token': token
    }).then((user) => {
        if (user) {
            return Promise.resolve(user);
        } else {
            return Promise.reject(user);
        }
    })
};

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}