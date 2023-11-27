const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

function connectToDatabase() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
            if (err) {
                reject(err);
            } else {
                resolve(client);
            }
        });
    });
}

function findAll(client) {
    return new Promise((resolve, reject) => {
        const db = client.db("mydb");
        let collection = db.collection('customers');
        let cursor = collection.find({}).limit(10);
        let documents = [];

        cursor.forEach(
            doc => documents.push(doc),
            err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(documents);
                }
            }
        );
    });
}

function closeConnection(client) {
    return new Promise((resolve, reject) => {
        client.close(err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Usage
connectToDatabase()
    .then(client => {
        console.log('1');
        return findAll(client);
    })
    .then(documents => {
        console.log('2');
        documents.forEach(doc => console.log(doc));
        console.log('5');
    })
    .catch(err => {
        console.error(err);
    })
    .finally(() => {
        console.log('Connection closed.');
        closeConnection(client)
            .catch(err => console.error(err));
    });

setTimeout(() => {
    console.log('iter');
}, 6000);
