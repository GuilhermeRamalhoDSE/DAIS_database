angular.module('frontend').factory('TotemService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://18.201.85.201/api/totem/';

    service.getAll = function(groupId) {
        return $http.get(baseUrl, { params: { group_id: groupId } });
    };

    service.getById = function(totemId) {
        return $http.get(baseUrl + totemId);
    };

    service.createTotem = function(totemData) {
        return $http.post(baseUrl, totemData);
    };
    
    service.duplicateTotem = function(totemId) {
        return $http.post(baseUrl + 'duplicate/' + totemId);
    };
    
    service.updateTotem = function(totemId, totemData) {
        return $http.put(baseUrl + totemId, totemData);
    };

    service.deleteTotem = function(totemId) {
        return $http.delete(baseUrl + totemId);
    };

    service.activate = function(totemId) {
        return $http.post(baseUrl + totemId + '/activate');
    };

    service.deactivate = function(totemId) {
        return $http.post(baseUrl + totemId + '/deactivate');
    };

    return service;
}]);
