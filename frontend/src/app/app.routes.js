angular.module('frontend')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController'
    })
    .state('forgot', {
        url: '/forgot-password',
        templateUrl: 'app/login/forgot-password.html',
        controller: 'PasswordResetRequestController'
    })
    .state('reset', {
        url: '/reset-password/:token',
        templateUrl: 'app/login/reset-password.html',
        controller: 'PasswordResetController'
    })
    $stateProvider
    .state('base', {
        abstract: true,
        templateUrl: 'app/base.html',
        data: {
            requireLogin: true
        }
    })
    $stateProvider
    .state('error', {
        url: '/error',
        templateUrl: 'app/errors/error.html',
        controller: 'ErrorController',
        data: {
            requireLogin: true
        }
    })
    $stateProvider
    .state('base.home', {
        url: '/home',
        templateUrl: 'app/home/home.html',
        controller: 'HomeController',
        data: {
            requireLogin: true
        }
    })
    $stateProvider
    .state('base.licenses-new', {
        url: '/licenses/new',
        templateUrl: 'app/licenses/license-new.html',
        controller: 'LicenseController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.licenses-update', {
        url: '/licenses/update/:licenseId',
        templateUrl: 'app/licenses/license-update.html',
        controller: 'LicenseUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.licenses-view', {
        url: '/licenses',
        templateUrl: 'app/licenses/license-view.html',
        controller: 'LicenseController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.user-new', {
        url: '/user/new',
        templateUrl: 'app/users/user-new.html',
        controller: 'UserController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.user-view', {
        url: '/user/list',
        templateUrl: 'app/users/user-view.html',
        controller: 'UserController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.user-update', {
        url: '/user/update/:userId',
        templateUrl: 'app/users/user-update.html',
        controller: 'UserUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.client-new', {
        url: '/clients/new',
        templateUrl: 'app/client/client-new.html',
        controller: 'ClientController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.client-view', {
        url: '/clients/list',
        templateUrl: 'app/client/client-view.html',
        controller: 'ClientController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.client-update', {
        url: '/clients/update/:clientId',
        templateUrl: 'app/client/client-update.html',
        controller: 'ClientUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.avatar-new', {
        url: '/avatar/new',
        templateUrl: 'app/avatar/avatar-new.html',
        controller: 'AvatarController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.avatar-view', {
        url: '/avatar/list',
        templateUrl: 'app/avatar/avatar-view.html',
        controller: 'AvatarController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.avatar-update', {
        url: '/avatar/update/:avatarId/:avatarName',
        templateUrl: 'app/avatar/avatar-update.html',
        controller: 'AvatarUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
}]);