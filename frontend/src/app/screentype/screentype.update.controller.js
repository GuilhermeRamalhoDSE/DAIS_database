angular.module('frontend').controller('ScreenTypeUpdateController', ['$scope', 'ScreenTypeService', '$state', '$stateParams', function($scope, ScreenTypeService, $state, $stateParams) {
    $scope.screentype = {};

    $scope.loadScreenTypeData = function() {
        const screentypeId = $stateParams.screentypeId;
        ScreenTypeService.getById(screentypeId).then(function(response) {
            if (response.data) {
                $scope.screentype = response.data; 
            } else {
                console.error('No data received for screen type');
                alert('No data found for this screen type.');
            }
        }).catch(function(error) {
            console.error('Error fetching screen type data:', error);
            alert('Error fetching screen type data.');
        });
    };

    $scope.updateScreenType = function() {
        ScreenTypeService.update($scope.screentype.id, $scope.screentype).then(function(response) {
            alert('Screen Type updated successfully!');
            $state.go('base.screentype-view');
        }).catch(function(error) {
            console.error('Error updating screen type:', error);
            alert('Error updating screen type.');
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.screentype-view');
    };

    $scope.loadScreenTypeData();
}]);
