angular.module('frontend').factory('DetailService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://18.201.85.201/api/details/';

    service.getAll = function(contributionId) {
        return $http.get(baseUrl, { params: { contribution_id: contributionId } });
    };

    service.getById = function(detailId) {
        return $http.get(baseUrl + detailId);
    };

    service.create = function(detailData) {
        return $http.post(baseUrl, detailData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    service.update = function(detailId, detailData) {
        return $http.put(baseUrl + detailId, detailData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    service.delete = function(detailId) {
        return $http.delete(baseUrl + detailId);
    };

    return service;
}]);
