
uver.controller('homeCtrl', ['$scope', '$rootScope', '$location',
    function($scope, $rootScope, $location) {
        var token     = localStorage.getItem('remember_token');
        $scope.loggedIn    = (typeof token !== 'undefined' && token !== null &&  token !== '');
        $scope.home = function () {
            $location.path('/app/home');
        };
    }]
);

uver.controller('dashboardCtrl', ['$scope', '$rootScope', '$location',
    function($scope, $rootScope, $location) {
        var token     = localStorage.getItem('remember_token');
        if(!token){
            $location.path('/app/pickupFrom');
            return false;
        }
        $scope.dashboard = function(){
            $location.path('/app/dashboard');
        };
    }]
);
uver.controller('userCtrl', ['$scope', '$rootScope', '$location',
    function($scope, $rootScope, $location) {
      $scope.profile = {avatar : 'img/profile-avatar.png'};


      $scope.dashboard = function(){
          $location.path('/app/dashboard');
      };
      $scope.register = function(){
          $location.path('/app/register');
      };
      $scope.doLogin = function(){
          $location.path('/app/profile');
      };
      $scope.doRegister = function(){
          $scope.getDeliver();
      };
      $scope.getDeliver = function(){
          $location.path('/app/pickupFrom');
      };
      $scope.setting = function(){
          $location.path('/app/addPayment');
      };
      $scope.orderDetailRedirect = function(id){
          $location.path('/app/orderDetail/' + id);
      };
      $scope.orderList = function(id){
          $location.path('/app/orderList');
      };
      $scope.contact   = function () {
          $location.path('/app/contact')
      };
    }
]);
uver.controller('pickupCtrl', ['$scope', '$rootScope', '$location', '$http', '$compile','$uibModal', 'pickUpPlace','serve','orderService',
    function($scope, $rootScope, $location, $http, $compile, $uibModal, pickUpPlace, serve, orderService) {
        $scope.err    = {
            phone: '',
            full_name: '',
            pack:''
        };
        $scope.user = {
            'full_name': localStorage.getItem('full_name'),
            'phone':localStorage.getItem('phone')
        };
        $scope.data     = {
            note:localStorage.getItem('note')
        };
        $scope.estimate = localStorage.getItem('estimate');
        $scope.package  = localStorage.getItem('package');
        $scope.pack     = {
            estimate: parseFloat($scope.estimate),
            package: $scope.package
        };
        $scope.package_text     = function () {
            if($scope.package === 6000){
                return "3 hari";
            }
            if($scope.package === 8000){
                return "2 hari";
            }
            if($scope.package === 10000){
                return "1 hari";
            }

        };
        $scope.package_total    = Number(($scope.package * $scope.estimate).toFixed(1)).toLocaleString();
        $scope.full_address = localStorage.getItem('full_address');
        $scope.address_note = localStorage.getItem('address_note');
        if(localStorage.getItem('location')){
            $scope.lng          = JSON.parse(localStorage.getItem('location')).lng;
        }
        if(localStorage.getItem('location')){
            $scope.lat          = JSON.parse(localStorage.getItem('location')).lat;
        }
        $scope.map_image    = 'https://maps.googleapis.com/maps/api/staticmap?center='+$scope.lat+','+$scope.lng +'&zoom=13&scale=1&size=300x110&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C'+$scope.lat+','+$scope.lng;

        /*start modal*/
        var $ctrl = $scope;

        $ctrl.animationsEnabled = true;

        $ctrl.open = function (size, parentSelector) {
            var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'myModalContent.html',
                controller:function($uibModalInstance, $scope){
                    $scope.address_note     = localStorage.getItem('address_note');
                    $scope.addAddressNote = function (address_note) {
                        console.log(address_note);
                        $scope.address_note = address_note;
                        localStorage.setItem('address_note',address_note);
                        $uibModalInstance.dismiss('cancel');

                        document.getElementById("address_note").innerHTML = address_note;
                    };
                    $scope.cancel   = function () {
                        $uibModalInstance.dismiss('cancel');
                    }
                },
                controllerAs: '$ctrl',
                size: size,
                appendTo: parentElem,
                resolve: {
                    address_note: function () {
                        console.log(localStorage.getItem('address_note'));
                        return localStorage.getItem('address_note');
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $ctrl.toggleAnimation = function () {
            $ctrl.animationsEnabled = !$ctrl.animationsEnabled;
        };
        /*End modal*/

        $scope.deliverTracking = function(){
            $location.path('/app/deliverTracking');
        };
        $scope.cancel = function(){
            $location.path('/app/cancel');
        };
        $scope.pickupFrom = function() {
            pickUpPlace.mapInit($scope,$compile, this.getPlace());
        };
        $scope.bacToSummaryOrder   = function () {
            $location.path('/app/summaryOrder');
        };
        $scope.summaryOrder   = function (pack) {
            err   = serve.addPackage($scope,$location,pack);
            if(err.status === true){
                $location.path('/app/selectPackage');
                return false;
            }
            $location.path('/app/summaryOrder');
        };
        $scope.profileField   = function () {
            $location.path('/app/profileField');
        };
        $scope.selectPackage   = function (user) {
            $location.path('/app/selectPackage');
        };
        $scope.checkMapExist  = function () {
            if(localStorage.getItem('location') === null){
                $location.path('/app/pickupFrom');
            }
            return "";
        };
        $scope.validatePhone    = function (user) {
            $location.path('/app/validatePhone');
            var err   = serve.checkProfilePost($scope,$location,user);
            if(err.status === true){
                document.getElementById("result-message").innerHTML = err.message;

                return false;
            }

            serve.validatePhone($scope,$location,$http,user).then(function (result) {
                if(result === true){
                    $location.path('/app/selectPackage');
                    return true;
                }else{
                    document.getElementById("result-message").innerHTML = 'Nomor hp tidak valid!!, hapar masukan no hp dengan benar';
                    return false;
                }
            });
        };

        $scope.createOrder  = function (data) {
            $scope.note     = (typeof data !== 'undefined') ? data.note : "";
            var result      = orderService.submitOrder($scope, $http, $location);
            $location.path('/app/createOrder');
        };

        pickUpPlace.mapInit($scope,$compile);
    }
]);

uver.controller('orderCtrl', ['$scope', '$rootScope', '$location','$stateParams','$http', 'orderService',
    function($scope, $rootScope, $location, $stateParams,$http, orderService) {

        var id              = $stateParams.param1;
        $scope.merchant     = JSON.parse(localStorage.getItem('merchant'));
        $scope.order_id     = id;
        $scope.orderApproved    = function () {
            $location.path('/app/orderApproved');
        };
    }
]);
uver.controller('orderDetailCtrl', ['$scope', '$rootScope', '$location','$stateParams','$http', 'orderService',
    function($scope, $rootScope, $location, $stateParams,$http, orderService) {
        $scope.merchant     = JSON.parse(localStorage.getItem('merchant'));
        var id              = $stateParams.param1;
        result  = orderService.detailOrderRequest($scope, $http, $location, id).then(function (result) {
            if(result){
                $scope.order  = result;
                var estimate                    = (result.actual_weight > 0) ? parseFloat(result.actual_weight) : parseFloat(result.estimate_weight);
                $scope.order.is_estimate        = (result.actual_weight < 1);
                $scope.order.estimate           = estimate;
                $scope.order.package_total      = result.package * estimate;
            }
        });

    }]
);

uver.controller('orderListCtrl', ['$scope', '$rootScope', '$location','$stateParams','$http', 'orderService',
    function($scope, $rootScope, $location, $stateParams,$http, orderService) {
        var token       = localStorage.getItem('remember_token');
        result  = orderService.listOrderRequest($scope, $http, $location, token).then(function (result) {
            if(result){
                $scope.orders  = result;
            }
        });

    }]
);