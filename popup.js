window.onload = function () {
	function updateLabel() {
		var enabled = chrome.extension.getBackgroundPage().enabled;
		document.getElementById('toggle_button').value = enabled ? "Disable" : "Enable";
	}
	document.getElementById('toggle_button').onclick = function () {
		var background = chrome.extension.getBackgroundPage();
		background.enabled = !background.enabled;
		updateLabel();
	};

  document.getElementById('download-csv').onclick = function () {
    var background = chrome.extension.getBackgroundPage();
    data = background.data
    csv_rows = []
    for (const [initiator, trackers] of Object.entries(data)) {
      trackers.forEach(tracker => {
        csv_rows.push([initiator, tracker])
      });
    }
    console.log(csv_rows)
    let csvContent = "data:text/csv;charset=utf-8," 
    + csv_rows.map(e => e.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    link.click()
  }
	updateLabel();
}




