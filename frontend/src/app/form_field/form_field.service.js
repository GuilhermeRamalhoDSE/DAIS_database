angular.module('frontend').factory('FormFieldService', ['$http', function($http){
    var service = {};
    var baseUrl = 'https://daisdatabasedse.it/api/formfield/'

    service.getAll = function(formId) {
        return $http.get(baseUrl, { params: { form_id:formId}});
    };

    service.getById = function(formfieldId) {
        return $http.get(baseUrl + formfieldId);
    };

    service.create = function(formfieldData) {
        return $http.post(baseUrl, formfieldData);
    };

    service.update = function(formfieldId, formfieldData) {
        return $http.put(baseUrl + formfieldId, formfieldData);
    };

    service.delete = function(formfieldId) {
        return $http.delete(baseUrl + formfieldId);
    };

    return service;
}])