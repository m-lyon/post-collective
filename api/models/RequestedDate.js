const mongoose = require('mongoose');
const { findDateRangeForUser } = require('./utils');
const { Schema } = mongoose;

const requestedDateSchema = new Schema({
    date: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    offeredDate: { type: Schema.Types.ObjectId, ref: 'OfferedDate', required: true },
});

requestedDateSchema.statics.findDateRangeForUser = findDateRangeForUser;

const RequestedDate = mongoose.model('RequestedDate', requestedDateSchema);

exports.RequestedDate = RequestedDate;
