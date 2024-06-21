angular.module('frontend').controller('GroupTypeController', ['$scope', 'GroupTypeService', '$state', 'AuthService', '$location', function($scope, GroupTypeService, $state, AuthService,$location) {
    $scope.grouptypes = [];
    $scope.newGroupType = {
        name: "",
    };

    $scope.loadGroupTypes = function() {
        GroupTypeService.getAll().then(function(response) {
            $scope.grouptypes = response.data;
        }, function(error) {
            console.error('Error loading grouptypes:', error);
        });
    };

    $scope.goToNewGroupType = function() {
        $state.go('base.grouptype-new');
    };

    $scope.isHomePage = function() {
        return $location.path() === '/home';
    };

    $scope.createGroupType = function() {
        GroupTypeService.create($scope.newGroupType).then(function(response) {
            alert('GroupType created successfully!');
            $state.go('base.grouptype-view'); 
        }).catch(function(error) {
            console.error('Error creating grouptype:', error);
        });
    };

    $scope.editGroupType = function(grouptypeId) {
        $state.go('base.grouptype-update', { grouptypeId: grouptypeId });
    };

    $scope.cancelCreate = function() {
        $state.go('base.grouptype-view');
    };

    $scope.goBack = function() {
        $state.go('base.home');
    };

    $scope.deleteGroupType = function(grouptypeId) {
        if (confirm('Are you sure you want to delete this grouptype?')) {
            GroupTypeService.delete(grouptypeId).then(function(response) {
                alert('GroupType deleted successfully!');
                $scope.loadGroupTypes();
            }).catch(function(error) {
                console.error('Error deleting grouptype:', error);
            });
        }
    };

    $scope.isSuperuser = function() {
        return AuthService.isSuperuser();
    };

    $scope.loadGroupTypes();
}]);
