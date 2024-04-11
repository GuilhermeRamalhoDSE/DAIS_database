angular.module('frontend').factory('GroupService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://127.0.0.1:8000/api/groups/';

    service.getAll = function() {
        return $http.get(baseUrl);
    };

    service.getById = function(groupId) {
        return $http.get(baseUrl + groupId);
    };

    service.create = function(groupData) {

        return $http.post(baseUrl, groupData);
    };

    service.update = function(id, groupData) {
        return $http.put(baseUrl + id, groupData);
    };

    service.delete = function(id) {
        return $http.delete(baseUrl + id);
    };

    return service;
}]);
