import type * as Monaco from "monaco-editor";

import { ISP_THEME } from "./theme";
import { registerRouterOS } from "./routeros";

let initialized = false;

export function setupMonaco(monaco: typeof Monaco) {
    if (initialized) return;

    initialized = true;

    monaco.editor.defineTheme("isp-dark", ISP_THEME);

    registerRouterOS(monaco);
}