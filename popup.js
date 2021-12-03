window.onload = function () {
  // Getting the current domain

  domain = "";
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var tab = tabs[0];
    var url = new URL(tab.url)
    domain = url.hostname
    console.log(domain)
    document.getElementById("current_website").innerHTML = "Current Website: " + domain;
    var background = chrome.extension.getBackgroundPage();
    data = background.data
    var csv_rows = [];
    for (const [initiator, trackers] of Object.entries(data)) {
      trackers.forEach(tracker => {
        csv_rows.push([initiator, tracker])
      });
    }
    counts = {};
    for (let i=0; i<csv_rows.length; i++){
      if ("https://"+domain == csv_rows[i][0]){
        var tracker= (csv_rows[i][1]).toString().substr(0, csv_rows[i][1].toString().indexOf(',')); 
        if (tracker in counts){
          counts[tracker] +=1;
        }
        else{
          counts[tracker]=1;
        }
      }
    }
    for (key in counts){
    var table = document.getElementById("myTable");
      var row = table.insertRow(1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      cell1.innerHTML = key;
      cell2.innerHTML = counts[key];
    }
  });
}