import {
  applyContentVariation,
  fontLinkTag,
  type AppVariation,
  variationCss,
} from "./app-variation";
import {
  applyDomainPersonality,
  type DomainFlavor,
} from "./template-personality";
import { applyVisualPolish } from "./visual-polish";
import { themeVarsCss, type ThemeExtras, type VibeTheme } from "./themes";

const THEME_OVERRIDES = `
body{background:linear-gradient(160deg,var(--vibe-bg1),var(--vibe-bg2) 50%,var(--vibe-bg3))!important;color:#fff!important}
.card,.balance,.daily,.next,.progress-box,.streak,.chart-wrap,.form,.hero .balance,.bars,.stat,.slot-card,.row,.med,.show,.tile,.bottle,.dose{
  border-radius:var(--vibe-radius)!important;
  background:var(--vibe-card)!important;
  border-color:var(--vibe-card-border)!important
}
.btn-add,.btn,.btn-add:not(.btn-reset){
  background:var(--vibe-accent)!important;
  color:var(--vibe-accent-text)!important;
  box-shadow:0 4px 20px var(--vibe-glow)!important
}
.daily,.next,.hero .daily,.today-banner{
  background:linear-gradient(135deg,var(--vibe-highlight),var(--vibe-accent))!important;
  color:var(--vibe-accent-text)!important
}
.bar-fill,.progress-fill,.glass-fill,.bar-seg{
  background:linear-gradient(90deg,var(--vibe-accent),var(--vibe-accent-light))!important
}
.glass.filled{border-color:var(--vibe-accent-light)!important;box-shadow:0 0 14px var(--vibe-glow)!important}
.glass-fill{background:linear-gradient(0deg,var(--vibe-bg2),var(--vibe-accent))!important}
.btn-reset{background:var(--vibe-danger)!important;color:#fff!important}
.msg.ok{background:color-mix(in srgb,var(--vibe-success) 25%,transparent)!important;color:var(--vibe-success)!important}
.day.today,.pill.today-pill,.day.selected,.pill.selected-pill{background:color-mix(in srgb,var(--vibe-accent) 35%,transparent)!important;box-shadow:0 0 12px var(--vibe-glow)!important}
.view-tabs button.active{background:var(--vibe-accent)!important;color:var(--vibe-accent-text)!important}
#ring,[id="ring"]{stroke:var(--vibe-accent)!important}
.balance .num,.daily .num,.ring-text,.ring-num,.hero-num .big,.stat .n,.progress-head .pct{color:var(--vibe-accent-light)!important}
.done-msg.show,.done-banner.show{color:var(--vibe-accent-light)!important}
.filters button.active,.chips button.active,.tag.sel,.tabs button.active{background:var(--vibe-accent)!important;color:var(--vibe-accent-text)!important}
.alert.ok{background:color-mix(in srgb,var(--vibe-success) 22%,transparent)!important;color:var(--vibe-success)!important;border-color:color-mix(in srgb,var(--vibe-success) 35%,transparent)!important}
.alert.warn{background:color-mix(in srgb,var(--vibe-highlight,#fbbf24) 22%,transparent)!important;color:var(--vibe-accent-light)!important}
.med-check{border-color:var(--vibe-accent)!important}
.med.taken .med-check{background:var(--vibe-accent)!important;color:var(--vibe-accent-text)!important}
.task-check{border-color:var(--vibe-accent)!important}
.task.done .task-check{background:var(--vibe-accent)!important;color:var(--vibe-accent-text)!important}
.persona-receipt .card,.persona-receipt .item,.persona-receipt .row{background:#fff!important;color:#374151!important}
`;

/** Снимает тему/полировку Vibe Studio — иначе !important блокирует смену цветов при доработке. */
export function stripStudioLayers(html: string): string {
  let result = html;
  result = result.replace(
    /<style data-vibe-theme="[^"]*">[\s\S]*?<\/style>/gi,
    "",
  );
  result = result.replace(
    /<style data-vibe-variation>[\s\S]*?<\/style>/gi,
    "",
  );
  result = result.replace(
    /<style data-vibe-polish>[\s\S]*?<\/style>/gi,
    "",
  );
  result = result.replace(
    /<script data-vibe-polish>[\s\S]*?<\/script>/gi,
    "",
  );
  result = result.replace(
    /<style data-vibe-personality>[\s\S]*?<\/style>/gi,
    "",
  );
  result = result.replace(
    /<script data-vibe-personality>[\s\S]*?<\/script>/gi,
    "",
  );
  result = result.replace(
    /<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^"]*">/gi,
    "",
  );
  result = result.replace(/\sdata-vibe-theme="[^"]*"/gi, "");
  result = result.replace(/\sdata-vibe-flavor="[^"]*"/gi, "");
  result = result.replace(/<body([^>]*)>/i, (_match, attrs: string) => {
    let a = (attrs ?? "")
      .replace(/\spersona-[\w-]+/g, "")
      .replace(/\sdata-vibe-flavor="[^"]*"/g, "");
    if (/class="([^"]*)"/.test(a)) {
      a = a.replace(/class="([^"]*)"/, (_m, cls: string) => {
        const cleaned = cls
          .replace(/\bpersona-[\w-]+\b/g, "")
          .replace(/\s+/g, " ")
          .trim();
        return cleaned ? `class="${cleaned}"` : "";
      });
    }
    return `<body ${a.trim()}>`;
  });
  return result;
}

export function applyThemeToHtml(
  html: string,
  theme: VibeTheme,
  extras: ThemeExtras,
  variation?: AppVariation,
  templateId?: string | null,
  flavor?: DomainFlavor | null,
): string {
  const variationBlock = variation
    ? `<style data-vibe-variation>${variationCss(variation)}</style>`
    : "";
  const themeBlock = `<style data-vibe-theme="${theme.id}">${themeVarsCss(theme, extras)}${THEME_OVERRIDES}</style>`;
  const fontBlock = variation ? fontLinkTag(variation) : "";

  let result = html.replace(
    /<style data-vibe-theme="[^"]*">[\s\S]*?<\/style>/,
    "",
  );
  result = result.replace(
    /<style data-vibe-variation>[\s\S]*?<\/style>/,
    "",
  );
  result = result.replace(
    /<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^"]*">/,
    "",
  );

  const inject = fontBlock + themeBlock + variationBlock;

  if (result.includes("<head>")) {
    result = result.replace("<head>", `<head>${inject}`);
  } else {
    result = inject + result;
  }

  result = result.replace(
    /<html([^>]*)>/i,
    `<html$1 data-vibe-theme="${theme.id}">`,
  );

  if (templateId) {
    result = applyContentVariation(result, templateId);
  }

  if (templateId && flavor) {
    result = applyDomainPersonality(result, templateId, flavor);
  }

  if (templateId) {
    result = applyVisualPolish(result, templateId);
  }

  return result;
}

/** Тема + анимации для AI-сгенерированных приложений (как у шаблонов). */
export function polishGeneratedApp(
  html: string,
  theme: VibeTheme,
  extras: ThemeExtras,
  variation: AppVariation,
): string {
  let result = applyThemeToHtml(html, theme, extras, variation, null, null);
  result = applyVisualPolish(result, "custom");
  return result;
}

export type { DomainFlavor };
