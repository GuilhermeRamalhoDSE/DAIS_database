angular.module('frontend').controller('ButtonTypeController', ['$scope', 'ButtonTypeService', '$state', 'AuthService', '$filter', function($scope, ButtonTypeService, $state, AuthService, $filter) {
    $scope.buttontypes = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.visiblePages = 3;
    $scope.newButtonType = {
        name: "",
    };

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.buttontypes, $scope.searchText);
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
        return Math.ceil($scope.buttontypes.length / $scope.pageSize);
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
    
    $scope.loadButtonTypes = function() {
        ButtonTypeService.getAll().then(function(response){
            $scope.buttontypes = response.data;
        }, function(error) {
            console.error('Error loading button type:', error);
        });
    };

    $scope.goToNewButtonType = function() {
        $state.go('base.buttontype-new');
    };

    $scope.createButtonType = function() {
        ButtonTypeService.create($scope.newButtonType).then(function(response) {
            alert('Button Type created successfully!');
            $state.go('base.buttontype-view'); 
        }).catch(function(error) {
            console.error('Error creating button type:', error);
        });
    };

    $scope.editButtonType = function(buttontypeId) {
        $state.go('base.buttontype-update', { buttontypeId: buttontypeId });
    };

    $scope.cancelCreate = function() {
        $state.go('base.buttontype-view');
    };

    $scope.goBack = function() {
        $state.go('base.home-su');
    };

    $scope.deleteButtonType = function(buttontypeId) {
        if (confirm('Are you sure you want to delete this button type?')) {
            ButtonTypeService.delete(buttontypeId).then(function(response) {
                alert('Button Type deleted successfully!');
                $scope.loadButtonTypes();
                $state.go('base.buttontype-view'); 
            }).catch(function(error) {
                console.error('Error deleting button type:', error);
            });
        }
    };

    $scope.isSuperuser = function() {
        return AuthService.isSuperuser();
    };

    $scope.loadButtonTypes();
}]);