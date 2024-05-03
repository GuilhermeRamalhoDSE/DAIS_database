angular.module('frontend').controller('TimeSlotController', ['$scope', 'TimeslotService', '$state', '$stateParams',
function($scope, TimeslotService, $state, $stateParams) {
    $scope.timeslots = [];
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;

    let perioddsId = parseInt($stateParams.perioddsId || sessionStorage.getItem('lastPerioddsId'), 10);
    sessionStorage.setItem('lastPerioddsId', perioddsId.toString());

    function formatTimeForInput(date) {
        var localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return localDate.toISOString().substring(11, 16); 
    }

    $scope.newTimeslot = {
        start_time: '',
        end_time: '',
        period_id: perioddsId
    };

    $scope.loadTimeslots = function() {
        TimeslotService.getAllTimeslots(perioddsId).then(function(response) {
            $scope.timeslots = response.data;
        }).catch(function(error) {
            console.error('Error loading timeslots:', error);
        });
    };

    $scope.createTimeslot = function() {
        var startTime = moment($scope.newTimeslot.start_time).tz('Europe/Rome', true);
        var endTime = moment($scope.newTimeslot.end_time).tz('Europe/Rome', true);

        var timeslotData = {
            period_id: perioddsId,
            start_time: startTime.format('HH:mm'),
            end_time: endTime.format('HH:mm')
        };
    
        TimeslotService.createTimeslot(timeslotData).then(function(response) {
            alert('Timeslot created successfully!');
            $scope.loadTimeslots();
            $state.go('base.timeslot-view', {
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                perioddsId: perioddsId
            });
        }).catch(function(error) {
            console.error('Error creating timeslot:', error);
            alert('Error creating timeslot: Check console for details.');
        });
    };
    
    $scope.editTimeslot = function(timeslotId) {
        $state.go('base.timeslot-update', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            perioddsId: perioddsId,
            timeslotId: timeslotId
        });
    };

    $scope.deleteTimeslot = function(timeslotId) {
        if (confirm('Are you sure you want to delete this timeslot?')) {
            TimeslotService.deleteTimeslot(timeslotId).then(function(response) {
                alert('Timeslot deleted successfully!');
                $scope.loadTimeslots();
            }).catch(function(error) {
                console.error('Error deleting timeslot:', error);
            });
        }
    };

    $scope.goBack = function() {
        $state.go('base.periodds-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            perioddsId: perioddsId
        });
    };

    $scope.goToContribution = function(timeslotId) {
        $state.go('base.contribution-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            perioddsId: perioddsId,
            timeslotId: timeslotId
        });
    };

    $scope.cancelCreate = function() {
        $state.go('base.timeslot-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            perioddsId: perioddsId
        });
    };

    $scope.goToCreateTimeslot = function() {
        $state.go('base.timeslot-new', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            perioddsId: perioddsId
        });
    };

    $scope.resetForm = function() {
        $scope.newTimeslot = {
            start_time: '',
            end_time: '', 
            period_id: perioddsId
        };
    };

    $scope.loadTimeslots();
    $scope.resetForm();
}]);
