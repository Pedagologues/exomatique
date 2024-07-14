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
    metadata: {
      type: String,
      required: true,
    },
    parents: {
      type: [String],
      required: true,
    },
    created: {
      type: Date,
      required: true,
    },
    updated: {
      type: Date,
      required: true,
    },
  })
);

Document.ensureIndexes();

export default Document;
