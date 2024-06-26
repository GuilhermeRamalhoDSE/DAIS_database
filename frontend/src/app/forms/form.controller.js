angular.module('frontend').controller('FormController', ['$scope', 'FormService', 'AuthService', '$state', '$stateParams', '$filter', function($scope, FormService, AuthService, $state, $stateParams, $filter) {
    $scope.formList = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.visiblePages = 3;

    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.isSuperuser = AuthService.isSuperuser();
 
    let clientmoduleId = parseInt($stateParams.clientmoduleId || sessionStorage.getItem('lastClientModuleId'), 10);
    sessionStorage.setItem('lastClientModuleId', clientmoduleId.toString());

    $scope.newForm = {
        client_module_id: clientmoduleId,
        name: '',
        // api: false,
    };

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.formList, $scope.searchText);
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
        return Math.ceil($scope.formList.length / $scope.pageSize);
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

    $scope.loadForms = function() {
        FormService.getAll(clientmoduleId).then(function(response) {
            $scope.formList = response.data;
        }).catch(function(error) {
            console.error('Error loading forms:', error);
        });
    };

    $scope.goToCreateForm = function() {
        $state.go('base.form-new', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: clientmoduleId 
        });
    };

    $scope.goToFormField = function(formId, formName) {
        sessionStorage.setItem('previousState', $state.current.name);
        $state.go('base.formfield-view', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: clientmoduleId,
            formId: formId,
            formName: formName
        });
    };

    $scope.goToFormData = function(formId, formName) {
        $state.go('base.formdata-view', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: clientmoduleId,
            formId: formId,
            formName: formName
        });
    };

    $scope.createForm = function() {
        FormService.create($scope.newForm).then(function(response) {
            alert('Form created successfully!');
            $scope.loadForms();
            $state.go('base.form-view',{
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                clientmoduleId: clientmoduleId
            });
        }).catch(function(error) {
            console.error('Error creating form:', error);
        });
    };

    $scope.editForm = function(formId, formName) {
        $state.go('base.form-update', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: clientmoduleId,
            formId: formId,
            formName: formName
        });
    };

    $scope.deleteForm = function(formId) {
        var isConfirmed = confirm('Are you sure you want to delete this form?');
        if (isConfirmed) {
            FormService.delete(formId).then(function(response) {
                alert('Form deleted successfully!');
                $scope.loadForms();
                $state.go('base.form-view',{
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    clientmoduleId: clientmoduleId
                });
            }).catch(function(error) {
                console.error('Error deleting form:', error);
            });
        }
    };

    $scope.cancelCreate = function() {
        $state.go('base.form-view',{
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: clientmoduleId
        });
    };

    $scope.goBack = function() {
        $state.go('base.clientmodule-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
        });
    };
    
    $scope.loadForms();
}])