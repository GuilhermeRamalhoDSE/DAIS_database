angular.module('frontend').controller('TotemController', ['$scope', 'TotemService', 'AuthService', '$state', '$stateParams', function($scope, TotemService, AuthService, $state, $stateParams) {
    $scope.totems = [];
    $scope.isSuperuser = AuthService.isSuperuser(); 

    let groupId = parseInt($stateParams.groupId || sessionStorage.getItem('lastgroupId'), 10);
    sessionStorage.setItem('lastgroupId', groupId.toString());

    let groupName = $stateParams.groupName || sessionStorage.getItem('lastGroupName');
    if (groupName) {
        sessionStorage.setItem('lastGroupName', groupName);
    } else {
        groupName = sessionStorage.getItem('lastGroupName');
    }
    $scope.groupName = groupName;

    let clientId = parseInt($stateParams.clientId || sessionStorage.getItem('lastClientId'), 10);
    sessionStorage.setItem('lastClientId', clientId.toString());

    if (isNaN(clientId)) {
        alert('Invalid or missing clientId');
        $state.go('base.client-view');
    }

    let clientName = $stateParams.clientName || sessionStorage.getItem('lastClientName');
    if (clientName) {
        sessionStorage.setItem('lastClientName', clientName);
    } else {
        clientName = sessionStorage.getItem('lastClientName');
    }
    $scope.clientName = clientName;

    $scope.loadClients = function() {
        ClientService.getClients().then(function(response) {
            $scope.clients = response.data;
        }).catch(function(error) {
            console.error('Error loading clients:', error);
        });
    };

    $scope.newTotem = {
        name: "",
        group_id: groupId,
        installation_date: "",
        active: true,
        comments: ""
    };

    $scope.loadTotems = function() {
        if (!groupId) {
            return;
        }
        TotemService.getAll(groupId).then(function(response) {
            $scope.totemList = response.data;
        }).catch(function(error) {
            console.error('Error loading totems:', error);
        });
    };

    $scope.goToCreateTotem = function() {
        if (clientId && groupId) {
            $state.go('base.totem-new', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
        } else {
            $state.go('base.group-view', { clientId: clientId });
        }
    };

    $scope.createTotem = function() {
        if(!groupId){
            return;
        }

        var totemData = angular.copy($scope.newTotem);
        
        if (totemData.installation_date) {
            totemData.installation_date = moment(totemData.installation_date, "DD/MM/YYYY").format('YYYY-MM-DD');
        }

    
        TotemService.createTotem(totemData).then(function(response) {
            alert('Totem created successfully!');
            $scope.loadTotems();
            $state.go('base.totem-view', {clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName});
        }).catch(function(error) {
            console.error('Error creating totem:', error);
            alert('Error creating totem: Check console for details.');
        });
    };

    $scope.cancelCreate = function(){
        $state.go('base.totem-view', {clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName});
    }

    $scope.editTotem = function(totemId) {
        $state.go('base.totem-update', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, totemId: totemId});
    };

    $scope.goBack = function() {
        $state.go('base.group-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
    };

    $scope.goToLogs = function(totemId, totemName) {
        $state.go('base.logs-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, totemId: totemId, totemName: totemName });
    };

    $scope.deleteTotem = function(totemId) {
        if (!totemId) {
            return;
        }
        if (confirm('Are you sure you want to delete this totem?')) {
            TotemService.deleteTotem(totemId).then(function(response) {
                alert('Totem successfully deleted!');
                $scope.loadTotems();
            }).catch(function(error) {
                console.error('Error deleting totem:', error);
                alert('Error deleting totem: Check console for details.');
            });
        }
    };

    $scope.resetForm = function() {
        $scope.newTotem = {
            name: "",
            group_id: groupId,
            installation_date: "",
            active: true,
            comments: ""
        };
    };

    $scope.loadTotems();
}]);
