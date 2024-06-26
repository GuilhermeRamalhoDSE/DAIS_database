angular.module('frontend').factory('ContributionAIService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'https://daisdatabasedse.it/api/contributionsAI/';

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
