angular.module('frontend').controller('FormFieldUpdateController', ['$scope', 'FormFieldService','AuthService', '$state', '$stateParams', function($scope, FormFieldService, AuthService, $state, $stateParams) {

    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.clientmoduleId = $stateParams.clientmoduleId;
    $scope.formId = $stateParams.formId;
    $scope.formName = $stateParams.formName;
    $scope.formfieldId = $stateParams.formfieldId;
    $scope.formfieldName = $stateParams.formfieldName;
    
    $scope.formfieldData = {};

    $scope.loadFormFieldDetails = function() {
        if(!$scope.formfieldId){
            console.log('No form field ID provided.');
            alert('No form field ID provided.')
            $state.go('base.formfield-view', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                clientmoduleId: $scope.clientmoduleId,
                formId: $scope.formId,
                formName: $scope.formName 
             });
             return;
        }
    FormFieldService.getById($scope.formfieldId).then(function(response) {
        if (response.data) {
            $scope.formfieldData = response.data;
            } else {
                console.error('Form field not found');
                alert('Form field not found.');
                $state.go('base.formfield-view', { 
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    clientmoduleId: $scope.clientmoduleId,
                    formId: $scope.formId,
                    formName: $scope.formName 
                 });
            }
        }).catch(function(error) {
            console.error('Error fetching form field details:', error);
        });
    }; 

    $scope.updateFormField = function() {
        FormFieldService.update($scope.formfieldId, $scope.formfieldData).then(function(response) {
            alert('Form field updated successfully!');
            $state.go('base.formfield-view', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                clientmoduleId: $scope.clientmoduleId,
                formId: $scope.formId,
                formName: $scope.formName 
             });
        }).catch(function(error) {
            alert('Error updating form field!')
            console.error('Error updating form field:', error);
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.formfield-view', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: $scope.clientmoduleId,
            formId: $scope.formId,
            formName: $scope.formName 
         });
    };

    $scope.loadFormFieldDetails();
}]);
