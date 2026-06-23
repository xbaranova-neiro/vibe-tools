import { budgetAltHtml } from "./budget-alt";
import { budgetHtml } from "./budget";
import { kidsAltHtml } from "./kids-alt";
import { kidsHtml } from "./kids";
import { shoppingAltHtml } from "./shopping-alt";
import { shoppingHtml } from "./shopping";
import { tasksAltHtml } from "./tasks-alt";
import { tasksHtml } from "./tasks";
import { pillsAltHtml } from "./pills-alt";
import { pillsHtml } from "./pills";
import { watchlistAltHtml } from "./watchlist-alt";
import { watchlistHtml } from "./watchlist";
import { waterAltHtml } from "./water-alt";
import { waterHtml } from "./water";

const PREBUILT: Record<string, string[]> = {
  budget: [budgetHtml, budgetAltHtml],
  habits: [waterHtml, waterAltHtml],
  tasks: [tasksHtml, tasksAltHtml],
  kids: [kidsHtml, kidsAltHtml],
  shopping: [shoppingHtml, shoppingAltHtml],
  pills: [pillsHtml, pillsAltHtml],
  watchlist: [watchlistHtml, watchlistAltHtml],
};

export function getPrebuiltHtml(templateId: string): string | null {
  const variants = PREBUILT[templateId];
  if (!variants?.length) return null;
  return variants[Math.floor(Math.random() * variants.length)]!;
}

export function hasPrebuiltTemplate(templateId: string): boolean {
  return templateId in PREBUILT;
}

export function getPrebuiltVariantCount(templateId: string): number {
  return PREBUILT[templateId]?.length ?? 0;
}
