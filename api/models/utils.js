// TODO: test this with the new string dates
async function findDates(userId, startDate, endDate) {
    console.log('startDate -> ', startDate);
    console.log('endDate -> ', endDate);
    const query = userId !== undefined ? { user: userId } : {};
    if (startDate !== undefined || endDate !== undefined) {
        query.date = {};
        if (startDate !== undefined) {
            query.date['$gte'] = startDate;
        }
        if (endDate !== undefined) {
            query.date['$lte'] = endDate;
        }
    }
    console.log(query);
    return this.find(query).populate('user', 'aptNum');
}

async function checkExists(id, name) {
    if (id === undefined) {
        return { status: false, msg: `${name}-id-not-provided` };
    }
    try {
        const response = await this.findById(id);
        if (response === null) {
            return { status: false, msg: `${name}-not-found` };
        } else {
            return { status: true, res: response };
        }
    } catch (err) {
        console.log(err.message);
        return { status: false, msg: `invalid-${name}-id` };
    }
}

exports.findDates = findDates;
exports.checkExists = checkExists;
