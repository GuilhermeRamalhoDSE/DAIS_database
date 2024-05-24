angular.module('frontend').controller('VoiceController', ['$scope', 'VoiceService', '$state', 'AuthService', '$location', function($scope, VoiceService, $state, AuthService,$location) {
    $scope.voices = [];
    $scope.newVoice = {
        name: "",
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

    $scope.isHomePage = function() {
        return $location.path() === '/home';
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
        $state.go('base.home');
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
