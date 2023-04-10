const mongoose = require('mongoose');
const dayjs = require('dayjs');
const { findDates } = require('./utils');
const { Schema } = mongoose;

const requestedDateSchema = new Schema({
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
    offeredDate: { type: Schema.Types.ObjectId, ref: 'OfferedDate', required: true },
});

requestedDateSchema.statics.findDatesForOffer = async function (offer) {
    const query = { offeredDate: offer };
    return this.find(query).populate('user', 'aptNum');
};

requestedDateSchema.statics.findDates = findDates;

exports.RequestedDate = mongoose.model('RequestedDate', requestedDateSchema);
