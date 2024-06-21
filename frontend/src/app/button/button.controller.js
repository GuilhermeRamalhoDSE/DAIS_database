angular.module('frontend').controller('ButtonController', ['$scope', 'ButtonService', 'AuthService', 'LicenseService', 'FormService', '$state', '$stateParams', '$q', '$interval', '$window', function($scope, ButtonService, AuthService, LicenseService, FormService, $state, $stateParams, $q, $interval, $window) {
    $scope.buttonList = [];
    $scope.forms = [];
    $scope.buttonTypes = [];
    
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
        url: '',
        form_id: null,
        file: null
    };

    $scope.loadButtons = function() {
        ButtonService.getAll(touchscreeninteractionId).then(function(response) {
            $scope.buttonList = response.data;
        }).catch(function(error) {
            console.error('Error loading buttons:', error);
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

    $scope.loadForms = function() {
        FormService.getAllByClientId($scope.clientId).then(function(response) {
            $scope.forms = response.data;
        }).catch(function(error) {
            alert('Error fetching forms:', error);
        });
    };

    $scope.createButton = function() {
        if (!$scope.newButton.name || !$scope.newButton.button_type_id) {
            alert('Please fill in all required fields.');
            return;
        }

        if ($scope.isFileType() && !$scope.newButton.file) {
            alert('A file is required for video or slideshows.');
            return;
        } else if ($scope.isURLType() && !$scope.newButton.url) {
            alert('A URL is required for web page type.');
            return;
        } else if ($scope.isFormType() && !$scope.newButton.form_id) {
            alert('A form is necessary for the FORM type.');
            return;
        }

        var buttonData = new FormData();
        var buttonIn = JSON.stringify({
            interaction_id: $scope.newButton.interaction_id,
            name: $scope.newButton.name,
            button_type_id: $scope.newButton.button_type_id,
            url: $scope.newButton.url,
            form_id: $scope.newButton.form_id,
            file_path: $scope.newButton.file ? $scope.newButton.file.name : null
        });

        buttonData.append('button_in', buttonIn);

        if ($scope.newButton.file) {
            buttonData.append('file', $scope.newButton.file);
        }

        $scope.upload().then(function() {
            ButtonService.create(buttonData).then(function(response) {
                alert('Button created successfully!');
                $scope.loadButtons();
                $state.go('base.button-view', {
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    clientmoduleId: $scope.clientmoduleId,
                    touchscreeninteractionId: touchscreeninteractionId,
                    touchscreeninteractionName: touchscreeninteractionName
                });
            }).catch(function(error) {
                alert('Error creating button:', error);
            });
        });
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

    $scope.isFileType = function() {
        var selectedType = $scope.buttonTypes.find(type => type.id === $scope.newButton.button_type_id);
        return selectedType && (selectedType.name === 'Video' || selectedType.name === 'Slideshow');
    };

    $scope.isURLType = function() {
        var selectedType = $scope.buttonTypes.find(type => type.id === $scope.newButton.button_type_id);
        return selectedType && selectedType.name === 'Web Page';
    };

    $scope.isFormType = function() {
        var selectedType = $scope.buttonTypes.find(type => type.id === $scope.newButton.button_type_id);
        return selectedType && selectedType.name === 'Form';
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

    $scope.goBack = function() {
        $state.go('base.touchscreeninteraction-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: $scope.clientmoduleId
        });
    };

    $scope.isDownloadable = function(button) {
        return button.button_type.name === 'Video' || button.button_type.name === 'Slideshow';
    };

    $scope.isURL = function(button) {
        return button.button_type.name === 'Web Page';
    };

    $scope.isForm = function(button) {
        return button.button_type.name === 'Form';
    };

    $scope.redirectToURL = function(url) {
        window.open(url, '_blank');
    };

    $scope.redirectToModule = function(button) {
        let route = "";
        switch (button.button_type.name) {
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
        sessionStorage.setItem('previousState', $state.current.name);
        $state.go(route, {
            clientId: $stateParams.clientId,
            clientName: $stateParams.clientName,
            clientmoduleId: $stateParams.clientmoduleId,
            formId: button.form.id,
            formName: button.form.name,
        });
    };

    $scope.uploadFile = function(buttonId, buttonName, buttontypeId, file) {
        var buttonData = new FormData();
        buttonData.append('file', file);

        const payload = {
            interaction_id: touchscreeninteractionId,
            name: buttonName,
            button_type_id: buttontypeId,
        };
        
        buttonData.append('button_in', JSON.stringify(payload));

        $scope.upload().then(function() {
            ButtonService.update(buttonId, buttonData).then(function(response) {
                alert('Button file uploaded successfully!');
                $scope.loadButtons();
                $window.location.reload();
            }).catch(function(error) {
                console.error('Error uploading button file:', error);
            });
        });
    };

    $scope.triggerFileInput = function(buttonId, buttonName, buttontypeId) {
        var fileInput = document.getElementById('fileInput' + buttonId);
        fileInput.click();

        fileInput.onchange = function(event) {
            var file = event.target.files[0];
            $scope.uploadFile(buttonId, buttonName, buttontypeId, file);
        };
    };

    $scope.viewFile = function(filePath) {
        if (filePath) {
            window.open('http://127.0.0.1:8000/' + filePath, '_blank');
        } else {
            alert('File path not available.');
        }
    };

    $scope.upload = function() {
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
    $scope.loadForms();
}]);
