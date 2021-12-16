var enabled = true;
var blocking = true;
var data = {};
const domain_patterns = blocked_domains_easy.map((domain) => {
  try {
    const pattern = new URLPattern({ hostname: '{*.}?' + domain, });
    return pattern;
  } catch (e) {
    console.error(e)
  }
})

function logURL(requestDetails) {
  const url = requestDetails.url;
  var filter_match;

  for (const domain of domain_patterns) {
    if (domain.test(url)) {
      filter_match = domain.hostname.substring(5);
      break;
    }
  }

  if (enabled && requestDetails.initiator !== undefined) {
    var initiator = (new URL(requestDetails.initiator)).hostname;
    var domain_registrant = blocked_domains_whois_easy[filter_match];
    if (domain_registrant == undefined) domain_registrant = 'unavailable';
    const time_stamp = new Date(requestDetails.timeStamp);
    if (data[initiator]) {
      data[initiator].push([filter_match, domain_registrant, url, time_stamp]);
    } else {
      data[initiator] = [[filter_match, domain_registrant, url, time_stamp]];
    }
    console.log(data);
  }
  return { cancel: blocking };
}

function cancel(requestDetails) {
  console.log("Canceling: " + requestDetails.url);
  return { cancel: true };
}

function reset_stats() {
  data = {}
}

chrome.webRequest.onBeforeRequest.addListener(
  logURL,
  { urls: blocked_domains_glob_easy },
  ['blocking']);