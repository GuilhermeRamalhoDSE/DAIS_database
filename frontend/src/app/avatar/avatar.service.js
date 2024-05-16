angular.module('frontend').factory('AvatarService', ['$http', function($http) {
    var baseUrl = 'http://127.0.0.1:8000/api/avatar/'; 
    return {
        getAvatars: function() {
            return $http.get(baseUrl);
        },
        getAvatarById: function(avatarId) {
            return $http.get(baseUrl, { params: { avatar_id: avatarId } });
        },        
        createAvatar: function(avatarData, config) {
            return $http.post(baseUrl, avatarData, angular.extend({
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }, config, {
                uploadEventHandlers: config.uploadEventHandlers
            }));
        },
        updateAvatar: function(avatarId, avatarData) {
            return $http.put(baseUrl + avatarId, avatarData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        },
        deleteAvatar: function(avatarId) {
            return $http.delete(baseUrl + avatarId);
        }
    };
}]);
