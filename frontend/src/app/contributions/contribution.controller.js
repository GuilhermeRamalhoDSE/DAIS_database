angular.module('frontend').controller('ContributionController', ['$scope', '$http', 'ContributionService', '$state', '$stateParams', 'AuthService', function($scope, $http, ContributionService, $state, $stateParams, AuthService) {
    $scope.contributionList = [];
    $scope.perioddsId = $stateParams.perioddsId;
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.isSuperuser = AuthService.isSuperuser();

    let timeSlotId = parseInt($stateParams.timeSlotId || sessionStorage.getItem('lastTimeSlotId'), 10);
    if (isNaN(timeSlotId)) {
        console.error('Invalid timeSlotId');
        return;
    }
    sessionStorage.setItem('lastTimeSlotId', timeSlotId.toString());

    $scope.newContribution = {
        time_slot_id: timeSlotId,
    };

    $scope.loadContributions = function() {
        if (!timeSlotId) {
            console.error('Time Slot ID is missing');
            return;
        }
        ContributionService.getAll(timeSlotId).then(function(response) {
            $scope.contributionList = response.data;
        }).catch(function(error) {
            console.error('Error fetching contributions:', error);
        });
    };

    $scope.goToCreateContribution = function() {
        if (timeSlotId) {
            $state.go('base.contribution-new', { timeSlotId: timeSlotId });
        } else {
            console.error('Time Slot ID is missing');
            $state.go('base.contribution-view', { timeSlotId: timeSlotId });
        }
    };

    $scope.createContribution = function() {
        if (!timeSlotId) {
            console.error('Time Slot ID is missing');
            return;
        }
        ContributionService.create($scope.newContribution).then(function(response) {
            alert('Contribution created successfully!');
            $scope.loadContributions();
            $state.go('base.contribution-view', { timeSlotId: timeSlotId });
        }).catch(function(error) {
            alert('Error creating contribution:', error);
        });
    };

    $scope.cancelCreate = function() {
        $state.go('base.contribution-view', { timeSlotId: timeSlotId });
    };

    $scope.editContribution = function(contributionId) {
        $state.go('base.contribution-update', { timeSlotId: timeSlotId, contributionId: contributionId });
    };

    $scope.detailContribution = function(contributionId) {
        $state.go('base.contribution-detail', { timeSlotId: timeSlotId, contributionId: contributionId });
    };

    $scope.goBack = function() {
        $state.go('base.timeSlot-view');
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
            time_slot_id: timeSlotId,
        };
    };

    $scope.loadContributions();
}]);
