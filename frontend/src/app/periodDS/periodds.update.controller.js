angular.module('frontend').controller('PeriodDSUpdateController', ['$scope', 'PeriodDSService', 'AuthService', '$state', '$stateParams', function($scope, PeriodDSService, AuthService, $state, $stateParams) {
    $scope.isSuperuser = AuthService.isSuperuser();

    var clientId = $stateParams.clientId;
    var clientName = $stateParams.clientName;
    var groupId = $stateParams.groupId;
    var groupName = $stateParams.groupName;
    var perioddsId = $stateParams.perioddsId;
    $scope.periodDSData = {};

    $scope.loadPeriodDSDetails = function() {
        if (!perioddsId) {
            console.error('No PeriodDS ID provided.');
            alert('No Period ID provided.');
            $state.go('base.periodds-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
            return;
        }
        PeriodDSService.getPeriodDSById(perioddsId).then(function(response) {
            if (response.data) {
                $scope.periodDSData = response.data;

                ['start_date', 'end_date'].forEach(function(dateField) {
                    if ($scope.periodDSData[dateField]) {
                        $scope.periodDSData[dateField] = new Date($scope.periodDSData[dateField]);
                    }
                });

            } else {
                console.error('PeriodDS not found');
                alert('Period not found.');
                $state.go('base.periodds-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
            }
        }).catch(function(error) {
            console.error('Error fetching PeriodDS details:', error);
            alert('Error fetching PeriodDS details: Check console for details.');
        });
    };

    $scope.updatePeriodDS = function() {
        var periodDSDataToUpdate = angular.copy($scope.periodDSData);
        
        ['start_date', 'end_date'].forEach(function(dateField) {
            if (periodDSDataToUpdate[dateField]) {
                periodDSDataToUpdate[dateField] = moment(periodDSDataToUpdate[dateField]).format('YYYY-MM-DD');
            }
        });

        PeriodDSService.updatePeriodDS(perioddsId, periodDSDataToUpdate).then(function(response) {
            alert('Period updated successfully!');
            $state.go('base.periodds-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
        }).catch(function(error) {
            console.error('Error updating PeriodDS:', error);
            alert('Error updating PeriodDS: Check console for details.');
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.periodds-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
    };

    $scope.loadPeriodDSDetails();
}]);
