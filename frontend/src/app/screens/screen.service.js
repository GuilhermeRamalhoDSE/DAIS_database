angular.module('frontend').factory('ScreenService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://127.0.0.1:8000/api/screens/';

    service.getAll = function(totemId) {
        return $http.get(baseUrl, { params: { totem_id: totemId } });
    };

    service.getById = function(screenId) {
        return $http.get(baseUrl + screenId);
    };

    service.create = function(screenData) {
        return $http.post(baseUrl, screenData);
    };

    service.update = function(screenId, screenData) {
        return $http.put(baseUrl + screenId, screenData);
    };

    service.delete = function(screenId) {
        return $http.delete(baseUrl + screenId);
    };

    return service;
}]);
