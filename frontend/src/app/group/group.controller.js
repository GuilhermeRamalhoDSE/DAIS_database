angular.module('frontend').controller('GroupController', ['$scope', 'GroupService', '$state', '$stateParams', 'AuthService', function($scope, GroupService, $state, $stateParams, AuthService) {
    $scope.groupList = [];
    $scope.isSuperuser = AuthService.isSuperuser();

    let clientId = parseInt($stateParams.clientId || sessionStorage.getItem('lastclientId'), 10);
    if (isNaN(clientId)) {
        console.error('Invalid clientId');
        return;
    }
    sessionStorage.setItem('lastclientId', clientId.toString());

    let clientName = $stateParams.clientName || sessionStorage.getItem('lastclientName');
    if (clientName) {
        sessionStorage.setItem('lastclientName', clientName);
    } else {
        clientName = sessionStorage.getItem('lastclientName');
    }
    $scope.clientName = clientName;

    $scope.newGroup = {
        name: "",
        typology: "",
        comments: "",
        client_id: clientId, 
    };

    $scope.loadGroups = function() {
        if (!clientId) {
            console.error('Client ID is missing');
            return;
        }
        GroupService.getAll(clientId).then(function(response) {
            $scope.groupList = response.data;
        }).catch(function(error) {
            console.error('Error fetching groups:', error);
        });
    };

    $scope.goToCreateGroup = function() {
        $state.go('base.group-new', { clientId: clientId, clientName: clientName }); 
    };

    $scope.createGroup = function() {
        GroupService.create($scope.newGroup).then(function(response) {
            alert('Group created successfully!');
            $scope.loadGroups();
            $state.go('base.group-view', { clientId: clientId, clientName: clientName }); 
        }).catch(function(error) {
            alert('Error creating group:', error.data);
        });
    };

    $scope.editGroup = function(groupId, groupName) {
        $state.go('base.group-update', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName }); 
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

    $scope.goToTotem = function(groupId, groupName) {
        $state.go('base.totem-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName }); 
    };

    $scope.cancelCreate = function() {
        $state.go('base.group-view', { clientId: clientId, clientName: clientName }); 
    };

    $scope.resetForm = function() {
        $scope.newGroup = {
            name: "",
            typology: "",
            comments: "",
            client_id: clientId
        };
    };

    $scope.loadGroups();
}]);