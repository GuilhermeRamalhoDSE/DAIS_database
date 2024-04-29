angular.module('frontend').factory('LicenseService', ['$http', function($http) {
    var service = {};

    var baseUrl = 'https://daisdatabasedse.it/api/licenses/';

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

    service.addLanguageToLicense = function(licenseId, languageId) {
        return $http.post(`${baseUrl}${licenseId}/add-language/`, { language_id: languageId });
    };

    service.removeLanguageFromLicense = function(licenseId, languageId) {
        return $http.post(`${baseUrl}${licenseId}/remove-language/`, { language_id: languageId });
    };

    service.addModuleToLicense = function(licenseId, moduleId) {
        return $http.post(`${baseUrl}${licenseId}/add-module/`, { module_id: moduleId });
    };

    service.removeModuleFromLicense = function(licenseId, moduleId) {
        return $http.post(`${baseUrl}${licenseId}/remove-module/`, { module_id: moduleId });
    };

    service.addScreenTypeToLicense = function(licenseId, screentypeId) {
        return $http.post(`${baseUrl}${licenseId}/add-screentype/`, { screentype_id: screentypeId });
    };

    service.removeScreenTypeFromLicense = function(licenseId, screentypeId) {
        return $http.post(`${baseUrl}${licenseId}/remove-screentype/`, { screentype_id: screentypeId });
    };

    service.getAvatarsByLicense = function(licenseId) {
        return $http.get(baseUrl + licenseId + '/avatars/');
    };

    service.getLanguagesByLicense = function(licenseId) {
        return $http.get(baseUrl + licenseId + '/languages/');
    };

    service.getVoicesByLicense = function(licenseId) {
        return $http.get(baseUrl + licenseId + '/voices/');
    };

    service.getModulesByLicense = function(licenseId) {
        return $http.get(baseUrl + licenseId + '/modules/');
    };

    service.getScreenTypeByLicense = function(licenseId) {
        return $http.get(baseUrl + licenseId + '/screentypes/');
    };
    
    return service;
}]);
