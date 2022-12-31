const { User, RequestedDate, OfferedDate } = require('./models');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose
    .connect('mongodb://127.0.0.1:27017/balmoralHouse')
    .then(() => console.log('we connected!'))
    .catch(() => console.log('we didnt connect :('));

async function createUsers() {
    await User.collection.drop();
    const matt = new User({ name: 'Matt', aptNum: 17 });
    await matt.save();
    const gooby = new User({ name: 'Gooby', aptNum: 702 });
    await gooby.save();
}

async function createDates() {
    OfferedDate.collection.drop();
    // Create days array
    const days = [];
    let day = new Date();
    day = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    days.push(day);
    for (let i = 2; i < 5; i += 2) {
        const day = new Date(days[0]);
        day.setDate(days[0].getDate() + i);
        days.push(day);
    }

    const matt = await User.findOne({ name: 'Matt' });

    // Create dates documents
    for (let day of days) {
        const dateOffered = new OfferedDate({ date: day, user: matt._id });
        dateOffered.save();
    }
}

async function createData() {
    await createUsers();
    await createDates();
}

createData();
