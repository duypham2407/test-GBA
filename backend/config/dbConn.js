import mongoose from "mongoose";
import "dotenv/config";

const dbConn = () => {
  const mongoURL = process.env.MONGO_URL;

  mongoose.connect(mongoURL)
    .then(() => console.log("Connect MongoDB successfull"))
    .catch((err) => {
      console.log(err);
    });
};

export default dbConn;