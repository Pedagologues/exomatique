import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const uri = process.env.DATABASE_URI || "";
const options = JSON.parse(process.env.DATABASE || "{}");

export default function createConnection() {
  return mongoose.createConnection(uri, options);
}
