angular.module('frontend').factory('LayerService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://18.201.85.201/api/layers/'; 

    service.createLayer = function(layerData) {
        return $http.post(baseUrl, layerData);
    };

    service.getLayersByPeriod = function(periodId) {
        return $http.get(baseUrl + periodId); 
    };

    service.getLayerById = function(layerId) {
        return $http.get(baseUrl + 'layer/' + layerId);
    };

    service.updateLayer = function(layerId, layerData) {
        return $http.put(baseUrl + 'update/' + layerId, layerData);
    };

    service.deleteLayer = function(layerId) {
        return $http.delete(baseUrl + 'delete/' + layerId);
    };

    return service;
}]);
