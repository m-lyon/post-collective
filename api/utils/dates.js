const dayjs = require('dayjs');

const MONTH_MAP = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    10: 'October',
    11: 'November',
    12: 'December',
};

function getDayMonthFormat(date, shorthand = true) {
    if (!dayjs(date, 'YYYY-MM-DD').isValid()) {
        throw new Error(`Invalid date format given: ${date}`);
    }
    const monthStr = MONTH_MAP[date.slice(5, 7)];
    const dayStr = date.slice(8, 10);
    return shorthand ? `${dayStr} ${monthStr.slice(0, 3)}` : `${dayStr} ${monthStr}`;
}

function getFormattedDateStr(date) {
    if (!dayjs(date, 'YYYY-MM-DD').isValid()) {
        throw new Error(`Invalid date format given: ${date}`);
    }
    const dateObj = new Date(date);
    const options = { month: 'short', day: 'numeric' };
    const monthDay = dateObj.toLocaleString('UTC', options).split(' ');
    return monthDay[1] + ' ' + addOrdinalSuffix(parseInt(monthDay[0]));
}

function addOrdinalSuffix(day) {
    if (day % 10 === 1 && day !== 11) {
        return day + 'st';
    } else if (day % 10 === 2 && day !== 12) {
        return day + 'nd';
    } else if (day % 10 === 3 && day !== 13) {
        return day + 'rd';
    } else {
        return day + 'th';
    }
}

exports.getFormattedDateStr = getFormattedDateStr;
exports.getDayMonthFormat = getDayMonthFormat;
