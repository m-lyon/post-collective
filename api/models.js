const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const { Schema } = mongoose;
const parseDate = require('./date_utils');

const userSchema = new Schema({
    name: { type: String, required: true },
    aptNum: { type: Number, required: true, unique: true },
});

const offeredDateSchema = new Schema({
    date: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const requestedDateSchema = new Schema({
    date: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    offeredDate: { type: Schema.Types.ObjectId, ref: 'OfferedDate', required: true },
});

async function findDateRangeForUser(user_id, startDate, endDate) {
    const days = await this.find({
        user: { $ne: user_id },
        date: { $gte: startDate, $lte: endDate },
    }).populate('user', 'aptNum');
    if (days.length === 0) {
        return [];
    }
    return days.map((day) => {
        return { date: day.date, aptNum: day.user.aptNum };
    });
}

offeredDateSchema.statics.findDateRangeForUser = findDateRangeForUser;
requestedDateSchema.statics.findDateRangeForUser = findDateRangeForUser;

const RequestedDate = mongoose.model('RequestedDate', requestedDateSchema);
const OfferedDate = mongoose.model('OfferedDate', offeredDateSchema);

userSchema.post('remove', async function () {
    console.log(`Just removed user: ${this.name}, apartment: ${this.aptNum}`);
    let res = await RequestedDate.deleteMany({ user: this._id });
    console.log(`Removed ${res.deletedCount} entries from RequestedDate`);
    res = await OfferedDate.deleteMany({ user: this._id });
    console.log(`Removed ${res.deletedCount} entries from OfferedDate`);
});

const User = mongoose.model('User', userSchema);

async function getDatesForUser(modelClass, userId, startDate, endDate) {
    const user = await User.findById(userId);
    if (user === null) {
        return []; // User not found
    }

    const offers = await modelClass.findDateRangeForUser(
        user._id,
        parseDate(startDate),
        parseDate(endDate)
    );
    return offers.map((offer) => ({
        date: offer.date.toISOString().slice(0, 10),
        aptNum: offer.aptNum,
    }));
}

exports.User = User;
exports.RequestedDate = RequestedDate;
exports.OfferedDate = OfferedDate;
exports.getDatesForUser = getDatesForUser;
