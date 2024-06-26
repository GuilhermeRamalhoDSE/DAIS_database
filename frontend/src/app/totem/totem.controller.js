angular.module('frontend').controller('TotemController', ['$scope', 'TotemService', 'AuthService', '$state', '$stateParams', '$filter', function($scope, TotemService, AuthService, $state, $stateParams, $filter) {
    $scope.totems = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.visiblePages = 3;
    $scope.isSuperuser = AuthService.isSuperuser(); 

    let groupId = parseInt($stateParams.groupId || sessionStorage.getItem('lastgroupId'), 10);
    sessionStorage.setItem('lastgroupId', groupId.toString());

    let groupName = $stateParams.groupName || sessionStorage.getItem('lastGroupName');
    if (groupName) {
        sessionStorage.setItem('lastGroupName', groupName);
    } else {
        groupName = sessionStorage.getItem('lastGroupName');
    }
    $scope.groupName = groupName;

    let clientId = parseInt($stateParams.clientId || sessionStorage.getItem('lastClientId'), 10);
    sessionStorage.setItem('lastClientId', clientId.toString());

    if (isNaN(clientId)) {
        alert('Invalid or missing clientId');
        $state.go('base.client-view');
    }

    let clientName = $stateParams.clientName || sessionStorage.getItem('lastClientName');
    if (clientName) {
        sessionStorage.setItem('lastClientName', clientName);
    } else {
        clientName = sessionStorage.getItem('lastClientName');
    }
    $scope.clientName = clientName;

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.totems, $scope.searchText);
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
        return Math.ceil($scope.totems.length / $scope.pageSize);
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

    $scope.loadClients = function() {
        ClientService.getClients().then(function(response) {
            $scope.clients = response.data;
        }).catch(function(error) {
            console.error('Error loading clients:', error);
        });
    };

    $scope.newTotem = {
        name: "",
        group_id: groupId,
        comments: ""
    };

    $scope.loadTotems = function() {
        if (!groupId) {
            return;
        }
        TotemService.getAll(groupId).then(function(response) {
            $scope.totems = response.data;
        }).catch(function(error) {
            console.error('Error loading totems:', error);
        });
    };

    $scope.goToCreateTotem = function() {
        if (clientId && groupId) {
            $state.go('base.totem-new', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
        } else {
            $state.go('base.group-view', { clientId: clientId });
        }
    };

    $scope.createTotem = function() {
        if (!groupId) {
            return;
        }
    
        var totemData = angular.copy($scope.newTotem);
    
        if (totemData.installation_date) {
            totemData.installation_date = moment(totemData.installation_date, "DD/MM/YYYY").format('YYYY-MM-DD');
        }
    
        TotemService.createTotem(totemData).then(function(response) {
            alert('Totem created successfully!');
            $scope.loadTotems();
            $state.go('base.totem-view', {clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName});
        }).catch(function(error) {
            if (error.data && error.data.includes("Limit of totems reached for this license.")) {
                alert('Cannot create totem: Limit of totems reached for this license.');
            } else {
                console.error('Error creating totem:', error);
                alert('Error creating totem: Check console for details.');
            }
        });
           
    };

    $scope.cancelCreate = function(){
        $state.go('base.totem-view', {clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName});
    }

    $scope.editTotem = function(totemId) {
        $state.go('base.totem-update', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, totemId: totemId});
    };

    $scope.goBack = function() {
        $state.go('base.group-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
    };

    $scope.goToLogs = function(totemId, totemName) {
        $state.go('base.logs-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, totemId: totemId, totemName: totemName });
    };

    $scope.goToScreens = function(totemId, totemName) {
        $state.go('base.screen-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, totemId: totemId, totemName: totemName });
    };

    $scope.deleteTotem = function(totemId) {
        if (!totemId) {
            return;
        }
        if (confirm('Are you sure you want to delete this totem?')) {
            TotemService.deleteTotem(totemId).then(function(response) {
                alert('Totem successfully deleted!');
                $scope.loadTotems();
            }).catch(function(error) {
                console.error('Error deleting totem:', error);
                alert('Error deleting totem: Check console for details.');
            });
        }
    };

    $scope.duplicateTotem = function(totemId) {
        TotemService.duplicateTotem(totemId).then(function(response) {
            $scope.loadTotems(); 
        }).catch(function(error) {
            if (error.data && error.data.includes("Limit of totems reached for this license.")) {
                alert('Cannot duplicate totem: Limit of totems reached for this license.');
            } else {
                console.error('Error duplicating totem:', error);
                alert('Error duplicating totem: Check console for details.');
            }
        });
    };   

    $scope.toggleActive = function(totem) {
        if (totem.active) {
            TotemService.deactivate(totem.id)
                .then(function() {
                    totem.active = false;
                    $scope.loadTotems(totem.group_id);
                })
                .catch(function(error) {
                    console.error('Error deactivating totem:', error);
                });
        } else {
            TotemService.activate(totem.id)
                .then(function() {
                    totem.active = true;
                    $scope.loadTotems(totem.group_id);
                })
                .catch(function(error) {
                    console.error('Error activating totem:', error);
                });
        }
    };
    
    $scope.resetForm = function() {
        $scope.newTotem = { 
            name: "",
            group_id: groupId,
            installation_date: "",
            active: false,
            comments: ""
        };
    };

    $scope.loadTotems();
}]);
