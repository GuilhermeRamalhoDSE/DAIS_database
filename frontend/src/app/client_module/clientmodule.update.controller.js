angular.module('frontend').controller('ClientModuleUpdateController', ['$scope', 'ClientModuleService', 'LicenseService','AuthService', '$state', '$stateParams', function($scope, ClientModuleService, LicenseService, AuthService, $state, $stateParams) {
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.clientmoduleId = $stateParams.clientmoduleId;

    $scope.modules = [];
    $scope.clientmoduleData = {};

    $scope.loadModules = function() {
        if ($scope.licenseId) {
            LicenseService.getModulesByLicense($scope.licenseId).then(function(response) {
                $scope.modules = response.data;
            }).catch(function(error) {
                console.error('Error loading modules:', error);
            });
        } else {
            console.error('License ID is undefined');
        }
    }; 

    $scope.loadClientModule = function() {
        if(!$scope.clientmoduleId){
            console.log('No client module ID provided.');
            alert('No client module ID provided.');
            $state.go('base.clientmodule-view', {
                clientId: $scope.clientId,
                clientName: $scope.clientName    
            });
            return;
        }
        ClientModuleService.getById($scope.clientmoduleId).then(function(response){
            if(response.data){
                $scope.clientmoduleData = response.data;
            } else {
                console.error('CLient Module not found');
                alert('CLient Module not found');
                $state.go('base.clientmodule-view', {
                    clientId: $scope.clientId,
                    clientName: $scope.clientName    
                });
            }
        }).catch(function(error) {
            console.error('Error fetching client module details:', error);
        }); 
    };

    $scope.updateClientModule = function() {
        ClientModuleService.update($scope.clientmoduleId, $scope.clientmoduleData).then(function(response) {
            alert('Client Module updated succesfully');
            $state.go('base.clientmodule-view', {
                clientId: $scope.clientId,
                clientName: $scope.clientName    
            });
        }).catch(function(error){
            console.error('Error updating client module:', error);
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.clientmodule-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName    
        });
    };

    $scope.loadModules();
    $scope.loadClientModule();
}])