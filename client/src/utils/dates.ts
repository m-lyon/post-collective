import * as dayjs from 'dayjs'

export class DateFormat extends Date {
    getDateStr() {
        // YYYY-MM-DD
        return this.toISOString().slice(0, 10);
    }

    getDayStr() {
        // Mon
        return this.toDateString().slice(0, 3);
    }

    getDayMonthStr() {
        const [month, day] = this.toISOString().slice(5, 10).split('-');
        return `${day}/${month}`;
    }
}

export function getStandardDate(dateStr: string): Date{
    if (!dayjs(dateStr, 'YYYY-MM-DD').isValid()){
        throw new Error('Invalid date format')
    }
    const parts = dateStr.split('-');
    const date = new DateFormat(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
    return date;
}

export function getInitialDates(numDays: number = 7): DateFormat[] {
    const days = [];
    for (let i = 0; i < numDays; i++) {
        const nextDay = new DateFormat();
        nextDay.setUTCHours(0, 0, 0, 0);
        nextDay.setDate(nextDay.getDate() + i);
        days.push(nextDay);
    }
    return days;
}

