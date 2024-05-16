angular.module('frontend').controller('FormationUpdateController', ['$scope', 'FormationService', 'LicenseService', 'AuthService', '$state', '$stateParams', '$q', '$interval', 'Upload', function($scope, FormationService, LicenseService, AuthService, $state, $stateParams, $q, $interval, Upload) {
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.periodiaId = $stateParams.periodiaId;
    $scope.layerName = $stateParams.layerName;
    $scope.layerId = $stateParams.layerId;
    
    $scope.formationId = $stateParams.formationId;
    $scope.formationName = $stateParams.formationName;
    
    $scope.formationData = {};
    $scope.file = null;
    $scope.languages = [];
    $scope.voices = [];

    $scope.loadLanguages = function() {
        if ($scope.licenseId) {
            LicenseService.getLanguagesByLicense($scope.licenseId).then(function(response) {
                $scope.languages = response.data;
            }).catch(function(error) {
                console.error('Error loading languages:', error);
            });
        } else {
            console.error('License ID is undefined');
        }
    }; 

    $scope.loadVoices = function() {
        if ($scope.licenseId) {
            LicenseService.getVoicesByLicense($scope.licenseId).then(function(response) {
                $scope.voices = response.data;
            }).catch(function(error) {
                console.error('Error loading voices:', error);
            });
        } else {
            console.error('License ID is undefined');
        }
    }; 

    $scope.loadFormationDetails = function() {
        if(!$scope.formationId){
            console.log('No formation ID provided.');
            alert('No formation ID provided.')
            $state.go('base.formation-view', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                periodiaId: $scope.periodiaId,
                layerId: $scope.layerId,
                layerName: $scope.layerName,
             });
             return;
        }
        FormationService.getById($scope.formationId).then(function(response) {
            if (response.data) {
                $scope.formationData = response.data;
                $scope.formationData.language_id = response.data.language.id; 
                $scope.formationData.voice_id = response.data.voice.id; 
            } else {
                console.error('formation not found');
                alert('formation not found.');
                $state.go('base.formation-view', { 
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    periodiaId: $scope.periodiaId,
                    layerId: $scope.layerId,
                    layerName: $scope.layerName,
                });
            }
        }).catch(function(error) {
            console.error('Error fetching formation details:', error);
        });
    }; 

    $scope.updateFormation = function() {
        var formData = new FormData();

        if ($scope.file) {
            formData.append('file', $scope.file);
        }

        formData.append('formation_in', JSON.stringify($scope.formationData));

        $scope.upload($scope.file).then(function() {
            FormationService.update($scope.formationId, formData).then(function(response) {
                alert('formation updated successfully!');
                $state.go('base.formation-view', { 
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    periodiaId: $scope.periodiaId,
                    layerId: $scope.layerId,
                    layerName: $scope.layerName,
                });
            }).catch(function(error) {
                console.error('Error updating formation:', error);
            });
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.formation-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            periodiaId: $scope.periodiaId,
            layerId: $scope.layerId,
            layerName: $scope.layerName
        });
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

    $scope.loadFormationDetails();
    $scope.loadLanguages();
    $scope.loadVoices();

}]);
