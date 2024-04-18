angular.module('frontend').controller('LayerController', ['$scope', 'LayerService', 'AuthService', '$state', '$stateParams', function($scope, LayerService, AuthService, $state, $stateParams) {
    $scope.layers = [];
    $scope.isSuperuser = AuthService.isSuperuser();

    // Extrair parâmetros da URL
    let periodiaId = parseInt($stateParams.periodiaId, 10);
    let clientId = parseInt($stateParams.clientId, 10);
    let groupId = parseInt($stateParams.groupId, 10);
    let groupName = $stateParams.groupName;
    let clientName = $stateParams.clientName;

    if (isNaN(periodiaId) || isNaN(clientId) || isNaN(groupId)) {
        alert('Invalid or missing IDs');
        $state.go('base.client-view');
        return;
    }

    $scope.newLayer = {
        period_id: periodiaId,
        parent_layer_number: null,
        avatar_id: null,
        name: "",
        trigger: ""
    };

    $scope.loadLayers = function() {
        LayerService.getLayersByPeriod(periodiaId).then(function(response) {
            $scope.layerList = response.data;
        }).catch(function(error) {
            console.error('Error loading layers:', error);
        });
    };

    $scope.goToCreateLayer = function() {
        $state.go('base.layer-new', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, periodiaId: periodiaId });
    };

    $scope.createLayer = function() {
        LayerService.createLayer($scope.newLayer).then(function(response) {
            alert('Layer created successfully!');
            $scope.loadLayers();
            $state.go('base.layer-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, periodiaId: periodiaId });
        }).catch(function(error) {
            console.error('Error creating layer:', error);
            alert('Error creating layer: Check console for details.');
        });
    };

    $scope.editLayer = function(layerId) {
        $state.go('base.layer-update', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, periodiaId: periodiaId, layerId: layerId });
    };

    $scope.goBack = function() {
        $state.go('base.periodia-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, periodiaId: periodiaId });
    };

    $scope.resetForm = function() {
        $scope.newLayer = {
            period_id: periodiaId,
            parent_layer_number: null,
            avatar_id: null,
            name: "",
            trigger: ""
        };
    };

    $scope.loadLayers();
}]);
