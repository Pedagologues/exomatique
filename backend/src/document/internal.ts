import mongoose from "mongoose";
import { loginFromToken } from "../user/internal";
import Document from "./db";
import {
  ChildExist,
  DocumentNotFound,
  MissingChild,
  MissingPermission,
  ModificationFailed,
} from "./error";
import "./task";
import { Document as FrontDocument } from "./types";

export async function exist(document_id: string) {
  const document = await Document.findById(document_id);
  return document != null;
}

export async function get(
  document_id: string,
  access_token?: string
): Promise<FrontDocument> {
  const document = await Document.findById(document_id);

  if (document == null) throw new DocumentNotFound(document_id);

  if (document?.is_private) {
    if (access_token == null) throw new MissingPermission(document_id, "READ");

    let current_user = await loginFromToken(access_token).then((v) => v.id);

    if (current_user != document.author.toString())
      throw new MissingPermission(document_id, "READ");
  }

  return {
    author: document.author.toString(),
    bytes: document?.bytes.toJSON().data,
    metadata: JSON.parse(document.metadata),
    children: new Map(
      Array.from(document.children, ([key, value]) => [key, value.toString()])
    ),
    is_private: document?.is_private,
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

  if (v.modifiedCount == 0) {
    throw new ModificationFailed(document_id, JSON.stringify(v));
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
    children: [],
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

export async function add_child(
  document_id: string,
  access_token: string,
  name: string,
  child_id: string
) {
  const document = await Document.findById(document_id);

  if (document == null) throw new DocumentNotFound(document_id);

  const child_document = await Document.findById(child_id);

  if (child_document == null) throw new DocumentNotFound(child_id);

  let current_user = await loginFromToken(access_token).then((v) => v.id);

  if (current_user != document.author.toString())
    throw new MissingPermission(document_id, "ADD_CHILD");

  if (document.children.get(name) != null)
    throw new ChildExist(document_id, name);

  await link(child_id, document_id, access_token);

  document.children.set(
    name,
    mongoose.Types.ObjectId.createFromHexString(child_id)
  );
  document.updated = new Date();

  document.save();
}

export async function remove_child_from_name(
  document_id: string,
  access_token: string,
  name: string
) {
  const document = await Document.findById(document_id);

  if (document == null) throw new DocumentNotFound(document_id);

  const child_id = document.children.get(name);

  let current_user = await loginFromToken(access_token).then((v) => v.id);

  if (current_user != document.author.toString())
    throw new MissingPermission(document_id, "REMOVE_CHILD");

  if (child_id == null) throw new MissingChild(document_id, name);

  await unlink(child_id.toString(), document_id, access_token);

  document.children.delete(name);
  document.updated = new Date();

  document.save();
}

export async function remove_child_from_id(
  document_id: string,
  access_token: string,
  child_id: string
) {
  const document = await Document.findById(document_id);

  if (document == null) throw new DocumentNotFound(document_id);

  let name = Array.from(document.children.entries())
    .filter((k, v) => v != null)
    .find((k, v) => v.toString() === child_id)?.[0];

  if (name == null) throw new MissingChild(document_id, child_id + "(ID)");

  return remove_child_from_name(document_id, access_token, name);
}

export async function get_children(document_id: string, access_token: string) {
  const document = await Document.findById(document_id);

  if (document == null) throw new DocumentNotFound(document_id);

  let current_user = await loginFromToken(access_token).then((v) => v.id);

  if (current_user != document.author.toString())
    throw new MissingPermission(document_id, "LIST_CHILDREN");
  return document.children;
}

export async function delete_document(document_id: string, recursive: boolean) {
  const document = await Document.findById(document_id);

  if (document == null) throw new DocumentNotFound(document_id);

  let children = new Map(document.children);
  document.children = new Map();

  children.forEach(async (_, v) => {
    let child_document = await Document.findById(v);
    if (child_document == null) return;
    child_document.parents = child_document.parents.filter(
      (v) => v != document_id
    );
    if (recursive && child_document.parents.length == 0)
      await delete_document(v, true);
  });

  await document.deleteOne();
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
