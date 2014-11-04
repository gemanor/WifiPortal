'use strict';

/* Controllers */

var portalSMBControllers = angular.module('portalSMB.controllers', []);
portalSMBControllers.controller('mainCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
        $rootScope.isHomePage = false;
        $scope.$on('$routeChangeSuccess', function(next, current) {
            $rootScope.isHomePage = false;
        });
        $scope.$back = function() {
            window.history.back();
        };
        $scope.showPopUp = function() {
            var popUpEnabled = $location.search();
            if (typeof popUpEnabled.popUp === 'undefined' || typeof popUpEnabled.popUp === 'boolean') {
                return false;
            }
            return true;
        };
        $scope.closePopUp = function() {
            $scope.$back();
        };
        $scope.getSectionHeight = function() {
            return {"height": "50%"}
        };
        $scope.$parent.myScrollOptions = {
            "FSListScrollWrapper": {scrollX: false, scrollY: true, mouseWheel: true, snap: false, bounce: false}
        };
        $scope.$goHome = function() {
            $location.url('/');
        };
    }]);
portalSMBControllers.controller('actionsMenuCtrl', ['$scope', function($scope) {
        $scope.fontSizeStyle = function() {
            var height = ($('.actionsMenu .icon')[0].clientHeight) * 0.8;
            return {
                'font-size': height + 'px'
            };
        };
    }]);
portalSMBControllers.controller('VOBCtrl', ['$scope', function($scope) {
        $scope.isActive = function(line) {
            return line.active === true ? 'green' : 'red';
        };
        $scope.isInOrOut = function(call) {
            return call.type === 'in' ? ' icon-call-in' : ' icon-call-out';
        };
        $scope.callLogObj = [
            {
                "number": "07400101234",
                "volume": "2",
                "active": true,
                "callLis": [
                    {
                        "number": "0527633035",
                        "time": "19:20:04",
                        "length": "00:20:10",
                        "date": "27/08/14",
                        "type": "out"
                    },
                    {
                        "number": "0527633035",
                        "time": "19:20:04",
                        "length": "00:20:10",
                        "date": "27/08/14",
                        "type": "in"
                    },
                    {
                        "number": "0527633035",
                        "time": "19:20:04",
                        "length": "00:20:10",
                        "date": "27/08/14",
                        "type": "out"
                    },
                    {
                        "number": "0527633035",
                        "time": "19:20:04",
                        "length": "00:20:10",
                        "date": "27/08/14",
                        "type": "out"
                    }
                ]
            },
            {
                "number": "07400132234",
                "volume": "5",
                "active": false,
                "callLis": [
                    {
                        "number": "0527633035",
                        "time": "19:20:04",
                        "length": "00:20:10",
                        "date": "27/08/14",
                        "type": "out"
                    },
                    {
                        "number": "0527633035",
                        "time": "19:20:04",
                        "length": "00:20:10",
                        "date": "27/08/14",
                        "type": "out"
                    },
                    {
                        "number": "0527633035",
                        "time": "19:20:04",
                        "length": "00:20:10",
                        "date": "27/08/14",
                        "type": "in"
                    },
                    {
                        "number": "0527633035",
                        "time": "19:20:04",
                        "length": "00:20:10",
                        "date": "27/08/14",
                        "type": "out"
                    }
                ]
            }
        ];
    }]);
portalSMBControllers.controller('homeCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        $rootScope.isHomePage = true;
        var data = {scrollX: true,
            scrollY: false,
            momentum: false,
            snap: true,
            bounce: false,
            snapSpeed: 400};
        $scope.$parent.myScrollOptions = {
            slideShowWrapper: data
        };
        setTimeout(function() {
//            $scope.myScroll['slideShowWrapper'].scrollToElement('li', '1s');
        }, 450);
        $scope.pieChartData = [{"label": "וידאו", "value": 20},
            {"label": "חדשות", "value": 20},
            {"label": "פורטלים", "value": 20},
            {"label": "בלוגים", "value": 20},
            {"label": "אחר", "value": 20}];
    }]);
portalSMBControllers.controller('networkUpgradeCtrl', ['$scope', function($scope) {
    }]);
