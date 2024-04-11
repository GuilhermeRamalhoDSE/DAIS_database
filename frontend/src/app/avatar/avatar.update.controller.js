angular.module('frontend').controller('AvatarUpdateController', ['$scope', '$state', 'AvatarService', 'AuthService', function($scope, $state, AvatarService, AuthService) {
    $scope.formAvatar = {};
    $scope.isSuperuser = AuthService.isSuperuser();

    $scope.loadAvatar = function() {
        const avatarId = $state.params.avatarId;
        AvatarService.getAvatarById(avatarId).then(function(response) {
            if (response.data && response.data.length > 0) {
                $scope.formAvatar = response.data[0];
                if (!$scope.isSuperuser) {
                    if (!$scope.formAvatar.license_id) {
                        $scope.formAvatar.license_id = AuthService.getLicenseId();
                    }
                }
            } else {
                $state.go('base.avatar-view');
            }
        }).catch(function(error) {
            console.error('Error fetching avatar:', error);
        });
    };
    
    $scope.updateAvatar = function() {
        var avatarDataToUpdate = new FormData();
        
        if ($scope.formAvatar.file && $scope.formAvatar.file !== $scope.formAvatar.originalFile) {
            avatarDataToUpdate.append('file', $scope.formAvatar.file);
        }
        
        const payload = {
            name: $scope.formAvatar.name,
        };
        
        avatarDataToUpdate.append('payload', JSON.stringify(payload));
        
        AvatarService.updateAvatar($scope.formAvatar.id, avatarDataToUpdate).then(function(response) {
            alert('Avatar updated successfully');
            $state.go('base.avatar-view');
        }).catch(function(error) {
            console.error('Error updating avatar:', error);
            alert('Failed to update avatar');
        });
    };
    
    $scope.cancelUpdate = function() {
        $state.go('base.avatar-view');
    };

    $scope.loadAvatar();
}]);
