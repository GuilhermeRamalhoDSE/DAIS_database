angular.module('frontend').factory('PeriodIAService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://localhost:8000/api/periodia/'; 

    service.createPeriodIA = function(periodIAData) {
        return $http.post(baseUrl, periodIAData);
    };

    service.getAllPeriodIAs = function(groupId) {
        return $http.get(baseUrl, { params: { group_id: groupId } });
    };

    service.getPeriodIAById = function(periodIAId) {
        return $http.get(baseUrl + periodIAId);
    };

    service.updatePeriodIA = function(periodIAId, periodIAData) {
        return $http.put(baseUrl + periodIAId, periodIAData);
    };

    service.deletePeriodIA = function(periodIAId) {
        return $http.delete(baseUrl + periodIAId);
    };

    return service;
}]);
