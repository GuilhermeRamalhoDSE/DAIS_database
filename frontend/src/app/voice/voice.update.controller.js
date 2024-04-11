angular.module('frontend').controller('VoiceUpdateController', ['$scope', 'VoiceService', '$state', '$stateParams', function($scope, VoiceService, $state, $stateParams) {
    $scope.voice = {};

    $scope.loadVoiceData = function() {
        const voiceId = $stateParams.voiceId;
        VoiceService.getById(voiceId).then(function(response) {
            if (response.data) {
                $scope.voice = response.data; 
            } else {
                console.error('No data received for voice');
                alert('No data found for this voice.');
            }
        }).catch(function(error) {
            console.error('Error fetching voice data:', error);
            alert('Error fetching voice data.');
        });
    };

    $scope.updateVoice = function() {
        VoiceService.update($scope.voice.id, $scope.voice).then(function(response) {
            alert('Voice updated successfully!');
            $state.go('base.voice-view');
        }).catch(function(error) {
            console.error('Error updating voice:', error);
            alert('Error updating voice.');
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.voice-view');
    };

    $scope.loadVoiceData();
}]);
