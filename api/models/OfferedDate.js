const mongoose = require('mongoose');
const dayjs = require('dayjs');
const { findDateRangeForUser, findDates } = require('./utils');
const { Schema } = mongoose;

const offeredDateSchema = new Schema({
    date: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return dayjs(value, 'YYYY-MM-DD').isValid();
            },
            message: 'Invalid date format. Please use the format YYYY-MM-DD.',
        },
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

offeredDateSchema.statics.findDateRangeForUser = findDateRangeForUser;
offeredDateSchema.statics.findDates = findDates;
offeredDateSchema.statics.checkExists = async function (offeredDate) {
    if (offeredDate === undefined) {
        return { status: false, msg: 'offered-date-id-not-provided' };
    }
    try {
        const offeredDateResponse = await this.findById(offeredDate).populate('user', '_id');
        if (offeredDateResponse === null) {
            return { status: false, msg: 'offered-date-not-found' };
        }
        return { status: true, offeredDate: offeredDateResponse };
    } catch (err) {
        console.log(err.message);
        return { status: false, msg: 'invalid-offered-date-id' };
    }
};

exports.OfferedDate = mongoose.model('OfferedDate', offeredDateSchema);
