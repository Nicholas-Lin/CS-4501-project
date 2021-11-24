// domain_patterns = blocked_domains.map((domain) => {
//   try{
//     const pattern = new URLPattern({
//       domain
//     });
//     return pattern;
//   }catch(e){
//     console.error(e)
//   }
// })
// console.log(domain_patterns)

var enabled = true;
var blocking = true;
var data = {};

function logURL(requestDetails) {
  // domain_patterns.forEach(function(domain){
  //     if(domain.test(url)){
  //       console.log("MATCH", url, host)
  //     }
  // })

  if(enabled){
    initiator = requestDetails.initiator;
    url = requestDetails.url;
    if (data[initiator]) {
      data[initiator].push(url);
    } else {
      data[initiator] = [url];
    }
    console.log(data);
  }
  return {cancel: enabled };
}

function cancel(requestDetails) {
  console.log("Canceling: " + requestDetails.url);
  return { cancel: true };
}

chrome.webRequest.onBeforeRequest.addListener(logURL, { urls: blocked_domains }, [blocking ? 'blocking' : '']);
