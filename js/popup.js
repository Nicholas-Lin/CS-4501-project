function get_domain_counts(domain) {
  var counts = {}
  data = chrome.extension.getBackgroundPage().data
  domain_data = data[domain];
  if (domain_data != undefined) {
    domain_data.forEach(tracker => tracker[0] in counts ? counts[tracker[0]] += 1 : counts[tracker[0]] = 1);
  }
  return counts;
}

function get_trackerOwner() {
  var owner = {}
  data = chrome.extension.getBackgroundPage().data;
  for (const [initiator, trackers] of Object.entries(data)) {
    trackers.forEach(tracker => {
      owner[tracker[0]] = tracker[1];
    });
  }
  return owner;
}

window.onload = function () {

  // Getting the current domain
  chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
    var tab = tabs[0];
    var url = new URL(tab.url);
    domain = url.hostname;
    document.getElementById("current_website").innerHTML = "Current Website: " + domain;
    counts = get_domain_counts(domain);
    var sort_counts = Object.keys(counts).map(function (key) {
      return [key, counts[key]];
    });
    sort_counts.sort(function (first, second) {
      return first[1] - second[1];
    });

    owner = get_trackerOwner();
    for (key in sort_counts) {
      if (sort_counts[key][0] in owner){
        sort_counts[key][2] = owner[sort_counts[key][0]]
      }
      var table = document.getElementById("myTable");
      var row = table.insertRow(1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = sort_counts[key][0];
      cell2.innerHTML = sort_counts[key][2];
      cell3.innerHTML = sort_counts[key][1];
    }
  });
}