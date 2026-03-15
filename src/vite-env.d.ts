/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHEETDB_URL: string;
  readonly VITE_POLL_INTERVAL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
