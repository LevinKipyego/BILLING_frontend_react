export type DeploymentStatus =
  | "draft"
  | "discovering"
  | "discovered"
  | "preview"
  | "running"
  | "verifying"
  | "success"
  | "failed"
  | "rolling_back"
  | "rolled_back";
  
export type PccMode =
  | "regular"
  | "weighted";


//Router Discovery
  export interface RouterDiscoveryResponse {
      status: "success" | "error";

      deployment_id?: string;

      router?: {
        id: string;
        identity: string;
      };

      discovery?: DeploymentDiscovery;

      message?: string;
    }



/* ================================================== */
/* CREATE                                             */
/* ================================================== */

export interface DeploymentWanConfig {
  interface: string;
  weight?: number;
}

export interface DeploymentCreatePayload {
  mikrotik_id: string;

  deployment_type: "load_balancing";

  mode: "pcc";

  pcc_type: PccMode;

  wan_interfaces: DeploymentWanConfig[];
}


/* ================================================== */
/* REQUESTED CONFIG                                   */
/* ================================================== */

export interface DeploymentRequestedConfig {
  deployment_type?: "load_balancing";

  mode: "pcc";

  pcc_type?: PccMode;

  /*
   * Frontend/API input name.
   *
   * Backend normalizes this to wan_ports internally.
   */
  wan_interfaces: DeploymentWanConfig[];
}


/* ================================================== */
/* ROUTER                                             */
/* ================================================== */

export interface DeploymentRouter {
  id: string;

  identity: string;

  management_ip: string;

  router_version?: string | null;
}


/* ================================================== */
/* Discovery                                          */
/* ================================================== */

export interface DiscoveredInterface {
  ".id"?: string;
  id?: string;

  name?: string;
  "default-name"?: string;

  type?: string;

  mtu?: string | number;
  "actual-mtu"?: string | number;
  l2mtu?: string | number;
  "max-l2mtu"?: string | number;

  vrf?: string;

  "mac-address"?: string;

  "last-link-up-time"?: string;
  "last-link-down-time"?: string;
  "link-downs"?: string | number;

  running?: boolean | string;
  disabled?: boolean | string;
  slave?: boolean | string;
  dynamic?: boolean | string;

  comment?: string;

  [key: string]: unknown;
}


/* -------------------------------------------------- */
/* IP Address Discovery                               */
/* -------------------------------------------------- */

export interface DiscoveredAddress {
  ".id"?: string;
  id?: string;

  address?: string;
  network?: string;

  interface?: string;
  "actual-interface"?: string;

  vrf?: string;

  invalid?: boolean | string;
  dynamic?: boolean | string;
  slave?: boolean | string;
  disabled?: boolean | string;

  comment?: string;

  [key: string]: unknown;
}


/* -------------------------------------------------- */
/* DHCP Client Discovery                              */
/* -------------------------------------------------- */

export interface DiscoveredDhcpClient {
  ".id"?: string;
  id?: string;

  interface?: string;

  status?: string;

  address?: string;
  gateway?: string;

  "dhcp-server"?: string;

  "primary-dns"?: string;
  "secondary-dns"?: string;

  "add-default-route"?: string;
  "default-route-distance"?: string | number;
  "default-route-tables"?: string;

  "check-gateway"?: string;

  "use-peer-dns"?: boolean | string;
  "use-peer-ntp"?: boolean | string;

  "allow-reconfigure"?: boolean | string;
  "use-broadcast"?: string;
  "dhcp-options"?: string;

  "expires-after"?: string;

  invalid?: boolean | string;
  dynamic?: boolean | string;
  disabled?: boolean | string;

  comment?: string;

  [key: string]: unknown;
}


/* -------------------------------------------------- */
/* Route Discovery                                    */
/* -------------------------------------------------- */

export interface DiscoveredRoute {
  ".id"?: string;
  id?: string;

  "dst-address"?: string;
  dst_address?: string;

  gateway?: string;
  "immediate-gw"?: string;

  "routing-table"?: string;
  routing_table?: string;

  distance?: string | number;

  scope?: string | number;
  "target-scope"?: string | number;

  "vrf-interface"?: string;
  "local-address"?: string;

  active?: boolean | string;
  inactive?: boolean | string;

  dynamic?: boolean | string;
  dhcp?: boolean | string;
  connect?: boolean | string;
  ecmp?: boolean | string;

