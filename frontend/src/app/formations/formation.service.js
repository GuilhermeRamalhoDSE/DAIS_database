angular.module('frontend').factory('FormationService', ['$http', function($http){
    var service = {};
    var baseUrl = 'https://daisdatabasedse.it/api/formations/'

    service.getAll = function(layerId) {
        return $http.get(baseUrl, { params: { layer_id:layerId}});
    };

    service.getById = function(formationId) {
        return $http.get(baseUrl + formationId);
    };

    service.create = function(formationData) {
        return $http.post(baseUrl, formationData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    service.update = function(formationId, formationData) {
        return $http.put(baseUrl + formationId, formationData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    service.delete = function(formationId) {
        return $http.delete(baseUrl + formationId);
    };

    return service;
}])