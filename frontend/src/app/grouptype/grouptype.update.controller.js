angular.module('frontend').controller('GroupTypeUpdateController', ['$scope', 'GroupTypeService', '$state', '$stateParams', function($scope, GroupTypeService, $state, $stateParams) {
    $scope.grouptype = {};

    $scope.loadGroupTypeData = function() {
        const grouptypeId = $stateParams.grouptypeId;
        GroupTypeService.getById(grouptypeId).then(function(response) {
            if (response.data) {
                $scope.grouptype = response.data; 
            } else {
                console.error('No data received for grouptype');
                alert('No data found for this grouptype.');
            }
        }).catch(function(error) {
            console.error('Error fetching grouptype data:', error);
            alert('Error fetching grouptype data.');
        });
    };

    $scope.updateGroupType = function() {
        GroupTypeService.update($scope.grouptype.id, $scope.grouptype).then(function(response) {
            alert('GroupType updated successfully!');
            $state.go('base.grouptype-view');
        }).catch(function(error) {
            console.error('Error updating grouptype:', error);
            alert('Error updating grouptype.');
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.grouptype-view');
    };

    $scope.loadGroupTypeData();
}]);
