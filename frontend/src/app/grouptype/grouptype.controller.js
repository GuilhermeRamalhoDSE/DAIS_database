angular.module('frontend').controller('GroupTypeController', ['$scope', 'GroupTypeService', '$state', 'AuthService', '$filter', function($scope, GroupTypeService, $state, AuthService, $filter) {
    $scope.grouptypes = [];
    $scope.currentPage = 0;
    $scope.pageSize = 2;
    $scope.newGroupType = {
        name: "",
    };

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.grouptypes, $scope.searchText);
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
        return Math.ceil($scope.grouptypes.length / $scope.pageSize);
    };
    
    $scope.getPages = function() {
        var pages = [];
        for (var i = 0; i < $scope.totalPages(); i++) {
            pages.push(i);
        }
        return pages;
    };

    $scope.loadGroupTypes = function() {
        GroupTypeService.getAll().then(function(response) {
            $scope.grouptypes = response.data;
        }, function(error) {
            console.error('Error loading grouptypes:', error);
        });
    };

    $scope.goToNewGroupType = function() {
        $state.go('base.grouptype-new');
    };

    $scope.createGroupType = function() {
        GroupTypeService.create($scope.newGroupType).then(function(response) {
            alert('GroupType created successfully!');
            $state.go('base.grouptype-view'); 
        }).catch(function(error) {
            console.error('Error creating grouptype:', error);
        });
    };

    $scope.editGroupType = function(grouptypeId) {
        $state.go('base.grouptype-update', { grouptypeId: grouptypeId });
    };

    $scope.cancelCreate = function() {
        $state.go('base.grouptype-view');
    };

    $scope.goBack = function() {
        $state.go('base.home-su');
    };

    $scope.deleteGroupType = function(grouptypeId) {
        if (confirm('Are you sure you want to delete this grouptype?')) {
            GroupTypeService.delete(grouptypeId).then(function(response) {
                alert('GroupType deleted successfully!');
                $scope.loadGroupTypes();
            }).catch(function(error) {
                console.error('Error deleting grouptype:', error);
            });
        }
    };

    $scope.isSuperuser = function() {
        return AuthService.isSuperuser();
    };

    $scope.loadGroupTypes();
}]);
