angular.module('frontend').controller('FormController', ['$scope', 'FormService', 'AuthService', '$state', '$stateParams', '$http', function($scope, FormationService, AuthService, $state, $stateParams, $http) {
    $scope.formList = [];

    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.isSuperuser = AuthService.isSuperuser();
 
    let clientmoduleId = parseInt($stateParams.clientmoduleId || sessionStorage.getItem('lastClientModuleId'), 10);
    sessionStorage.setItem('lastClientModuleId', clientmoduleId.toString());

    $scope.newForm = {
        client_module_id: clientmoduleId,
        name: '',

    };

    $scope.loadForms = function() {
        FormationService.getAll(clientmoduleId).then(function(response) {
            $scope.formList = response.data;
        }).catch(function(error) {
            console.error('Error loading forms:', error);
        });
    };



    $scope.goToCreateForm = function() {
        $state.go('base.form-new', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: clientmoduleId });
    };

    $scope.createForm = function() {
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
            var downloadUrl = 'http://localhost:8000/api/formations/download/' + formationId;
    
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