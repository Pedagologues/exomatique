import { TRPCError } from "@trpc/server";

export class DocumentNotFound extends TRPCError {
  constructor(public document_id: string) {
    super({
      code: "NOT_FOUND",
      message: `Document ${document_id} could not be found`,
    });
  }
}

export type DOCUMENT_PERMISSION = "READ" | "WRITE" | "LINK" | "UNLINK";

export class MissingPermission extends TRPCError {
  constructor(
    public document_id: string,
    public permission: DOCUMENT_PERMISSION
  ) {
    super({
      code: "UNAUTHORIZED",
      message: `Missing ${permission} permission on document ${document_id}`,
    });
  }
}

export class ModificationFailed extends TRPCError {
  constructor(
    public document_id: string,
    cause: string
  ) {
    super({
      code: "UNAUTHORIZED",
      message: `Modification of ${document_id} failed`,
      cause,
    });
  }
}
