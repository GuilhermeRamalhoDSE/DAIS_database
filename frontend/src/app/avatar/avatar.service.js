angular.module('frontend').factory('AvatarService', ['$http', function($http) {
    var baseUrl = 'http://18.201.85.201/api/avatar/'; 
    return {
        getAvatars: function() {
            return $http.get(baseUrl);
        },
        getAvatarById: function(avatarId) {
            return $http.get(baseUrl, { params: { avatar_id: avatarId } });
        },        
        createAvatar: function(avatarData) {
            return $http.post(baseUrl, avatarData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
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
