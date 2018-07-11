uver.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
      url: '/app',
      controller: 'userCtrl',
      template: '<ion-nav-view></ion-nav-view>',
      abstract: true
  })
  .state('app.home', {
      cache: false,
      url: '/home',
      templateUrl: 'templates/home.html?v=1.0.1',
      controller: 'homeCtrl'
  })
  .state('app.dashboard', {
      cache: false,
      url: '/dashboard',
      templateUrl: 'templates/profile.html',
      controller: 'dashboardCtrl'
  })
  .state('app.login', {
      cache: false,
      url: '/login',
      controller: 'userCtrl',
      templateUrl: 'templates/login.html'
  })
  .state('app.register', {
    cache: false,
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'userCtrl'
  })
  .state('app.profile', {
    cache: false,
    url: '/profile',
    templateUrl: 'templates/profile.html?v=1',
    controller: 'userCtrl'
  })
  .state('app.validatePhoneForm', {
      cache: false,
      url: '/validatePhoneForm',
      templateUrl: 'templates/validatePhoneForm.html?v=1',
      controller: 'pickupCtrl'
  })
  .state('app.cancel', {
    cache: false,
    url: '/cancel',
    templateUrl: 'templates/cancel.html',
    controller: 'pickupCtrl'
  })
  .state('app.contact', {
    cache: false,
    url: '/contact',
    templateUrl: 'templates/contact.html?v=1',
    controller: 'userCtrl'
  })
  .state('app.summaryOrder', {
      cache: false,
      url: '/summaryOrder',
      templateUrl: 'templates/summaryOrder.html?v=1',
      controller: 'pickupCtrl'
  })
  .state('app.selectPackage', {
      cache: false,
      url: '/selectPackage',
      templateUrl: 'templates/selectPackage.html?v=1',
      controller: 'pickupCtrl'
  })
  .state('app.profileField', {
    cache: false,
    url: '/profileField',
    templateUrl: 'templates/profileField.html?v=1',
    controller: 'pickupCtrl'
  })
  .state('app.validatePhone', {
      cache: false,
      url: '/validatePhone',
      templateUrl: 'templates/loadingValidatePhone.html?v=1',
      controller: 'pickupCtrl'
  })
  .state('app.pickupFrom', {
    cache: false,
    url: '/pickupFrom',
    templateUrl: 'templates/pickupFrom.html?v=1.0.0',
    controller: 'pickupCtrl'
  })
  .state('app.createOrder', {
      cache: false,
      url: '/createOrder',
      templateUrl: 'templates/loadingOrder.html?v=1',
      controller: 'pickupCtrl'
  })
  .state('app.orderApproved', {
      cache: false,
      url: '/orderApproved/:param1',
      templateUrl: 'templates/orderApproved.html?v=1',
      controller: 'orderCtrl'
  })
  .state('app.orderDetail', {
      cache: false,
      url: '/orderDetail/:param1',
      templateUrl: 'templates/orderDetail.html?v=1',
      controller: 'orderDetailCtrl'
  })
  .state('app.orderList', {
      cache: false,
      url: '/orderList',
      templateUrl: 'templates/orderList.html?v=1',
      controller: 'orderListCtrl'
  })
  .state('app.deliverTracking', {
    cache: false,
    url: '/deliverTracking',
    templateUrl: 'templates/deliverTracking.html',
    controller: 'pickupCtrl'
  })
  .state('app.version', {
      cache: false,
      url: '/version',
      controller: 'versionCtrl',
      templateUrl: 'templates/update.html'
  });
  $urlRouterProvider.otherwise("/app/home");
});
