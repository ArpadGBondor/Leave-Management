/// <reference types="vite/client" />

// For React component imports via ?react
declare module '*.svg?react' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

interface ImportMetaEnv {
  readonly VITE_FIREBASE_CONFIG_API_KEY: string;
  readonly VITE_FIREBASE_CONFIG_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_CONFIG_PROJECT_ID: string;
  readonly VITE_FIREBASE_CONFIG_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_CONFIG_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_CONFIG_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
