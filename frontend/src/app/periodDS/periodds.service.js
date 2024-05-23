angular.module('frontend').factory('PeriodDSService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'https://daisdatabasedse.it/api/periodds/';

    service.createPeriodDS = function(periodDSData) {
        return $http.post(baseUrl, periodDSData);
    };

    service.getAllPeriodDSs = function(groupId) {
        return $http.get(baseUrl, { params: { group_id: groupId } });
    };

    service.getPeriodDSById = function(periodDSId) {
        return $http.get(baseUrl + periodDSId);
    };

    service.updatePeriodDS = function(periodDSId, periodDSData) {
        return $http.put(baseUrl + periodDSId, periodDSData);
    };

    service.deletePeriodDS = function(periodDSId) {
        return $http.delete(baseUrl + periodDSId);
    };

    return service;
}]);
