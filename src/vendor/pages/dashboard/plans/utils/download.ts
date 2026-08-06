export function downloadFile(
  filename: string,
  content: string,
  mime = "text/plain;charset=utf-8"
) {
  const blob = new Blob([content], {
    type: mime,
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
}

export function exportHTML(html: string) {
  downloadFile(
    "hotspot-buttons.html",
    html,
    "text/html"
  );
}

export function exportTXT(html: string) {
  downloadFile(
    "hotspot-buttons.txt",
    html,
    "text/plain"
  );
}

export function exportJSON(json: string) {
  downloadFile(
    "plans.json",
    json,
    "application/json"
  );
}

export function exportRSC(content: string) {
  downloadFile(
    "hotspot-plans.rsc",
    content,
    "text/plain"
  );
}