/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_GEMINI_API_KEY: string
  readonly VITE_RYTR_API_KEY: string
  readonly VITE_ZOOMINFO_API_KEY: string
  readonly VITE_HUNTERIO_API_KEY: string
  readonly VITE_MAILCHIMP_API_KEY: string
  readonly VITE_SMARTLY_API_KEY: string
  readonly VITE_DYNAMIC_YIELD_API_KEY: string
  readonly VITE_GA_MEASUREMENT_ID: string
  readonly VITE_HOTJAR_SITE_ID: string
  readonly VITE_SURFER_SEO_API_KEY: string
  readonly VITE_INTERCOM_APP_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