portalSMBControllers.controller('fileSystemCtrl', ['$scope', '$http', '$routeParams', '$location', 'localStorageService', function($scope, $http, $routeParams, $location, localStorageService) {
        $scope.currentPath = $routeParams.path;
        $scope.currentNode = '';
        $scope.grid = localStorageService.get('FSGrid') === null ? localStorageService.set('FSGrid', 'false') : (localStorageService.get('FSGrid') == 'false' ? false : true);
        var tempFilesObj = [];
        var splitPath = [];
        var getFilesObj = function() {
            if (!tempFilesObj.length) {
                tempFilesObj = ['start'];
                $http.get('fileSystem.json').success(function(data) {
                    tempFilesObj = data;
                });
            }
            return tempFilesObj;
        };
        var getFileExt = function(name) {
            var ext = name.split('.').pop().toLowerCase();
            return ext;
        }
        $scope.filesObj = function() {
            if (typeof $scope.currentPath === 'undefined') {
                return getFilesObj();
            }
            var filesObj = getFilesObj(),
                    pathArray = $scope.currentPath.split('/'),
                    currentFilesObj = filesObj;
            pathArray.shift();
            for (var i = 0; i < pathArray.length; i++) {
                for (var j = 0; j < currentFilesObj.length; j++) {
                    if (currentFilesObj[j].name === pathArray[i]) {
                        currentFilesObj = currentFilesObj[j].nodes;
                    }
                }
            }
            if (currentFilesObj[0].name) {
                $scope.currentNode = currentFilesObj[0].name;
            }
            return currentFilesObj;
        };
        $scope.isFolder = function(type) {
            if (type === 'folder') {
                return true;
            }
            return false;
        };
        $scope.isMain = function isMain() {
            if (typeof $scope.currentPath === 'undefined' || $scope.currentPath === '/') {
                return 'icon-drawer';
            }
            return 'icon-folder';
        };
        $scope.doPath = function(path, node) {
            $location.search('path', makePath(path, node));
        };
        var makePath = function(path, node) {
            path = path || '';
            var editedPath;
            if (node == null) {
                editedPath = path;
            } else {
                editedPath = path + '/' + node;
            }
            return editedPath;
        };
        $scope.openPopUp = function(path) {
            var ext = getFileExt(path),
                    imageExtensions = ['jpg', 'gif', 'jpeg', 'gif', 'webm'];
            if (imageExtensions.indexOf(ext) > -1) {
                var x = Math.floor(Math.random() * (600 - 300 + 1) + 300),
                        y = Math.floor(Math.random() * (600 - 300 + 1) + 300);
                path = 'http://lorempixum.com/' + x + '/' + y;
            } else {
                path = 'notRecognized';
            }
            $location.search('popUp', path);
        };
        $scope.popUpContent = function() {
            var path = $location.search().popUp;
            if (path === 'notRecognized') {
                return false;
            }
            return path;
        };
        $scope.toggleGrid = function() {
            $scope.grid = localStorageService.get('FSGrid') === 'false' ? true : false;
            localStorageService.set('FSGrid', $scope.grid);
            setTimeout(function() {
                $scope.$parent.myScroll['FSListScrollWrapper'].refresh();
                $scope.$parent.myScroll['FSListScrollWrapper'].scrollTo(0, 0, 200);
            }, 450);
        };
        var makeSplitPath = function() {
            if (splitPath.length) {
                return splitPath;
            }
            var tempArrayToLink = '';
            if ($scope.currentPath) {
                var pathArray = $scope.currentPath.split('/');
                if (pathArray[1] === '') {
                    pathArray.shift();
                }
                if (pathArray.length) {
                    for (var i = 0; i < pathArray.length; i++) {
                        tempArrayToLink += '/' + pathArray[i];
                        if (pathArray.length === i + 1) {
                            tempArrayToLink = '';
                        }
                        if (pathArray[i] === '' && tempArrayToLink !== "/") {
                            pathArray[i] = '/';
                        }
                        splitPath.push({name: pathArray[i], link: tempArrayToLink});
                    }
                }
            } else {
                splitPath.push({name: '/', link: ""});
            }
            return splitPath;
        };
        $scope.$on('$viewContentLoaded', function() {
            setTimeout(function() {
                $scope.$parent.myScroll['FSListScrollWrapper'].refresh();
                $scope.$parent.myScroll['FSListScrollWrapper'].scrollTo(0, 0, 200);
            }, 450);
        });
        $scope.getSplitPath = function() {
            return makeSplitPath();
        };
        $scope.fileExtIcon = function(name) {
            var ext = getFileExt(name),
                    iconClass = '',
                    imageExtensions = ['jpg', 'gif', 'jpeg', 'gif', 'webm'],
                    docExtensions = ['doc', 'docx'],
                    pdfExtensions = ['pdf'],
                    musicExtensions = ['mp3', 'wav'],
                    movieExtensions = ['mp4', 'mov', 'avi', '3gp'],
                    spreadsheetExtensions = ['xls', 'xlsx'],
                    presentationExtensions = ['ppt', 'pptx'];
            if (imageExtensions.indexOf(ext) > -1) {
                iconClass = 'icon-picture';
            } else if (docExtensions.indexOf(ext) > -1) {
                iconClass = 'icon-doc';
            } else if (musicExtensions.indexOf(ext) > -1) {
                iconClass = 'icon-music-tone';
            } else if (pdfExtensions.indexOf(ext) > -1) {
                iconClass = 'icon-docs';
            } else if (movieExtensions.indexOf(ext) > -1) {
                iconClass = 'icon-film';
            } else if (spreadsheetExtensions.indexOf(ext) > -1) {
                iconClass = 'icon-calculator';
            } else if (presentationExtensions.indexOf(ext) > -1) {
                iconClass = 'icon-screen-desktop';
            } else {
                iconClass = 'icon-doc';
            }
            return iconClass;
        };
    }]);
