window.onload = function () {
	function updateExtensionLabel() {
		var enabled = chrome.extension.getBackgroundPage().enabled;
		document.getElementById('toggle_extension').value = enabled ? "Disable Extension" : "Enable Extension";
	}
	document.getElementById('toggle_extension').onclick = function () {
		var background = chrome.extension.getBackgroundPage();
		background.enabled = !background.enabled;
		updateExtensionLabel();
	};

  function updateBlockingLabel() {
		var blocking = chrome.extension.getBackgroundPage().blocking;
		document.getElementById('toggle_blocking').value = blocking ? "Disable Blocking" : "Enable Blocking";
	}
	document.getElementById('toggle_blocking').onclick = function () {
		var background = chrome.extension.getBackgroundPage();
		background.blocking = !background.blocking;
		updateBlockingLabel();
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
	updateExtensionLabel();
  updateBlockingLabel();
}




