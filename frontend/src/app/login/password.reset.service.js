angular.module('frontend').factory('PasswordResetService', ['$http', function($http) {
    var baseUrl = 'http://127.0.0.1:8080/api/password/'; 
    return {
        requestReset: function(email) {
            return $http.post(baseUrl + 'request-password-reset/?email=' + encodeURIComponent(email));
        },
        resetPassword: function(token, newPassword) {
            return $http.post(baseUrl + `reset-password/${token}/`, { new_password: newPassword });
        }        
    };
}]);
