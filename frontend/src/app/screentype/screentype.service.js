angular.module('frontend').factory('ScreenTypeService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://18.201.85.201/api/screentypes/'

    service.create = function(screentypeData) {
        return $http.post(baseUrl, screentypeData);
    };
    
    service.getAll = function() {
        return $http.get(baseUrl);
    };

    service.getById = function(screentypeId) {
        return $http.get(baseUrl + screentypeId);
    };

    service.update = function(screentypeId, screentypeData) {
        return $http.put(baseUrl + screentypeId, screentypeData);
    };

    service.delete =  function(screentypeId) {
        return $http.delete(baseUrl + screentypeId);
    };

    return service;
}])