import { createContext } from "react";

export interface SiteAssets {
  siteScript: string;
  supportScript: string;
  globalStyle: string;
  supportStyle: string;
}

export const developmentAssets: SiteAssets = {
  siteScript: "/src/scripts/site.ts",
  supportScript: "/src/scripts/support.ts",
  globalStyle: "/src/styles/global.css",
  supportStyle: "/src/styles/support.css",
};

export const SiteContext = createContext({
  path: "/",
  assets: developmentAssets,
});
