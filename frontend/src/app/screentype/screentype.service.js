angular.module('frontend').factory('ScreenTypeService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://127.0.0.1:8000/api/scr/'

    service.create = function(moduleData) {
        return $http.post(baseUrl, moduleData);
    };
    
    service.getAll = function() {
        return $http.get(baseUrl);
    };

    service.getById = function(moduleId) {
        return $http.get(baseUrl + moduleId);
    };

    service.update = function(moduleId, moduleData) {
        return $http.put(baseUrl + moduleId, moduleData);
    };

    service.delete =  function(moduleId) {
        return $http.delete(baseUrl + moduleId);
    };

    return service;
}])