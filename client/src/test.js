// Tell the browser that this function is asynchronous
async function myFunc() {
    // Await for the promise to resolve
    await new Promise((resolve) => {
        setTimeout(() => {
            // Resolve the promise
            resolve(console.log('hello'));
        }, 3000);
    });
    // Once the promise gets resolved continue on
    console.log('hi');
}

async function outer() {
    await myFunc();
    console.log('first or last?');
}
// Call the function
outer();
