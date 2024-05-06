angular.module('frontend').controller('FormController', ['$scope', 'FormService', 'AuthService', '$state', '$stateParams', function($scope, FormService, AuthService, $state, $stateParams) {
    $scope.formList = [];

    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.isSuperuser = AuthService.isSuperuser();
 
    let clientmoduleId = parseInt($stateParams.clientmoduleId || sessionStorage.getItem('lastClientModuleId'), 10);
    sessionStorage.setItem('lastClientModuleId', clientmoduleId.toString());

    $scope.newForm = {
        client_module_id: clientmoduleId,
        name: '',
        api: false,
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
        $state.go('base.formation-update', { 
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