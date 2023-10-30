const mongoose = require('mongoose');
const dayjs = require('dayjs');
const { generateRandomUsername, generateRandomString } = require('../utils/rng');
const { User } = require('../models/User');
const { OfferedDate } = require('../models/OfferedDate');

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', async () => {
  try {
    // Wipe the database
    await mongoose.connection.db.dropDatabase();

    // Create two new verified users
    const user1 = new User({
        username: generateRandomUsername(),
        name: 'Spongebob',
        aptNum: '10',
        isVerified: true,
        verificationCode: generateRandomString(),
    });
    await user1.save();

    const user2 = new User({
        username: generateRandomUsername(),
        name: 'Squidward',
        aptNum: '11',
        isVerified: true,
        verificationCode: generateRandomString(),
    });
    await user2.save();

    // Calculate date range (+/- 28 days from the current date)
    const currentDate = dayjs();

    // Function to generate a random date within the date range and check for conflicts
    const generateRandomDate = async (user) => {
        let randomDate;
        let isConflict = false;
        do {
          randomDate = currentDate.add(
            Math.floor(Math.random() * 56) - 28,
            'day'
          ).format('YYYY-MM-DD');
          // Check for date conflicts
          const conflictDate = await OfferedDate.findOne({date: randomDate, user: user._id});
          isConflict = conflictDate !== null;
        } while (isConflict);
        return randomDate;
      };

    // Populate 10 random offered dates for each user
    const populateOfferedDates = async (user) => {
        console.log(user)
        for (let i = 0; i < 10; i++) {
        const offeredDate = new OfferedDate({
            date: await generateRandomDate(user),
            user: user._id,
        });
        await offeredDate.save();
        }
    };

    await populateOfferedDates(user1);
    await populateOfferedDates(user2);

    console.log('Database wiped, users created, and offered dates populated.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.disconnect();
    }
});
