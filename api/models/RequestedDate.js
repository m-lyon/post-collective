const mongoose = require('mongoose');
const { findDates } = require('./utils');
const { Schema } = mongoose;

const requestedDateSchema = new Schema({
    date: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    offeredDate: { type: Schema.Types.ObjectId, ref: 'OfferedDate', required: true },
});

requestedDateSchema.statics.findDatesForOffer = async function (offer) {
    const query = { offeredDate: offer };
    return this.find(query).populate('user', 'aptNum');
};

requestedDateSchema.statics.findDates = findDates;

const RequestedDate = mongoose.model('RequestedDate', requestedDateSchema);

exports.RequestedDate = RequestedDate;
