import { MongoClient } from "mongodb";

let db;

async function connectToDb(cb) {
    const dbPath = 'mongodb://127.0.0.1:27017';
    const dbName = 'ankiDb';

    const client = new MongoClient(dbPath);
    await client.connect();
    db = client.db(dbName);
    cb();
}

export {
    db,
    connectToDb,
}