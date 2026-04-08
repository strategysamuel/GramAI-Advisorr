/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CROP_AGENT_URL: string;
  readonly VITE_LAND_AGENT_URL: string;
  readonly VITE_FINANCE_AGENT_URL: string;
  readonly VITE_SCHEME_AGENT_URL: string;
  readonly VITE_OPTIMIZER_URL: string;
  readonly VITE_ORCHESTRATOR_URL: string;
  readonly VITE_DOCUMENT_AGENT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
