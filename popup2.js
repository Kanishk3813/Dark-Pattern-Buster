document.addEventListener('DOMContentLoaded', function () {

    // Function to handle blacklisting
    document.getElementById("blacklistButton").onclick = function () {
        var url = document.getElementById("blacklistUrl").value.trim();
        if (url !== "") {
            addToBlacklist(url);
        }
    };

    // Function to display blacklisted websites
    document.getElementById("showBlacklistedButton").onclick = function () {
        updateBlacklist();
        document.getElementById("blacklistedWebsites").style.display = "block";
    };

    // Function to handle clearing of blacklisted websites
    document.getElementById("clearBlacklistButton").onclick = function () {
        clearBlacklist();
    };

    // Function to check and show popup when visiting blacklisted website
    checkAndShowPopup();

    // Listen for tab changes to check and show popup again
    chrome.tabs.onActivated.addListener(checkAndShowPopup);
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.url) {
            checkAndShowPopup();
        }
    });
});

function addToBlacklist(url) {
    // Retrieve existing blacklist from storage
    chrome.storage.local.get(['blacklist'], function (result) {
        var blacklist = result.blacklist || [];
        // Check if the URL is already in the blacklist
        if (!blacklist.includes(url)) {
            // Add new URL to the blacklist
            blacklist.push(url);
            // Save updated blacklist to storage
            chrome.storage.local.set({ 'blacklist': blacklist }, function () {
                console.log('URL added to blacklist: ' + url);
            });
        } else {
            console.log('URL is already in the blacklist: ' + url);
        }
    });
}

function updateBlacklist() {
    // Retrieve blacklisted URLs from storage and display them
    chrome.storage.local.get(['blacklist'], function (result) {
        var blacklist = result.blacklist || [];
        var blacklistElement = document.getElementById("blacklist");
        blacklistElement.innerHTML = ""; // Clear existing list
        blacklist.forEach(function (url) {
            var listItem = document.createElement('li');
            listItem.textContent = url;
            listItem.style.color = "white";
            blacklistElement.appendChild(listItem);
        });
    });
}

function clearBlacklist() {
    // Clear the blacklisted URLs from storage
    chrome.storage.local.set({ 'blacklist': [] }, function () {
        console.log('Blacklist cleared');
        updateBlacklist(); // Update the displayed list
    });
}

function checkAndShowPopup() {
    // Get the current URL
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentUrl = tabs[0].url;
        // Retrieve blacklisted URLs from storage
        chrome.storage.local.get(['blacklist'], function (result) {
            var blacklist = result.blacklist || [];
            // Check if the current URL is in the blacklist
            if (blacklist.includes(currentUrl)) {
                // Display your popup logic here
                alert("This site is in your blacklist!");
            }
        });
    });
}
