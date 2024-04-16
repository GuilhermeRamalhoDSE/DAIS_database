angular.module('frontend').controller('TimeSlotUpdateController', ['$scope', 'TimeslotService', '$state', '$stateParams',
function($scope, TimeslotService, $state, $stateParams) {
    $scope.timeslotId = $stateParams.timeslotId;
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.perioddsId = $stateParams.perioddsId;

    $scope.timeslotData = {};

    function formatTimeForInput(date) {
        var localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return localDate.toISOString().substring(11, 16);
    }

    $scope.loadTimeslotDetails = function() {
        TimeslotService.getTimeslotById($scope.timeslotId).then(function(response) {
            if (response.data) {
                $scope.timeslotData = response.data;
    
                var baseDate = new Date();
    
                var startTimeParts = $scope.timeslotData.start_time.split(':');
                var endTimeParts = $scope.timeslotData.end_time.split(':');
    
                $scope.timeslotData.start_time = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), startTimeParts[0], startTimeParts[1], startTimeParts[2]);
                $scope.timeslotData.end_time = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), endTimeParts[0], endTimeParts[1], endTimeParts[2]);
            } else {
                console.error('Timeslot not found');
                alert('Timeslot not found.');
                $scope.cancelUpdate();
            }
        }).catch(function(error) {
            console.error('Error fetching timeslot details:', error);
            alert('Error fetching timeslot details: Check console for details.');
        });
    };
    
    $scope.updateTimeslot = function() {
        var startTime = moment($scope.timeslotData.start_time).tz('Europe/Rome', true);
        var endTime = moment($scope.timeslotData.end_time).tz('Europe/Rome', true);

        var timeslotDataToUpdate = {
            period_id: $scope.perioddsId,
            start_time: startTime.format('HH:mm'),
            end_time: endTime.format('HH:mm')
        };

        TimeslotService.updateTimeslot($scope.timeslotId, timeslotDataToUpdate).then(function(response) {
            alert('Timeslot updated successfully!');
            $state.go('base.timeslot-view', {
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                perioddsId: $scope.perioddsId
            });
        }).catch(function(error) {
            console.error('Error updating timeslot:', error);
            alert('Error updating timeslot: Check console for details.');
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.timeslot-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            perioddsId: $scope.perioddsId
        });
    };

    $scope.loadTimeslotDetails();
}]);
