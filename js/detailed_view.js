window.onload = function () {
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
      var tracker= (csv_rows[i][1]).toString().substr(0, csv_rows[i][1].toString().indexOf(',')); 
      if (tracker in counts){
        counts[tracker] +=1;
      }
      else{
        counts[tracker]=1;
      }
  }
  
  var sort_counts = Object.keys(counts).map(function(key) {
    return [key, counts[key]];
  });

  sort_counts.sort(function(first, second) {
    return first[1] - second[1];
  });

  for (key in sort_counts){
    var table = document.getElementById("myTable");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = sort_counts[key][0];
    cell2.innerHTML = sort_counts[key][1];
  }

  websites=[];
  for (let i = 0; i<csv_rows.length; i++){
    websites.push(csv_rows[i][0]);
  }  
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  var unique = websites.filter(onlyUnique);

  unique = websites.filter((item, i, ar) => ar.indexOf(item) === i);
  document.getElementById("totalWebsites").innerHTML = unique.length;
  totTrack=csv_rows.length;
  document.getElementById("totalTrackers").innerHTML = totTrack;
}