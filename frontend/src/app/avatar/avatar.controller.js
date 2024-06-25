angular.module('frontend').controller('AvatarController', ['$scope', 'AvatarService', '$state', 'AuthService', '$q', '$interval', '$location', '$window', '$filter', function($scope, AvatarService, $state, AuthService, $q, $interval, $location, $window, $filter) {
    $scope.avatarList = [];
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.isSuperuser = AuthService.isSuperuser();

    $scope.newAvatar = {
        name: "",
        file: null,
    };

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.avatarList, $scope.searchText);
        var startIndex = $scope.currentPage * $scope.pageSize;
        var endIndex = Math.min(startIndex + $scope.pageSize, filteredList.length);
        return filteredList.slice(startIndex, endIndex);
    };
     
    $scope.setCurrentPage = function(page) {
        if (page >= 0 && page < $scope.totalPages()) {
            $scope.currentPage = page;
        }
    };
    
    $scope.totalPages = function() {
        return Math.ceil($scope.avatarList.length / $scope.pageSize);
    };
    
    $scope.getPages = function() {
        var pages = [];
        for (var i = 0; i < $scope.totalPages(); i++) {
            pages.push(i);
        }
        return pages;
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
    
        $scope.upload().then(function() {
            AvatarService.createAvatar(avatarData).then(function(response) {
                alert('Avatar created successfully!');
                $scope.loadAvatars();
                $state.go('base.avatar-view');
            }).catch(function(error) {
                alert('Error creating avatar:', error);
            });
        });
    };  
    
    $scope.uploadAvatarFile = function(avatarId, avatarName, file) {
        var avatarData = new FormData();
        avatarData.append('file', file);

        const payload = {
            name: avatarName,
        };
        
        avatarData.append('payload', JSON.stringify(payload));

        $scope.upload().then(function() {
            AvatarService.updateAvatar(avatarId, avatarData).then(function(response) {
                alert('Avatar file uploaded successfully!');
                $scope.loadAvatars();
                $window.location.reload();
            }).catch(function(error) {
                console.error('Error uploading avatar file:', error);
            });
        });
    };

    $scope.triggerFileInput = function(avatarId, avatarName) {
        var fileInput = document.getElementById('fileInput' + avatarId);
        fileInput.click();

        fileInput.onchange = function(event) {
            var file = event.target.files[0];
            $scope.uploadAvatarFile(avatarId, avatarName, file);
        };
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
    
    $scope.goBack = function() {
        $state.go('base.home-su');
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

    $scope.viewFile = function(filePath) {
        if (filePath) {
            window.open('https://daisdatabasedse.it/' + filePath, '_blank');
        } else {
            alert('File path not available.');
        }
    };
    
    $scope.upload = function() {
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
