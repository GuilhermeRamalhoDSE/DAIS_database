angular.module('frontend').factory('FormDataService', ['$http', function($http){
    var service = {};
    var baseUrl = 'http://127.0.0.1:8000/api/formdata/'

    service.getAll = function(formId) {
        return $http.get(baseUrl, { params: { form_id:formId}});
    };

    service.getById = function(formdataId) {
        return $http.get(baseUrl + formdataId);
    };

    service.create = function(formdataData) {
        return $http.post(baseUrl, formdataData);
    };

    service.delete = function(formdataId) {
        return $http.delete(baseUrl + formdataId);
    };

    return service;
}])