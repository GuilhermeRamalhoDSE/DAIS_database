angular.module('frontend').controller('ClientModuleController', ['$scope', 'ClientModuleService', 'LicenseService', 'AuthService', '$state', '$stateParams', '$http', function($scope, ClientModuleService, LicenseService, AuthService, $state, $stateParams, $http) {
    $scope.clientmoduleList = [];
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();
    $scope.modules = [];
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

    $scope.newClientModule = {
        client_id: clientId,
        name: '',
        module_id: null
    };

    $scope.loadClientModule = function() {
        ClientModuleService.getAll(clientId).then(function(response) {
            $scope.clientmoduleList = response.data;
        }).catch(function(error) {
            console.error('Error loading client modules', error)
        });
    };

    $scope.loadModules = function() {
        if ($scope.licenseId) {
            LicenseService.getModulesByLicense($scope.licenseId).then(function(response) {
                $scope.modules = response.data;
            }).catch(function(error) {
                console.error('Error loading modules', error);
            });
        } else {
            console.error('License ID is undefined');
        }
    };

    $scope.goToCreateClientModule = function() {
        $state.go('base.clientmodule-new', {
            clientId: $scope.clientId,
            clientName: $scope.clientName
        });
    };

    $scope.createClientModule = function(){
        ClientModuleService.create($scope.newClientModule).then(function(response){
            alert('Client Module created successfully!');
            $scope.loadClientModule();
            $state.go('base.clientmodule-view', {
                clientId: $scope.clientId,
                clientName: $scope.clientName
            });
        }).catch(function(error) {
            console.error('Error creating client module:', error);
        });
    };

    $scope.editClientModule = function(clientmoduleId, clientmoduleName) {
        $state.go('base.clientmodule-update', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: clientmoduleId,
            clientmoduleName: clientmoduleName
        });
    };

    $scope.deleteClientModule = function(clientmoduleId) {
        var isConfirmed = confirm('Are you sure you want to delete this client module?')
        if(isConfirmed) {
            ClientModuleService.delete(clientmoduleId).then(function(response) {
                alert('Client Module deleted successfully');
                $scope.loadClientModule();
                $scope.go('base.clientmodule-view', {
                    clientId: $scope.clientId,
                    clientName: $scope.clientName
                });
                }).catch(function(error) {
                    console.error('Error deleting client module:', error);
            });
        };
    };

    $scope.cancelCreate = function() {
        $state.go('base.clientmodule-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName
        });
    };

    $scope.goBack = function() {
        $state.go('base.client-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName
        });
    };

    $scope.loadClientModule();
    $scope.loadModules();
}])