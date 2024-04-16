angular.module('frontend').factory('ContributionService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://127.0.0.1:8000/api/contributions/';

    service.getAll = function(timeSlotId) {
        return $http.get(baseUrl, { params: { time_slot_id: timeSlotId } });
    };

    service.getById = function(contributionId) {
        return $http.get(baseUrl + contributionId);
    };

    service.create = function(contributionData) {
        return $http.post(baseUrl, contributionData);
    };

    service.update = function(contributionId, contributionData) {
        return $http.put(baseUrl + contributionId, contributionData);
    };

    service.delete = function(contributionId) {
        return $http.delete(baseUrl + contributionId);
    };

    return service;
}]);
