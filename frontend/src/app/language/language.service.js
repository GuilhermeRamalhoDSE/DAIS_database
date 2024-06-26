angular.module('frontend').factory('LanguageService', ['$http', function($http) {
    const baseUrl = 'https://daisdatabasedse.it/api/languages/'; 

    return {
        create: function(languageData) {
            return $http.post(baseUrl, languageData);
        },
        getAll: function() {
            return $http.get(baseUrl);
        },
        getById: function(languageId) {
            return $http.get(baseUrl + languageId);
        },
        update: function(languageId, languageData) {
            return $http.put(baseUrl + languageId, languageData);
        },
        delete: function(languageId) {
            return $http.delete(baseUrl + languageId);
        }
    };
}]);
