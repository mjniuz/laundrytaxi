var mainURL = 'http://cuber.local/api/';
uver.factory('orderService', function() {
    order = {};

    order.submitOrder   = function ($scope, $http, $location) {
        localStorage.setItem('note', $scope.note);
        requestSubmitOrder($http, $location, 1);
        console.log($scope);
    };

    order.detailOrderRequest   = function ($scope, $http, $location, id) {
        return requestDetailOrder($scope, $http, $location, id);
    };

    order.listOrderRequest      = function($scope, $http, $location, token){
        return requestListOrder($scope, $http, $location, token);

    };

    return order;
});

function requestListOrder($scope, $http, $location, token) {
    var $theURL     = mainURL + 'order-list';
    return $http({
        url: $theURL,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        method: "POST",
        transformRequest: function(obj) {
            var param       = {
                'remember_token': token
            };
            var str = [];
            for(var p in param)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(param[p]));
            return str.join("&");
        }
    }).then(function(response) {
        if(response.data.status === true){

            return response.data.data;
        }

        return false;
    }, function(response) {
        console.log('error requestListOrder');
    });
}

function requestDetailOrder($scope, $http, $location, id) {
    var $theURL     = mainURL + 'order-detail/' + id;
    return $http({
        url: $theURL,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        method: "POST",
        transformRequest: function(obj) {
            var param       = {
                'remember_token': localStorage.getItem('remember_token')
            };
            var str = [];
            for(var p in param)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(param[p]));
            return str.join("&");
        }
    }).then(function(response) {
        if(response.data.status === true){

            return response.data.data;
        }

        return false;
    }, function(response) {
        console.log('error requestDetailOrder');
    });
}

var request     = 0;
function requestSubmitOrder($http, $location, count) {
    var $theURL     = mainURL + 'create-order';
    $http({
        url: $theURL,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        method: "POST",
        transformRequest: function(obj) {
            var param       = processInput();
            var str = [];
            for(var p in param)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(param[p]));
            return str.join("&");
        }
    }).then(function(response) {
        console.log(response);
        if(response.data.status === true){
            resetAfterSuccessOrder();

            localStorage.setItem('merchant', JSON.stringify(response.data.data.merchant));
            localStorage.setItem('remember_token', response.data.data.user.remember_token);
            $location.path('/app/orderApproved/' + response.data.data.id);

            return response.data;
        }
        if(count > 2){
            document.getElementById('loading-order-msg').innerHTML = "Terjadi kesalahan jaringan, silahkan kembali dan coba lagi";
            return false;
        }
        count += 1;
        requestSubmitOrder($http, $location, count);
    }, function(response) {
        if(count > 2){
            document.getElementById('loading-order-msg').innerHTML = "Terjadi kesalahan jaringan, silahkan kembali dan coba lagi";
            return false;
        }
        count += 1;
        requestSubmitOrder($http, $location, count);
    });
}

function processInput(){
    var result  = {};
    result.full_name    = localStorage.getItem('full_name');
    result.phone        = localStorage.getItem('phone');
    result.note         = localStorage.getItem('note');
    result.estimate     = localStorage.getItem('estimate');
    result.package      = localStorage.getItem('package');
    result.estimate     = localStorage.getItem('estimate');
    result.package      = localStorage.getItem('package');

    result.full_address = localStorage.getItem('full_address');
    result.address_note = localStorage.getItem('address_note');
    result.lng          = JSON.parse(localStorage.getItem('location')).lng;
    result.lat          = JSON.parse(localStorage.getItem('location')).lat;

    return result;
}

function resetAfterSuccessOrder() {
    localStorage.setItem('package', '');
    localStorage.setItem('estimate', '');
}