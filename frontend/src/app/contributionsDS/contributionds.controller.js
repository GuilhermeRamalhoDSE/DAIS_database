angular.module('frontend').controller('ContributionDSController', ['$scope', 'ContributionDSService', '$state', '$stateParams', 'AuthService', '$window', '$q', '$interval', function($scope, ContributionDSService, $state, $stateParams, AuthService,$window, $q, $interval) {
    $scope.contributiondsList = [];
    $scope.campaigndsId = $stateParams.campaigndsId;
    $scope.campaigndsName = $stateParams.campaigndsName;
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.file = null;

    let timeslotId = parseInt($stateParams.timeslotId || sessionStorage.getItem('lastTimeSlotId'), 10);
    if (isNaN(timeslotId)) {
        console.error('Invalid timeSlotId');
        return;
    }
    sessionStorage.setItem('lastTimeSlotId', timeslotId.toString());

    $scope.newContributionDS = {
        time_slot_id: timeslotId,
        name: "",
    };

    $scope.loadContributionDSs = function() {
        ContributionDSService.getAll(timeslotId).then(function(response) {
            $scope.contributiondsList = response.data;
        }).catch(function(error) {
            console.error('Error fetching contributiondss:', error);
        });
    };

    $scope.goToCreateContributionDS = function() {
        if (timeslotId) {
            $state.go('base.contributionds-new', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                campaigndsId: $scope.campaigndsId,
                campaigndsName: $scope.campaigndsName,
                timeslotId: timeslotId });
        } else {
            console.error('Time Slot ID is missing');
            $state.go('base.contributionds-view', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                campaigndsId: $scope.campaigndsId,
                campaigndsName: $scope.campaigndsName,
                timeslotId: timeslotId });
        }
    };

    $scope.createContributionDS = function() {
        var formData = new FormData();

        if ($scope.file) {
            formData.append('file', $scope.file);
        }

        formData.append('contributionds_in', JSON.stringify($scope.newContributionDS))

        $scope.upload().then(function() {
            ContributionDSService.create(formData).then(function(response) {
                alert('ContributionDS created successfully!');
                $scope.loadContributionDSs();
                $state.go('base.contributionds-view', { 
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    campaigndsId: $scope.campaigndsId,
                    campaigndsName: $scope.campaigndsName,
                    timeslotId: timeslotId });
            }).catch(function(error) {
                alert('Error creating contributionds:', error);
            });
        });
    };

    $scope.cancelCreate = function() {
        $state.go('base.contributionds-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            campaigndsId: $scope.campaigndsId,
            campaigndsName: $scope.campaigndsName,
            timeslotId: timeslotId });
    };

    $scope.editContributionDS = function(contributiondsId) {
        $state.go('base.contributionds-update', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            campaigndsId: $scope.campaigndsId,
            campaigndsName: $scope.campaigndsName,
            timeslotId: timeslotId,
            contributiondsId: contributiondsId });
    };

    $scope.goBack = function() {
        $state.go('base.timeslot-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            campaigndsId: $scope.campaigndsId,
            campaigndsName: $scope.campaigndsName,
            timeslotId: timeslotId
        });
    };

    $scope.deleteContributionDS = function(contributiondsId) {
        if (!contributiondsId) {
            console.error('ContributionDS ID is missing');
            return;
        }
        var isConfirmed = confirm('Are you sure you want to delete this contribution ds?');
        if (isConfirmed) {
            ContributionDSService.delete(contributiondsId).then(function(response) {
                alert('ContributionDS deleted successfully!');
                $scope.loadContributionDSs();
            }).catch(function(error) {
                console.error('Error deleting contributionds:', error);
            });
        }
    };

    $scope.uploadFile = function(contributiondsId, contributiondsName, file) {
        var contributiondsData = new FormData();
        contributiondsData.append('file', file);

        const payload = {
            name: contributiondsName,
        };
        
        contributiondsData.append('contributionds_in', JSON.stringify(payload));

        $scope.upload().then(function() {
            ContributionDSService.update(contributiondsId, contributiondsData).then(function(response) {
                alert('Contribution file uploaded successfully!');
                $scope.loadContributionDSs();
                $window.location.reload();
            }).catch(function(error) {
                console.error('Error uploading contributionds file:', error);
            });
        });
    };

    $scope.triggerFileInput = function(contributiondsId, contributiondsName) {
        var fileInput = document.getElementById('fileInput' + contributiondsId);
        fileInput.click();

        fileInput.onchange = function(event) {
            var file = event.target.files[0];
            $scope.uploadFile(contributiondsId, contributiondsName, file);
        };
    };

    $scope.viewFile = function(filePath) {
        if (filePath) {
            window.open('http://127.0.0.1:8000/' + filePath, '_blank');
        } else {
            alert('File path not available.');
        }
    };

    $scope.upload = function() {
        var deferred = $q.defer(); 

        $scope.showProgress = true;
        $scope.loadingProgress = 0;

        var progressInterval = $interval(function() {
            $scope.loadingProgress += 10; 
            if ($scope.loadingProgress >= 100) {
                $interval.cancel(progressInterval); 
                deferred.resolve(); 
            }
        }, 500); 

        return deferred.promise; 
    };  

    $scope.loadContributionDSs();
}]);
