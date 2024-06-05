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

angular.module('frontend').directive('initFootable', function($timeout) {
    return {
        link: function(scope, element) {
            $timeout(function() {
                $('.table').footable();
            }, 0);
        }
    };
});

angular.module('frontend').filter('customTotemIdFilter', function() {
    return function(logs, searchText) {
        var filteredLogs = [];
        for (var i = 0; i < logs.length; i++) {
            var log = logs[i];
            if (!searchText || log.totem_id === parseInt(searchText)) {
                filteredLogs.push(log);
            }
        }
        return filteredLogs;
    };
});

angular.module('frontend').filter("dateFilter", function() {
    return function datefilter(items, from, to) {
        var result = [];
        angular.forEach(items, function(value) {
            var logDate = new Date(value.date);
            var startDate = new Date(from);
            startDate.setHours(0, 0, 0, 0); 
            var endDate = new Date(to);
            endDate.setHours(23, 59, 59, 999);

            if (logDate >= startDate && logDate <= endDate) {
                result.push(value);
            }
        });
        return result;
    };
});
