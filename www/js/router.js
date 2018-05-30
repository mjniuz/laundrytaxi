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
      templateUrl: 'templates/home.html',
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
  .state('app.addPayment', {
    cache: false,
    url: '/addPayment',
    templateUrl: 'templates/addPayment.html',
    controller: 'userCtrl'
  })
  .state('app.profile', {
    cache: false,
    url: '/profile',
    templateUrl: 'templates/profile.html',
    controller: 'userCtrl'
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
    templateUrl: 'templates/contact.html',
    controller: 'userCtrl'
  })
  .state('app.summaryOrder', {
      cache: false,
      url: '/summaryOrder',
      templateUrl: 'templates/summaryOrder.html',
      controller: 'pickupCtrl'
  })
  .state('app.selectPackage', {
      cache: true,
      url: '/selectPackage',
      templateUrl: 'templates/selectPackage.html',
      controller: 'pickupCtrl'
  })
  .state('app.profileField', {
    cache: false,
    url: '/profileField',
    templateUrl: 'templates/profileField.html',
    controller: 'pickupCtrl'
  })
  .state('app.validatePhone', {
      cache: false,
      url: '/validatePhone',
      templateUrl: 'templates/loadingValidatePhone.html',
      controller: 'pickupCtrl'
  })
  .state('app.pickupFrom', {
    cache: false,
    url: '/pickupFrom',
    templateUrl: 'templates/pickupFrom.html',
    controller: 'pickupCtrl'
  })
  .state('app.createOrder', {
      cache: false,
      url: '/createOrder',
      templateUrl: 'templates/loadingOrder.html',
      controller: 'pickupCtrl'
  })
  .state('app.orderApproved', {
      cache: false,
      url: '/orderApproved/:param1',
      templateUrl: 'templates/orderApproved.html',
      controller: 'orderCtrl'
  })
  .state('app.orderDetail', {
      cache: false,
      url: '/orderDetail/:param1',
      templateUrl: 'templates/orderDetail.html',
      controller: 'orderDetailCtrl'
  })
  .state('app.orderList', {
      cache: false,
      url: '/orderList',
      templateUrl: 'templates/orderList.html',
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
