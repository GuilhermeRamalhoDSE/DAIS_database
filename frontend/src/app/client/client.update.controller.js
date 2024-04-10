angular.module('frontend').controller('ClientUpdateController', ['$scope', 'ClientService', '$state', '$stateParams', function($scope, ClientService, $state, $stateParams) {
    $scope.client = {};

    $scope.loadClientData = function() {
        const clientId = $stateParams.clientId;
        ClientService.getById(clientId).then(function(response) {
            if (response.data && response.data.length > 0) {
                $scope.client = response.data[0]; 
            } else {
                console.error('No data received for client');
                alert('No data found for this client.');
            }
        }).catch(function(error) {
            console.error('Error fetching client data:', error);
            alert('Error fetching client data.');
        });
    };
         
    $scope.updateClient = function() {
        ClientService.update($scope.client.id, $scope.client).then(function(response) {
            alert('Client updated successfully!');
            $state.go('base.client-view');
        }).catch(function(error) {
            console.error('Error updating client:', error);
            alert('Error updating client.');
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.client-view');
    };

    $scope.loadClientData();
}]);
