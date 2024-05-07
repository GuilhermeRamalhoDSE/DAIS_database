angular.module('frontend').controller('FormFieldController', ['$scope', 'FormFieldService', 'AuthService', '$state', '$stateParams', function($scope, FormFieldService, AuthService, $state, $stateParams) {
    $scope.formfieldList = [];

    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.clientmoduleId = $stateParams.clientmoduleId;
    $scope.isSuperuser = AuthService.isSuperuser();
 
    let formId = parseInt($stateParams.formId || sessionStorage.getItem('lastformId'), 10);
    sessionStorage.setItem('lastformId', formId.toString());

    let formName = $stateParams.formName || sessionStorage.getItem('lastformName');
    sessionStorage.setItem('lastformName', formName);
    $scope.formName = formName;

    $scope.newFormField = {
        form_id: formId,
        name: '',
        number: null,
        field_type: '',
        required: false,
    };

    $scope.loadFormFields = function() {
        FormFieldService.getAll(formId).then(function(response) {
            $scope.formfieldList = response.data;
        }).catch(function(error) {
            console.error('Error loading fields:', error);
        });
    };

    $scope.goToCreateFormField = function() {
        $state.go('base.formfield-new', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: $scope.clientmoduleId,
            formId: formId,
            formName: formName 
        });
    };

    $scope.createFormField = function() {
        FormFieldService.create($scope.newFormField).then(function(response) {
            alert('Field created successfully!');
            $scope.loadFormFields();
            $state.go('base.formfield-view', {
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                clientmoduleId: $scope.clientmoduleId,
                formId: formId,
                formName: formName 
            });
        }).catch(function(error) {
            console.error('Error creating field:', error);
        });
    };

    $scope.editFormField = function(formfieldId, formfieldName) {
        $state.go('base.formfield-update', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: $scope.clientmoduleId,
            formId: formId,
            formName: formName,
            formfieldId: formfieldId,
            formfieldName: formfieldName
        });
    };

    $scope.deleteFormField = function(formfieldId) {
        var isConfirmed = confirm('Are you sure you want to delete this field?');
        if (isConfirmed) {
            FormFieldService.delete(formfieldId).then(function(response) {
                alert('Field deleted successfully!');
                $scope.loadFormFields();
                $state.go('base.formfield-view', {
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    clientmoduleId: $scope.clientmoduleId,
                    formId: formId,
                    formName: formName 
                });
            }).catch(function(error) {
                console.error('Error deleting field:', error);
            });
        }
    };

    $scope.cancelCreate = function() {
        $state.go('base.formfield-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: $scope.clientmoduleId,
            formId: formId,
            formName: formName 
        });
    };

    $scope.goBack = function() {
        $state.go('base.form-view',{
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: $scope.clientmoduleId
        });
    };
    
    $scope.loadFormFields();
}])