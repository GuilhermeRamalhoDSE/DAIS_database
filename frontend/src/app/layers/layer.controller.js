angular.module('frontend').controller('LayerController', ['$scope', 'LayerService', 'LicenseService', 'AuthService', '$state', '$stateParams', function($scope, LayerService, LicenseService, AuthService, $state, $stateParams) {
    $scope.layers = [];
    $scope.avatars = [];
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();


    let campaignaiId = parseInt($stateParams.campaignaiId, 10);
    let clientId = parseInt($stateParams.clientId, 10);
    let groupId = parseInt($stateParams.groupId, 10);
    let groupName = $stateParams.groupName;
    let clientName = $stateParams.clientName;
    

    if (isNaN(campaignaiId) || isNaN(clientId) || isNaN(groupId)) {
        alert('Invalid or missing IDs');
        $state.go('base.client-view');
        return;
    }

    $scope.newLayer = {
        campaign_id: campaignaiId,
        avatar_id: null,
        name: "",
        trigger: ""
    };

    $scope.loadLayers = function() {
        LayerService.getLayersByPeriod(campaignaiId).then(function(response) {
            $scope.layerList = response.data;
        }).catch(function(error) {
            console.error('Error loading layers:', error);
        });
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

    $scope.goToCreateLayer = function() {
        $state.go('base.layer-new', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaignaiId: campaignaiId });
    };

    $scope.goToNewChildren = function(layerNumber) {
        $state.go('base.layer-new-children', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaignaiId: campaignaiId,  layerNumber: layerNumber});
    };

    $scope.createLayer = function() {
        LayerService.createLayer($scope.newLayer).then(function(response) {
            alert('Layer created successfully!');
            $scope.loadLayers();
            $state.go('base.layer-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaignaiId: campaignaiId });
        }).catch(function(error) {
            console.error('Error creating layer:', error);
            alert('Error creating layer: Check console for details.');
        });
    };

    $scope.editLayer = function(layerId) {
        $state.go('base.layer-update', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaignaiId: campaignaiId, layerId: layerId });
    };

    $scope.goBack = function() {
        $state.go('base.campaignai-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaignaiId: campaignaiId });
    };

    $scope.cancelCreate = function() {
        $state.go('base.layer-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaignaiId: campaignaiId });
    };

    $scope.goToContribution = function(layerId, layerName) {
        $state.go('base.contributionia-view', {
            clientId: clientId, 
            clientName: clientName, 
            groupId: groupId, 
            groupName: groupName, 
            campaignaiId: campaignaiId,
            layerName: layerName,
            layerId: layerId
        });
    };

    $scope.goToFormation = function(layerId, layerName) {
        $state.go('base.formation-view', {
            clientId: clientId, 
            clientName: clientName, 
            groupId: groupId, 
            groupName: groupName, 
            campaignaiId: campaignaiId,
            layerName: layerName,
            layerId: layerId
        });
    };

    $scope.deleteLayer = function(layerId) {
        if (confirm('Are you sure you want to delete this layer?')) {
            LayerService.deleteLayer(layerId).then(function(response) {
                alert('Layer deleted successfully!');
                $scope.loadLayers(); 
            }).catch(function(error) {
                console.error('Error deleting layer:', error);
                alert('Failed to delete layer: ' + error.data.message);
            });
        }
    };
    
    $scope.isParentZeroPresent = function() {
        if ($scope.layerList && $scope.layerList.length > 0) {
            for (var i = 0; i < $scope.layerList.length; i++) {
                if ($scope.layerList[i].parent === null) {
                    return true; 
                }
            }
        }
        return false; 
    };
    
    $scope.resetForm = function() {
        $scope.newLayer = {
            campaign_id: campaignaiId,
            parent_layer_number: null,
            avatar_id: null,
            name: "",
            trigger: ""
        };
    };

    $scope.loadLayers();
    $scope.loadAvatars();
}]);
