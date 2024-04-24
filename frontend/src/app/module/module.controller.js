angular.module('frontend').controller('ModuleController', ['$scope', 'ModuleService', '$state', 'AuthService', function($scope, ModuleService, $state, AuthService) {
    $scope.modules = [];
    $scope.newModule = {
        name: "",
    }
    
    $scope.loadModules = function() {
        ModuleService.getAll().then(function(response){
            $scope.modules = response.data;
        }, function(error) {
            console.error('Error loading modules:', error);
        });
    };

    $scope.goToNewModule = function() {
        $state.go('base.module-new');
    };

    $scope.createModule = function() {
        ModuleService.create($scope.newModule).then(function(response) {
            alert('Module created successfully!');
            $state.go('base.module-view'); 
        }).catch(function(error) {
            console.error('Error creating module:', error);
        });
    };

    $scope.editModule = function(moduleId) {
        $state.go('base.module-update', { moduleId: moduleId });
    };

    $scope.cancelCreate = function() {
        $state.go('base.module-view');
    };

    $scope.goBack = function() {
        $state.go('base.home');
    };

    $scope.deleteModule = function(moduleId) {
        if (confirm('Are you sure you want to delete this module?')) {
            ModuleService.delete(moduleId).then(function(response) {
                alert('Module deleted successfully!');
                $scope.loadModules();
                $state.go('base.module-view'); 
            }).catch(function(error) {
                console.error('Error deleting module:', error);
            });
        }
    };

    $scope.isSuperuser = function() {
        return AuthService.isSuperuser();
    };

    $scope.loadModules();
}]);