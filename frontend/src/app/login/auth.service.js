angular.module('frontend').factory('AuthService', ['$http', '$window', function($http, $window) {
    var authService = {};

    authService.login = function(credentials) {
        return $http.post('https://daisdatabasedse.it/api/login/', credentials).then(function(response) {
            var storage = credentials.rememberMe ? $window.localStorage : $window.sessionStorage;
            
            storage.setItem('jwtToken', response.data.token);
            storage.setItem('userId', response.data.user_id.toString());
            storage.setItem('isSuperuser', response.data.is_superuser.toString());
            storage.setItem('isStaff', response.data.is_staff.toString());
            
            
            if (response.data.license_id != null) {
                storage.setItem('licenseId', response.data.license_id.toString());
            } else {
               
                storage.removeItem('licenseId'); 
            }
            
            return response.data;
        });
    };

    authService.getUserId = function() {
        return $window.localStorage.getItem('userId') || $window.sessionStorage.getItem('userId');
    };

    authService.isSuperuser = function() {
        return $window.localStorage.getItem('isSuperuser') === 'true' || $window.sessionStorage.getItem('isSuperuser') === 'true';
    };

    authService.isStaff = function() {
        return $window.localStorage.getItem('isStaff') === 'true' || $window.sessionStorage.getItem('isStaff') === 'true';
    };

    authService.getLicenseId = function() {
        var licenseId = $window.localStorage.getItem('licenseId') || $window.sessionStorage.getItem('licenseId');
        return licenseId ? parseInt(licenseId, 10) : null; 
    };
    

    authService.logout = function() {
        $window.localStorage.clear();
        $window.sessionStorage.clear();
    };

    authService.isAuthenticated = function() {
        return !!($window.localStorage.getItem('jwtToken') || $window.sessionStorage.getItem('jwtToken'));
    };

    authService.getToken = function() {
        return $window.localStorage.getItem('jwtToken') || $window.sessionStorage.getItem('jwtToken');
    };

    authService.isOnlyStaff = function() {
        return this.isStaff() && !this.isSuperuser();
    };

    return authService;
}]);
