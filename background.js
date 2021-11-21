// domain_patterns = blocked_domains.map((domain) => {
//   try{
//     const pattern = new URLPattern({
//       hostname: domain,
//     });
//     return pattern;
//   }catch(e){
//     console.error(e)
//   }
// })
// console.log(domain_patterns)

function logURL(requestDetails) {
  // initiator = requestDetails.initiator;
  // url = requestDetails.url;
  // domain_patterns.forEach(function(domain){
  //     if(domain.test(url)){
  //       console.log("MATCH", url, host)
  //     }
  // })
  console.log(requestDetails);
}

function cancel(requestDetails) {
  console.log("Canceling: " + requestDetails.url);
  return { cancel: true };
}

chrome.webRequest.onBeforeRequest.addListener(logURL, { urls: blocked_domains }, ['blocking']);
