'use strict';

// ---external global dependencies
/* global chrome:false */

function updateBadge(tabId) {
    chrome.tabs.sendMessage(tabId, {}, function(linkData) {
        if(!Array.isArray(linkData)) { linkData = []; }

        chrome.browserAction.setBadgeText({
            text:String(linkData.length||''),
            tabId: tabId
        });

        chrome.browserAction.setBadgeBackgroundColor({
            color: '#ff7f0e'
        });
    });
}

chrome.tabs.onActivated.addListener(function(info) {
    updateBadge(info.tabId);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if(changeInfo.status==='complete') {
        updateBadge(tabId);
    }
});
