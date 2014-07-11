(function() {
    'use strict';

    // ---external global dependencies
    /* global chrome:false */

    var dataExtensions = [
        'xls',
        'xlsx',
        'csv',
        'tsv',
        'm',
        'mat',
        'mdb',
        'h5',
        'hdf',
        'hdf5'
    ];

    var linkList;

    function getFileLinks() {
        if(window.location.host==='plot.ly') {
            linkList = 'PLOTLY';
            return;
        }

        linkList = nodeListToArray(
                document.querySelectorAll('a[href]') )
            .map(function(link) {
                var fileName = link.href.replace(/.*\//,''),
                    parts = fileName.split('.'),
                    extension = parts[parts.length-1].toLowerCase(),
                    plotlyMatch = link.href.match(
                        /\/\/plot.ly\/(external|quandl)/);

                // existing plotly links - collect them in the popup too
                // but don't alter their links at all.
                if(plotlyMatch) {
                    var fn;
                    try {
                        fn = plotlyMatch[1]==='quandl' ?
                            link.href.split('code=')[1] :
                            decodeURIComponent(link.href.split('url=')[1])
                                .replace(/.*\//,'');
                    }
                    catch(e) {
                        try {
                            fn = link.href.split('plot.ly/')[1];
                        }
                        catch(e2) { fn = link.href; }
                    }

                    return {
                        isPlotly: true,
                        href: link.href,
                        fileName: fn
                    };
                }
                // data files that are NOT explicitly linked to Plotly already
                else if(dataExtensions.indexOf(extension)!==-1) {
                    var plotlyHref = 'https://plot.ly/external?url='+
                            encodeURIComponent(link.href);
                    link.insertAdjacentHTML('afterend',
                        '<div class="plotly-link-external">'+
                            '<a href="' + plotlyHref + '" target="_blank">'+
                                'plotly'+
                            '</a>'+
                        '</div>');

                    return {
                        href:plotlyHref,
                        fileName: fileName
                    };
                }
                else { return false; }
            })
            .filter(function(link) { return link; });
    }

    function nodeListToArray(nl) {
        var arr = [];
        for(var i=-1,l=nl.length>>>0;++i!==l;arr[i]=nl[i]);
        return arr;
    }

    getFileLinks();

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            sendResponse(linkList);
        }
    );

}());
