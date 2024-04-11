angular.module('frontend').controller('GroupController', ['$scope', 'GroupService', '$state', '$stateParams', 'AuthService', function($scope, GroupService, $state, $stateParams, AuthService) {
    $scope.groupList = [];
    $scope.isSuperuser = AuthService.isSuperuser();

    $scope.newGroup = {
        name: "",
        typology: "",
        comments: "",
        license_id: AuthService.getLicenseId()
    };

    $scope.loadGroups = function() {
        GroupService.getAll().then(function(response) {
            $scope.groupList = response.data;
        }).catch(function(error) {
            console.error('Error fetching groups:', error);
        });
    };

    $scope.goToCreateGroup = function() {
        $state.go('base.group-new'); 
    };

    $scope.createGroup = function() {
        GroupService.create($scope.newGroup).then(function(response) {
            alert('Group created successfully!');
            $scope.loadGroups();
            $state.go('base.group-view'); 
        }).catch(function(error) {
            alert('Error creating group:', error.data);
        });
    };

    $scope.editGroup = function(groupId) {
        $state.go('base.group-update', { groupId: groupId }); 
    };

    $scope.deleteGroup = function(groupId) {
        var isConfirmed = confirm('Are you sure you want to delete this group?');
        if (isConfirmed) {
            GroupService.delete(groupId).then(function(response) {
                alert('Group deleted successfully!');
                $scope.loadGroups();
            }).catch(function(error) {
                console.error('Error deleting group:', error);
            });
        }
    };

    $scope.detailGroup = function(groupId) {
        $state.go('base.group-detail', { groupId: groupId }); 
    };

    $scope.cancelCreate = function() {
        $state.go('base.group-view'); 
    };

    $scope.resetForm = function() {
        $scope.newGroup = {
            name: "",
            typology: "",
            comments: "",
        };
    };

    $scope.loadGroups();
}]);
