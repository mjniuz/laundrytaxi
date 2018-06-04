// var mainURL = 'http://cuber.local/api/';
uver.factory('serve', function() {
    var serve   = {};
    var err     = {
        status: false,
        phone: '',
        full_name: '',
        activate_code: ''
    };

    serve.checkProfilePost    = function ($scope, $location, user) {
        if(localStorage.getItem('full_name') && localStorage.getItem('phone', '') && typeof user === 'undefined'){
            // ok you can pass
            return data    = {
                status: false
            };
        }
        //localStorage.setItem('full_name', '');
        //localStorage.setItem('phone', '');
        err.full_name   = '';
        err.phone       = '';

        if (typeof user === 'undefined' || user.full_name === null || user.full_name.length < 3) {
            err.full_name = 'Minimal 3 karakter untuk nama';
        }
        if (typeof user === 'undefined' || user.phone === null || user.phone.length < 6) {
            err.phone = 'Minimal 6 karakter untuk telepon';
        }

        if (err.full_name.length || err.phone.length) {
            $scope.err = err;
            err = {
                status: true,
                phone: '',
                full_name: ''
            };

            return err;
        }
        // save to local storage
        localStorage.setItem('full_name', user.full_name);
        localStorage.setItem('phone', user.phone);
        user.status     = false;
        user.message    = 'Data tidak benar';

        return user;
    };

    serve.checkCodePost    = function ($scope, $location, user) {
        if (typeof user === 'undefined' || typeof user.activate_code === 'undefined' || user.activate_code.length < 4) {
            $scope.err = err;
            err = {
                status: true,
                activate_code: 'Harap isi kode aktivasi, cek sms pada nomor hp Anda, min 4 digit'
            };

            return err;
        }
        return data    = {
            status: false
        };
    };
    serve.validatePhone    = function ($scope, $location, $http, user) {
        var token       = localStorage.getItem('remember_token');
        var $theURL     = mainURL + 'validate-phone';
        return $http({
            url: $theURL,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: "POST",
            transformRequest: function(obj) {
                var param       = {
                    'phone': user.phone,
                    'full_name': user.full_name,
                    'remember_token': token
                };
                var str = [];
                for(var p in param)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(param[p]));
                return str.join("&");
            }
        }).then(function(response) {
            console.log(response);
            return response.data;
        }, function(response) {
            document.getElementById('loading-order-msg').innerHTML = "Terjadi kesalahan jaringan, silahkan kembali dan coba lagi";
            return false;
        });
    };
    serve.validatePhoneSubmit    = function ($scope, $location, $http, user) {
        var $theURL     = mainURL + 'validate-phone-submit';
        return $http({
            url: $theURL,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: "POST",
            transformRequest: function(obj) {
                var param       = {
                    'phone': user.phone,
                    'activate_code': user.activate_code
                };
                var str = [];
                for(var p in param)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(param[p]));
                return str.join("&");
            }
        }).then(function(response) {
            console.log(response);
            return response.data;
        }, function(response) {
            document.getElementById('loading-order-msg').innerHTML = "Terjadi kesalahan jaringan, silahkan kembali dan coba lagi";
            return false;
        });
    };
    serve.getPackages    = function ($scope, $location, $http, token) {
        var $theURL     = mainURL + 'get-packages';
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
            return response.data;
        }, function(response) {
            return false;
        });
    };

    serve.addPackage    = function ($scope,$location,pack) {
        localStorage.setItem('package', '');
        localStorage.setItem('estimate', '');
        err.status  = false;
        err.pack = {
            package: Boolean(typeof pack !== 'undefined' && pack.package) ? '' : 'Harap pilih paket',
            estimate: Boolean(typeof pack === 'undefined' || !isNumeric(pack.estimate)) ? "Harap masukan angka" : ''
        };
        console.log(pack);
        if(err.pack.package || err.pack.estimate){
            console.log('error');
            err.status  = true;
            $scope.err = err;

            return err;
        }
        if(typeof pack.package !== 'object'){
            localStorage.setItem('package', pack.package);
        }else{
            localStorage.setItem('package', JSON.stringify(pack.package));
        }
        localStorage.setItem('estimate', pack.estimate);
        err.package     = pack;

        return err;
    };

    return serve;
});
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
