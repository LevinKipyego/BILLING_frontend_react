import type * as Monaco from "monaco-editor";

export function registerRouterOS(monaco: typeof Monaco) {
  monaco.languages.register({ id: "routeros" });

  monaco.languages.setMonarchTokensProvider("routeros", {
    tokenizer: {
      root: [
        [/\/(?:ip|ppp|queue|interface|system|tool|routing).*/, "keyword"],
        [/\b(add|set|remove|print|enable|disable)\b/, "keyword"],
        [/\b(name|rate-limit|address|interface|comment|disabled)=/, "attribute"],
        [/".*?"/, "string"],
        [/\b\d+\b/, "number"],
      ],
    },
  });
}