angular.module('frontend').controller('ClientController', ['$scope', 'ClientService', '$state', 'AuthService', '$filter', function($scope, ClientService, $state, AuthService,$filter) {
    $scope.clients = [];
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.newClient = {
        name: "",
        email: "",
        address: "",
        phone: "",
        license_id: AuthService.getLicenseId()
    };

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.clients, $scope.searchText);
        var startIndex = $scope.currentPage * $scope.pageSize;
        var endIndex = Math.min(startIndex + $scope.pageSize, filteredList.length);
        return filteredList.slice(startIndex, endIndex);
    };
    
    
    $scope.setCurrentPage = function(page) {
        if (page >= 0 && page < $scope.totalPages()) {
            $scope.currentPage = page;
        }
    };
    
    $scope.totalPages = function() {
        return Math.ceil($scope.clients.length / $scope.pageSize);
    };
    
    $scope.getPages = function() {
        var pages = [];
        for (var i = 0; i < $scope.totalPages(); i++) {
            pages.push(i);
        }
        return pages;
    };

    $scope.loadClients = function() {
        ClientService.getAll().then(function(response) {
            $scope.clients = response.data;
        });
    };

    $scope.goToNewClient = function() {
        $state.go('base.client-new');
    };
    
    $scope.createClient = function() {
        ClientService.create($scope.newClient).then(function(response) {
            alert('Client created successfully!');
            $state.go('base.client-view'); 
        }).catch(function(error) {
            console.error('Error creating client:', error);
        });
    };

    $scope.editClient = function(clientId) {
        $state.go('base.client-update', { clientId: clientId });
    };

    $scope.cancelCreate = function() {
        $state.go('base.client-view');
    };

    $scope.goBack = function() {
        $state.go('base.home-admin');
    };

    $scope.viewGroups = function(clientId, clientName) {
        $state.go('base.group-view', { clientId: clientId, clientName: clientName });
    };

    $scope.goToModules = function(clientId, clientName) {
        $state.go('base.clientmodule-view', { clientId: clientId, clientName: clientName });
    };

    $scope.deleteClient = function(clientId) {
        if (confirm('Are you sure you want to delete this client?')) {
            ClientService.delete(clientId).then(function(response) {
                alert('Client deleted successfully!');
                $scope.loadClients();
            }).catch(function(error) {
                console.error('Error deleting client:', error);
            });
        }
    };
    $scope.isSuperuser = function() {
        return AuthService.isSuperuser();
    };

    $scope.loadClients();
}]);
