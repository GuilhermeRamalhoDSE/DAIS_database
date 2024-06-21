angular.module('frontend').factory('LogsService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://127.0.0.1:8000/api/logs/';

    service.getLogsByLicense = function(licenseId) {
        return $http.get(baseUrl, {
            params: {
                license_id: licenseId
            }
        });
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
