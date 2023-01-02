function parseDate(dateStr) {
    if (dateStr === undefined) {
        return dateStr;
    }
    // YYYY-MM-DD
    const [year, month, day] = dateStr.split('-');

    // month is 0-based, that's why we need dataParts[1] - 1
    const date = new Date(year, month - 1, day);
    return date;
}

module.exports = parseDate;
