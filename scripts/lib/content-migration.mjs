import path from "node:path";

function escapeAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function transformBody(body, slug) {
  let transformed = body.replace(/\{%\s*comment\s*%\}[\s\S]*?\{%\s*endcomment\s*%\}/g, "");
  transformed = transformed
    .replace(/\{%\s*raw\s*%\}\s*/g, "")
    .replace(/\s*\{%\s*endraw\s*%\}/g, "")
    .replaceAll("<br>", "<br />")
    .replaceAll("<mdmclienterror:72>", "&lt;mdmclienterror:72&gt;")
    .replace(/^```Dockerfile$/gm, "```docker")
    .replace(/\{%\s*revision\s+['"]([^'"]+)['"]\s*%\}/g, '<Revision date="$1">')
    .replace(/\{%\s*endrevision\s*%\}/g, "</Revision>")
    .replace(/\{%\s*post_url\s+(?:\/?post\/)?([^%\s]+)\s*%\}/g, "/post/$1")
    .replace(/\{%\s*asset_path\s+([^%\s]+)\s*%\}/g, `/assets/posts/post/${slug}/$1`)
    .replace(/^\s*\*\s+TOC\s*\n\s*\{:\s*toc\s*\}\s*$/gim, "")
    .replace(
      /\{%\s*speakerdeck\s+([a-z0-9]+)(?:\s+\d+)?\s*%\}/gi,
      '<LinkCard href="https://speakerdeck.com/player/$1" />',
    )
    .replace(
      /<iframe\b[^>]*\bsrc=['"]([^'"]+)['"][^>]*><\/iframe>/gi,
      (_, href) => `<LinkCard href="${escapeAttribute(href)}" />`,
    );

  transformed = transformed.replace(/!\[\]\((\/assets\/posts\/[^)]+)\)/g, (_, source) => {
    const filename = path.basename(source, path.extname(source)).replaceAll("_", " ");
    return `![${filename}](${source})`;
  });

  return transformed.replace(/\n{3,}/g, "\n\n").trimStart();
}

export function collectStats(text) {
  return {
    headings: (text.match(/^#{1,6}\s+/gm) ?? []).length,
    codeBlocks: Math.floor((text.match(/^```/gm) ?? []).length / 2),
    internalLinks: (text.match(/\]\(\/post\/[^)]+\)/g) ?? []).length,
    images: (text.match(/!\[[^\]]*]\([^)]+\)/g) ?? []).length,
    characters: text.replace(/\s+/g, "").length,
  };
}
