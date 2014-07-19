'use strict';

// ---external global dependencies
/* global chrome:false */

var messageBox = document.querySelector('.for-import--message'),
    linkList = document.querySelector('.for-import--link ul'),
    plotlyMessageBox = document.querySelector('.plotly-link--message'),
    plotlyLinkList = document.querySelector('.plotly-link--links ul');

function linkTemplate(link) {
    return '<li><a href="' + link.href + '" target="_blank">' +
            link.fileName +
        '</a></li>';
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {}, function(linkData) {
        console.log(linkData);
        if(linkData==='PLOTLY') {
            document.body.className = 'on-plotly';
            return;
        }
        else {
            document.body.className = '';
        }
        if(!Array.isArray(linkData)) { linkData = []; }

        if(!linkData.length) {
            document.body.className = 'no-links';
            return;
        }

        var plotlyLinks = linkData.filter(function(link) {
                return link.isPlotly;
            }),
            dataLinks = linkData.filter(function(link) {
                return !link.isPlotly;
            });

        if(dataLinks.length) {
            document.body.classList.add('has-for-import');
            messageBox.innerHTML = 'Found ' +
                dataLinks.length +
                ' data file'+(dataLinks.length>1 ? 's' : '')+
                ' on this page. Click to import to Plotly.';

            linkList.innerHTML = dataLinks.map(linkTemplate).join('');
        }

        if(plotlyLinks.length) {
            document.body.classList.add('has-plotly-link');
            plotlyMessageBox.innerHTML = 'Found ' +
                plotlyLinks.length +
                ' Plotly link'+(plotlyLinks.length>1 ? 's' : '')+
                ' on this page.';

            plotlyLinkList.innerHTML = plotlyLinks.map(linkTemplate).join('');
        }
    });
});
