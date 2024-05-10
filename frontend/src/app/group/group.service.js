angular.module('frontend').factory('GroupService', ['$http', function($http) {
    var service = {};
    var baseUrl = 'http://127.0.0.1:8000/api/groups/';

    service.getAll = function(clientId) {
        return $http.get(baseUrl, { params: { client_id: clientId }});
    };

    service.getById = function(groupId) {
        return $http.get(baseUrl + groupId);
    };

    service.getAllByLicense = function(licenseId) {
        return $http.get(baseUrl, { params: { license_id: licenseId }});
    };

    service.getAllByClient = function(clientId) {
        return $http.get(baseUrl, { params: { client_id: clientId }});
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
    service.addFormToGroup = function(groupId, formId) {
        return $http.post(`${baseUrl}${groupId}/add-form/`, { form_id: formId });
    };

    service.removeFormFromGroup = function(groupId, formId) {
        return $http.post(`${baseUrl}${groupId}/remove-form/`, { form_id: formId });
    };

    service.getFormsByGroup = function(groupId) {
        return $http.get(baseUrl + groupId + '/forms/');
    };

    return service;
}]);
