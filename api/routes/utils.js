const { User, OfferedDate } = require('../models');

async function checkUserExists(req, res) {
    if (req.query.user === undefined) {
        res.status(400).send({ status: 400, error: 'user-id-not-provided' });
        return false;
    }
    try {
        const user = await User.findById(req.query.user);
        if (user === null) {
            res.status(400).send({ status: 400, error: 'user-not-found' });
            return false;
        }
    } catch (err) {
        res.status(400).send({ status: 400, error: 'invalid-user-id' });
        return false;
    }
    return true;
}

async function checkOfferedDateExists(req, res) {
    if (req.query.offeredDate === undefined) {
        res.status(400).send({ status: 400, error: 'offered-date-not-provided' });
        return null;
    }
    try {
        const offeredDate = await OfferedDate.findById(req.query.offeredDate);
        if (offeredDate === null) {
            res.status(400).send({ status: 400, error: 'offered-date-not-found' });
            return null;
        }
        return offeredDate;
    } catch (err) {
        res.status(400).send({ status: 400, error: 'invalid-offered-date-id' });
        return null;
    }
}

exports.checkUserExists = checkUserExists;
exports.checkOfferedDateExists = checkOfferedDateExists;
