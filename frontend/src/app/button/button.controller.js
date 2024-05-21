angular.module('frontend').controller('ButtonController', ['$scope', 'ButtonService', 'AuthService', 'LicenseService', '$state', '$stateParams', '$http', function($scope, ButtonService, AuthService, LicenseService, $state, $stateParams, $http) {
    $scope.buttonList = [];

    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.clientmoduleId = $stateParams.clientmoduleId;
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();
 
    let touchscreeninteractionId = parseInt($stateParams.touchscreeninteractionId || sessionStorage.getItem('lasttouchscreeninteractionId'), 10);
    sessionStorage.setItem('lasttouchscreeninteractionId', touchscreeninteractionId.toString());

    let touchscreeninteractionName = $stateParams.touchscreeninteractionName || sessionStorage.getItem('lasttouchscreeninteractionName');
    sessionStorage.setItem('lasttouchscreeninteractionName', touchscreeninteractionName);
    $scope.touchscreeninteractionName = touchscreeninteractionName;

    $scope.newButton = {
        interaction_id: touchscreeninteractionId,
        name: '',
        button_type_id: null,
    };

    $scope.loadButtons = function() {
        ButtonService.getAll(touchscreeninteractionId).then(function(response) {
            $scope.buttonList = response.data;
        }).catch(function(error) {
            console.error('Error loading fields:', error);
        });
    };

    $scope.loadButtonType = function() {
        if ($scope.licenseId) {
            LicenseService.getButtonTypeByLicense($scope.licenseId).then(function(response) {
                $scope.buttonTypes = response.data;
            }).catch(function(error) {
                console.error('Error loading button types:', error);
            });
        } else {
            console.error('License ID is undefined');
        }
    }; 

    $scope.goToCreateButton = function() {
        $state.go('base.button-new', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: $scope.clientmoduleId,
            touchscreeninteractionId: touchscreeninteractionId,
            touchscreeninteractionName: touchscreeninteractionName 
        });
    };

    $scope.createButton = function() {
        if (!$scope.newButton.name || !$scope.newButton.field_type) {
            alert('Please fill in all required fields.');
            return;
        }
    
        if ($scope.newButton.field_type === 'Video' || $scope.newButton.field_type === 'Slideshow') {
            if (!$scope.newButton.file) {
                alert('A file is required for video or slideshows.');
                return;
            }
        } else if ($scope.newButton.field_type === 'Web page') {
            if (!$scope.newButton.url) {
                alert('A URL is required for web page type.');
                return;
            }
        } else if ($scope.newButton.field_type === 'Form') {
            if (!$scope.newButton.form) {
                alert('A form is necessary for the FORM type.');
                return;
            }
        }
    
        ButtonService.create($scope.newButton).then(function(response) {
            alert('Field created successfully!');
            $scope.loadButtons();
            $state.go('base.button-view', {
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                clientmoduleId: $scope.clientmoduleId,
                touchscreeninteractionId: touchscreeninteractionId,
                touchscreeninteractionName: touchscreeninteractionName
            });
        }).catch(function(error) {
            console.error('Error creating field:', error);
        });
    };    

    $scope.editButton = function(buttonId, buttonName) {
        $state.go('base.button-update', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: $scope.clientmoduleId,
            touchscreeninteractionId: touchscreeninteractionId,
            touchscreeninteractionName: touchscreeninteractionName,
            buttonId: buttonId,
            buttonName: buttonName
        });
    };

    $scope.deleteButton = function(buttonId) {
        var isConfirmed = confirm('Are you sure you want to delete this field?');
        if (isConfirmed) {
            ButtonService.delete(buttonId).then(function(response) {
                alert('Field deleted successfully!');
                $scope.loadButtons();
                $state.go('base.button-view', {
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    clientmoduleId: $scope.clientmoduleId,
                    touchscreeninteractionId: touchscreeninteractionId,
                    touchscreeninteractionName: touchscreeninteractionName 
                });
            }).catch(function(error) {
                console.error('Error deleting field:', error);
            });
        }
    };

    $scope.cancelCreate = function() {
        $state.go('base.button-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: $scope.clientmoduleId,
            touchscreeninteractionId: touchscreeninteractionId,
            touchscreeninteractionName: touchscreeninteractionName 
        });
    };

    $scope.goBack = function() {
        $state.go('base.touchscreeninteraction-view',{
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: $scope.clientmoduleId
        });
    };

    $scope.isDownloadable = function(button) {
        return button.button_type.name === 'Video' || button.button_type.name === 'Slideshow';
    };
    
    $scope.isURL = function(button) {
        return button.button_type.name === 'Web page';
    };
    
    $scope.isForm = function(button) {
        return button.button_type.name === 'Form';
    };
    

    $scope.redirectToURL = function(url) {
        window.open(url, '_blank');
    };    

    $scope.redirectToModule = function(button) {
        let route = "";
        switch(button.button_type.name) {
            case 'Form':
                route = 'base.formfield-view';
                break;
            case 'Touch Screen Interaction':
                route = 'base.touchscreeninteraction-view';
                break;
            default:
                console.error('Unknown module type');
                return;
        }
        
        $state.go(route, {
            clientId: $stateParams.clientId,
            clientName: $stateParams.clientName,
            clientmoduleId: $stateParams.clientmoduleId,
            formId: button.form.id,
            formName: button.form.name,
        });
    };

    $scope.downloadFile = function(buttonId) {
        if (buttonId) {
            var downloadUrl = 'http://127.0.0.1:8000/api/buttons/download/' + buttonId;
            
            $http({
                url: downloadUrl,
                method: 'GET',
                responseType: 'blob', 
            }).then(function (response) {
                var blob = new Blob([response.data], {type: response.headers('Content-Type')});
                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href', window.URL.createObjectURL(blob));
                downloadLink.attr('download', 'ButtonFile-' + buttonId );  
                downloadLink[0].click();
            }).catch(function (error) {
                console.error("Download failed: ", error);
            });
        } else {
            console.error("Download failed: Button ID is invalid.");
        }
    };
    
    $scope.upload = function(file) {
        var deferred = $q.defer(); 
    
        $scope.showProgress = true;
        $scope.loadingProgress = 0;
    
        var progressInterval = $interval(function() {
            $scope.loadingProgress += 10; 
            if ($scope.loadingProgress >= 100) {
                $interval.cancel(progressInterval); 
                deferred.resolve(); 
            }
        }, 500); 
    
        return deferred.promise; 
    };  
    
    $scope.loadButtons();
    $scope.loadButtonType();
}])