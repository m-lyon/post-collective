const mongoose = require('mongoose');
const { findDateRangeForUser, findDates } = require('./utils');
const { Schema } = mongoose;

const offeredDateSchema = new Schema({
    date: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

offeredDateSchema.statics.findDateRangeForUser = findDateRangeForUser;
offeredDateSchema.statics.findDates = findDates;
offeredDateSchema.statics.checkExists = async function (offeredDate) {
    if (offeredDate === undefined) {
        return { status: false, msg: 'offered-date-id-not-provided' };
    }
    try {
        const offeredDateResponse = await OfferedDate.findById(offeredDate);
        if (offeredDateResponse === null) {
            return { status: false, msg: 'offered-date-not-found' };
        }
        return { status: true, offeredDate: offeredDateResponse.date };
    } catch (err) {
        console.log(err.message);
        return { status: false, msg: 'invalid-offered-date-id' };
    }
};

const OfferedDate = mongoose.model('OfferedDate', offeredDateSchema);

exports.OfferedDate = OfferedDate;
