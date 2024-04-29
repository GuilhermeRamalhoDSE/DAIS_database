angular.module('frontend').factory('VoiceService', ['$http', function($http) {
    const baseUrl = 'http://18.201.85.201/api/voices/';
    return {
        create: function(voiceData) {
            return $http.post(baseUrl, voiceData);
        },
        getAll: function() {
            return $http.get(baseUrl);
        },
        getById: function(voiceId) {
            return $http.get(baseUrl + voiceId );
        },
        update: function(voiceId, voiceData) {
            return $http.put(baseUrl + voiceId, voiceData);
        },
        delete: function(voiceId) {
            return $http.delete(baseUrl + voiceId);
        }
    };
}]);
