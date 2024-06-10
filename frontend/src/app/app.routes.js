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
    .state('base.clientmodule-new', {
        url: '/:clientId/:clientName/module/new',
        templateUrl: 'app/client_module/clientmodule-new.html',
        controller: 'ClientModuleController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.clientmodule-view', {
        url: '/:clientId/:clientName/modules',
        templateUrl: 'app/client_module/clientmodule-view.html',
        controller: 'ClientModuleController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.clientmodule-update', {
        url: '/:clientId/:clientName/module/update/:clientmoduleId/:clientmoduleName',
        templateUrl: 'app/client_module/clientmodule-update.html',
        controller: 'ClientModuleUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.form-new', {
        url: '/:clientId/:clientName/:clientmoduleId/form/new',
        templateUrl: 'app/forms/form-new.html',
        controller: 'FormController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.form-view', {
        url: '/:clientId/:clientName/:clientmoduleId/forms',
        templateUrl: 'app/forms/form-view.html',
        controller: 'FormController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.form-update', {
        url: '/:clientId/:clientName/:clientmoduleId/form/update/:formId/:formName',
        templateUrl: 'app/forms/form-update.html',
        controller: 'FormUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.formfield-new', {
        url: '/:clientId/:clientName/:clientmoduleId/:formId/:formName/field/new',
        templateUrl: 'app/form_field/form_field-new.html',
        controller: 'FormFieldController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.formfield-view', {
        url: '/:clientId/:clientName/:clientmoduleId/:formId/:formName/fields',
        templateUrl: 'app/form_field/form_field-view.html',
        controller: 'FormFieldController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.formfield-update', {
        url: '/:clientId/:clientName/:clientmoduleId/:formId/:formName/field/update/:formfieldId/:formfieldName',
        templateUrl: 'app/form_field/form_field-update.html',
        controller: 'FormFieldUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.formdata-new', {
        url: '/:clientId/:clientName/:clientmoduleId/:formId/:formName/data/new',
        templateUrl: 'app/formdata/formdata-new.html',
        controller: 'FormDataController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.formdata-view', {
        url: '/:clientId/:clientName/:clientmoduleId/:formId/:formName/data',
        templateUrl: 'app/formdata/formdata-view.html',
        controller: 'FormDataController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.touchscreeninteraction-new', {
        url: '/:clientId/:clientName/:clientmoduleId/touchscreen-interaction/new',
        templateUrl: 'app/Touchscreen-Interactions/touchscreen-interactions-new.html',
        controller: 'TouchscreenInteractionController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.touchscreeninteraction-view', {
        url: '/:clientId/:clientName/:clientmoduleId/touchscreen-interactions',
        templateUrl: 'app/Touchscreen-Interactions/touchscreen-interactions-view.html',
        controller: 'TouchscreenInteractionController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.touchscreeninteraction-update', {
        url: '/:clientId/:clientName/:clientmoduleId/touchscreen-interaction/update/:touchscreeninteractionId',
        templateUrl: 'app/Touchscreen-Interactions/touchscreen-interactions-update.html',
        controller: 'TouchscreenInteractionUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.button-new', {
        url: '/:clientId/:clientName/:clientmoduleId/:touchscreeninteractionId/:touchscreeninteractionName/button/new',
        templateUrl: 'app/button/button-new.html',
        controller: 'ButtonController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.button-view', {
        url: '/:clientId/:clientName/:clientmoduleId/:touchscreeninteractionId/:touchscreeninteractionName/buttons',
        templateUrl: 'app/button/button-view.html',
        controller: 'ButtonController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.button-update', {
        url: '/:clientId/:clientName/:clientmoduleId/:touchscreeninteractionId/:touchscreeninteractionName/button/update/:buttonId',
        templateUrl: 'app/button/button-update.html',
        controller: 'ButtonUpdateController',
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
    .state('base.module-new', {
        url: '/module/new',
        templateUrl: 'app/module/module-new.html',
        controller: 'ModuleController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.module-view', {
        url: '/modules',
        templateUrl: 'app/module/module-view.html',
        controller: 'ModuleController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.module-update', {
        url: '/module/update/:moduleId/:moduleName',
        templateUrl: 'app/module/module-update.html',
        controller: 'ModuleUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.screentype-new', {
        url: '/screentype/new',
        templateUrl: 'app/screentype/screentype-new.html',
        controller: 'ScreenTypeController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.screentype-view', {
        url: '/screentype',
        templateUrl: 'app/screentype/screentype-view.html',
        controller: 'ScreenTypeController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.screentype-update', {
        url: '/screentype/update/:screentypeId/:screentypeName',
        templateUrl: 'app/screentype/screentype-update.html',
        controller: 'ScreenTypeUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.buttontype-new', {
        url: '/buttontype/new',
        templateUrl: 'app/buttontype/buttontype-new.html',
        controller: 'ButtonTypeController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.buttontype-view', {
        url: '/buttontypes',
        templateUrl: 'app/buttontype/buttontype-view.html',
        controller: 'ButtonTypeController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser'] 
        }
    })
    $stateProvider
    .state('base.buttontype-update', {
        url: '/buttontype/update/:buttontypeId/:buttontypeName',
        templateUrl: 'app/buttontype/buttontype-update.html',
        controller: 'ButtonTypeUpdateController',
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
    .state('base.screen-new', {
        url: '/:clientId/:clientName/:groupId/:groupName/:totemId/:totemName/screen/new',
        templateUrl: 'app/screens/screen-new.html',
        controller: 'ScreenController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.screen-view', {
        url: '/:clientId/:clientName/:groupId/:groupName/:totemId/:totemName/screens',
        templateUrl: 'app/screens/screen-view.html',
        controller: 'ScreenController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.screen-update', {
        url: '/:clientId/:clientName/:groupId/:groupName/:totemId/:totemName/screen/update/:screenId',
        templateUrl: 'app/screens/screen-update.html',
        controller: 'ScreenUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.logs-view', {
        url: '/logs',
        templateUrl: 'app/logs/logs-view.html',
        controller: 'LogsController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.campaignds-new', {
        url: '/:clientId/:clientName/:groupId/:groupName/campaignds/new',
        templateUrl: 'app/campaignDS/campaignds-new.html',
        controller: 'CampaignDSController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.campaignds-view', {
        url: '/:clientId/:clientName/:groupId/:groupName/campaignds',
        templateUrl: 'app/campaignDS/campaignds-view.html',
        controller: 'CampaignDSController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.campaignds-update', {
        url: '/:clientId/:clientName/:groupId/:groupName/campaignds/updade/:campaigndsId',
        templateUrl: 'app/campaignDS/campaignds-update.html',
        controller: 'CampaignDSUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.timeslot-new', {
        url: '/:clientId/:clientName/:groupId/:groupName/:campaigndsId/:campaigndsName/timeslot/new',
        templateUrl: 'app/timeslots/timeslot-new.html',
        controller: 'TimeSlotController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.timeslot-view', {
        url: '/:clientId/:clientName/:groupId/:groupName/:campaigndsId/:campaigndsName/timeslots',
        templateUrl: 'app/timeslots/timeslot-view.html',
        controller: 'TimeSlotController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.timeslot-update', {
        url: '/:clientId/:clientName/:groupId/:groupName/:campaigndsId/:campaigndsName/timeslot/update/:timeslotId',
        templateUrl: 'app/timeslots/timeslot-update.html',
        controller: 'TimeSlotUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.contributionds-new', {
        url: '/:clientId/:clientName/:groupId/:groupName/:campaigndsId/:campaigndsName/:timeslotId/contribution/new',
        templateUrl: 'app/contributionsDS/contributionds-new.html',
        controller: 'ContributionDSController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.contributionds-view', {
        url: '/:clientId/:clientName/:groupId/:groupName/:campaigndsId/:campaigndsName/:timeslotId/contributions',
        templateUrl: 'app/contributionsDS/contributionds-view.html',
        controller: 'ContributionDSController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.contributionds-update', {
        url: '/:clientId/:clientName/:groupId/:groupName/:campaigndsId/:campaigndsName/:timeslotId/contribution/update/:contributiondsId',
        templateUrl: 'app/contributionsDS/contributionds-update.html',
        controller: 'ContributionDSUpdateController',
        data: {
            requireLogin: true, 
            requiredPermissions: ['superuser', 'staff'] 
        }
    })
    $stateProvider
    .state('base.campaignai-new', {
        url: '/:clientId/:clientName/:groupId/:groupName/campaignai/new',
        templateUrl: 'app/campaignAI/campaignai-new.html',
        controller: 'CampaignAIController',
        data: {
            requireLogin: true,
            requiredPermissions: ['superuser', 'staff']
        }
    });
    $stateProvider
    .state('base.campaignai-view', {
        url: '/:clientId/:clientName/:groupId/:groupName/campaignai',
        templateUrl: 'app/campaignAI/campaignai-view.html',
        controller: 'CampaignIAController',
        data: {
            requireLogin: true,
            requiredPermissions: ['superuser', 'staff']
        }
    });
    $stateProvider
    .state('base.campaignai-update', {
        url: '/:clientId/:clientName/:groupId/:groupName/campaignai/update/:campaignaiId',
        templateUrl: 'app/campaignAI/campaignai-update.html',
        controller: 'CampaignAIUpdateController',
        data: {
            requireLogin: true,
            requiredPermissions: ['superuser', 'staff']
        }
    });
    $stateProvider
    .state('base.layer-new', {
        url: '/:clientId/:clientName/:groupId/:groupName/:campaigniaId/layers/new',
        templateUrl: 'app/layers/layer-new.html',
        controller: 'LayerController',
        data: {
            requireLogin: true,
            requiredPermissions: ['superuser', 'staff']
        }
    });
    $stateProvider
    .state('base.layer-new-children', {
        url: '/:clientId/:clientName/:groupId/:groupName/:campaigniaId/layers/new/:layerNumber',
        templateUrl: 'app/layers/layer-new-children.html',
        controller: 'LayerController',
        data: {
            requireLogin: true,
            requiredPermissions: ['superuser', 'staff']
        }
    });

    $stateProvider
    .state('base.layer-view', {
        url: '/:clientId/:clientName/:groupId/:groupName/:campaigniaId/layers',
        templateUrl: 'app/layers/layer-view.html',
        controller: 'LayerController',
        data: {
            requireLogin: true,
            requiredPermissions: ['superuser', 'staff']
        }
    });

    $stateProvider
    .state('base.layer-update', {
        url: '/:clientId/:clientName/:groupId/:groupName/:campaigniaId/update/:layerId',
        templateUrl: 'app/layers/layer-update.html',
        controller: 'LayerUpdateController',
        data: {
            requireLogin: true,
            requiredPermissions: ['superuser', 'staff']
        }
    });
    $stateProvider
    .state('base.contributionia-new', {
        url: '/:clientId/:clientName/:groupId/:groupName/:campaigniaId/:layerId/:layerName/contributionIA/new',
        templateUrl: 'app/contributionsIA/contributionia-new.html',
        controller: 'ContributionIAController',
        data: {
            requireLogin: true,
            requiredPermissions: ['superuser', 'staff']
        }
    });

    $stateProvider
    .state('base.contributionia-view', {
        url: '/:clientId/:clientName/:groupId/:groupName/:campaigniaId/:layerId/:layerName/contributionsIA',
        templateUrl: 'app/contributionsIA/contributionia-view.html',
        controller: 'ContributionIAController',
        data: {
            requireLogin: true,
            requiredPermissions: ['superuser', 'staff']
        }
    });

    $stateProvider
    .state('base.contributionia-update', {
        url: '/:clientId/:clientName/:groupId/:groupName/:campaigniaId/:layerId/:layerName/contributionIA/update/:contributioniaId/:contributioniaName',
        templateUrl: 'app/contributionsIA/contributionia-update.html',
        controller: 'ContributionIAUpdateController',
        data: {
            requireLogin: true,
            requiredPermissions: ['superuser', 'staff']
        }
    });
    $stateProvider
    .state('base.formation-new', {
        url: '/:clientId/:clientName/:groupId/:groupName/:campaigniaId/:layerId/:layerName/formation/new',
        templateUrl: 'app/formations/formation-new.html',
        controller: 'FormationController',
        data: {
            requireLogin: true,
            requiredPermissions: ['superuser', 'staff']
        }
    });

    $stateProvider
    .state('base.formation-view', {
        url: '/:clientId/:clientName/:groupId/:groupName/:campaigniaId/:layerId/:layerName/formations',
        templateUrl: 'app/formations/formation-view.html',
        controller: 'FormationController',
        data: {
            requireLogin: true,
            requiredPermissions: ['superuser', 'staff']
        }
    });

    $stateProvider
    .state('base.formation-update', {
        url: '/:clientId/:clientName/:groupId/:groupName/:campaigniaId/:layerId/:layerName/formation/update/:formationId/:formationName',
        templateUrl: 'app/formations/formation-update.html',
        controller: 'FormationUpdateController',
        data: {
            requireLogin: true,
            requiredPermissions: ['superuser', 'staff']
        }
    });
}]);