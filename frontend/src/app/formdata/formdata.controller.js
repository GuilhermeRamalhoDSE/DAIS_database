angular.module('frontend').controller('FormDataController', ['$scope', 'FormDataService', 'FormFieldService', '$state', '$stateParams', function($scope, FormDataService, FormFieldService, $state, $stateParams) {
    $scope.formData = {};
    $scope.formFields = []; 

    $scope.loadFormFields = function() {

        FormFieldService.getById($stateParams.formId).then(function(response) {
            $scope.formFields = response.data;
        }).catch(function(error) {
            console.error('Failed to fetch form fields:', error);
        });
    };

    $scope.submitFormData = function() {
        FormDataService.create($stateParams.formId, $scope.formData).then(function(response) {
            alert('Data saved successfully!');
            $state.go('some-state'); 
        }).catch(function(error) {
            console.error('Error saving form data:', error);
            alert('Failed to save data.');
        });
    };

    $scope.getFormData = function(form_data_id) {
        FormDataService.getById(form_data_id).then(function(response) {
            $scope.formData = response.data.data; 
        }).catch(function(error) {
            console.error('Error fetching form data:', error);
        });
    };

    $scope.deleteFormData = function(form_data_id) {
        FormDataService.delete(form_data_id).then(function(response) {
            alert('Data deleted successfully!');
            $state.reload(); 
        }).catch(function(error) {
            console.error('Error deleting form data:', error);
            alert('Failed to delete data.');
        });
    };

    $scope.loadFormFields(); 
}]);
