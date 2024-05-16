angular.module('frontend', ['ui.router', 'ngFileUpload'])
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
}])
.run(['$rootScope', '$state', 'AuthService', function($rootScope, $state, AuthService) {
    $rootScope.isSuperuser = function() {
        return AuthService.isSuperuser();
    };
    $rootScope.isStaff = function() {
        return AuthService.isStaff();
    };

    $rootScope.$on('$stateChangeStart', function(event, toState) {
        var requireLogin = toState.data && toState.data.requireLogin;
        var requiredPermissions = toState.data ? toState.data.requiredPermissions : null;

        if (requireLogin && !AuthService.isAuthenticated()) {
            event.preventDefault(); 
            $state.go('login'); 
        } else if (toState.name === 'login' && AuthService.isAuthenticated()) {
            event.preventDefault();
            $state.go('base.home'); 
        } else if (requiredPermissions) {
            var hasSuperuserPermission = requiredPermissions.includes('superuser') && AuthService.isSuperuser();
            var hasStaffPermission = requiredPermissions.includes('staff') && AuthService.isStaff();

            if (!hasSuperuserPermission && !hasStaffPermission) {
                event.preventDefault();
                $state.go('error');
            }
        }
    });
}]);
angular.module('frontend').directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                    scope.upload(element[0].files[0]);
                });
            });
        }
    };
}]);
angular.module('frontend').filter('formatTime', function() {
    return function(input) {
        if (!input) return ''; 
        var parts = input.split(':'); 
        if (parts.length >= 2) {
            var hours = parts[0];
            var minutes = parts[1];
            return hours + ':' + minutes; 
        }
        return input; 
    };
});
app.directive('initFootable', function($timeout) {
    return {
        link: function(scope, element) {
            $timeout(function() {
                $('.table').footable();
            }, 0);
        }
    };
});
