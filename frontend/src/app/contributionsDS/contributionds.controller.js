angular.module('frontend').controller('ContributionDSController', ['$scope', 'ContributionDSService', '$state', '$stateParams', 'AuthService', '$http', '$q', '$interval', function($scope, ContributionDSService, $state, $stateParams, AuthService,$http, $q, $interval) {
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

        $scope.upload($scope.newContributionDS.file).then(function() {
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

    $scope.downloadFile = function(contributiondsId) {
        if (contributiondsId) {
            var downloadUrl = 'http://127.0.0.1:8000/api/contributionsDS/download/' + contributiondsId;
    
            $http({
                url: downloadUrl,
                method: 'GET',
                responseType: 'blob',
            }).then(function(response) {
                var blob = new Blob([response.data], { type: response.headers('Content-Type') });
                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href', window.URL.createObjectURL(blob));
                downloadLink.attr('download', 'ContributionFile-' + contributiondsId); 
    
                document.body.appendChild(downloadLink[0]);
                downloadLink[0].click();
                document.body.removeChild(downloadLink[0]);
            }).catch(function(error) {
                console.error('Error downloading file:', error);
            });
        } else {
            alert('Invalid Detail ID');
        }
    };

    $scope.viewFile = function(filePath) {
        if (filePath) {
            window.open('http://127.0.0.1:8000/' + filePath, '_blank');
        } else {
            alert('File path not available.');
        }
    };

    $scope.upload = function(file) {
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
