angular.module('frontend').controller('FormationUpdateController', ['$scope', 'FormationService', 'LicenseService', 'AuthService', '$state', '$stateParams', '$http', '$q', '$interval', 'Upload', function($scope, FormationService, LicenseService, AuthService, $state, $stateParams, $http, $q, $interval, Upload) {
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.campaignaiId = $stateParams.campaignaiId;
    $scope.campaignaiName = $stateParams.campaignaiName;
    $scope.layerName = $stateParams.layerName;
    $scope.layerId = $stateParams.layerId;
    
    $scope.formationId = $stateParams.formationId;
    $scope.formationName = $stateParams.formationName;
    
    $scope.formationData = {};
    $scope.file = null;
    $scope.languages = [];
    $scope.voices = [];
    $scope.inputType = 'file';
    $scope.textInput = '';

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
                campaignaiId: $scope.campaignaiId,
                campaignaiName: $scope.campaignaiName,
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

                if (response.data.file_path) {
                    $scope.loadFileContent(response.data.file_path);
                }
            } else {
                console.error('Formation not found');
                alert('Formation not found.');
                $state.go('base.formation-view', { 
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    campaignaiId: $scope.campaignaiId,
                    campaignaiName: $scope.campaignaiName,
                    layerId: $scope.layerId,
                    layerName: $scope.layerName,
                });
            }
        }).catch(function(error) {
            console.error('Error fetching formation details:', error);
        });
    }; 

    $scope.loadFileContent = function(filePath) {
        $http.get('http://127.0.0.1:8000/' + filePath).then(function(response) {
            $scope.textInput = response.data;
            $scope.inputType = 'text';
        }).catch(function(error) {
            console.error('Error loading file content:', error);
        });
    };

    $scope.generateTextFile = function(textInput) {
        if (!textInput) {
            alert("Please enter text to generate the file.");
            return;
        }

        var blob = new Blob([textInput], { type: 'text/plain' });
        var fileName = "textFile_" + Date.now() + ".txt";
        var file = new File([blob], fileName, { type: 'text/plain' });

        $scope.file = file;

        alert("Text file generated and ready for upload.");
    };

    $scope.updateFormation = function() {
        var formData = new FormData();

        if ($scope.file) {
            formData.append('file', $scope.file);
        }

        formData.append('formation_in', JSON.stringify($scope.formationData));

        $scope.upload($scope.file).then(function() {
            FormationService.update($scope.formationId, formData).then(function(response) {
                alert('Formation updated successfully!');
                $state.go('base.formation-view', { 
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    campaignaiId: $scope.campaignaiId,
                    campaignaiName: $scope.campaignaiName,
                    layerId: $scope.layerId,
                    layerName: $scope.layerName,
                });
            }).catch(function(error) {
                console.error('Error updating formation:', error);
            });
        });
    };

    $scope.fileChanged = function(element) {
        $scope.file = element.files[0];
    };

    $scope.cancelUpdate = function() {
        $state.go('base.formation-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            campaignaiId: $scope.campaignaiId,
            campaignaiName: $scope.campaignaiName,
            layerId: $scope.layerId,
            layerName: $scope.layerName
        });
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

    $scope.loadFormationDetails();
    $scope.loadLanguages();
    $scope.loadVoices();

}]);