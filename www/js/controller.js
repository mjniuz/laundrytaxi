
uver.controller('homeCtrl', ['$scope', '$rootScope', '$location','$http',
    function($scope, $rootScope, $location, $http) {

        if(platforms !== 'browser'){
            var $theURL     = mainURL + "check-for-update?version="+version;
            $http({
                url: $theURL,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                method: "GET"
            }).then(function(response) {
				console.log(response.data);
                if(Boolean(response.data.status) === true){
                    $location.path('/app/version');
                    return false;
                }
            }, function(response) {
            });
        }

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
uver.controller('pickupCtrl', ['$scope', '$rootScope', '$location', '$http', '$compile','$uibModal','$interval', 'pickUpPlace','serve','orderService',
    function($scope, $rootScope, $location, $http, $compile, $uibModal,$interval, pickUpPlace, serve, orderService) {
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
        $scope.package  = (localStorage.getItem('package')) ? JSON.parse(localStorage.getItem('package')) : '';
        $scope.prices   = (localStorage.getItem('prices')) ? JSON.parse(localStorage.getItem('prices')) : '';
        $scope.grand_total  = (localStorage.getItem('grand_total')) ? localStorage.getItem('grand_total') : '';

        $scope.pack     = {
            estimate: parseFloat($scope.estimate)
        };
        $scope.remember_token   = (localStorage.getItem('remember_token')) ? localStorage.getItem('remember_token') : '';
        $scope.full_address = (localStorage.getItem('full_address')) ? localStorage.getItem('full_address') : '';
        $scope.address_note = (localStorage.getItem('address_note')) ? localStorage.getItem('address_note') : '';
        if(localStorage.getItem('location')){
            $scope.lng          = JSON.parse(localStorage.getItem('location')).lng;
        }
        if(localStorage.getItem('location')){
            $scope.lat          = JSON.parse(localStorage.getItem('location')).lat;
        }
        $scope.map_image    = 'http://maps.googleapis.com/maps/api/staticmap?key=AIzaSyA4cvpCYxiYr2gbDptRIEAY4nF9dF0j--s&center='+$scope.lat+','+$scope.lng +'&zoom=13&scale=1&size=300x110&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C'+$scope.lat+','+$scope.lng;

        $scope.requestPackageTime   = 0;
        $scope.getPackages     = function () {
            if($scope.remember_token === ''){
                // validate phone first
                $location.path('/app/profileField');
                return false;
            }
            if($scope.remember_token !== '' && $scope.requestPackageTime === 0){
                console.log('request server');
                $scope.requestPackageTime = 1;
                // request to server by phone
                return serve.getPackages($scope,$location,$http,$scope.remember_token).then(function (result) {
                    if(Boolean(result.status) === true){
                        $scope.packages = result.data;
                        return result.data;
                    }else{
                        return false;
                    }
                });
            }
        };

        // select package logic
        $scope.selectedPackage    = function (value) {
            $scope.selected         = {};
            $scope.selected.package = true;
            $scope.selected.description     = value.description;
            console.log(value);
        };

        $scope.loggedIn         = (typeof $scope.remember_token !== 'undefined' && $scope.remember_token !== null &&  $scope.remember_token !== '');
        $scope.home             = function () {
            $location.path('/app/home');
        };
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
            localStorage.setItem('prices','');
            localStorage.setItem('grand_total','');
            err   = serve.addPackage($scope,$location,pack);
            if(err.status === true){
                $location.path('/app/selectPackage');
                return false;
            }
            $scope.estimate = err.package.estimate;
            if(typeof err.package.package !== 'object'){
                $scope.package  = JSON.parse(err.package.package);
            }else{
                $scope.package  = err.package.package;
            }

            var total           = 0;
            var package_price   = 0;
            var max_price       = '';
            var over_max        = false;
            if($scope.package.max > 0 && $scope.package.max < $scope.estimate){
                over_max    = true;
                max_price   = ($scope.estimate - $scope.package.max) * $scope.package.after_max;
                package_price   = $scope.package.max * $scope.package.price_per_kg;
                total   += $scope.package.max * $scope.package.price_per_kg;
                total   += max_price;
            }else{
                package_price   = $scope.package.price_per_kg * $scope.estimate;
                total   += package_price;
            }
            $scope.grand_total  = Number((total).toFixed(1)).toLocaleString();
            $scope.prices       = generateOrderDetail($scope.package, $scope.estimate, package_price, max_price, over_max);
            localStorage.setItem('prices',JSON.stringify($scope.prices));
            localStorage.setItem('package_id',$scope.package.id);
            localStorage.setItem('grand_total',$scope.grand_total);


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
            console.log(user);
            var err   = serve.checkProfilePost($scope,$location,user);
            if(err.status === true){
                $location.path('/app/profileField');

                return false;
            }

            serve.validatePhone($scope,$location,$http,user).then(function (result) {
                if(Boolean(result.status) === true){
                    if(Boolean(result.activation) === true){
                        // need validation phone
                        $location.path('/app/validatePhoneForm');
                        return true;
                    }
                    $scope.requestPackageTime   = 0;
                    $location.path('/app/selectPackage');
                    return true;
                }else{
                    document.getElementById("result-message").innerHTML = 'Nomor hp tidak valid!!, hapar masukan no hp dengan benar';
                    return false;
                }
            });
        };
        $scope.validatePhoneForm    = function () {
            $location.path('/app/validatePhoneForm');
        };
        $scope.validatePhoneSubmit  = function (user) {
            $scope.disabled_button  = true;
            var err   = serve.checkCodePost($scope,$location,user);
            if(err.status === true){
                document.getElementById("result-message").innerHTML = '';
                $scope.disabled_button  = false;
                $scope.err = err;

                return false;
            }

            serve.validatePhoneSubmit($scope,$location,$http,user).then(function (result) {
                $scope.err.activate_code    = '';
                $scope.disabled_button  = false;
                if(Boolean(result.status) === true){
                    localStorage.setItem('remember_token', result.remember_token);
                    $location.path('/app/selectPackage');
                    return true;
                }else{
                    document.getElementById("result-message").innerHTML = result.data;
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
        if(localStorage.getItem('merchant')){
            $scope.merchant     = JSON.parse(localStorage.getItem('merchant'));
        }
        $scope.order_id     = id;
        $scope.orderApproved    = function () {
            $location.path('/app/orderApproved');
        };
    }
]);
uver.controller('orderDetailCtrl', ['$scope', '$rootScope', '$location','$stateParams','$http', 'orderService',
    function($scope, $rootScope, $location, $stateParams,$http, orderService) {
        if(localStorage.getItem('merchant')){
            $scope.merchant     = JSON.parse(localStorage.getItem('merchant'));
        }
        var id              = $stateParams.param1;
        result  = orderService.detailOrderRequest($scope, $http, $location, id).then(function (result) {
            if(result){
                var data        = result.data;
                $scope.order    = data;
                var estimate                    = (data.actual_weight > 0) ? parseFloat(data.actual_weight) : parseFloat(data.estimate_weight);
                var price                       = result.price;
                $scope.order.is_estimate        = (data.actual_weight < 1);
                $scope.order.estimate           = estimate;
                $scope.order.package_total      = data.package * estimate;
                $scope.order.grand_total        = Number((price.grand_total).toFixed(1)).toLocaleString();

                $scope.order.prices             = generateOrderDetail(result.package, price.weight, price.weight_price, price.max_price, price.over_max);
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

uver.controller('versionCtrl', ['$scope', '$rootScope', '$location',
    function($scope, $rootScope, $location) {
        $scope.link_update  = link_update;
    }]
);
function generateOrderDetail(pack, weight, package_price, max_price, over_max) {
    var prices  = [
        {
            title:"Paket "+ pack.name +" @"+ weight +"Kg" + ((pack.max > 0) ? ", max " + pack.max +"kg" : ""),
            price_text:Number((package_price).toFixed(1)).toLocaleString(),
            price:package_price
        }
    ];
    if(over_max){
        var overMaxArray    = {
            title:'Biaya lebih ' + (weight - pack.max) + 'kg @' + pack.after_max + '/kg',
            price_text:Number((max_price).toFixed(1)).toLocaleString(),
            price:max_price
        };
        prices.push(overMaxArray);
    }

    var deliveryFeeArray = {
        title:"Biaya Pickup (PROMO)",
        price_text:0,
        price:0
    };
    prices.push(deliveryFeeArray);

    return prices;
}