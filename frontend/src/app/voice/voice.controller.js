angular.module('frontend').controller('VoiceController', ['$scope', 'VoiceService', '$state', 'AuthService', '$filter', function($scope, VoiceService, $state, AuthService, $filter) {
    $scope.voices = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.visiblePages = 3;
    $scope.newVoice = {
        name: "",
    };

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.voices, $scope.searchText);
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
        return Math.ceil($scope.voices.length / $scope.pageSize);
    };
    
    $scope.getPages = function() {
        var pages = [];
        var total = $scope.totalPages();
        var startPage = Math.max(0, $scope.currentPage - Math.floor($scope.visiblePages / 2));
        var endPage = Math.min(total, startPage + $scope.visiblePages);
    
        if (startPage > 0) {
            pages.push(0);
            if (startPage > 1) {
                pages.push('...');
            }
        }
    
        for (var i = startPage; i < endPage; i++) {
            pages.push(i);
        }
    
        if (endPage < total) {
            if (endPage < total - 1) {
                pages.push('...');
            }
            pages.push(total - 1);
        }
    
        return pages;
    };

    $scope.loadVoices = function() {
        VoiceService.getAll().then(function(response) {
            $scope.voices = response.data;
        }, function(error) {
            console.error('Error loading voices:', error);
        });
    };

    $scope.goToNewVoice = function() {
        $state.go('base.voice-new');
    };

    $scope.createVoice = function() {
        VoiceService.create($scope.newVoice).then(function(response) {
            alert('Voice created successfully!');
            $state.go('base.voice-view'); 
        }).catch(function(error) {
            console.error('Error creating voice:', error);
        });
    };

    $scope.editVoice = function(voiceId) {
        $state.go('base.voice-update', { voiceId: voiceId });
    };

    $scope.cancelCreate = function() {
        $state.go('base.voice-view');
    };

    $scope.goBack = function() {
        $state.go('base.home-su');
    };

    $scope.deleteVoice = function(voiceId) {
        if (confirm('Are you sure you want to delete this voice?')) {
            VoiceService.delete(voiceId).then(function(response) {
                alert('Voice deleted successfully!');
                $scope.loadVoices();
            }).catch(function(error) {
                console.error('Error deleting voice:', error);
            });
        }
    };

    $scope.isSuperuser = function() {
        return AuthService.isSuperuser();
    };

    $scope.loadVoices();
}]);
