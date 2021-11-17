function logURL(requestDetails) {
  console.log(requestDetails.initiator, requestDetails.url);
}

function cancel(requestDetails) {
  console.log("Canceling: " + requestDetails.url);
  return { cancel: true };
}

chrome.webRequest.onBeforeRequest.addListener(logURL, { urls: ["<all_urls>"] });
