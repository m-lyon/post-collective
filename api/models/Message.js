const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    text: { type: String, required: true },
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seen: { type: Boolean, required: true },
});

const Message = mongoose.model('Message', messageSchema);

exports.Message = Message;
