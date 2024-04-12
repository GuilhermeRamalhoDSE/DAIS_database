angular.module('frontend').controller('TotemController', ['$scope', 'TotemService', 'ClientService', 'GroupService', 'AuthService', '$state', '$stateParams', function($scope, TotemService, ClientService, GroupService, AuthService, $state, $stateParams) {
    $scope.totems = [];
    $scope.clients = [];
    $scope.groups = [];
    $scope.isSuperuser = AuthService.isSuperuser(); 
    $scope.isStaff = AuthService.isStaff();

    let clientId = $stateParams.clientId;
    let clientName = $stateParams.clientName;
    let groupId = $stateParams.groupId;
    let groupName = $stateParams.groupName;

    $scope.clientId = clientId;
    $scope.clientName = clientName;
    $scope.groupId = groupId;
    $scope.groupName = groupName;

    $scope.loadClients = function() {
        ClientService.getClients().then(function(response) {
            $scope.clients = response.data;
        }).catch(function(error) {
            console.error('Error loading clients:', error);
        });
    };

    $scope.loadGroups = function() {
        GroupService.getGroups().then(function(response) {
            $scope.groups = response.data;
        }).catch(function(error) {
            console.error('Error loading groups:', error);
        });
    };

    $scope.loadTotems = function() {
        TotemService.getTotems().then(function(response) {
            $scope.totems = response.data;
        }).catch(function(error) {
            console.error('Error loading totems:', error);
        });
    };

    $scope.createTotem = function() {
        var totemData = {
            client_id: $scope.clientId,
            group_id: $scope.groupId,
        };
        
        TotemService.createTotem(totemData).then(function(response) {
            alert('Totem created successfully!');
            $scope.loadTotems();
            $state.go('base.totem-view', {clientId: $scope.clientId, clientName: $scope.clientName, groupId: $scope.groupId, groupName: $scope.groupName});
        }).catch(function(error) {
            console.error('Error creating totem:', error);
            alert('Error creating totem: Check console for details.');
        });
    };

    $scope.updateTotem = function(totemId) {
        var totemData = {
            client_id: $scope.clientId,
            group_id: $scope.groupId,
        };

        TotemService.updateTotem(totemId, totemData).then(function(response) {
            alert('Totem updated successfully!');
            $scope.loadTotems();
        }).catch(function(error) {
            console.error('Error updating totem:', error);
            alert('Error updating totem: Check console for details.');
        });
    };

    // Função para deletar um totem
    $scope.deleteTotem = function(totemId) {
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

    // Inicializar dados
    $scope.loadClients();
    $scope.loadGroups();
    $scope.loadTotems();
}]);
