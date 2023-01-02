const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    aptNum: { type: Number, required: true, unique: true },
});

userSchema.statics.checkExists = async function (user) {
    if (user === undefined) {
        return { status: false, msg: 'user-id-not-provided' };
    }
    try {
        const userResponse = await User.findById(user);
        if (userResponse === null) {
            return { status: false, msg: 'user-not-found' };
        }
    } catch (err) {
        console.log(err.message);
        return { status: false, msg: 'invalid-user-id' };
    }
    return { status: true };
};

userSchema.post('remove', async function () {
    console.log(`Just removed user: ${this.name}, apartment: ${this.aptNum}`);
    let res = await RequestedDate.deleteMany({ user: this._id });
    console.log(`Removed ${res.deletedCount} entries from RequestedDate`);
    res = await OfferedDate.deleteMany({ user: this._id });
    console.log(`Removed ${res.deletedCount} entries from OfferedDate`);
});

const User = mongoose.model('User', userSchema);

exports.User = User;
