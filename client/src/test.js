// function getInitialDates(numDays = 7) {
//     const days = [];
//     const availibility = [];
//     for (let i = 0; i < numDays; i++) {
//         const nextDay = new Date();
//         nextDay.setDate(nextDay.getDate() + i);
//         days.push(nextDay);
//         availibility.push(false);
//     }
//     return [days, availibility];
// }

// const [initialDays, initialAvailibility] = getInitialDates();
// console.log(initialDays);
// console.log(initialAvailibility);

Object.defineProperty(Array.prototype.__proto__, '-1', {
    get() {
        return this[this.length - 1];
    },
});

// Example usage
const arr = [1, 2, 3];
console.log(arr[0]);
console.log(arr[-1]); // Output: 3
