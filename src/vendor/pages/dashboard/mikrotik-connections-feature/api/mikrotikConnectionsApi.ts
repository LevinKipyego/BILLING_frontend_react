import {
  listMikrotikConnections,
  createMikrotikConnection,
  updateMikrotikConnection,
  deleteMikrotikConnection,
} from "../../../../api/mikrotikConfigurations";
import { fetchMikrotiks } from "../../../../api/devices";
import type { ExtendedMikrotikConnectionCreate, ExtendedMikrotikConnection, MikrotikDevice } from "../types/mikrotikConnections";

export async function getMikrotikConnections(): Promise<ExtendedMikrotikConnection[]> {
  const result = await listMikrotikConnections();
  return Array.isArray(result) ? result as ExtendedMikrotikConnection[] : [];
}
export async function getMikrotikDevices(): Promise<MikrotikDevice[]> {
  const result = await fetchMikrotiks();
  return Array.isArray(result) ? result as MikrotikDevice[] : [];
}
export async function createConnection(payload: ExtendedMikrotikConnectionCreate) {
  return createMikrotikConnection(payload as never);
}
export async function updateConnection(id: string, payload: ExtendedMikrotikConnectionCreate) {
  return updateMikrotikConnection(id, payload as never);
}
export async function removeConnection(id: string) {
  return deleteMikrotikConnection(id);
}