  disabled?: boolean | string;

  [key: string]: unknown;
}


/* -------------------------------------------------- */
/* Routing Table Discovery                            */
/* -------------------------------------------------- */

export interface DiscoveredRoutingTable {
  ".id"?: string;
  id?: string;

  name?: string;

  fib?: boolean | string;

  dynamic?: boolean | string;
  invalid?: boolean | string;
  disabled?: boolean | string;

  [key: string]: unknown;
}


/* -------------------------------------------------- */
/* WAN Discovery                                      */
/* -------------------------------------------------- */

/*
 * This is the normalized WAN object returned in:
 *
 * discovery.wans[]
 *
 * Example:
 *
 * {
 *   interface: "ether1",
 *   gateway: "192.168.100.254",
 *   address: "192.168.100.100/24",
 *   status: "bound",
 *   dynamic: true,
 *   disabled: false,
 *   interface_type: "ether",
 *   running: true
 * }
 */

export interface DiscoveredWan {
  interface: string;

  gateway?: string;
  address?: string;

  status?: string;

  dynamic?: boolean | string;
  disabled?: boolean | string;

  interface_type?: string;

  running?: boolean | string;

  /*
   * Keep this optional because the WAN discovery
   * implementation may expose the DHCP object
   * in some contexts.
   */
  dhcp_client?: DiscoveredDhcpClient | null;

  [key: string]: unknown;
}


/* -------------------------------------------------- */
/* Raw WAN Discovery                                  */
/* -------------------------------------------------- */

/*
 * discovery.wan is NOT the normalized WAN array.
 *
 * It is the raw WAN discovery structure:
 *
 * {
 *   interfaces: [...],
 *   dhcp_clients: [...],
 *   addresses: [...]
 * }
 */

export interface DeploymentWanDiscovery {
  interfaces?: DiscoveredInterface[];

  dhcp_clients?: DiscoveredDhcpClient[];

  addresses?: DiscoveredAddress[];

  [key: string]: unknown;
}


//* -------------------------------------------------- */
/* Raw Router Discovery                               */
/* -------------------------------------------------- */

export interface DeploymentDiscovery {
  /* ---------------------------------------------- */
  /* System                                         */
  /* ---------------------------------------------- */

  system?: Record<string, unknown>;


  /* ---------------------------------------------- */
  /* Identity                                       */
  /* ---------------------------------------------- */

  identity?: {
    name?: string;

    [key: string]: unknown;
  };


  /* ---------------------------------------------- */
  /* Interfaces                                     */
  /* ---------------------------------------------- */

  interfaces?: DiscoveredInterface[];


  /* ---------------------------------------------- */
  /* IP Addresses                                   */
  /* ---------------------------------------------- */

  /*
   * Canonical field returned by
   * RouterDiscoveryService.
   */

  ip_addresses?: DiscoveredAddress[];


  /*
   * Legacy compatibility.
   *
   * Do not use this in new components.
   */

  addresses?: DiscoveredAddress[];


  /* ---------------------------------------------- */
  /* DHCP Clients                                   */
  /* ---------------------------------------------- */

  dhcp_clients?: DiscoveredDhcpClient[];


  /* ---------------------------------------------- */
  /* Routes                                         */
  /* ---------------------------------------------- */

  routes?: DiscoveredRoute[];


  /* ---------------------------------------------- */
  /* Routing Tables                                 */
  /* ---------------------------------------------- */

  routing_tables?: DiscoveredRoutingTable[];


  /* ---------------------------------------------- */
  /* NAT                                            */
  /* ---------------------------------------------- */

  nat_rules?: Record<string, unknown>[];


  /* ---------------------------------------------- */
  /* Mangle                                         */
  /* ---------------------------------------------- */

  mangle_rules?: Record<string, unknown>[];


  /* ---------------------------------------------- */
  /* Firewall                                       */
  /* ---------------------------------------------- */

  firewall_rules?: Record<string, unknown>[];


  /* ---------------------------------------------- */
  /* Normalized WANs                                */
  /* ---------------------------------------------- */

  /*
   * Canonical normalized WAN list.
   *
   * This is what WanSelector should use.
   */

  wans?: DiscoveredWan[];


  /* ---------------------------------------------- */
  /* Raw WAN Discovery                              */
  /* ---------------------------------------------- */

  wan?: DeploymentWanDiscovery | null;


