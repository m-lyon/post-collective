async function findDateRangeForUser(userId, startDate, endDate) {
    // TODO: if undefined startDate logic here
    const days = await this.find({
        user: { $ne: userId },
        date: { $gte: startDate, $lte: endDate },
    }).populate('user', 'aptNum');
    if (days.length === 0) {
        return [];
    }
    return days.map((day) => {
        return { date: day.date, aptNum: day.user.aptNum };
    });
}

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

exports.findDateRangeForUser = findDateRangeForUser;
exports.findDates = findDates;
