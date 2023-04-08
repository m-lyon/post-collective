class DateFormat extends Date {
    getDateStr() {
        // YYYY-MM-DD
        return this.toISOString().slice(0, 10);
    }

    getDateInitStr() {
        // MM/DD/YYYY
        // TODO
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

export { DateFormat };
