import { loginFromToken } from "../user/internal";
import Document from "./db";

export async function get(document_id: string, access_token?: string) {
  const file = await Document.findById(document_id);

  if (file == null) throw new Error("Could not find Document");

  if (!file?.is_private)
    return {
      bytes: file?.bytes.toJSON().data,
      metadata: JSON.parse(file.metadata),
    };

  if (access_token == null)
    throw new Error(
      "Document is private and you are not authorized to view it"
    );

  let current_user = await loginFromToken(access_token).then((v) => v.id);

  if (current_user != file.author.toString())
    throw new Error(
      "Document is private and you are not authorized to view it"
    );

  return {
    bytes: file?.bytes.toJSON().data,
    metadata: JSON.parse(file.metadata),
  };
}

export async function set(
  document_id: string,
  access_token: string,
  bytes?: Buffer,
  metadata?: any
) {
  const file = await Document.findById(document_id);

  if (file == null) throw new Error("Could not find Document");

  let current_user = await loginFromToken(access_token).then((v) => v.id);

  if (current_user != file.author.toString())
    throw new Error("Only the author can modify the Document");

  let v = await Document.updateOne(
    { _id: document_id },
    {
      $set: {
        bytes,
        metadata: metadata == null ? undefined : JSON.stringify(metadata),
      },
    }
  );

  if (v.upsertedCount == 0) {
    throw new Error("Document was found but modification failed");
  }
}

export async function create(
  access_token: string,
  is_private: boolean,
  bytes?: Buffer,
  metadata?: any
): Promise<string> {
  let author = await loginFromToken(access_token).then((v) => v.id);

  const file = await Document.create({
    author,
    is_private,
    bytes,
    metadata: metadata == null ? "{}" : JSON.stringify(metadata),
  });

  return file._id.toString();
}

export async function remove(document_id: string, access_token: string) {
  const file = await Document.findById(document_id);

  if (file == null) throw new Error("Could not find Document");

  let current_user = await loginFromToken(access_token).then((v) => v.id);

  if (current_user != file.author.toString())
    throw new Error("Only the author can remove the Document");

  let v = await Document.deleteOne({ _id: document_id });

  if (v.deletedCount == 0) {
    throw new Error("Document was found but removal failed");
  }
}
