angular.module('frontend').factory('ContributionIAService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://127.0.0.1:8080/api/contributionsIA/';

    service.getAll = function(layerId) {
        return $http.get(baseUrl, { params: { layer_id: layerId } });
    };

    service.getById = function(contributionId) {
        return $http.get(baseUrl + contributionId);
    };

    service.create = function(contributionData) {
        return $http.post(baseUrl, contributionData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    service.update = function(contributionId, contributionData) {
        return $http.put(baseUrl + contributionId, contributionData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    service.delete = function(contributionId) {
        return $http.delete(baseUrl + contributionId);
    };

    return service;
}]);
