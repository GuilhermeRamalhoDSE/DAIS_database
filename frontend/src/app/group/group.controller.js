angular.module('frontend').controller('GroupController', ['$scope', 'GroupService', '$state', '$stateParams', 'AuthService', 'FormService', 'LicenseService', '$window', '$filter', function($scope, GroupService, $state, $stateParams, AuthService, FormService, LicenseService, $window, $filter) {
    $scope.groupList = [];
    $scope.forms = [];
    $scope.grouptypes = [];
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.moduleFormEnabled = false;
    $scope.modulesAvailable = AuthService.hasModules();
    $scope.licenseId = AuthService.getLicenseId();
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.visiblePages = 3;

    let clientId = parseInt($stateParams.clientId || sessionStorage.getItem('lastclientId'), 10);
    if (isNaN(clientId)) {
        console.error('Invalid clientId');
        return;
    }
    sessionStorage.setItem('lastclientId', clientId.toString());

    let clientName = $stateParams.clientName || sessionStorage.getItem('lastclientName');
    if (clientName) {
        sessionStorage.setItem('lastclientName', clientName);
    } else {
        clientName = sessionStorage.getItem('lastclientName');
    }
    $scope.clientName = clientName;

    $scope.newGroup = {
        name: "",
        typology_id: null,
        comments: "",
        client_id: clientId, 
        forms_ids: []
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

    $scope.loadGroupType = function() {
        if ($scope.licenseId) {
            LicenseService.getGroupTypeByLicense($scope.licenseId).then(function(response) {
                $scope.grouptypes = response.data;
            }).catch(function(error) {
                console.error('Error loading group type:', error);
            });
        } else {
            console.error('License ID is undefined');
        }
    }; 

    $scope.checkModuleFormEnabled = function() {
        if (AuthService.isModuleEnabled('form')) {
            $scope.groupList.forEach(group => {
                group.moduleFormEnabled = group.forms && group.forms.length > 0;  
            });
        }
    };

    $scope.loadGroups = function() {
        if (!clientId) {
            console.error('Client ID is missing');
            return;
        }
    
        GroupService.getAll(clientId).then(function(response) {
            $scope.groupList = response.data.map(group => ({...group, moduleFormEnabled: false}));
            $scope.checkModuleFormEnabled();
        }).catch(function(error) {
            console.error('Error fetching groups:', error);
        });
    };

    $scope.loadForms = function() {
        FormService.getAllByClientId(clientId).then(function(response) {
            $scope.forms = response.data;
        }).catch(function(error) {
            alert('Error fetching forms:', error);
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
    
    $scope.goToCreateGroup = function() {
        $state.go('base.group-new', { clientId: clientId, clientName: clientName }); 
    };

    $scope.createGroup = function() {
        GroupService.create($scope.newGroup).then(function(response) {
            alert('Group created successfully!');
            $scope.loadGroups();
            $state.go('base.group-view', { clientId: clientId, clientName: clientName }); 
        }).catch(function(error) {
            alert('Error creating group:', error.data);
        });
    };

    $scope.editGroup = function(groupId, groupName) {
        $state.go('base.group-update', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName }); 
    };

    $scope.deleteGroup = function(groupId) {
        var isConfirmed = confirm('Are you sure you want to delete this group?');
        if (isConfirmed) {
            GroupService.delete(groupId).then(function(response) {
                alert('Group deleted successfully!');
                $scope.loadGroups();
            }).catch(function(error) {
                console.error('Error deleting group:', error);
            });
        }
    };

    $scope.detailGroup = function(groupId, groupName, typology) {
        if (typology === 'Digital Signage') {
            $state.go('base.campaignds-view', { clientId: clientId, clientName: clientName,groupId: groupId, groupName: groupName });
        } else if (typology === 'Artificial Intelligence') {
            $state.go('base.campaignai-view', { clientId: clientId, clientName: clientName,groupId: groupId, groupName: groupName });
        } else {
            alert('Unknown typology');
        }
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
    
    $scope.goBack = function() {
        $state.go('base.client-view', { clientId: clientId, clientName: clientName });
    };

    $scope.goToTotem = function(groupId, groupName) {
        $state.go('base.totem-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName }); 
    };

    $scope.cancelCreate = function() {
        $state.go('base.group-view', { clientId: clientId, clientName: clientName }); 
    };

    $scope.resetForm = function() {
        $scope.newGroup = {
            name: "",
            typology_id: null,
            comments: "",
            client_id: clientId,
            forms_ids: []
        };
    };

    $scope.toggleFormAssignment = function(group, formId) {
        const isAssigned = group.forms && group.forms.some(form => form.id === formId);
        if (isAssigned) {
            GroupService.removeFormFromGroup(group.id, formId)
                .then(function(response) {
                    $scope.loadGroups(); 
                })
                .catch(function(error) {
                    console.error('Error removing form from group:', error);
                });
        } else {
            GroupService.addFormToGroup(group.id, formId)
                .then(function(response) {
                    $scope.loadGroups(); 
                })
                .catch(function(error) {
                    console.error('Error adding form to group:', error);
                });
        }
    };

    $scope.isFormAssignedToGroup = function(group, formId) {
        return group.forms && group.forms.some(form => form.id === formId);
    };

    $scope.loadGroups();
    $scope.loadForms();
    $scope.loadGroupType();
}]);
