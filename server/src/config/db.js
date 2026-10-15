const mongoose = require("mongoose");

let connectionPromise;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!connectionPromise || mongoose.connection.readyState === 0) {
    connectionPromise = mongoose
      .connect(process.env.DATABASE_URL)
      .then(() => {
        console.log("Connected to MongoDB");
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
}

module.exports = { connectDB };
