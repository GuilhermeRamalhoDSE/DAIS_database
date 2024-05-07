angular.module('frontend').controller('FormDataController', ['$scope', 'FormDataService', '$state', '$stateParams', function($scope, FormDataService, $state, $stateParams) {
    $scope.formData = {};
    $scope.formFields = []; // Deve ser carregado com os campos do formulário

    // Carregar detalhes do formulário para construir dinamicamente no frontend
    $scope.loadFormFields = function() {
        // Supondo que FormFieldService já esteja definido e obtenha os campos do formulário especificado
        FormFieldService.getFieldsByFormId($stateParams.formId).then(function(response) {
            $scope.formFields = response.data;
        }).catch(function(error) {
            console.error('Failed to fetch form fields:', error);
        });
    };

    // Enviar dados do formulário
    $scope.submitFormData = function() {
        FormDataService.create($stateParams.formId, $scope.formData).then(function(response) {
            alert('Data saved successfully!');
            $state.go('some-state'); // Redirecionar conforme necessário
        }).catch(function(error) {
            console.error('Error saving form data:', error);
            alert('Failed to save data.');
        });
    };

    // Obter dados salvos (Para visualização)
    $scope.getFormData = function(form_data_id) {
        FormDataService.getById(form_data_id).then(function(response) {
            $scope.formData = response.data.data; // Ajuste de acordo com a resposta do backend
        }).catch(function(error) {
            console.error('Error fetching form data:', error);
        });
    };

    // Deletar um dado específico
    $scope.deleteFormData = function(form_data_id) {
        FormDataService.delete(form_data_id).then(function(response) {
            alert('Data deleted successfully!');
            $state.reload(); // Recarrega o estado atual para refletir a mudança
        }).catch(function(error) {
            console.error('Error deleting form data:', error);
            alert('Failed to delete data.');
        });
    };

    $scope.loadFormFields(); // Inicializa os campos do formulário ao carregar
}]);
