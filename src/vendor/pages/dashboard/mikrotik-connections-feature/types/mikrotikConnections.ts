import type { MikrotikConnection, MikrotikConnectionCreate } from "../../../../types/mikrotikConfiguration";
import type { MikrotikDevice } from "../../../../types/device";

export type ExtendedMikrotikConnectionCreate = MikrotikConnectionCreate & {
  hotspot_login_url?: string;
};

export type ExtendedMikrotikConnection = MikrotikConnection & {
  password?: string;
  hotspot_login_url?: string;
};

export type { MikrotikConnection, MikrotikDevice };

export const createEmptyConnectionForm = (): ExtendedMikrotikConnectionCreate => ({
  mikrotik: "",
  management_ip: "",
  port: 8728,
  username: "",
  password: "",
  hotspot_server: "",
  hotspot_login_url: "",
  use_ssl: false,
  enabled: true,
});
