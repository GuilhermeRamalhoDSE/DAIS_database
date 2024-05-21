angular.module('frontend').controller('LicenseController', ['$scope', 'LicenseService', 'AvatarService', 'VoiceService', 'LanguageService', 'ModuleService', 'ScreenTypeService', 'ButtonTypeService', '$state', function($scope, LicenseService, AvatarService, VoiceService, LanguageService, ModuleService, ScreenTypeService, ButtonTypeService, $state) {
    $scope.licenses = [];
    $scope.avatars = [];
    $scope.voices = [];
    $scope.languages = [];
    $scope.modules = [];
    $scope.screentypes = [];
    $scope.buttontypes = [];
 
    $scope.newLicense = {
        name: "",
        email: "",
        address: "",
        tel: "",
        license_code: "",
        active: true,
        start_date: "",
        end_date: "",
        avatars_ids: [],
        voices_ids: [],
        languages_ids: [],
        modules_ids: [],
        screentypes_ids: [],
        buttontypes_ids: [],
    };

    $scope.getAllLicenses = function() {
        LicenseService.getAll().then(function(response) {
            $scope.licenses = response.data;
        }).catch(function(error) {
            alert('Error fetching licenses:', error);
        });
    };

    $scope.loadAvatars = function() {
        AvatarService.getAvatars().then(function(response) {
            $scope.avatars = response.data;
        }).catch(function(error) {
            alert('Error fetching avatars:', error);
        });
    };

    $scope.loadVoices = function() {
        VoiceService.getAll().then(function(response) {
            $scope.voices = response.data;
        }).catch(function(error) {
            alert('Error fetching voices:', error);
        });
    };

    $scope.loadLanguages = function() {
        LanguageService.getAll().then(function(response) {
            $scope.languages = response.data;
        }).catch(function(error) {
            alert('Error fetching languages:', error);
        });
    };

    $scope.loadModules = function() {
        ModuleService.getAll().then(function(response) {
            $scope.modules = response.data;
        }).catch(function(error) {
            alert('Error fetching modules:', error);
        });
    };

    $scope.loadScreenTypes = function() {
        ScreenTypeService.getAll().then(function(response) {
            $scope.screentypes = response.data;
        }).catch(function(error) {
            alert('Error fetching screen type:', error);
        });
    };

    $scope.loadButtonTypes = function() {
        ButtonTypeService.getAll().then(function(response) {
            $scope.buttontypes = response.data;
        }).catch(function(error) {
            alert('Error fetching button type:', error);
        });
    };

    $scope.goToCreateLicense = function() {
        $state.go('base.licenses-new');
    };

    $scope.createLicense = function() {
        var licenseData = angular.copy($scope.newLicense);
        
        if (licenseData.start_date) {
            licenseData.start_date = moment(licenseData.start_date, "DD/MM/YYYY").format('YYYY-MM-DD');
        }
        if (licenseData.end_date) {
            licenseData.end_date = moment(licenseData.end_date, "DD/MM/YYYY").format('YYYY-MM-DD');
        }

        LicenseService.create(licenseData).then(function(response) {
            alert('License created successfully!');
            $scope.getAllLicenses();
            $scope.newLicense = {
                name: "",
                email: "",
                address: "",
                tel: "",
                license_code: "",
                active: true,
                start_date: "",
                end_date: "",
                avatars_ids: [],
                voices_ids: [],
                languages_ids: [],
                modules_ids: [],
                screentypes_ids: [],
                buttontypes_ids: [],
            };
            $state.go('base.licenses-view'); 
        }).catch(function(error) {
            alert('Error creating license:', error);
        });
    };

    $scope.cancelCreate = function() {
        $state.go('base.licenses-view');
    };

    $scope.editLicense = function(licenseId) {
        $state.go('base.licenses-update', { licenseId: licenseId }); 
    };

    $scope.goBack = function() {
        $state.go('base.home');
    }; 
    
    $scope.deleteLicense = function(licenseId) {
        if (confirm('Are you sure you want to delete this license?')) {
            LicenseService.delete(licenseId).then(function(response) {
                alert('License successfully deleted!');
                $scope.getAllLicenses();
            }).catch(function(error) {
                alert('Error deleting license:', error);
            });
        }
    };

    $scope.toggleAvatarAssignment = function(license, avatarId) {
        const isAssigned = $scope.isAvatarAssignedToLicense(license, avatarId);
        if (isAssigned) {
            LicenseService.removeAvatarFromLicense(license.id, avatarId)
                .then(function(response) {
                    $scope.getAllLicenses(); 
                })
                .catch(function(error) {
                    console.error('Error removing avatar from license:', error);
                });
        } else {
            LicenseService.addAvatarToLicense(license.id, avatarId)
                .then(function(response) {
                    $scope.getAllLicenses(); 
                })
                .catch(function(error) {
                    console.error('Error adding avatar to license:', error);
                });
        }
    };
    
    $scope.isAvatarAssignedToLicense = function(license, avatarId) {
        return license.avatars.some(avatar => avatar.id === avatarId);
    };    
    
    $scope.toggleVoiceAssignment = function(license, voiceId) {
        const isAssigned = $scope.isVoiceAssignedToLicense(license, voiceId);
        if (isAssigned) {
            LicenseService.removeVoiceFromLicense(license.id, voiceId)
                .then(function(response) {
                    $scope.getAllLicenses(); 
                })
                .catch(function(error) {
                    console.error('Error removing voice from license:', error);
                });
        } else {
            LicenseService.addVoiceToLicense(license.id, voiceId)
                .then(function(response) {
                    $scope.getAllLicenses(); 
                })
                .catch(function(error) {
                    console.error('Error adding voice to license:', error);
                });
        }
    };
    
    $scope.isVoiceAssignedToLicense = function(license, voiceId) {
        return license.voices && license.voices.some(voice => voice.id === voiceId);
    };   
    
    $scope.toggleLanguageAssignment = function(license, languageId) {
        const isAssigned = license.languages && license.languages.some(language => language.id === languageId);
        if (isAssigned) {
            LicenseService.removeLanguageFromLicense(license.id, languageId)
                .then(function(response) {
                    $scope.getAllLicenses(); 
                })
                .catch(function(error) {
                    console.error('Error removing language from license:', error);
                });
        } else {
            LicenseService.addLanguageToLicense(license.id, languageId)
                .then(function(response) {
                    $scope.getAllLicenses(); 
                })
                .catch(function(error) {
                    console.error('Error adding language to license:', error);
                });
        }
    };

    $scope.isLanguageAssignedToLicense = function(license, languageId) {
        return license.languages && license.languages.some(language => language.id === languageId);
    };

    $scope.toggleModuleAssignment = function(license, moduleId) {
        const isAssigned = license.modules && license.modules.some(module => module.id === moduleId);
        if (isAssigned) {
            LicenseService.removeModuleFromLicense(license.id, moduleId)
                .then(function(response) {
                    $scope.getAllLicenses(); 
                })
                .catch(function(error) {
                    console.error('Error removing module from license:', error);
                });
        } else {
            LicenseService.addModuleToLicense(license.id, moduleId)
                .then(function(response) {
                    $scope.getAllLicenses(); 
                })
                .catch(function(error) {
                    console.error('Error adding module to license:', error);
                });
        }
    };

    $scope.isModuleAssignedToLicense = function(license, moduleId) {
        return license.modules && license.modules.some(module => module.id === moduleId);
    };

    $scope.toggleScreenTypeAssignment = function(license, screentypeId) {
        const isAssigned = license.screentypes && license.screentypes.some(screentype => screentype.id === screentypeId);
        if (isAssigned) {
            LicenseService.removeScreenTypeFromLicense(license.id, screentypeId)
                .then(function(response) {
                    $scope.getAllLicenses(); 
                })
                .catch(function(error) {
                    console.error('Error removing screen type from license:', error);
                });
        } else {
            LicenseService.addScreenTypeToLicense(license.id, screentypeId)
                .then(function(response) {
                    $scope.getAllLicenses(); 
                })
                .catch(function(error) {
                    console.error('Error adding screen type to license:', error);
                });
        }
    };

    $scope.isScreenTypeAssignedToLicense = function(license, screentypeId) {
        return license.screentypes && license.screentypes.some(screentype => screentype.id === screentypeId);
    };

    $scope.toggleButtonTypeAssignment = function(license, buttontypeId) {
        const isAssigned = license.buttontypes && license.buttontypes.some(buttontype => buttontype.id === buttontypeId);
        if (isAssigned) {
            LicenseService.removeButtonTypeFromLicense(license.id, buttontypeId)
                .then(function(response) {
                    $scope.getAllLicenses(); 
                })
                .catch(function(error) {
                    console.error('Error removing button type from license:', error);
                });
        } else {
            LicenseService.addButtonTypeToLicense(license.id, buttontypeId)
                .then(function(response) {
                    $scope.getAllLicenses(); 
                })
                .catch(function(error) {
                    console.error('Error adding button type to license:', error);
                });
        }
    };

    $scope.isButtonTypeAssignedToLicense = function(license, buttontypeId) {
        return license.buttontypes && license.buttontypes.some(buttontype => buttontype.id === buttontypeId);
    };

    $scope.getAllLicenses(); 
    $scope.loadAvatars();
    $scope.loadVoices();
    $scope.loadLanguages();
    $scope.loadModules();
    $scope.loadScreenTypes();
    $scope.loadButtonTypes();
}]);
