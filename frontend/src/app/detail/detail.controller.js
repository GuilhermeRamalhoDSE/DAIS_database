angular.module('frontend').controller('DetailController', ['$scope', 'DetailService', '$state', '$stateParams', 'AuthService', '$http', function($scope, DetailService, $state, $stateParams, AuthService, $http) {
    $scope.detailList = [];
    $scope.file = null;
    $scope.perioddsId = $stateParams.perioddsId;
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.timeslotId = $stateParams.timeslotId;
    $scope.isSuperuser = AuthService.isSuperuser();

    let contributionId = parseInt($stateParams.contributionId || sessionStorage.getItem('lastContributionId'), 10);
    sessionStorage.setItem('lastContributionId', contributionId.toString());

    if (isNaN(contributionId)) {
        alert('Invalid or missing contributionId');
        $state.go('base.contribution-view');
    }

    $scope.newDetail = {
        name: "",
        contribution_id: contributionId
    };

    $scope.loadDetails = function() {
        if (!contributionId) {
            return;
        }
        DetailService.getAll(contributionId).then(function(response) {
            $scope.detailList = response.data;
        }).catch(function(error) {
            console.error('Error loading details:', error);
        });
    };
    
    $scope.goToCreateDetail = function() {
        $state.go('base.detail-new', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            perioddsId: $scope.perioddsId,
            timeslotId: $scope.timeslotId,
            contributionId: contributionId });
    };

    $scope.createDetail = function() {
        if (!contributionId || !$scope.file) {
            return;
        }

        var formData = new FormData();
        formData.append('file', $scope.file);

        var detailData = { ...$scope.newDetail };
        formData.append('detail_in', JSON.stringify(detailData));

        DetailService.create(formData).then(function(response) {
            alert('Detail created successfully!');
            $scope.loadDetails();
            $state.go('base.detail-view', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                perioddsId: $scope.perioddsId,
                timeslotId: $scope.timeslotId,
                contributionId: contributionId });
        }).catch(function(error) {
            console.error('Error creating detail:', error);
        });
    };

    $scope.editDetail = function(detailId) {
        $state.go('base.detail-update', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            perioddsId: $scope.perioddsId,
            timeslotId: $scope.timeslotId,
            contributionId: contributionId, 
            detailId: detailId });
    };

    $scope.deleteDetail = function(detailId) {
        if (!detailId) {
            return;
        }
        var isConfirmed = confirm('Are you sure you want to delete this detail?');
        if (isConfirmed) {
            DetailService.delete(detailId).then(function(response) {
                alert('Detail deleted successfully!');
                $scope.loadDetails();
                $state.go('base.detail-view', { 
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    perioddsId: $scope.perioddsId,
                    timeslotId: $scope.timeslotId,
                    contributionId: contributionId });
            }).catch(function(error) {
                console.error('Error deleting detail:', error);
            });
        }
    };

    $scope.cancelCreate = function() {
        $state.go('base.detail-view', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            perioddsId: $scope.perioddsId,
            timeslotId: $scope.timeslotId,
            contributionId: contributionId });
    };

    $scope.goBack = function() {
        $state.go('base.contribution-view', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            perioddsId: $scope.perioddsId,
            timeslotId: $scope.timeslotId,
            contributionId: contributionId });
    };

    $scope.resetForm = function() {
        $scope.newDetail = {
            order: "",
            contribution_id: contributionId
        };
    };

    $scope.downloadDetailFile = function(detailId) {
        if (detailId) {
            var downloadUrl = 'http://localhost:8000/api/details/download/' + detailId;
    
            $http({
                url: downloadUrl,
                method: 'GET',
                responseType: 'blob',
            }).then(function(response) {
                var blob = new Blob([response.data], { type: response.headers('Content-Type') });
                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href', window.URL.createObjectURL(blob));
                downloadLink.attr('download', 'DetailFile-' + detailId); 
    
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

    $scope.loadDetails();
}]);
