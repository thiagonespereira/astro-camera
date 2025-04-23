import fs from "fs";

export default {
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  build: {
    target: "esnext",
    wasm: {
      mimeType: "application/wasm", // Explicit MIME type for wasm
    },
  },
};
