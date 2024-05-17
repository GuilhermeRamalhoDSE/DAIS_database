angular.module('frontend').controller('TouchscreenInteractionUpdateController', ['$scope', 'TouchscreenInteractionService','AuthService', '$state', '$stateParams', function($scope, TouchscreenInteractionService, AuthService, $state, $stateParams) {

    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.clientmoduleId = $stateParams.clientmoduleId;
    $scope.touchscreeninteractionId = $stateParams.touchscreeninteractionId;
    $scope.touchscreeninteractionName = $stateParams.touchscreeninteractionName;
    
    $scope.touchscreeninteractionData = {
        name: '',   
    };

    $scope.loadTouchscreenInteractionDetails = function() {
        if(!$scope.touchscreeninteractionId){
            console.log('No touchscreen interaction ID provided.');
            alert('No touchscreen interaction ID provided.')
            $state.go('base.touchscreeninteraction-view', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                clientmoduleId: $scope.clientmoduleId,
             });
             return;
        }
        TouchscreenInteractionService.getById($scope.touchscreeninteractionId).then(function(response) {
        if (response.data) {
            $scope.touchscreeninteractionData = response.data;
            } else {
                console.error('touchscreeninteraction not found');
                alert('Touchscreen interaction not found.');
                $state.go('base.touchscreeninteraction-view', { 
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    clientmoduleId: $scope.clientmoduleId,
                 });
            }
        }).catch(function(error) {
            console.error('Error fetching touchscreen interaction details:', error);
        });
    }; 

    $scope.updateTouchscreenInteraction = function() {
        TouchscreenInteractionService.update($scope.touchscreeninteractionId, $scope.touchscreeninteractionData).then(function(response) {
            alert('Touchscreen interaction updated successfully!');
            $state.go('base.touchscreeninteraction-view', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                clientmoduleId: $scope.clientmoduleId,
             });
        }).catch(function(error) {
            alert('Error updating touchscreen interaction!')
            console.error('Error updating touchscreen interaction:', error);
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.touchscreeninteraction-view', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: $scope.clientmoduleId,
         });
    };

    $scope.loadtouchscreeninteractionDetails();
}]);
