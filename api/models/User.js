const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;
const { checkExists } = require('./utils');
const { DEMO } = require('../constants');

const sessionSchema = new Schema({
    refreshToken: {
        type: String,
        default: '',
    },
});

const userSchema = new Schema({
    name: { type: String, required: true },
    refreshToken: { type: [sessionSchema] },
    aptNum: {
        type: Number,
        required: true,
        unique: DEMO ? false : true,
        validate: {
            validator: function (value) {
                return Number.isInteger(value) && value >= 1 && value <= 32;
            },
            message: 'aptNum must be an integer between 1 and 32',
        },
    },
    isVerified: { type: Boolean, required: true },
    verificationCode: { type: String },
});

userSchema.statics.checkExists = async function (user) {
    return checkExists.call(this, user, 'user');
};

userSchema.post('remove', async function () {
    console.log(`Just removed user: ${this.name}, apartment: ${this.aptNum}`);
    let res = await RequestedDate.deleteMany({ user: this._id });
    console.log(`Removed ${res.deletedCount} entries from RequestedDate`);
    res = await OfferedDate.deleteMany({ user: this._id });
    console.log(`Removed ${res.deletedCount} entries from OfferedDate`);
});

// Remove refreshToken from the response
userSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.refreshToken;
        delete ret.verificationCode;
        return ret;
    },
});
userSchema.plugin(passportLocalMongoose);

exports.User = mongoose.model('User', userSchema);
