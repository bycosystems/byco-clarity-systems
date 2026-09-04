// Grille de prix ByCo Systems, source unique pour les deux marchés.
//
// "europe" = grille euro actuelle (France, UK, reste), inchangée.
// "afrique_francophone" = Cameroun, Sénégal, Côte d'Ivoire, grille publique FCFA.
//
// Les planchers de négociation internes (150k/300k/500k FCFA) ne vivent
// nulle part dans ce fichier ni ailleurs dans le code public — ils ne
// doivent jamais être affichés ni récités par Orlane.

export type Marche = "afrique_francophone" | "europe";

const AFRIQUE_FRANCOPHONE_COUNTRIES = new Set(["CM", "SN", "CI"]);

export function resolveMarche(countryCode: string | undefined | null): Marche {
  if (countryCode && AFRIQUE_FRANCOPHONE_COUNTRIES.has(countryCode.toUpperCase())) {
    return "afrique_francophone";
  }
  return "europe";
}

export function resolveMarcheOverride(raw: unknown): Marche | undefined {
  return raw === "afrique_francophone" || raw === "europe" ? raw : undefined;
}

export const PLAN_PRICES: Record<string, Record<Marche, string>> = {
  Essential: { europe: "490€", afrique_francophone: "343 900 FCFA" },
  Business: { europe: "990€", afrique_francophone: "694 900 FCFA" },
  "Business+": { europe: "1 490€", afrique_francophone: "1 045 800 FCFA" },
  Premium: { europe: "1 990€", afrique_francophone: "1 396 700 FCFA" },
};

export function priceFor(planName: string, marche: Marche): string {
  return PLAN_PRICES[planName]?.[marche] ?? PLAN_PRICES[planName]?.europe ?? "";
}
