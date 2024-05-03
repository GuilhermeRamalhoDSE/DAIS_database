angular.module('frontend').controller('ClientModuleUpdateController', ['$scope', 'ClientModuleService','AuthService', '$state', '$stateParams', function($scope, ClientModuleService, AuthService, $state, $stateParams) {
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.clientmoduleName = $stateParams.clientmoduleName;
    $scope.clientmoduleId = $stateParams.clientmoduleId;

    $scope.clientmoduleData = {};

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

    $scope.loadClientModule();
}])