portalSMBControllers.controller('WiFiCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        $scope.hideCharts = [];
        $scope.hideCharts[0] = true;
        $scope.isChecked = function(value) {
            return value === true ? 'checked' : '';
        };
        $scope.$parent.myScrollOptions.wifiForm = {
            bounce: false,
            mouseWheel: true,
            scrollX: false,
            preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|DIV|LABEL)$/ },
            scrollY: true,
            snap: false
        };
        console.log($scope.$parent.myScrollOptions);
        $scope.wifiData = [
            {
                "name": "רשת 2.4MHz",
                "networkName": "Gabriel's WiFi",
                "networkPassword": "123123123",
                "hidden": true
            },
            {
                "name": "רשת 2.4MHz",
                "networkName": "Gabriel's WiFi",
                "networkPassword": "123123123",
                "hidden": false
            }
        ];
    }]);
portalSMBControllers.controller('boxOperationsCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
        $scope.openPopUp = function(path) {
            $location.search('popUp', path);
            $scope.logSents = false;
        };
        $scope.popUpContent = function() {
            return $location.search().popUp;
        };
        $scope.logSents = false;
        $scope.setLogSents = function() {
            $scope.logSents = true;
        };
    }]);
portalSMBControllers.controller('connectionsMapsCtrl', ['$scope', '$location', '$rootScope', 'localStorageService', function($scope, $location, $rootScope, localStorageService) {
        $scope.openPopUp = function(dataObj) {
            localStorageService.set('mapsPopUpTitle', dataObj.name);
            localStorageService.set('mapsPopUpObj', dataObj.details);
            $rootScope.$apply(function() {
                $location.search('popUp', 'open');
            });
        };
        $scope.getPopUpContent = function() {
            var objToReturn = {};
            objToReturn['name'] = localStorageService.get('mapsPopUpTitle');
            objToReturn['details'] = localStorageService.get('mapsPopUpObj')
            return objToReturn;
        };
        $scope.mapData = {
            "name": "חיבור לאינטרנט",
            "type": "internet",
            "details": {
                "מהירות חיבור": "5MB",
                "סוג חיבור": "ADSL"
            },
            "children": [{
                    "name": "נתב אלחוטי",
                    "type": "box",
                    "details": {
                        "דגם": "SmartBox Siemens 505",
                        "חיבורים בשימוש": "7",
                        "כתובת IP": "192.168.12.14"
                    },
                    "children": [{
                            "name": "GABRIEL_PC",
                            "type": "comp",
                            "details": {
                                "סוג החיבור": "קווי",
                                "כתובת IP": "192.168.12.15",
                                "מערכת הפעלה": "Windows8"
                            }
                        }, {
                            "name": "טלפון",
                            "type": "phone",
                            "details": {
                                "סוג החיבור": "טלפוניה",
                                "מספר טלפון": "074-1239474",
                                "דגם": "DECT 102E"
                            }
                        }, {
                            "name": "SanDisk Cruzer micro",
                            "type": "storage",
                            "details": {
                                "סוג החיבור": "USB",
                                "נפח אחסון": "16GB"
                            }
                        }, {
                            "name": "SQLServer011",
                            "type": "comp",
                            "details": {
                                "סוג החיבור": "קווי",
                                "כתובת IP": "192.168.12.22",
                                "מערכת הפעלה": "Fedora20"
                            }
                        }, {
                            "name": "CommunityStructure",
                            "type": "smartPhone",
                            "details": {
                                "סוג החיבור": "אלחוטי",
                                "כתובת IP": "192.168.12.19",
                                "מערכת הפעלה": "Android"
                            }
                        }, {
                            "name": "Oren Taizi",
                            "type": "comp",
                            "details": {
                                "סוג החיבור": "קווי",
                                "כתובת IP": "192.168.12.16",
                                "מערכת הפעלה": "Windows7"
                            }
                        }, {
                            "name": "MyMac",
                            "type": "comp",
                            "details": {
                                "סוג החיבור": "אלחוטי",
                                "כתובת IP": "192.168.12.18",
                                "מערכת הפעלה": "MAC OSX"
                            }
                        }]
                }]

        };



        $scope.$parent.myScrollOptions['connectionsMapsScrollWrapper'] = {
            scrollX: true,
            scrollY: true,
            mouseWheel: true,
            snap: false,
            bounce: false
        };

        $scope.setRefresh = function() {
            $scope.myScroll['connectionsMapsScrollWrapper'].refresh();
            $scope.myScroll['connectionsMapsScrollWrapper'].scrollTo(-(173 / 2), 0, 1000);
        }
        ;
    }]);