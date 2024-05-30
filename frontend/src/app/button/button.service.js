angular.module('frontend').factory('ButtonService', ['$http', function($http){
    var service = {};
    var baseUrl = 'http://127.0.0.1:8000/api/buttons/';

    service.getAll = function(touchscreeninteractionId) {
        return $http.get(baseUrl, { params: { interaction_id: touchscreeninteractionId }});
    };

    service.getById = function(buttonId) {
        return $http.get(baseUrl + buttonId);
    };

    service.create = function(buttonData) {
        return $http.post(baseUrl, buttonData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    };

    service.update = function(buttonId, buttonData) {
        return $http.put(baseUrl + buttonId, buttonData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    };

    service.delete = function(buttonId) {
        return $http.delete(baseUrl + buttonId);
    };

    return service;
}]);
