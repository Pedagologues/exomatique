import { loginFromToken } from "../user/internal";
import Document from "./db";
import {
  DocumentNotFound,
  MissingPermission,
  ModificationFailed,
} from "./error";
import "./task";
import { Document as FrontDocument } from "./types";

export async function get(document_id: string, access_token?: string) {
  const document = await Document.findById(document_id);

  if (document == null) throw new DocumentNotFound(document_id);

  if (!document?.is_private)
    return {
      bytes: document?.bytes.toJSON().data,
      metadata: JSON.parse(document.metadata),
    };

  if (access_token == null) throw new MissingPermission(document_id, "READ");

  let current_user = await loginFromToken(access_token).then((v) => v.id);

  if (current_user != document.author.toString())
    throw new MissingPermission(document_id, "READ");

  return {
    bytes: document?.bytes.toJSON().data,
    metadata: JSON.parse(document.metadata),
  };
}

export async function set(
  document_id: string,
  access_token: string,
  bytes?: Buffer,
  metadata?: any
) {
  const document = await Document.findById(document_id);

  if (document == null) throw new DocumentNotFound(document_id);

  let current_user = await loginFromToken(access_token).then((v) => v.id);

  if (current_user != document.author.toString())
    throw new MissingPermission(document_id, "WRITE");

  let v = await Document.updateOne(
    { _id: document_id },
    {
      $set: {
        bytes,
        metadata: metadata == null ? undefined : JSON.stringify(metadata),
        updated: new Date(),
      },
    }
  );

  if (v.upsertedCount == 0) {
    throw new ModificationFailed(document_id, `Document is unchanged`);
  }
}

export async function create(
  access_token: string,
  parent: string,
  is_private: boolean,
  bytes?: Buffer,
  metadata?: any
): Promise<string> {
  let author = await loginFromToken(access_token).then((v) => v.id);

  const document = await Document.create({
    author,
    is_private,
    bytes,
    metadata: metadata == null ? "{}" : JSON.stringify(metadata),
    parents: [parent],
    created: new Date(),
    updated: new Date(),
  });

  return document._id.toString();
}

export async function link(
  document_id: string,
  parent: string,
  access_token: string
) {
  const document = await Document.findById(document_id);

  if (document == null) throw new DocumentNotFound(document_id);

  let current_user = await loginFromToken(access_token).then((v) => v.id);

  if (current_user != document.author.toString())
    throw new MissingPermission(document_id, "LINK");

  if (parent in document.parents) {
    throw new Error("Document was found but parent is already present");
  }

  document.parents.push(parent);
  document.updated = new Date();

  document.save();
}

export async function unlink(
  document_id: string,
  parent: string,
  access_token: string
) {
  const document = await Document.findById(document_id);

  if (document == null) throw new DocumentNotFound(document_id);

  let current_user = await loginFromToken(access_token).then((v) => v.id);

  if (current_user != document.author.toString())
    throw new MissingPermission(document_id, "UNLINK");

  if (!document.parents.includes(parent)) {
    throw new ModificationFailed(document_id, `${parent} is not a parent`);
  }

  document.parents = document.parents.filter((v) => v !== parent);
  document.updated = new Date();

  document.save();
}

const TIME_BEFORE_DELETION = 7 * 24 * 60 * 1000;

export async function cleanup() {
  let documents = await Document.find({ parents: [] });

  if (documents.length === 0) {
    console.log("No documents were found for removal . . .");
    return;
  }

  let date = new Date();

  documents.forEach((doc) => {
    if (
      Math.abs(doc.updated.getTime() - date.getTime()) < TIME_BEFORE_DELETION
    ) {
      console.log(
        `Document ${doc._id} is not linked but is still in the waiting phase. Document will be removed in ${
          TIME_BEFORE_DELETION -
          Math.abs(doc.updated.getTime() - date.getTime())
        }ms`
      );
      return;
    }

    let truncated_document: FrontDocument = {
      ...doc.toObject(),
      author: doc.author.toString(),
    };

    console.log(
      "Deletions of " +
        JSON.stringify({ ...truncated_document, bytes: undefined })
    );

    doc.deleteOne().exec();
  });
}
