// background.js
chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      const blockedFilters = JSON.parse(localStorage.getItem("customFilters")) || [];
      const url = new URL(details.url);
  
      if (blockedFilters.some((filter) => url.hostname.includes(filter))) {
        return { cancel: true };
      }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
  );