async function findDates(userId, startDate, endDate) {
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
        const userResponse = await this.findById(id);
        if (userResponse === null) {
            return { status: false, msg: `${name}-not-found` };
        }
    } catch (err) {
        console.log(err.message);
        return { status: false, msg: `invalid-${name}-id` };
    }
    return { status: true };
}

exports.findDates = findDates;
exports.checkExists = checkExists;
