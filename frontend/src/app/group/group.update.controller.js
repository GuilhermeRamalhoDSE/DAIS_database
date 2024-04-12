angular.module('frontend').controller('GroupUpdateController', ['$scope', 'GroupService', '$state', '$stateParams', 'AuthService', function($scope, GroupService, $state, $stateParams, AuthService) {
    $scope.group = {};
    $scope.isSuperuser = AuthService.isSuperuser();

    var clientId = $stateParams.clientId;
    var clientName = $stateParams.clientName;

    $scope.typologyOptions = [
        {value: 'Artificial Intelligence', label: 'Intelligenza artificiale'},
        {value: 'Digital Signage', label: 'Digital Signage'}
    ];

    $scope.loadGroupData = function() {
        const groupId = $stateParams.groupId; 
        
        GroupService.getById(groupId).then(function(response) {
            if (response.data) {
                $scope.group = response.data;
                $scope.clientId = response.data.client_id;
            } else {
                console.error('Group not found');
                alert('Group not found.');
                $state.go('base.group-view'); 
            }
        }).catch(function(error) {
            console.error('Error fetching group data:', error);
            alert('Error fetching group data.');
        });
    };

    $scope.updateGroup = function() {
        if ($scope.group && $scope.group.id) {
            const payload = {
                name: $scope.group.name,
                typology: $scope.group.typology,
                comments: $scope.group.comments
               
            };
            GroupService.update($scope.group.id, payload).then(function(response) {
                alert('Group updated successfully!');
                $state.go('base.group-view', { clientId: clientId, clientName: clientName });  
            }).catch(function(error) {
                console.error('Error updating group:', error);
                alert('Error updating group.');
            });
        }
    };

    $scope.cancelUpdate = function() {
        $state.go('base.group-view', { clientId: clientId, clientName: clientName }); 
    };

    $scope.loadGroupData();
}]);
