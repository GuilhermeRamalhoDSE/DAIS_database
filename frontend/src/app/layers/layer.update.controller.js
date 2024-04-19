angular.module('frontend').controller('LayerUpdateController', ['$scope', 'LayerService', 'LicenseService', 'AuthService', '$state', '$stateParams', function($scope, LayerService, LicenseService, AuthService, $state, $stateParams) {
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();

    var clientId = $stateParams.clientId;
    var clientName = $stateParams.clientName;
    var groupId = $stateParams.groupId;
    var groupName = $stateParams.groupName;
    var periodiaId = $stateParams.periodiaId;
    var layerId = $stateParams.layerId;
    $scope.layerData = {};
    $scope.avatars = [];

    $scope.loadAvatars = function() {
        return LicenseService.getAvatarsByLicense($scope.licenseId).then(function(response) {
            $scope.avatars = response.data;
        }).catch(function(error) {
            console.error('Error loading avatars:', error);
            alert('Error loading avatars. Check console for details.');
        });
    };

    $scope.loadLayerDetails = function() {
        if (!layerId) {
            console.error('No Layer ID provided.');
            alert('No Layer ID provided.');
            $state.go('base.layer-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, periodiaId: periodiaId });
            return;
        }
        LayerService.getLayerById(layerId).then(function(response) {
            if (response.data) {
                $scope.layerData = response.data;
                $scope.layerData.avatar_id = response.data.avatar.id; 
            } else {
                console.error('Layer not found');
                alert('Layer not found.');
                $state.go('base.layer-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, periodiaId: periodiaId });
            }
        }).catch(function(error) {
            console.error('Error fetching Layer details:', error);
            alert('Error fetching Layer details. Check console for details.');
        });
    };

    $scope.updateLayer = function() {
        var layerDataToUpdate = {
            name: $scope.layerData.name,
            trigger: $scope.layerData.trigger,
            avatar_id: $scope.layerData.avatar_id 
        };

        LayerService.updateLayer(layerId, layerDataToUpdate).then(function(response) {
            alert('Layer updated successfully!');
            $state.go('base.layer-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, periodiaId: periodiaId });
        }).catch(function(error) {
            console.error('Error updating Layer:', error);
            alert('Error updating Layer. Check console for details.');
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.layer-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, periodiaId: periodiaId });
    };

    $scope.loadAvatars().then(function() {
        $scope.loadLayerDetails();
    });
}]);
