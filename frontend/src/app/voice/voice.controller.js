angular.module('frontend').controller('VoiceController', ['$scope', 'VoiceService', '$state', 'AuthService', '$filter', function($scope, VoiceService, $state, AuthService, $filter) {
    $scope.voices = [];
    $scope.currentPage = 0;
    $scope.pageSize = 5;
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
        for (var i = 0; i < $scope.totalPages(); i++) {
            pages.push(i);
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
