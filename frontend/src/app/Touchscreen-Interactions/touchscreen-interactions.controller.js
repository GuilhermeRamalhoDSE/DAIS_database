angular.module('frontend').controller('TouchscreenInteractionController', ['$scope', 'FormService', 'AuthService', '$state', '$stateParams', function($scope, TouchscreenInteractionService, AuthService, $state, $stateParams) {
    $scope.touchscreeninteractionList = [];

    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.isSuperuser = AuthService.isSuperuser();
 
    let clientmoduleId = parseInt($stateParams.clientmoduleId || sessionStorage.getItem('lastClientModuleId'), 10);
    sessionStorage.setItem('lastClientModuleId', clientmoduleId.toString());

    $scope.newTouchscreenInteraction = {
        client_module_id: clientmoduleId,
        name: '',
    };

    $scope.loadTouchscreenInteraction = function() {
        TouchscreenInteractionService.getAll(clientmoduleId).then(function(response) {
            $scope.touchscreeninteractionList = response.data;
        }).catch(function(error) {
            console.error('Error loading touchscreen interactions:', error);
        });
    };

    $scope.goToCreateTouchscreenInteraction = function() {
        $state.go('base.touchscreeninteraction-new', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: clientmoduleId 
        });
    };

    $scope.goToButton = function(touchscreeninteractionId, touchscreeninteractionName) {
        $state.go('base.button-view', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: clientmoduleId,
            touchscreeninteractionId: touchscreeninteractionId,
            touchscreeninteractionName: touchscreeninteractionName
        });
    };

    $scope.createTouchscreenInteraction = function() {
        TouchscreenInteractionService.create($scope.newTouchscreenInteraction).then(function(response) {
            alert('Touchscreen Interaction created successfully!');
            $scope.loadTouchscreenInteraction();
            $state.go('base.touchscreeninteraction-view',{
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                clientmoduleId: clientmoduleId
            });
        }).catch(function(error) {
            console.error('Error creating touchscreen interaction:', error);
        });
    };

    $scope.editTouchscreenInteraction = function(touchscreeninteractionId, touchscreeninteractionName) {
        $state.go('base.touchscreeninteraction-update', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: clientmoduleId,
            touchscreeninteractionId: touchscreeninteractionId,
            touchscreeninteractionName: touchscreeninteractionName
        });
    };

    $scope.deleteTouchscreenInteraction = function(touchscreeninteractionId) {
        var isConfirmed = confirm('Are you sure you want to delete this touchscreen interaction?');
        if (isConfirmed) {
            TouchscreenInteractionService.delete(touchscreeninteractionId).then(function(response) {
                alert('Touchscreen Interaction deleted successfully!');
                $scope.loadForms();
                $state.go('base.touchscreeninteraction-view',{
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    clientmoduleId: clientmoduleId
                });
            }).catch(function(error) {
                console.error('Error deleting touchscreen interaction:', error);
            });
        }
    };

    $scope.cancelCreate = function() {
        $state.go('base.touchscreeninteraction-view',{
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: clientmoduleId
        });
    };

    $scope.goBack = function() {
        $state.go('base.clientmodule-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
        });
    };
    
    $scope.loadForms();
}])