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
    $stateProvider
    .state('base.voice-new', {
        url: '/voice/new',
        templateUrl: 'app/voice/voice-new.html',
        controller: 'VoiceController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.voice-view', {
        url: '/voices',
        templateUrl: 'app/voice/voice-view.html',
        controller: 'VoiceController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.voice-update', {
        url: '/voice/update/:voiceId/:voiceName',
        templateUrl: 'app/voice/voice-update.html',
        controller: 'VoiceUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.language-new', {
        url: '/language/new',
        templateUrl: 'app/language/language-new.html',
        controller: 'LanguageController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.language-view', {
        url: '/languages',
        templateUrl: 'app/language/language-view.html',
        controller: 'LanguageController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.language-update', {
        url: '/language/update/:languageId/:languageName',
        templateUrl: 'app/language/language-update.html',
        controller: 'LanguageUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.group-new', {
        url: '/:clientId/:clientName/group/new',
        templateUrl: 'app/group/group-new.html',
        controller: 'GroupController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.group-view', {
        url: '/:clientId/:clientName/groups',
        templateUrl: 'app/group/group-view.html',
        controller: 'GroupController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.group-view-all', {
        url: '/groups',
        templateUrl: 'app/group/group-view-all.html',
        controller: 'GroupGetAllController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.group-update', {
        url: '/:clientId/:clientName/group/update/:groupId/:groupName',
        templateUrl: 'app/group/group-update.html',
        controller: 'GroupUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.totem-new', {
        url: '/:clientId/:clientName/:groupId/:groupName/totem/new',
        templateUrl: 'app/totem/totem-new.html',
        controller: 'TotemController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.totem-view', {
        url: '/:clientId/:clientName/:groupId/:groupName/totems',
        templateUrl: 'app/totem/totem-view.html',
        controller: 'TotemController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.totem-update', {
        url: '/:clientId/:clientName/:groupId/:groupName/totem/:totemId',
        templateUrl: 'app/totem/totem-update.html',
        controller: 'TotemUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.logs-new', {
        url: '/:clientId/:clientName/:groupId/:groupName/:totemId/:totemName/logs/new',
        templateUrl: 'app/logs/logs-new.html',
        controller: 'LogsController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.logs-view', {
        url: '/:clientId/:clientName/:groupId/:groupName/:totemId/:totemName/logs',
        templateUrl: 'app/logs/logs-view.html',
        controller: 'LogsController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.periodds-new', {
        url: '/:clientId/:clientName/:groupId/:groupName/periodds/new',
        templateUrl: 'app/periodDS/periodds-new.html',
        controller: 'PeriodDSController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.periodds-view', {
        url: '/:clientId/:clientName/:groupId/:groupName/periodds',
        templateUrl: 'app/periodDS/periodds-view.html',
        controller: 'PeriodDSController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.periodds-update', {
        url: '/:clientId/:clientName/:groupId/:groupName/periodds/updade/:perioddsId',
        templateUrl: 'app/periodDS/periodds-update.html',
        controller: 'PeriodDSUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.timeslot-new', {
        url: '/:clientId/:clientName/:groupId/:groupName/:perioddsId/timeslot/new',
        templateUrl: 'app/timeslots/timeslot-new.html',
        controller: 'TimeSlotController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.timeslot-view', {
        url: '/:clientId/:clientName/:groupId/:groupName/:perioddsId/timeslots',
        templateUrl: 'app/timeslots/timeslot-view.html',
        controller: 'TimeSlotController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.timeslot-update', {
        url: '/:clientId/:clientName/:groupId/:groupName/:perioddsId/timeslot/update/:timeslotId',
        templateUrl: 'app/timeslots/timeslot-update.html',
        controller: 'TimeSlotUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.periodia-new', {
        url: '/:clientId/:clientName/:groupId/:groupName/periodia/new',
        templateUrl: 'app/periodIA/periodia-new.html',
        controller: 'PeriodIAController',
        data: {
            requireLogin: true,
            requiredPermissions: ['superuser', 'staff']
        }
    });

$stateProvider
    .state('base.periodia-view', {
        url: '/:clientId/:clientName/:groupId/:groupName/periodia',
        templateUrl: 'app/periodIA/periodia-view.html',
        controller: 'PeriodIAController',
        data: {
            requireLogin: true,
            requiredPermissions: ['superuser', 'staff']
        }
    });

$stateProvider
    .state('base.periodia-update', {
        url: '/:clientId/:clientName/:groupId/:groupName/periodia/update/:periodiaId',
        templateUrl: 'app/periodIA/periodia-update.html',
        controller: 'PeriodIAUpdateController',
        data: {
            requireLogin: true,
            requiredPermissions: ['superuser', 'staff']
        }
    });
}]);