// utils/tabId.js
export function getTabId() {
  let tabId = sessionStorage.getItem("tabId");

  // S’il n’y a pas encore de tabId, on réutilise celui d’un token existant
  if (!tabId) {
    const existingKeys = Object.keys(sessionStorage).filter(k => k.startsWith("token_"));
    if (existingKeys.length > 0) {
      tabId = existingKeys[0].replace("token_", "");
    } else {
      tabId = Date.now().toString();
    }
    sessionStorage.setItem("tabId", tabId);
  }

  return tabId;
}
