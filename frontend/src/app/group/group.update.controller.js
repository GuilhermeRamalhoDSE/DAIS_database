angular.module('frontend').controller('GroupUpdateController', ['$scope', 'GroupService', '$state', '$stateParams', 'AuthService', 'LicenseService', function($scope, GroupService, $state, $stateParams, AuthService, LicenseService) {
    $scope.group = {};
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.grouptypes = [];
    $scope.licenseId = AuthService.getLicenseId();

    var clientId = $stateParams.clientId;
    var clientName = $stateParams.clientName;

    $scope.loadGroupType = function() {
        if ($scope.licenseId) {
            LicenseService.getGroupTypeByLicense($scope.licenseId).then(function(response) {
                $scope.grouptypes = response.data;
            }).catch(function(error) {
                console.error('Error loading group type:', error);
            });
        } else {
            console.error('License ID is undefined');
        }
    }; 

    $scope.loadGroupData = function() {
        const groupId = $stateParams.groupId; 
        
        GroupService.getById(groupId).then(function(response) {
            if (response.data) {
                $scope.group = response.data;
                $scope.clientId = response.data.client_id;
                $scope.group.typology_id = response.data.typology.id;
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
                typology_id: $scope.group.typology_id,
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
    $scope.loadGroupType();
}]);
