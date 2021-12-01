var enabled = true;
var blocking = true;
var data = {};
const domain_patterns = blocked_domains_easy.map((domain) => {
  try{
    const pattern = new URLPattern({hostname: '{*.}?' + domain,});
    return pattern;
  }catch(e){
    console.error(e)
  }
})
// console.log(domain_patterns)

function logURL(requestDetails) {
  const url = requestDetails.url;
  var filter_match;

  for(const domain of domain_patterns){
    if(domain.test(url)){
      filter_match = domain.hostname.substring(5);
      break;
    }
  }

  if(enabled){
    initiator = requestDetails.initiator;
    if (data[initiator]) {
      data[initiator].push([filter_match, url]);
    } else {
      data[initiator] = [[filter_match, url]];
    }
    console.log(data);
  }
  return {cancel: enabled };
}

function cancel(requestDetails) {
  console.log("Canceling: " + requestDetails.url);
  return { cancel: true };
}

chrome.webRequest.onBeforeRequest.addListener(logURL, { urls: blocked_domains_glob_easy }, [blocking ? 'blocking' : '']);