angular.module('frontend').factory('FormService', ['$http', function($http){
    var service = {};
    var baseUrl = 'https://daisdatabasedse.it/api/forms/'

    service.getAll = function(clientmoduleId) {
        return $http.get(baseUrl, { params: { client_module_id:clientmoduleId}});
    };

    service.getById = function(formId) {
        return $http.get(baseUrl + formId);
    };

    service.create = function(formData) {
        return $http.post(baseUrl, formData);
    };

    service.update = function(formId, formData) {
        return $http.put(baseUrl + formId, formData);
    };

    service.delete = function(formId) {
        return $http.delete(baseUrl + formId);
    };

    return service;
}])