angular.module('frontend').controller('NewChildrenLayerController', [
    '$scope', 'LayerService', 'LicenseService', 'AuthService', '$state', '$stateParams', 
    function($scope, LayerService, LicenseService, AuthService, $state, $stateParams) {
    let layerNumber = parseInt($stateParams.layerNumber, 10);
    let campaignaiId = parseInt($stateParams.campaignaiId, 10);
    var campaignaiName = $stateParams.campaignaiName;
    let clientId = parseInt($stateParams.clientId, 10);
    let groupId = parseInt($stateParams.groupId, 10);
    let groupName = $stateParams.groupName;
    let clientName = $stateParams.clientName;
    $scope.licenseId = AuthService.getLicenseId();

    if (isNaN(layerNumber)) {
        alert('Invalid Layer Number');
        $state.go('base.layer-view');
        return;
    }

    $scope.newLayerChildren = {
        campaignai_id: campaignaiId,
        parent_layer_number: layerNumber,
        avatar_id: null,
        name: "",
        trigger: ""
    };

    $scope.loadAvatars = function() {
        if ($scope.licenseId) {
            LicenseService.getAvatarsByLicense($scope.licenseId).then(function(response) {
                $scope.avatars = response.data;
            }).catch(function(error) {
                console.error('Error loading avatars:', error);
            });
        } else {
            console.error('License ID is undefined');
        }
    };    

    $scope.createNewChildren = function() {
        if (!$scope.newLayerChildren.parent_layer_number) {
            alert('Parent layer number is required.');
            return;
        }

        LayerService.createLayer($scope.newLayerChildren).then(function(response) {
            alert('Child layer created successfully!');
            $state.go('base.layer-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaignaiId: campaignaiId, campaignaiName: campaignaiName });
        }).catch(function(error) {
            console.error('Error creating child layer:', error);
            alert('Error creating child layer: Check console for details.');
        });
    };

    $scope.cancelCreate = function() {
        $state.go('base.layer-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaignaiId: campaignaiId, campaignaiName: campaignaiName });
    };

    $scope.resetForm = function() {
        $scope.newLayerChildren = {
            campaignai_id: campaignaiId,
            parent_layer_number: layerNumber,
            avatar_id: null,
            name: "",
            trigger: ""
        };
    };

    $scope.loadAvatars();
}]);
