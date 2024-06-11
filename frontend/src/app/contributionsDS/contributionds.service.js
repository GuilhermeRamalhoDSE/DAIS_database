angular.module('frontend').factory('ContributionDSService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'https://daisdatabasedse.it/api/contributionsDS/';

    service.getAll = function(timeslotId) {
        return $http.get(baseUrl, { params: { time_slot_id: timeslotId } });
    };

    service.getById = function(contributiondsId) {
        return $http.get(baseUrl + contributiondsId);
    };

    service.create = function(contributiondsData) {
        return $http.post(baseUrl, contributiondsData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    service.update = function(contributiondsId, contributiondsData) {
        return $http.put(baseUrl + contributiondsId, contributiondsData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    service.delete = function(contributiondsId) {
        return $http.delete(baseUrl + contributiondsId);
    };

    return service;
}]);
