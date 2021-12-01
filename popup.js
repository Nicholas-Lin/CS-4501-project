window.onload = function () {
  // Getting the current domain

  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var tab = tabs[0];
    var url = new URL(tab.url)
    var domain = url.hostname
    console.log(domain)
    document.getElementById("current_website").innerHTML = "Current Website: " + domain;
  });
  
}
