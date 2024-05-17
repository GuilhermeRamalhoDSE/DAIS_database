angular.module('frontend').factory('TouchscreenInteractionService', ['$http', function($http){
    var service = {};
    var baseUrl = 'http://127.0.0.1:8000/api/touchscreen-interactions/'

    service.getAll = function(clientmoduleId) {
        return $http.get(baseUrl, { params: { client_module_id:clientmoduleId}});
    };

    service.getById = function(touchscreeninteractionId) {
        return $http.get(baseUrl + touchscreeninteractionId);
    };

    service.create = function(touchscreeninteractionData) {
        return $http.post(baseUrl, touchscreeninteractionData);
    };

    service.update = function(touchscreeninteractionId, touchscreeninteractionData) {
        return $http.put(baseUrl + touchscreeninteractionId, touchscreeninteractionData);
    };

    service.delete = function(touchscreeninteractionId) {
        return $http.delete(baseUrl + touchscreeninteractionId);
    };

    return service;
}])