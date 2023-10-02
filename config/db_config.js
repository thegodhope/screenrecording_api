import mongoose from "mongoose";

const url = process.env.MONGO_DB_URI;
const dbName = "recorder";

const connectDB = () => {
  mongoose
    .connect(`${url}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      writeConcern: { w: "majority" },
    })
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

export default connectDB;
