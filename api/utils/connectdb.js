const mongoose = require('mongoose');
mongoose.set({ strictQuery: true });
const url = process.env.MONGO_DB_CONNECTION_STRING;
const connect = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
connect
    .then((db) => {
        console.log('connected to db at ', url);
    })
    .catch((err) => {
        console.log(err);
    });
