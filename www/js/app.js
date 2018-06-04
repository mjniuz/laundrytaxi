// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var uver = angular.module('uver', ['ionic', 'ngMap','ui.bootstrap']);

uver.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

      document.addEventListener("deviceready", (function() {
          console.log('ready update euy');
          updater = new LiveUpdate({
              updateUrl: mainURL + 'check-for-update',
              originalBuildId: 1,
              afterDownloadComplete: function (currentId, latestId) {
                  var confirmPopup, d;
                  d = $q.defer();
                  confirmPopup = $ionicPopup.confirm({
                      title: 'Update Available',
                      template: sprintf("Version %d is available for download (you are running %d). Update now?", latestId, currentId),
                      buttons: [
                          {
                              text: 'Update Later',
                              onTap: (function () {
                                  return d.reject();
                              })
                          }, {
                              text: 'Update Now',
                              type: 'button-positive',
                              onTap: (function () {
                                  return d.resolve();
                              })
                          }
                      ]
                  });
                  return d.promise;
              }
          });
          updater.go(); // Check for updates, install, and then launch
          updater.checkOnce()
              .then(function (currentBuildId) {
                  console.log("The current build ID is", currentBuildId);
              });
      }), false);
  });
}).config(['$httpProvider', function ($httpProvider) {
    //Reset headers to avoid OPTIONS request (aka preflight)
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
}]);
