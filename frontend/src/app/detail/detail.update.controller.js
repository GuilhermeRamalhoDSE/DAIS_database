angular.module('frontend').controller('DetailUpdateController', ['$scope', 'DetailService', '$state', '$stateParams', 'AuthService', function($scope, DetailService, $state, $stateParams, AuthService) {

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
        var formData = new FormData();

        if ($scope.file) {
            formData.append('file', $scope.file);
        }

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

    $scope.loadDetail();
}]);
