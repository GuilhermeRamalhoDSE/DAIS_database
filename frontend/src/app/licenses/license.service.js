angular.module('frontend').factory('LicenseService', ['$http', function($http) {
    var service = {};

    var baseUrl = 'http://127.0.0.1:8000/api/licenses/';

    service.getAll = function() {
        return $http.get(baseUrl);
    };

    service.getById = function(licenseId) {
        return $http.get(baseUrl, {
            params: { license_id: licenseId } 
        });
    };  
    
    service.create = function(licenseData) {
        return $http.post(baseUrl, licenseData);
    };

    service.update = function(id, licenseData) {
        return $http.put(`${baseUrl}${id}`, licenseData);
    };

    service.delete = function(id) {
        return $http.delete(`${baseUrl}${id}`);
    };

    service.addAvatarToLicense = function(licenseId, avatarId) {
        return $http.post(`${baseUrl}${licenseId}/add-avatar/`, { avatar_id: avatarId });
    };

    service.removeAvatarFromLicense = function(licenseId, avatarId) {
        return $http.post(`${baseUrl}${licenseId}/remove-avatar/`, { avatar_id: avatarId });
    };

    service.addVoiceToLicense = function(licenseId, voiceId) {
        return $http.post(`${baseUrl}${licenseId}/add-voice/`, { voice_id: voiceId });
    };

    service.removeVoiceFromLicense = function(licenseId, voiceId) {
        return $http.post(`${baseUrl}${licenseId}/remove-voice/`, { voice_id: voiceId });
    };

    return service;
}]);
