/** Устанавливает HTML-документ в текущую страницу с выполнением скриптов. */
export function installHtmlDocument(html: string, target: Document = document): void {
  const parsed = new DOMParser().parseFromString(html, "text/html");

  const title = parsed.querySelector("title")?.textContent?.trim();
  if (title) target.title = title;

  target.head
    .querySelectorAll("meta, link, style, title, base, script")
    .forEach((el) => el.remove());

  parsed.head
    .querySelectorAll("meta, link, style, title, base")
    .forEach((el) => {
      target.head.appendChild(target.importNode(el, true));
    });

  target.body.innerHTML = parsed.body.innerHTML;

  const runScript = (oldScript: HTMLScriptElement) => {
    const script = target.createElement("script");
    for (const attr of oldScript.attributes) {
      script.setAttribute(attr.name, attr.value);
    }
    if (oldScript.textContent) {
      script.textContent = oldScript.textContent;
    }
    oldScript.parentNode?.replaceChild(script, oldScript);
  };

  parsed.head.querySelectorAll("script").forEach((node) => {
    const script = target.createElement("script");
    for (const attr of node.attributes) {
      script.setAttribute(attr.name, attr.value);
    }
    if (node.textContent) script.textContent = node.textContent;
    target.head.appendChild(script);
  });

  target.body.querySelectorAll("script").forEach((node) => {
    runScript(node as HTMLScriptElement);
  });
}
