angular.module('frontend').controller('FormationController', ['$scope', 'FormationService', 'LicenseService', 'AuthService', '$state', '$stateParams', '$http', function($scope, FormationService, LicenseService, AuthService, $state, $stateParams, $http) {
    $scope.formationList = [];
    $scope.file = null;

    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.periodiaId = $stateParams.periodiaId;
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();
    $scope.languages = [];
    $scope.voices = [];

    let layerId = parseInt($stateParams.layerId || sessionStorage.getItem('lastLayerId'), 10);
    sessionStorage.setItem('lastLayerId', layerId.toString());

    let layerName = $stateParams.layerName || sessionStorage.getItem('lastLayerName');
    sessionStorage.setItem('lastLayerName', layerName);
    $scope.layerName = layerName;

    $scope.newFormation = {
        layer_id: layerId,
        name: '',
        trigger: '',
        language_id: null,
        voice_id: null
    };

    $scope.loadFormations = function() {
        FormationService.getAll(layerId).then(function(response) {
            $scope.formationList = response.data;
        }).catch(function(error) {
            console.error('Error loading formations:', error);
        });
    };

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

    $scope.goToCreateFormation = function() {
        $state.go('base.formation-new', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            periodiaId: $scope.periodiaId, 
            layerId: layerId,
            layerName: layerName });
    };

    $scope.createFormation = function() {
        if (!layerId || !$scope.file) {
            return;
        }

        var formData = new FormData();
        formData.append('file', $scope.file);

        var formationData = { ...$scope.newFormation };
        formData.append('formation_in', JSON.stringify(formationData));

        FormationService.create(formData).then(function(response) {
            alert('Formation created successfully!');
            $scope.loadFormations();
            $state.go('base.formation-view',{
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                periodiaId: $scope.periodiaId, 
                layerId: layerId,
                layerName: layerName });
        }).catch(function(error) {
            console.error('Error creating formation:', error);
        });
    };

    $scope.editFormation = function(formationId, formationName) {
        $state.go('base.formation-update', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            periodiaId: $scope.periodiaId, 
            layerId: layerId,
            layerName: layerName,
            formationId: formationId,
            formationName: formationName,
        });
    };

    $scope.deleteFormation = function(formationId) {
        var isConfirmed = confirm('Are you sure you want to delete this formation?');
        if (isConfirmed) {
            FormationService.delete(formationId).then(function(response) {
                alert('formationId deleted successfully!');
                $scope.loadFormations();
                $state.go('base.formation-view', {
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    periodiaId: $scope.periodiaId, 
                    layerId: layerId,
                    layerName: layerName
                });
            }).catch(function(error) {
                console.error('Error deleting formation:', error);
            });
        }
    };

    $scope.downloadFile = function(formationId) {
        if (formationId) {
            var downloadUrl = 'http://127.0.0.1:8080/api/formations/download/' + formationId;
    
            $http({
                url: downloadUrl,
                method: 'GET',
                responseType: 'blob',
            }).then(function(response) {
                var blob = new Blob([response.data], { type: response.headers('Content-Type') });
                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href', window.URL.createObjectURL(blob));
                downloadLink.attr('download', 'formationFile-' + formationId);
    
                document.body.appendChild(downloadLink[0]);
                downloadLink[0].click();
                document.body.removeChild(downloadLink[0]);
            }).catch(function(error) {
                console.error('Error downloading file:', error);
            });
        } else {
            alert('Invalid formation ID');
        }
    };

    $scope.cancelCreate = function() {
        $state.go('base.formation-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            periodiaId: $scope.periodiaId,
            layerId: layerId,
            layerName: layerName
        });
    };

    $scope.goBack = function() {
        $state.go('base.layer-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            periodiaId: $scope.periodiaId,
            layerId: layerId,
            layerName: layerName
        });
    };
    
    $scope.loadLanguages();
    $scope.loadVoices();
    $scope.loadFormations();
}])