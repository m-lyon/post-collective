const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose
    .connect('mongodb://127.0.0.1:27017/balmoralHouse')
    .then(() => console.log('we connected!'))
    .catch(() => console.log('we didnt connect :('));

// TODO: userSchema.pre('remove') validation that user

const { Schema } = mongoose;

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

function deleteFieldNotInSchema() {
    User.findOneAndUpdate({ name: 'Matt' }, { $unset: { apt: 0 } }, { strict: false })
        .then(() => console.log('worked'))
        .catch((err) => console.log(err));
}

function AddExample() {
    User.findOneAndUpdate({ name: 'Matt' }, { aptNum: 17 }, { new: true })
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
}

async function testDeleting() {
    const katie = new User({ name: 'KatieG', aptNum: 8 });
    await katie.save();
    console.log('we just saved');
    await katie.remove();
    const users = await User.find({});
    console.log(users);
}

// testDeleting();
// User.findOneAndRemove({ name: 'KATIEG' }).then(User.find().then((users) => console.log(users)));
