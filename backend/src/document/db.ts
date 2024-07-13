import createConnection from "@backend/database";
import mongoose from "mongoose";

const connection = createConnection();

const Document = connection.model(
  "document",
  new mongoose.Schema({
    author: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    bytes: {
      type: Buffer,
      required: true,
    },
    is_private: {
      type: Boolean,
      required: true,
    },
  })
);

Document.ensureIndexes();

export default Document;
