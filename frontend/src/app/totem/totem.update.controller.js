angular.module('frontend').controller('TotemUpdateController', ['$scope', 'TotemService', '$state', '$stateParams', 'AuthService', 'GroupService', function($scope, TotemService, $state, $stateParams, AuthService, GroupService) {
    $scope.isSuperuser = AuthService.isSuperuser();
    
    var clientId = $stateParams.clientId;
    var clientName = $stateParams.clientName;
    var groupId = $stateParams.groupId;
    var groupName = $stateParams.groupName;
    var totemId = $stateParams.totemId;
    $scope.totemData = {};
    $scope.groups = [];

    $scope.loadTotemDetails = function() {
        if (!totemId) {
            console.error('No totem ID provided.');
            alert('No totem ID provided.');
            $state.go('base.totem-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
            return;
        }
        TotemService.getById(totemId).then(function(response) {
            if (response.data) {
                $scope.totemData = response.data;

                ['installation_date'].forEach(function(dateField) {
                    if ($scope.totemData[dateField]) {
                        $scope.totemData[dateField] = new Date($scope.totemData[dateField]);
                    }
                });

            } else {
                console.error('Totem not found');
                alert('Totem not found.');
                $state.go('base.totem-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
            }
        }).catch(function(error) {
            console.error('Error fetching totem details:', error);
            alert('Error fetching totem details: Check console for details.');
        });
    };

    $scope.loadGroups = function() {
        GroupService.getAllByClient(clientId).then(function(response) {
            $scope.groups = response.data;
        }).catch(function(error) {
            console.error('Error loading groups:', error);
        });
    };

    $scope.updateTotem = function() {
        var totemDataToUpdate = angular.copy($scope.totemData);
        
        ['installation_date'].forEach(function(dateField) {
            if (totemDataToUpdate[dateField]) {
                totemDataToUpdate[dateField] = moment(totemDataToUpdate[dateField]).format('YYYY-MM-DD');
            }
        });

        TotemService.updateTotem(totemId, totemDataToUpdate).then(function(response) {
            alert('Totem updated successfully!');
            $state.go('base.totem-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
        }).catch(function(error) {
            console.error('Error updating totem:', error);
            alert('Error updating totem: Check console for details.');
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.totem-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
    };

    $scope.isGroupDigitalSignage = function() {
        if ($scope.totemData.group_id && $scope.groups.length > 0) {
            var selectedGroup = $scope.groups.find(function(group) {
                return group.id === $scope.totemData.group_id;
            });
            return selectedGroup && selectedGroup.typology === "Digital Signage";
        }
        return false;
    };
    
    $scope.loadTotemDetails();
    $scope.loadGroups();
}]);
