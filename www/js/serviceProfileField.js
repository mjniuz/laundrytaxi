var mainURL = 'http://cuber.local/api/';
uver.factory('serve', function() {
    var serve   = {};
    var err     = {
        status: false,
        phone: '',
        full_name: ''
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
    serve.validatePhone    = function ($scope, $location, $http, user) {
        var $theURL     = mainURL + 'validate-phone';
        return $http({
            url: $theURL,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: "POST",
            transformRequest: function(obj) {
                var param       = {
                    'phone': user.phone
                };
                var str = [];
                for(var p in param)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(param[p]));
                return str.join("&");
            }
        }).then(function(response) {
            console.log(response);
            return response.data.status;
        }, function(response) {
            document.getElementById('loading-order-msg').innerHTML = "Terjadi kesalahan jaringan, silahkan kembali dan coba lagi";
            return false;
        });
    };

    serve.addPackage    = function ($scope,$location,pack) {
        localStorage.setItem('package', '');
        localStorage.setItem('estimate', '');
        err.status  = false;
        err.pack = {
            package: (typeof pack !== 'undefined' && pack.package) ? '' : 'Harap pilih paket',
            estimate: (typeof pack === 'undefined' || !isNumeric(pack.estimate)) ? "Harap masukan angka" : ''
        };
        console.log(err);
        if(err.pack.package || err.pack.estimate){
            err.status  = true;
            $scope.err = err;

            return err;
        }
        localStorage.setItem('package', pack.package);
        localStorage.setItem('estimate', pack.estimate);

        return pack;
    };

    return serve;
});
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
