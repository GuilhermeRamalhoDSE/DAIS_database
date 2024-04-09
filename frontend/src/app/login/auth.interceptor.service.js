angular.module('frontend').factory('AuthInterceptor', ['$q', '$window', '$injector', function($q, $window, $injector) {
    return {
        request: function(config) {
            var AuthService = $injector.get('AuthService'); 
            config.headers = config.headers || {};

            if (!config.url.endsWith('/login')) {
                var token = AuthService.getToken();
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
            }

            return config;
        },
        responseError: function(response) {
            if (response.status === 401) {
                $window.location.href = '/login'; 
            }
            return $q.reject(response);
        }
    };
}]);
