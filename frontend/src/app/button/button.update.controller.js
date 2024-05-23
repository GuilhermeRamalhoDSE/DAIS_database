angular.module('frontend').controller('ButtonUpdateController', ['$scope', 'ButtonService','AuthService', 'LicenseService', 'FormService', '$state', '$stateParams', '$q', '$interval', function($scope, ButtonService, AuthService, LicenseService, FormService, $state, $stateParams,$q, $interval) {

    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.clientmoduleId = $stateParams.clientmoduleId;
    $scope.touchscreeninteractionId = $stateParams.touchscreeninteractionId;
    $scope.touchscreeninteractionName = $stateParams.touchscreeninteractionName;
    $scope.buttonId = $stateParams.buttonId;
    $scope.buttonName = $stateParams.buttonName;
    $scope.licenseId = AuthService.getLicenseId();
    
    $scope.buttonData = {};
    $scope.file = null;
    $scope.forms = [];
    $scope.buttonTypes = [];

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

    $scope.loadButtonDetails = function() {
        if(!$scope.buttonId){
            console.log('No button ID provided.');
            alert('No button ID provided.')
            $state.go('base.button-view', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                clientmoduleId: $scope.clientmoduleId,
                touchscreeninteractionId: $scope.touchscreeninteractionId,
                touchscreeninteractionName: $scope.touchscreeninteractionName 
             });
             return;
        }
        ButtonService.getById($scope.buttonId).then(function(response) {
            if (response.data) {
                $scope.buttonData = response.data;
                $scope.buttonData.button_type_id = response.data.button_type.id; 
    
                if ($scope.isFormType()) {
                    $scope.buttonData.form_id = response.data.form ? response.data.form.id : null;
                }
            } else {
                console.error('Button not found');
                alert('Button not found.');
                $state.go('base.button-view', { 
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    clientmoduleId: $scope.clientmoduleId,
                    touchscreeninteractionId: $scope.touchscreeninteractionId,
                    touchscreeninteractionName: $scope.touchscreeninteractionName 
                 });
            }
        }).catch(function(error) {
            console.error('Error fetching button details:', error);
        });
    };

    $scope.updateButton = function() {
        var formData = new FormData();
    
        if ($scope.file) {
            formData.append('file', $scope.file);
        } 
        
        formData.append('button_in', JSON.stringify($scope.buttonData));
    
        $scope.upload($scope.file).then(function(){ 
            ButtonService.update($scope.buttonId, formData).then(function(response) {
                alert('Button updated successfully!');
                $state.go('base.button-view', {
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    clientmoduleId: $scope.clientmoduleId,
                    touchscreeninteractionId: $scope.touchscreeninteractionId,
                    touchscreeninteractionName: $scope.touchscreeninteractionName
                });
            }).catch(function(error) {
                console.error('Error updating button:', error);
                alert('Error updating button!');
            });
        });    
    };
      
    $scope.cancelUpdate = function() {
        $state.go('base.button-view', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: $scope.clientmoduleId,
            touchscreeninteractionId: $scope.touchscreeninteractionId,
            touchscreeninteractionName: $scope.touchscreeninteractionName 
         });
    };

    $scope.isFormType = function() {
        var selectedType = $scope.buttonTypes.find(type => type.id === $scope.buttonData.button_type_id);
        return selectedType && selectedType.name === 'Form';
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

    $scope.loadButtonType();
    $scope.loadForms();
    $scope.loadButtonDetails();
}]);


