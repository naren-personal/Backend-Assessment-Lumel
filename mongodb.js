const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const dbName = "SalesDB";

const connectToMongoDB = async () => {
  const client = new MongoClient(uri);
  try {
    const connect = await client.connect();
    const db = await connect.db(dbName);
    return db;
  } catch (err) {
    console.log("[ERROR][DB][Connect]", err);
    throw "DB Connection Failed";
  }
};

module.exports = {
  connectToMongoDB,
};
