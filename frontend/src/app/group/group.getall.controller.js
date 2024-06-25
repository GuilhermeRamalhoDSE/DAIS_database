angular.module('frontend').controller('GroupGetAllController', ['$scope', '$state', 'GroupService', 'AuthService', '$filter', '$window', function($scope, $state, GroupService, AuthService, $filter, $window) {
    $scope.groupList = [];
    $scope.moduleFormEnabled = false;
    $scope.modulesAvailable = AuthService.hasModules();
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.visiblePages = 3;

    $scope.checkModuleFormEnabled = function() {
        if (AuthService.isModuleEnabled('form')) {
            $scope.groupList.forEach(group => {
                group.moduleFormEnabled = group.forms && group.forms.length > 0;  
            });
        }
    };

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.groupList, $scope.searchText);
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
        return Math.ceil($scope.groupList.length / $scope.pageSize);
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

    $scope.loadAllGroups = function() {
        var licenseId = AuthService.getLicenseId(); 
        if (!licenseId) {
            console.error('License ID is missing');
            return;
        }
        GroupService.getAllByLicense(licenseId).then(function(response) {
            $scope.groupList = response.data.map(group => ({ ...group, moduleFormEnabled: false }));
            $scope.checkModuleFormEnabled();
        }).catch(function(error) {
            console.error('Error fetching all groups:', error);
        });
    };    

    $scope.goToTotem = function(group) {
        $state.go('base.totem-view', { clientId: group.client_id, clientName: group.client_name, groupId: group.id, groupName: group.name });
    };

    $scope.goToForm = function(group, form) {
        sessionStorage.setItem('previousState', $state.current.name);
        if (!form) {
            console.error('Form not provided');
            return;
        }
        $state.go('base.formfield-view', {
            clientId: group.client_id,
            clientName: group.client_name,
            clientmoduleId: form.client_module_id,
            formId: form.id,
            formName: form.name
        });
    };    

    $scope.updateLastUpdate = function(groupId) {
        GroupService.updateLastUpdate(groupId).then(function(response) {
            alert('Last update date changed to: ' + new Date(response.data.last_update).toLocaleString());
            GroupService.updateNeedsUpdate(groupId).then(function(response) {
                $window.location.reload();
            }, function(error) {
                alert('Error updating needs update state!');
            });
        }, function(error) {
            alert('Error updating the last update date!');
        });
    };

    $scope.editGroup = function(group) {
        $state.go('base.group-update', { clientId: group.client_id, clientName: group.client_name, groupId: group.id, groupName: group.name  }); 
    };
    
    $scope.detailGroup = function(group) {
        if (group.typology.name === 'Digital Signage') {
            $state.go('base.campaignds-view', { clientId: group.client_id, clientName: group.client_name, groupId: group.id, groupName: group.name });
        } else if (group.typology.name === 'Artificial Intelligence') {
            $state.go('base.campaignai-view', { clientId: group.client_id, clientName: group.client_name, groupId: group.id, groupName: group.name });
        } else {
            alert('Unknown typology');
        }
    };

    $scope.deleteGroup = function(groupId) {
        var isConfirmed = confirm('Are you sure you want to delete this group?');
        if (isConfirmed) {
            GroupService.delete(groupId).then(function(response) {
                alert('Group deleted successfully!');
                $scope.loadAllGroups();
            }).catch(function(error) {
                console.error('Error deleting group:', error);
            });
        }
    };

    $scope.goBack = function() {
        $state.go('base.home-admin');
    };

    $scope.loadAllGroups();
}]);
