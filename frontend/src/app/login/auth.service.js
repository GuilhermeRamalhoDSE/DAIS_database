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
                authService.fetchAndStoreModules(response.data.license_id);
            } else {
                storage.removeItem('licenseId'); 
                storage.removeItem('licenseModules');
            }  
            return response.data;
        });
    };  

    authService.fetchAndStoreModules = function(licenseId) {
        var storage = $window.localStorage.getItem('jwtToken') ? $window.localStorage : $window.sessionStorage;
    
        return $http.get('https://daisdatabasedse.it/api/licenses/' + licenseId + '/modules/').then(function(response) {
            if (response.data && Array.isArray(response.data)) { 
                var moduleSlugs = response.data.map(module => module.slug); 
                storage.setItem('licenseModules', JSON.stringify(moduleSlugs));
            } else {
                console.log('No modules found or response is incorrect:', response.data); 
                storage.setItem('licenseModules', '[]');
            }
        }).catch(function(error) {
            console.error('Failed to fetch modules', error);
            storage.setItem('licenseModules', '[]');
        });
    };

    authService.isModuleInAnyGroup = function(moduleSlug, groupId) {
        if (!groupId) return Promise.resolve(false);
    
        return $http.get(`https://daisdatabasedse.it/api/groups/${groupId}/modules/`)
        .then(function(response) {
            return response.data.some(module => module.slug === moduleSlug);
        }).catch(function(error) {
            console.error('Failed to check module associations for group:', groupId, error);
            return false;
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

    authService.isModuleEnabled = function(slug) {
        var modules = JSON.parse($window.localStorage.getItem('licenseModules') || $window.sessionStorage.getItem('licenseModules') || '[]');
        return modules.includes(slug);
    };       

    authService.hasModules = function() {
        var modules = JSON.parse($window.localStorage.getItem('licenseModules') || $window.sessionStorage.getItem('licenseModules') || '[]');
        return modules.length > 0;
    };

    authService.isOnlyStaff = function() {
        return this.isStaff() && !this.isSuperuser();
    };

    return authService;
}]);
