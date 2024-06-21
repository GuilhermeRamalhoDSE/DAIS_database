angular.module('frontend').factory('ClientModuleService', ['$http', function($http){
    var service = {};
    var baseUrl = 'https://daisdatabasedse.it/api/clientmodules/'

    service.getAll = function(clientId) {
        return $http.get(baseUrl, { params: { client_id:clientId}});
    };

    service.getById = function(clientmoduleId) {
        return $http.get(baseUrl + clientmoduleId);
    };

    service.create = function(clientmoduleData) {
        return $http.post(baseUrl, clientmoduleData)
    };

    service.update = function(clientmoduleId, clientmoduleData) {
        return $http.put(baseUrl + clientmoduleId, clientmoduleData);
    };

    service.delete = function(clientmoduleId) {
        return $http.delete(baseUrl + clientmoduleId);
    };

    service.addGroupToModule = function(clientmoduleId, groupId) {
        return $http.post(`${baseUrl}${clientmoduleId}/add-group/`, { group_id: groupId });
    };

    service.removeGroupFromModule = function(clientmoduleId, groupId) {
        return $http.post(`${baseUrl}${clientmoduleId}/remove-group/`, { group_id: groupId });
    };

    service.getGroupsByModule = function(clientmoduleId) {
        return $http.get(baseUrl + clientmoduleId + '/groups/');
    };

    return service;
}])