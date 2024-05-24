angular.module('frontend').factory('ButtonTypeService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'https://daisdatabasedse.it/api/buttontypes/'

    service.create = function(buttontypeData) {
        return $http.post(baseUrl, buttontypeData);
    };
    
    service.getAll = function() {
        return $http.get(baseUrl);
    };

    service.getById = function(buttontypeId) {
        return $http.get(baseUrl + buttontypeId);
    };

    service.update = function(buttontypeId, buttontypeData) {
        return $http.put(baseUrl + buttontypeId, buttontypeData);
    };

    service.delete =  function(buttontypeId) {
        return $http.delete(baseUrl + buttontypeId);
    };

    return service;
}])