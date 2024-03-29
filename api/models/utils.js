// TODO: test this with the new string dates
function findDates(userId, startDate, endDate) {
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
    return this.find(query);
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
