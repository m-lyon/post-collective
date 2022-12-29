const { User, RequestedDate, OfferedDate } = require('./models');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose
    .connect('mongodb://127.0.0.1:27017/balmoralHouse')
    .then(() => console.log('we connected!'))
    .catch(() => console.log('we didnt connect :('));

function createUsers() {
    const matt = new User({ name: 'Matt', aptNum: 17 });
    matt.save();
}

async function createDates() {
    // Create days array
    const days = [];
    days.push(new Date());
    for (let i = 2; i < 5; i += 2) {
        const day = new Date();
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

createDates();
