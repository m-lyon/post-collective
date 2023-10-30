function generateRandomString() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }

    return result;
}

function generateRandomUsername() {
    const timestamp = new Date().getTime().toString(36); // Convert timestamp to base36 string
    const randomString = Math.random().toString(36).slice(2, 7); // Generate a random string (5 characters)
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number

    const username = `${timestamp}${randomString}${randomNumber}`;
    return username;
}

exports.generateRandomString = generateRandomString;
exports.generateRandomUsername = generateRandomUsername;
