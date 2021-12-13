function get_counts() {
  var counts = {}
  data = chrome.extension.getBackgroundPage().data;
  for (const [initiator, trackers] of Object.entries(data)) {
    trackers.forEach(tracker => {
      tracker[0] in counts ? counts[tracker[0]] += 1 : counts[tracker[0]] = 1;
    });
  }
  return counts;
}



window.onload = function () {
  const ctx = document.getElementById('myChart');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  counts = get_counts();
  var sort_counts = Object.keys(counts).map(function (key) {
    return [key, counts[key]];
  });

  sort_counts.sort(function (first, second) {
    return first[1] - second[1];
  });

  for (key in sort_counts) {
    var table = document.getElementById("myTable");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = sort_counts[key][0];
    cell2.innerHTML = sort_counts[key][1];
  }

  data = chrome.extension.getBackgroundPage().data;
  total_websites = Object.keys(data).length;
  total_trackers = 0;
  for (const [filter, count] of Object.entries(counts)) {
    total_trackers += count;
  }

  document.getElementById("totalWebsites").innerHTML = total_websites;
  document.getElementById("totalTrackers").innerHTML = total_trackers;
}