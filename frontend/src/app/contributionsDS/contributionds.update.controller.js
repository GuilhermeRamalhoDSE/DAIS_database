angular.module('frontend').controller('ContributionDSUpdateController', ['$scope', 'ContributionDSService', '$state', '$stateParams', 'AuthService','Upload', '$q', '$interval', function($scope, ContributionDSService, $state, $stateParams, AuthService, Upload, $q, $interval) {

    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.campaigndsId = $stateParams.campaigndsId;
    $scope.campaigndsName = $stateParams.campaigndsName;
    $scope.timeslotId = $stateParams.timeslotId;
    $scope.contributiondsId = $stateParams.contributiondsId;
    $scope.isSuperuser = AuthService.isSuperuser();

    $scope.contributiondsData = {};
    $scope.file = null;

    $scope.loadContributionDS = function() {
        if ($scope.contributiondsId) {
            ContributionDSService.getById($scope.contributiondsId).then(function(response) {
                if (response.data) {
                    $scope.contributiondsData = response.data;
                } else {
                    console.error('ContributionDS not found.');
                    alert('ContributionDS not found.');
                    $state.go('base.contributionds-view', {
                        clientId: $scope.clientId,
                        clientName: $scope.clientName,
                        groupId: $scope.groupId,
                        groupName: $scope.groupName,
                        campaigndsId: $scope.campaigndsId,
                        campaigndsName: $scope.campaigndsName,
                        timeslotId: $scope.timeslotId,
                        contributionId: $scope.contributionId
                    });
                }
            }).catch(function(error) {
                console.error('Error fetching contributiondss:', error);
            });
        } else {
            console.log('No contributionds ID provided.');
        }
    };

    $scope.updateContributionDS = function() {
        var formData = new FormData();
        
        if ($scope.file) {
            formData.append('file', $scope.file);
        } 
    
        formData.append('contributionds_in', JSON.stringify($scope.contributiondsData));
    
        $scope.upload($scope.file).then(function() {
            ContributionDSService.update($scope.contributiondsId, formData).then(function(response) {
                alert('ContributionDS updated successfully!');
                $state.go('base.contributionds-view', {
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    campaigndsId: $scope.campaigndsId,
                    campaigndsName: $scope.campaigndsName,
                    timeslotId: $scope.timeslotId,
                    contributionId: $scope.contributionId
                });
            }).catch(function(error) {
                console.error('Error updating contributionds:', error);
            });
        }).catch(function(error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
        });
    };
    
    $scope.cancelUpdate = function() {
        $state.go('base.contributionds-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            campaigndsId: $scope.campaigndsId,
            campaigndsName: $scope.campaigndsName,
            timeslotId: $scope.timeslotId,
            contributionId: $scope.contributionId
        });
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

    $scope.loadContributionDS();
}]);
