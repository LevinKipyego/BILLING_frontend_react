export async function copyText(text: string): Promise<boolean> {
  if (!text || text === "---") return false;
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(text); return true; } catch { /* use fallback */ }
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus(); textarea.select();
  let copied = false;
  try { copied = document.execCommand("copy"); }
  finally { document.body.removeChild(textarea); }
  return copied;
}
