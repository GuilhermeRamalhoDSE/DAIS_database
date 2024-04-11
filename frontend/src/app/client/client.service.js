angular.module('frontend').factory('ClientService', ['$http', function($http) {
    const baseUrl = 'http://127.0.0.1:8000/api/clients/';
    return {
        create: function(clientData) {
            return $http.post(baseUrl, clientData);
        },
        getAll: function() {
            return $http.get(baseUrl);
        },
        getById: function(clientId) {
            return $http.get(baseUrl, { params: { client_id: clientId } });
        },        
        update: function(clientId, clientData) {
            return $http.put(baseUrl + clientId, clientData);
        },
        delete: function(clientId) {
            return $http.delete(baseUrl + clientId);
        }        
    };
}]);