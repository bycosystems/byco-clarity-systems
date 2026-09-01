// Contexte "marché" (europe | afrique_francophone), résolu côté serveur
// dans __root.tsx (en-tête CF-IPCountry, ou override manuel ?marche=)
// et rendu disponible à tout composant descendant via useMarche().

import { createContext, useContext, type ReactNode } from "react";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { resolveMarche, type Marche } from "./pricing";

export type { Marche };

export const getMarcheServerFn = createServerFn({ method: "GET" }).handler(() => {
  const country = getRequestHeader("cf-ipcountry" as any);
  return resolveMarche(country as string | undefined);
});

const MarketContext = createContext<Marche>("europe");

export function MarketProvider({
  marche,
  children,
}: {
  marche: Marche;
  children: ReactNode;
}) {
  return <MarketContext.Provider value={marche}>{children}</MarketContext.Provider>;
}

export function useMarche(): Marche {
  return useContext(MarketContext);
}
