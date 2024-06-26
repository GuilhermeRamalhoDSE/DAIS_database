angular.module('frontend').controller('LayerController', ['$scope', 'LayerService', 'LicenseService', 'AuthService', '$state', '$stateParams', '$filter', function($scope, LayerService, LicenseService, AuthService, $state, $stateParams, $filter) {
    $scope.layers = [];
    $scope.avatars = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.visiblePages = 3;
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();


    let campaignaiId = parseInt($stateParams.campaignaiId, 10);
    let campaignaiName = $stateParams.campaignaiName || sessionStorage.getItem('lastCampaignaiName');
    if (campaignaiName) {
        sessionStorage.setItem('lastClientName', campaignaiName);
    } else {
        campaignaiName = sessionStorage.getItem('lastCampaignaiName');
    }
    $scope.campaignaiName = campaignaiName;

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
        campaignai_id: campaignaiId,
        avatar_id: null,
        name: "",
        trigger: ""
    };

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.layers, $scope.searchText);
        var startIndex = $scope.currentPage * $scope.pageSize;
        var endIndex = Math.min(startIndex + $scope.pageSize, filteredList.length);
        return filteredList.slice(startIndex, endIndex);
    };

    $scope.setCurrentPage = function(page) {
        if (page >= 0 && page < $scope.totalPages()) {
            $scope.currentPage = page;
        }
    };

    $scope.totalPages = function() {
        return Math.ceil($scope.layers.length / $scope.pageSize);
    };

    $scope.getPages = function() {
        var pages = [];
        var total = $scope.totalPages();
        var startPage = Math.max(0, $scope.currentPage - Math.floor($scope.visiblePages / 2));
        var endPage = Math.min(total, startPage + $scope.visiblePages);
    
        if (startPage > 0) {
            pages.push(0);
            if (startPage > 1) {
                pages.push('...');
            }
        }
    
        for (var i = startPage; i < endPage; i++) {
            pages.push(i);
        }
    
        if (endPage < total) {
            if (endPage < total - 1) {
                pages.push('...');
            }
            pages.push(total - 1);
        }
    
        return pages;
    };

    $scope.loadLayers = function() {
        LayerService.getLayersByPeriod(campaignaiId).then(function(response) {
            $scope.layers = response.data;
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
        $state.go('base.layer-new', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaignaiId: campaignaiId, campaignaiName: campaignaiName });
    };

    $scope.goToNewChildren = function(layerNumber) {
        $state.go('base.layer-new-children', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaignaiId: campaignaiId, campaignaiName: campaignaiName, layerNumber: layerNumber});
    };

    $scope.createLayer = function() {
        LayerService.createLayer($scope.newLayer).then(function(response) {
            alert('Layer created successfully!');
            $scope.loadLayers();
            $state.go('base.layer-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaignaiId: campaignaiId, campaignaiName: campaignaiName });
        }).catch(function(error) {
            console.error('Error creating layer:', error);
            alert('Error creating layer: Check console for details.');
        });
    };

    $scope.editLayer = function(layerId) {
        $state.go('base.layer-update', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaignaiId: campaignaiId, campaignaiName: campaignaiName, layerId: layerId });
    };

    $scope.goBack = function() {
        $state.go('base.campaignai-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaignaiId: campaignaiId, campaignaiName: campaignaiName });
    };

    $scope.cancelCreate = function() {
        $state.go('base.layer-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaignaiId: campaignaiId, campaignaiName: campaignaiName });
    };

    $scope.goToContribution = function(layerId, layerName) {
        $state.go('base.contributionai-view', {
            clientId: clientId,
            clientName: clientName,
            groupId: groupId,
            groupName: groupName,
            campaignaiId: campaignaiId,
            campaignaiName: campaignaiName,
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
            campaignaiName: campaignaiName,
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
        if ($scope.layers && $scope.layers.length > 0) {
            for (var i = 0; i < $scope.layers.length; i++) {
                if ($scope.layers[i].parent === null) {
                    return true; 
                }
            }
        }
        return false; 
    };
    
    $scope.resetForm = function() {
        $scope.newLayer = {
            campaignai_id: campaignaiId,
            parent_layer_number: null,
            avatar_id: null,
            name: "",
            trigger: ""
        };
    };

    $scope.loadLayers();
    $scope.loadAvatars();
}]);
