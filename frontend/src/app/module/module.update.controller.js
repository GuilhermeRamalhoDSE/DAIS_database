angular.module('frontend').controller('ModuleUpdateController', ['$scope', 'ModuleService', '$state', '$stateParams', function($scope, ModuleService, $state, $stateParams) {
    $scope.module = {};

    $scope.loadModuleData = function() {
        const moduleId = $stateParams.moduleId;
        ModuleService.getById(moduleId).then(function(response) {
            if (response.data) {
                $scope.module = response.data; 
            } else {
                console.error('No data received for module');
                alert('No data found for this module.');
            }
        }).catch(function(error) {
            console.error('Error fetching module data:', error);
            alert('Error fetching module data.');
        });
    };

    $scope.updateModule = function() {
        ModuleService.update($scope.module.id, $scope.module).then(function(response) {
            alert('module updated successfully!');
            $state.go('base.module-view');
        }).catch(function(error) {
            console.error('Error updating module:', error);
            alert('Error updating module.');
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.module-view');
    };

    $scope.loadModuleData();
}]);
