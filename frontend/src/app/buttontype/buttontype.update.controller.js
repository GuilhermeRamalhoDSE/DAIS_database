angular.module('frontend').controller('ButtonTypeUpdateController', ['$scope', 'ButtonTypeService', '$state', '$stateParams', function($scope, ButtonTypeService, $state, $stateParams) {
    $scope.buttontype = {};

    $scope.loadButtonTypeData = function() {
        const buttontypeId = $stateParams.buttontypeId;
        ButtonTypeService.getById(buttontypeId).then(function(response) {
            if (response.data) {
                $scope.buttontype = response.data; 
            } else {
                console.error('No data received for button type');
                alert('No data found for this button type.');
            }
        }).catch(function(error) {
            console.error('Error fetching button type data:', error);
            alert('Error fetching button type data.');
        });
    };

    $scope.updateButtonType = function() {
        ButtonTypeService.update($scope.buttontype.id, $scope.buttontype).then(function(response) {
            alert('Button Type updated successfully!');
            $state.go('base.buttontype-view');
        }).catch(function(error) {
            console.error('Error updating button type:', error);
            alert('Error updating button type.');
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.buttontype-view');
    };

    $scope.loadButtonTypeData();
}]);
