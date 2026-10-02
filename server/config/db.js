const mongoose = require("mongoose")

let connectionPromise = null

const connectDB = async () => {
  // Already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose
  }

  // Connection is already being established
  if (connectionPromise) {
    return connectionPromise
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined")
  }

  connectionPromise = mongoose
    .connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => {
      console.log("MongoDB connected successfully")
      return mongoose
    })
    .catch((error) => {
      connectionPromise = null
      console.error("MongoDB connection error:", error)
      throw error
    })

  return connectionPromise
}

module.exports = connectDB