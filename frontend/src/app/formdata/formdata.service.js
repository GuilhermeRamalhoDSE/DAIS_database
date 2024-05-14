angular.module('frontend').factory('FormDataService', ['$http', function($http){
    var service = {};
    var baseUrl = 'http://127.0.0.1:8080/api/formdata/'

    service.getAll = function(formId) {
        return $http.get(baseUrl, { params: { form_id:formId}});
    };

    service.create = function(formId, formdataData) {
        return $http.post(baseUrl, {form_id: formId, data: formdataData});
    };    

    service.delete = function(formdataId) {
        return $http.delete(baseUrl + formdataId);
    };

    return service;
}])