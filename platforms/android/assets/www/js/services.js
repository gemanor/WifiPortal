'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var portalSMBServices = angular.module('portalSMB.services', []);

portalSMBServices.factory('d3Service', ['$document', '$q', '$rootScope',
    function($document, $q, $rootScope) {
        var d = $q.defer();
        function onScriptLoad() {
            // Load client in the browser
            $rootScope.$apply(function() {
                d.resolve(window.d3);
            });
        }
        // Create a script tag with d3 as the source
        // and call our onScriptLoad callback when it
        // has been loaded
        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = 'js/vendor/d3.min.js';
        scriptTag.onreadystatechange = function() {
            if (this.readyState == 'complete')
                onScriptLoad();
        };
        scriptTag.onload = onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

        return {
            d3: function() {
                return d.promise;
            }
        };
    }]);
