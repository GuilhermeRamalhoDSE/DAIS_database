angular.module('frontend').factory('ClientModuleService', ['$http', function($http){
    var service = {};
    var baseUrl = 'http://127.0.0.1:8000/api/clientmodules/'

    service.getAll = function(clientId) {
        return $http.get(baseUrl, { params: { client_id:clientId}});
    };

    service.getById = function(clientmoduleId) {
        return $http.get(baseUrl + clientmoduleId);
    };

    service.create = function(clientmoduleData) {
        return $http.post(baseUrl, clientmoduleData)
    };

    service.update = function(clientmoduleId, clientmoduleData) {
        return $http.put(baseUrl + clientmoduleId, clientmoduleData);
    };

    service.delete = function(clientmoduleId) {
        return $http.delete(baseUrl + clientmoduleId);
    };

    return service;
}])