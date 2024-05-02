angular.module('frontend').factory('UserService', ['$http', function($http) {
    var service = {};

    var baseUrl = 'http://localhost:8000/api/users/';

    service.getAllUsers = function() {
        return $http.get(baseUrl);
    };

    service.createUser = function(userData) {
        return $http.post(baseUrl, userData);
    };

    service.updateUser = function(id, userData) {
        return $http.put(`${baseUrl}${id}`, userData);
    };

    service.deleteUser = function(id) {
        return $http.delete(`${baseUrl}${id}`);
    };

    service.getUserById = function(userId) {
        return $http.get(baseUrl, { params: { user_id: userId } });
    };
    service.getAllLicenses = function() {
        return $http.get('http://localhost:8000/api/licenses/');
    };   
    
    return service;
}]);
