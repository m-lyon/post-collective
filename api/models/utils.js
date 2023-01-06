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

exports.findDates = findDates;
