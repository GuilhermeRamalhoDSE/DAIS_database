angular.module('frontend').controller('PeriodIAUpdateController', ['$scope', 'PeriodIAService', 'AuthService', '$state', '$stateParams', function($scope, PeriodIAService, AuthService, $state, $stateParams) {
    $scope.isSuperuser = AuthService.isSuperuser();

    var clientId = $stateParams.clientId;
    var clientName = $stateParams.clientName;
    var groupId = $stateParams.groupId;
    var groupName = $stateParams.groupName;
    var periodiaId = $stateParams.periodiaId;
    $scope.periodIAData = {};

    $scope.loadPeriodIADetails = function() {
        if (!periodiaId) {
            console.error('No PeriodIA ID provided.');
            alert('No Period ID provided.');
            $state.go('base.periodia-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
            return;
        }
        PeriodIAService.getPeriodIAById(periodiaId).then(function(response) {
            if (response.data) {
                $scope.periodIAData = response.data;

                ['start_date', 'end_date'].forEach(function(dateField) {
                    if ($scope.periodIAData[dateField]) {
                        $scope.periodIAData[dateField] = new Date($scope.periodIAData[dateField]);
                    }
                });

            } else {
                console.error('PeriodIA not found');
                alert('Period not found.');
                $state.go('base.periodia-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
            }
        }).catch(function(error) {
            console.error('Error fetching PeriodIA details:', error);
            alert('Error fetching PeriodIA details: Check console for details.');
        });
    };

    $scope.updatePeriodIA = function() {
        var periodIADataToUpdate = angular.copy($scope.periodIAData);
        
        ['start_date', 'end_date'].forEach(function(dateField) {
            if (periodIADataToUpdate[dateField]) {
                periodIADataToUpdate[dateField] = moment(periodIADataToUpdate[dateField]).format('YYYY-MM-DD');
            }
        });

        PeriodIAService.updatePeriodIA(periodiaId, periodIADataToUpdate).then(function(response) {
            alert('Period updated successfully!');
            $state.go('base.periodia-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
        }).catch(function(error) {
            console.error('Error updating PeriodIA:', error);
            alert('Error updating PeriodIA: Check console for details.');
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.periodia-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
    };

    $scope.loadPeriodIADetails();
}]);
