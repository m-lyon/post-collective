const { User } = require('../models');

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

exports.checkUserExists = checkUserExists;
