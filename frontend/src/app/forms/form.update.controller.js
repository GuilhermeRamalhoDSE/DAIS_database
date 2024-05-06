angular.module('frontend').controller('FormUpdateController', ['$scope', 'FormService','AuthService', '$state', '$stateParams', function($scope, FormService, AuthService, $state, $stateParams) {

    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.clientmoduleId = $stateParams.clientmoduleId;
    $scope.formId = $stateParams.formId;
    $scope.formName = $stateParams.formName;
    
    $scope.formData = {
        name: '',
        api: false
    };

    $scope.loadFormDetails = function() {
        if(!$scope.formId){
            console.log('No form ID provided.');
            alert('No form ID provided.')
            $state.go('base.form-view', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                clientmoduleId: $scope.clientmoduleId,
             });
             return;
        }
    FormService.getById($scope.formId).then(function(response) {
        if (response.data) {
            $scope.formData = response.data;
            } else {
                console.error('Form not found');
                alert('Form not found.');
                $state.go('base.form-view', { 
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    clientmoduleId: $scope.clientmoduleId,
                 });
            }
        }).catch(function(error) {
            console.error('Error fetching form details:', error);
        });
    }; 

    $scope.updateForm = function() {
        FormService.update($scope.formId, $scope.formData).then(function(response) {
            alert('Form updated successfully!');
            $state.go('base.form-view', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                clientmoduleId: $scope.clientmoduleId,
             });
        }).catch(function(error) {
            alert('Error updating form!')
            console.error('Error updating form:', error);
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.form-view', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: $scope.clientmoduleId,
         });
    };

    $scope.loadFormDetails();
}]);
