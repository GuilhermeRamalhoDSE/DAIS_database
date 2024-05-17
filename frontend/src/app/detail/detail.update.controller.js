angular.module('frontend').controller('DetailUpdateController', ['$scope', 'DetailService', '$state', '$stateParams', 'AuthService','Upload', '$q', '$interval', function($scope, DetailService, $state, $stateParams, AuthService, Upload, $q, $interval) {

    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.perioddsId = $stateParams.perioddsId;
    $scope.timeslotId = $stateParams.timeslotId;
    $scope.contributionId = $stateParams.contributionId;
    $scope.detailId = $stateParams.detailId;
    $scope.isSuperuser = AuthService.isSuperuser();

    $scope.detailData = {};
    $scope.file = null;

    $scope.loadDetail = function() {
        if ($scope.detailId) {
            DetailService.getById($scope.detailId).then(function(response) {
                if (response.data) {
                    $scope.detailData = response.data;
                } else {
                    console.error('Detail not found.');
                    alert('Detail not found.');
                    $state.go('base.detail-view', {
                        clientId: $scope.clientId,
                        clientName: $scope.clientName,
                        groupId: $scope.groupId,
                        groupName: $scope.groupName,
                        perioddsId: $scope.perioddsId,
                        timeslotId: $scope.timeslotId,
                        contributionId: $scope.contributionId
                    });
                }
            }).catch(function(error) {
                console.error('Error fetching details:', error);
            });
        } else {
            console.log('No detail ID provided.');
        }
    };

    $scope.updateDetail = function() {
        if ($scope.file) {
            $scope.upload($scope.file).then(function() {
                var formData = new FormData();
                formData.append('file', $scope.file);
                formData.append('detail_in', JSON.stringify($scope.detailData));
    
                DetailService.update($scope.detailId, formData).then(function(response) {
                    alert('Detail updated successfully!');
                    $state.go('base.detail-view', {
                        clientId: $scope.clientId,
                        clientName: $scope.clientName,
                        groupId: $scope.groupId,
                        groupName: $scope.groupName,
                        perioddsId: $scope.perioddsId,
                        timeslotId: $scope.timeslotId,
                        contributionId: $scope.contributionId
                    });
                }).catch(function(error) {
                    console.error('Error updating detail:', error);
                });
            });
        } 
    };

    $scope.cancelUpdate = function() {
        $state.go('base.detail-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            perioddsId: $scope.perioddsId,
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

    $scope.loadDetail();
}]);
