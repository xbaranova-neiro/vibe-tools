/** Устанавливает HTML-документ в текущую страницу с выполнением скриптов. */
export function installHtmlDocument(html: string, target: Document = document): void {
  const parsed = new DOMParser().parseFromString(html, "text/html");

  const title = parsed.querySelector("title")?.textContent?.trim();
  if (title) target.title = title;

  target.head
    .querySelectorAll("meta, link, style, title, base")
    .forEach((el) => el.remove());

  parsed.head.querySelectorAll("meta, link, style, title, base").forEach((el) => {
    target.head.appendChild(target.importNode(el, true));
  });

  target.body.innerHTML = parsed.body.innerHTML;

  const runScripts = (root: ParentNode) => {
    root.querySelectorAll("script").forEach((oldScript) => {
      const script = target.createElement("script");
      for (const attr of oldScript.attributes) {
        script.setAttribute(attr.name, attr.value);
      }
      if (oldScript.textContent) {
        script.textContent = oldScript.textContent;
      }
      oldScript.replaceWith(script);
    });
  };

  runScripts(parsed.head);
  runScripts(target.body);
}
