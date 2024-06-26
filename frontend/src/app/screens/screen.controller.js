angular.module('frontend').controller('ScreenController', ['$scope', 'ScreenService', '$state', '$stateParams', 'AuthService', 'LicenseService', '$filter', function($scope, ScreenService, $state, $stateParams, AuthService, LicenseService, $filter) {
    $scope.screenList = [];
    $scope.screenTypes = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.visiblePages = 3;
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();

    let totemId = parseInt($stateParams.totemId || sessionStorage.getItem('lasttotemId'), 10);
    sessionStorage.setItem('lasttotemId', totemId.toString());

    let totemName = $stateParams.totemName || sessionStorage.getItem('lasttotemName');
    sessionStorage.setItem('lasttotemName', totemName);
    $scope.totemName = totemName;

    $scope.newScreen = {
        totem_id: totemId,
        typology_id: null,
    };

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.screenList, $scope.searchText);
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
        return Math.ceil($scope.screenList.length / $scope.pageSize);
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


    $scope.loadScreens = function() {
        ScreenService.getAll(totemId).then(function(response) {
            $scope.screenList = response.data;
        }).catch(function(error) {
            console.error('Error loading screens:', error);
        });
    };

    $scope.loadScreenType = function() {
        if ($scope.licenseId) {
            LicenseService.getScreenTypeByLicense($scope.licenseId).then(function(response) {
                $scope.screenTypes = response.data;
            }).catch(function(error) {
                console.error('Error loading screen types:', error);
            });
        } else {
            console.error('License ID is undefined');
        }
    }; 

    $scope.goToCreateScreen = function() {
        $state.go('base.screen-new', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            totemId: totemId,
            totemName: totemName });
    };

    $scope.createScreen = function() {
        ScreenService.create($scope.newScreen).then(function(response) {
            alert('Screen created successfully!');
            $scope.loadScreens();
            $state.go('base.screen-view', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                totemId: totemId,
                totemName: totemName });
        }).catch(function(error) {
            console.error('Error creating screen:', error);
        });
    }    

    $scope.editScreen = function(screenId) {
        $state.go('base.screen-update', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            totemId: totemId,
            totemName: totemName,
            screenId: screenId });
    };

    $scope.deleteScreen = function(screenId) {
        var isConfirmed = confirm('Are you sure you want to delete this screen?');
        if (isConfirmed) {
            ScreenService.delete(screenId).then(function(response) {
                alert('Screen deleted successfully!');
                $scope.loadScreens();
                $state.go('base.screen-view', { 
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    totemId: totemId,
                    totemName: totemName });
            }).catch(function(error) {
                console.error('Error deleting screen:', error);
            });
        }
    };

    $scope.cancelCreate = function() {
        $state.go('base.screen-view', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            totemId: totemId,
            totemName: totemName });
    };

    $scope.goBack = function() {
        $state.go('base.totem-view', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            totemId: totemId,
            totemName: totemName});
    };

    $scope.loadScreens();
    $scope.loadScreenType();
}]);
