angular.module('frontend').factory('TotemService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://127.0.0.1:8000/api/totem/';

    service.getAll = function(groupId) {
        return $http.get(baseUrl, { params: { group_id: groupId } });
    };

    service.getById = function(totemId) {
        return $http.get(baseUrl + totemId);
    };

    service.createTotem = function(totemData) {
        return $http.post(baseUrl, totemData);
    };

    service.updateTotem = function(totemId, totemData) {
        return $http.put(baseUrl + totemId, totemData);
    };

    service.deleteTotem = function(totemId) {
        return $http.delete(baseUrl + totemId);
    };

    return service;
}]);
