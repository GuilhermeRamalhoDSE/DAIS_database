angular.module('frontend').factory('ContributionService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://localhost:8000/api/contributionsDS/';

    service.getAll = function(timeslotId) {
        return $http.get(baseUrl, { params: { time_slot_id: timeslotId } });
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

    service.setRandomOrder = function(contributionId) {
        return $http.post(`${baseUrl}${contributionId}/set-random/`);
    };

    service.unsetRandomOrder = function(contributionId) {
        return $http.post(`${baseUrl}${contributionId}/unset-random/`);
    };


    return service;
}]);
