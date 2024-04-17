angular.module('frontend').controller('ContributionController', ['$scope', '$filter', 'ContributionService', '$state', '$stateParams', 'AuthService', 'TimeslotService', function($scope, $filter, ContributionService, $state, $stateParams, AuthService, TimeslotService) {
    $scope.contributionList = [];
    $scope.perioddsId = $stateParams.perioddsId;
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.isSuperuser = AuthService.isSuperuser();

    let timeslotId = parseInt($stateParams.timeslotId || sessionStorage.getItem('lastTimeSlotId'), 10);
    if (isNaN(timeslotId)) {
        console.error('Invalid timeSlotId');
        return;
    }
    sessionStorage.setItem('lastTimeSlotId', timeslotId.toString());

    $scope.newContribution = {
        time_slot_id: timeslotId,
    };

    $scope.displayTimeSlot = "";

    $scope.formatTimeSlotDisplay = function(startTime, endTime) {
        var formattedStartTime = $filter('formatTime')(startTime);
        var formattedEndTime = $filter('formatTime')(endTime);
        $scope.displayTimeSlot = formattedStartTime + ' - ' + formattedEndTime;
    };

    $scope.loadTimeSlotDetails = function() {
        TimeslotService.getTimeslotById(timeslotId).then(function(response) {
            var startTime = response.data.start_time;
            var endTime = response.data.end_time;
            $scope.formatTimeSlotDisplay(startTime, endTime);
        }).catch(function(error) {
            console.error('Failed to load time slot details:', error);
        });
    };

    $scope.loadContributions = function() {
        if (!timeslotId) {
            console.error('Time Slot ID is missing');
            return;
        }
        ContributionService.getAll(timeslotId).then(function(response) {
            $scope.contributionList = response.data;
        }).catch(function(error) {
            console.error('Error fetching contributions:', error);
        });
    };

    $scope.goToCreateContribution = function() {
        if (timeslotId) {
            $state.go('base.contribution-new', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                perioddsId: $scope.perioddsId,
                timeslotId: timeslotId });
        } else {
            console.error('Time Slot ID is missing');
            $state.go('base.contribution-view', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                perioddsId: $scope.perioddsId,
                timeslotId: timeslotId });
        }
    };

    $scope.createContribution = function() {
        if (!timeslotId) {
            console.error('Time Slot ID is missing');
            return;
        }
        ContributionService.create($scope.newContribution).then(function(response) {
            alert('Contribution created successfully!');
            $scope.loadContributions();
            $state.go('base.contribution-view', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                perioddsId: $scope.perioddsId,
                timeslotId: timeslotId });
        }).catch(function(error) {
            alert('Error creating contribution:', error);
        });
    };

    $scope.cancelCreate = function() {
        $state.go('base.contribution-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            perioddsId: $scope.perioddsId,
            timeslotId: timeslotId });
    };

    $scope.editContribution = function(contributionId) {
        $state.go('base.contribution-update', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            perioddsId: $scope.perioddsId,
            timeslotId: timeslotId,
            contributionId: contributionId });
    };

    $scope.detailContribution = function(contributionId) {
        $state.go('base.contribution-detail', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            perioddsId: $scope.perioddsId,
            timeslotId: timeslotId,
            contributionId: contributionId });
    };

    $scope.goBack = function() {
        $state.go('base.timeslot-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            perioddsId: $scope.perioddsId,
            timeslotId: timeslotId
        });
    };

    $scope.deleteContribution = function(contributionId) {
        if (!contributionId) {
            console.error('Contribution ID is missing');
            return;
        }
        var isConfirmed = confirm('Are you sure you want to delete this contribution?');
        if (isConfirmed) {
            ContributionService.delete(contributionId).then(function(response) {
                alert('Contribution deleted successfully!');
                $scope.loadContributions();
            }).catch(function(error) {
                console.error('Error deleting contribution:', error);
            });
        }
    };

    $scope.resetForm = function() {
        $scope.newContribution = {
            time_slot_id: timeslotId,
        };
    };

    $scope.loadContributions();
    $scope.loadTimeSlotDetails();
}]);
