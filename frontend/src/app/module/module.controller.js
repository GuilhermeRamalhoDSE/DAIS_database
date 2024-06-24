angular.module('frontend').controller('ModuleController', ['$scope', 'ModuleService', '$state', 'AuthService', '$filter', function($scope, ModuleService, $state, AuthService,$filter) {
    $scope.modules = [];
    $scope.currentPage = 0;
    $scope.pageSize = 2;
    $scope.newModule = {
        name: "",
    }

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.modules, $scope.searchText);
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
        return Math.ceil($scope.modules.length / $scope.pageSize);
    };
    
    $scope.getPages = function() {
        var pages = [];
        for (var i = 0; i < $scope.totalPages(); i++) {
            pages.push(i);
        }
        return pages;
    };
    
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
        $state.go('base.home-su');
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