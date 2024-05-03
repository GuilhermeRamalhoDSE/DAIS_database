angular.module('frontend').factory('LogsService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://localhost:8000/api/logs/';

    service.getLogsByTotem = function(totemId) {
        return $http.get(baseUrl + 'totem/' + totemId);
    };

    service.getLogById = function(logId) {
        return $http.get(baseUrl + logId);
    };

    service.createLog = function(logData) {
        return $http.post(baseUrl, logData);
    };

    service.deleteLog = function(logId) {
        return $http.delete(baseUrl + logId);
    };

    return service;
}]);
