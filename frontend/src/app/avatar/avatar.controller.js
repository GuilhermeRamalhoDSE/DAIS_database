angular.module('frontend').controller('AvatarController', ['$scope', '$http', 'Upload', 'AvatarService', '$state', 'AuthService', '$q', '$interval', function($scope, $http, Upload, AvatarService, $state, AuthService, $q, $interval) {
    $scope.avatarList = [];
    $scope.isSuperuser = AuthService.isSuperuser();

    $scope.newAvatar = {
        name: "",
        file: null,
    };

    $scope.loadAvatars = function() {
        AvatarService.getAvatars().then(function(response) {
            $scope.avatarList = response.data;
        }).catch(function(error) {
            console.error('Error fetching avatars:', error);
        });
    };

    $scope.goToCreateAvatar = function() {
        $state.go('base.avatar-new');
    };

    $scope.createAvatar = function() {
        var avatarData = new FormData();
        var avatarIn = JSON.stringify({
            name: $scope.newAvatar.name,
            voice: $scope.newAvatar.voice,
            file: $scope.newAvatar.file ? $scope.newAvatar.file.name : null
        });
    
        avatarData.append('avatar_in', avatarIn);
    
        if ($scope.newAvatar.file) {
            avatarData.append('file', $scope.newAvatar.file);
        }
    
        $scope.upload($scope.newAvatar.file).then(function() {
            AvatarService.createAvatar(avatarData).then(function(response) {
                alert('Avatar created successfully!');
                $scope.loadAvatars();
                $state.go('base.avatar-view');
            }).catch(function(error) {
                alert('Error creating avatar:', error);
            });
        });
    };    

    $scope.resetForm = function() {
        $scope.newAvatar = { name: "", file: null, voice: "" }; 
        $scope.isEditing = false;
        $scope.initForm();
    };    

    $scope.cancelCreate = function() {
        $state.go('base.avatar-view');
    };

    $scope.editAvatar = function(avatarId) {
        $state.go('base.avatar-update', { avatarId: avatarId });
    };

    $scope.deleteAvatar = function(avatarId) {
        if (confirm('Are you sure you want to delete this avatar?')) {
            AvatarService.deleteAvatar(avatarId).then(function(response) {
                alert('Avatar deleted successfully!');
                $scope.loadAvatars();
            }).catch(function(error) {
                console.error('Error deleting avatar:', error);
            });
        }
    };

    $scope.downloadAvatarFile = function(avatarId) {
        if (avatarId) {
            var downloadUrl = 'http://127.0.0.1:8000/api/avatar/download/' + avatarId;
            
            $http({
                url: downloadUrl,
                method: 'GET',
                responseType: 'blob', 
            }).then(function (response) {
                var blob = new Blob([response.data], {type: response.headers('Content-Type')});
                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href', window.URL.createObjectURL(blob));
                downloadLink.attr('download', 'AvatarFile-' + avatarId + '.fbx'); 
                
                downloadLink[0].click();
            }).catch(function (error) {
                console.error("Download failed: ", error);
            });
        } else {
            console.error("Download failed: Avatar ID is invalid.");
        }
    };
    
    $scope.upload = function(file) {
        var deferred = $q.defer(); 
    
        $scope.showProgress = true;
        $scope.loadingProgress = 0;
    
        var progressInterval = $interval(function() {
            $scope.loadingProgress += 10; 
            if ($scope.loadingProgress >= 100) {
                $interval.cancel(progressInterval); 
                deferred.resolve(); 
            }
        }, 500); 
    
        return deferred.promise; 
    };  
    

    $scope.loadAvatars();
}]);
