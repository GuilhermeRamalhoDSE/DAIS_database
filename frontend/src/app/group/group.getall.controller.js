angular.module('frontend').controller('GroupGetAllController', ['$scope', '$state', 'GroupService', 'AuthService', function($scope, $state, GroupService, AuthService) {
    $scope.groupList = [];

    // Carregar todos os grupos baseando-se no ID da licença.
    $scope.loadAllGroups = function() {
        var licenseId = AuthService.getLicenseId(); 
        if (!licenseId) {
            console.error('License ID is missing');
            return;
        }
        GroupService.getAllByLicense(licenseId).then(function(response) {
            $scope.groupList = response.data;
        }).catch(function(error) {
            console.error('Error fetching all groups:', error);
        });
    };

    $scope.goToTotem = function(group) {
        $state.go('base.totem-view', { clientId: group.client_id, clientName: group.client_name, groupId: group.id, groupName: group.name });
    };

    $scope.detailGroup = function(group) {
        if (group.typology === 'Digital Signage') {
            $state.go('base.periodds-view', { clientId: group.client_id, clientName: group.client_name, groupId: group.id, groupName: group.name });
        } else if (group.typology === 'Artificial Intelligence') {
            $state.go('base.periodia-view', { clientId: group.client_id, clientName: group.client_name, groupId: group.id, groupName: group.name });
        } else {
            alert('Unknown typology');
        }
    };

    $scope.goBack = function() {
        $state.go('base.home');
    };

    $scope.loadAllGroups();
}]);
