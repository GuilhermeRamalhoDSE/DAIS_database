angular.module('frontend').controller('GroupGetAllController', ['$scope', '$state', 'GroupService', 'AuthService', '$location', function($scope, $state, GroupService, AuthService, $location) {
    $scope.groupList = [];
    $scope.moduleFormEnabled = false;
    $scope.modulesAvailable = AuthService.hasModules();

    $scope.checkModuleFormEnabled = function() {
        if (AuthService.isModuleEnabled('form')) {
            $scope.groupList.forEach(group => {
                group.moduleFormEnabled = group.forms && group.forms.length > 0;  
            });
        }
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
        }, function(error) {
            alert('Error updating the last update date!');
        });
    };
    
    $scope.detailGroup = function(group) {
        if (group.typology === 'Digital Signage') {
            $state.go('base.periodds-view', { clientId: group.client_id, clientName: group.client_name, groupId: group.id, groupName: group.name });
        } else if (group.typology === 'Artificial Intelligence') {
            $state.go('base.periodia-view', { clientId: group.client_id, clientName: group.client_name, groupId: group.id, groupName: group.name });
        } else {
            alert('Unknown typology');
        }
    };

    $scope.isHomePage = function() {
        return $location.path() === '/home';
    };

    $scope.goBack = function() {
        $state.go('base.home');
    };

    $scope.loadAllGroups();
}]);
