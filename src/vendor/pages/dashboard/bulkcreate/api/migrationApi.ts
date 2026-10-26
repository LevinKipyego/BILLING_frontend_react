import { apiPost } from "../../../../api/client";
import type { BulkMigrationPayload, BulkMigrationResponse } from "../types/migrations";

export async function migrateBulkUsers(payload: BulkMigrationPayload): Promise<BulkMigrationResponse> {
  return apiPost<BulkMigrationResponse>("/vendors/migrate-bulk/", payload);
}