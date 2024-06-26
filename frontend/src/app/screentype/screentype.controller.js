angular.module('frontend').controller('ScreenTypeController', ['$scope', 'ScreenTypeService', '$state', 'AuthService', '$filter', function($scope, ScreenTypeService, $state, AuthService, $filter) {
    $scope.screentypes = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.visiblePages = 3;
    $scope.newScreenType = {
        name: "",
    };

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.screentypes, $scope.searchText);
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
        return Math.ceil($scope.screentypes.length / $scope.pageSize);
    };
    
    $scope.getPages = function() {
        var pages = [];
        var total = $scope.totalPages();
        var startPage = Math.max(0, $scope.currentPage - Math.floor($scope.visiblePages / 2));
        var endPage = Math.min(total, startPage + $scope.visiblePages);
    
        if (startPage > 0) {
            pages.push(0);
            if (startPage > 1) {
                pages.push('...');
            }
        }
    
        for (var i = startPage; i < endPage; i++) {
            pages.push(i);
        }
    
        if (endPage < total) {
            if (endPage < total - 1) {
                pages.push('...');
            }
            pages.push(total - 1);
        }
    
        return pages;
    };
    
    $scope.loadScreenTypes = function() {
        ScreenTypeService.getAll().then(function(response){
            $scope.screentypes = response.data;
        }, function(error) {
            console.error('Error loading screen type:', error);
        });
    };

    $scope.goToNewScreenType = function() {
        $state.go('base.screentype-new');
    };

    $scope.createScreenType = function() {
        ScreenTypeService.create($scope.newScreenType).then(function(response) {
            alert('Screen Type created successfully!');
            $state.go('base.screentype-view'); 
        }).catch(function(error) {
            console.error('Error creating screen type:', error);
        });
    };

    $scope.editScreenType = function(screentypeId) {
        $state.go('base.screentype-update', { screentypeId: screentypeId });
    };

    $scope.cancelCreate = function() {
        $state.go('base.screentype-view');
    };

    $scope.goBack = function() {
        $state.go('base.home-su');
    };

    $scope.deleteScreenType = function(screentypeId) {
        if (confirm('Are you sure you want to delete this screen type?')) {
            ScreenTypeService.delete(screentypeId).then(function(response) {
                alert('Screen Type deleted successfully!');
                $scope.loadScreenTypes();
                $state.go('base.screentype-view'); 
            }).catch(function(error) {
                console.error('Error deleting screen type:', error);
            });
        }
    };

    $scope.isSuperuser = function() {
        return AuthService.isSuperuser();
    };

    $scope.loadScreenTypes();
}]);