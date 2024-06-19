angular.module('frontend').factory('GroupTypeService', ['$http', function($http) {
    const baseUrl = 'http://127.0.0.1:8000/api/grouptypes/';
    return {
        create: function(grouptypeData) {
            return $http.post(baseUrl, grouptypeData);
        },
        getAll: function() {
            return $http.get(baseUrl);
        },
        getById: function(grouptypeId) {
            return $http.get(baseUrl + grouptypeId );
        },
        update: function(grouptypeId, grouptypeData) {
            return $http.put(baseUrl + grouptypeId, grouptypeData);
        },
        delete: function(grouptypeId) {
            return $http.delete(baseUrl + grouptypeId);
        }
    };
}]);
