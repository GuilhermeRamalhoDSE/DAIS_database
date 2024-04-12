angular.module('frontend').controller('TotemUpdateController', ['$scope', 'TotemService', '$state', '$stateParams', 'AuthService', function($scope, TotemService, $state, $stateParams, AuthService) {
    $scope.isSuperuser = AuthService.isSuperuser();
    
    var clientId = $stateParams.clientId;
    var clientName = $stateParams.clientName;
    var groupId = $stateParams.groupId;
    var groupName = $stateParams.groupName;
    var totemId = $stateParams.totemId;
    $scope.totemData = {};

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

    $scope.loadTotemDetails();
}]);
