import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "../index";
import { content } from "@/lib/i18n";

export const Route = createFileRoute("/fr/")({
  head: () => ({
    meta: [
      { title: content.fr.meta.title },
      { name: "description", content: content.fr.meta.description },
      { property: "og:title", content: content.fr.meta.title },
      { property: "og:description", content: content.fr.meta.ogDescription },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <HomePage lang="fr" />,
});