  /* ---------------------------------------------- */
  /* Preview Convenience                            */
  /* ---------------------------------------------- */

  default_routes?: DiscoveredRoute[];


  /* ---------------------------------------------- */
  /* Extensibility                                  */
  /* ---------------------------------------------- */

  [key: string]: unknown;
}


/* ================================================== */
/* Router Discovery Response                          */
/* ================================================== */

export interface RouterDiscoveryResponse {

  status:
    | "success"
    | "error";


  deployment_id?: string;


  router?: {
    id: string;

    identity: string;
  };


  discovery?: DeploymentDiscovery;


  message?: string;
}


/* ================================================== */
/* PLAN - WAN                                         */
/* ================================================== */

export interface PlannedWan
  extends DiscoveredWan {
  weight: number;
}


/* ================================================== */
/* PLAN - ROUTE TABLE                                 */
/* ================================================== */

export interface DeploymentRouteTablePlan {
  name: string;

  interface: string;

  gateway: string;

  default_route: {
    dst: string;

    gateway: string;
  };
}


/* ================================================== */
/* PLAN - PCC                                         */
/* ================================================== */

export interface DeploymentPccRule {
  interface: string;

  connection_mark: string;

  routing_mark: string;

  classifier: string;
}


export interface DeploymentPccPlan {
  method: PccMode;

  total_buckets: number;

  rules: DeploymentPccRule[];
}


/* ================================================== */
/* PLAN - NAT                                         */
/* ================================================== */

export interface DeploymentNatRule {
  interface: string;

  action: string;

  chain: string;

  out_interface: string;
}


/* ================================================== */
/* PLAN - VERIFICATION                                */
/* ================================================== */

export type DeploymentVerificationType =
  | "gateway_ping"
  | "route_check"
  | "internet_connectivity";


export interface DeploymentVerificationStep {
  type: DeploymentVerificationType | string;

  interface?: string;

  target?: string;
}


/* ================================================== */
/* PLAN                                               */
/* ================================================== */

export interface DeploymentPlan {
  type: "load_balancing" | string;

  mode: "pcc" | string;

  pcc_type: PccMode | string;

  wans: PlannedWan[];

  route_tables: DeploymentRouteTablePlan[];

  pcc: DeploymentPccPlan;

  nat: DeploymentNatRule[];

  verification: DeploymentVerificationStep[];

  deployment_marker: string[];
}


/* ================================================== */
/* CONFLICT CHECK                                     */
/* ================================================== */

export type DeploymentCheckStatus =
  | "pass"
  | "warning"
  | "fail";


export interface DeploymentConflictCheck {
  code: string;

  status: DeploymentCheckStatus;

  severity?: string;

  message: string;

  details?: Record<string, unknown>;
}


/* ================================================== */
/* CONFLICT                                           */
/* ================================================== */

export interface DeploymentConflict {
  code?: string;

  type?: string;

  resource?: string;

  message?: string;

  severity?: string;

  details?: Record<string, unknown>;

  [key: string]: unknown;
}


/* ================================================== */
/* CONFLICT SUMMARY                                   */
/* ================================================== */

export interface DeploymentConflictSummary {
  checks: number;

  conflicts: number;

  warnings: number;

  blocking: number;
}


/* ================================================== */
/* CONFLICT ANALYSIS                                  */
/* ================================================== */

export interface DeploymentConflicts {
  safe: boolean;

  checks: DeploymentConflictCheck[];

  conflicts: DeploymentConflict[];

  warnings: DeploymentConflictCheck[];

  summary: DeploymentConflictSummary;
}


/* ================================================== */
/* CHANGES                                            */
/* ================================================== */

export interface DeploymentChanges {
  route_tables: number;

  pcc_rules: number;

  nat_rules: number;
}


/* ================================================== */
/* PREVIEW                                            */
/* ================================================== */

export interface DeploymentPreview {
  router: DeploymentRouter;

  discovery: DeploymentDiscovery;

  plan: DeploymentPlan;

  conflicts: DeploymentConflicts;

  changes: DeploymentChanges;

  can_execute: boolean;

  rollback_supported: boolean;
}


/* ================================================== */
/* PREVIEW RESPONSE                                   */
/* ================================================== */

export interface PreviewDeploymentResponse {
  status: "success" | "error";

  deployment_id: string;

  preview?: DeploymentPreview;

  message?: string;
}