angular.module('frontend').controller('FormDataController', ['$scope', 'FormDataService', 'FormFieldService', 'AuthService', '$state', '$stateParams', function($scope, FormDataService, FormFieldService, AuthService, $state, $stateParams) {
    $scope.formData = {};
    $scope.formDataList = [];
    $scope.formFields = []; 

    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.clientmoduleId = $stateParams.clientmoduleId;
    $scope.isSuperuser = AuthService.isSuperuser();
 
    let formId = parseInt($stateParams.formId || sessionStorage.getItem('lastformId'), 10);
    sessionStorage.setItem('lastformId', formId.toString());

    let formName = $stateParams.formName || sessionStorage.getItem('lastformName');
    sessionStorage.setItem('lastformName', formName);
    $scope.formName = formName;

    $scope.loadFormFields = function() {
        FormFieldService.getAll(formId).then(function(response) {
            $scope.formFields = response.data;
            $scope.getFormData();
        }).catch(function(error) {
            console.error('Failed to fetch form fields:', error);
        });
    };

    $scope.goToCreateFormData = function() {
        $state.go('base.formdata-new', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: $scope.clientmoduleId,
            formId: formId,
            formName: formName 
        });
    };

    $scope.createFormData = function() {  
        
        if (!Object.keys($scope.formData).length) {
            alert('Please fill in the form data.');
            return;
        }

        FormDataService.create(formId, $scope.formData).then(function(response) {
            alert('Data saved successfully!');
            $state.go('base.formdata-view', {
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                clientmoduleId: $scope.clientmoduleId,
                formId: formId,
                formName: formName 
            });
        }).catch(function(error) {
            console.error('Error saving form data:', error);
            alert('Failed to save data. Please check the form inputs and try again.');
        });
    };
    
    $scope.getFormData = function() {
        FormDataService.getAll(formId).then(function(response) {
            $scope.formDataList = response.data; 
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

    $scope.cancelCreate = function() {
        $state.go('base.formdata-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: $scope.clientmoduleId,
            formId: formId,
            formName: formName 
        });
    };

    $scope.exportToCSV = function() {
        var csvContent = "data:text/csv;charset=utf-8,";
    
        var headers = $scope.formFields.map(function(field) {
            return field.name;
        });
        csvContent += headers.join(",") + "\n";
    
        $scope.formDataList.forEach(function(data) {
            var row = [];
            $scope.formFields.forEach(function(field) {
                var value = data.data[field.name];
                if (field.field_type === 'date') {
                    value = $filter('date')(value, 'dd/MM/yyyy');
                }
                row.push(value);
            });
            csvContent += row.join(",") + "\n";
        });
    
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", $scope.formName + ".csv");
        document.body.appendChild(link);
    
        link.click();
    };

    $scope.goBack = function() {
        $state.go('base.form-view',{
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            clientmoduleId: $scope.clientmoduleId
        });
    };

    $scope.loadFormFields(); 
}]);
