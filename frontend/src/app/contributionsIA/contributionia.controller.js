angular.module('frontend').controller('ContributionIAController', ['$scope', 'ContributionIAService', 'LicenseService', 'AuthService', '$state', '$stateParams', '$http', 'Upload', '$q', '$interval', function($scope, ContributionIAService, LicenseService, AuthService, $state, $stateParams, $http, Upload, $q, $interval) {
    $scope.contributionList = [];
    $scope.file = null;

    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.periodiaId = $stateParams.periodiaId;
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();
    $scope.languages = [];

    let layerId = parseInt($stateParams.layerId || sessionStorage.getItem('lastLayerId'), 10);
    sessionStorage.setItem('lastLayerId', layerId.toString());

    let layerName = $stateParams.layerName || sessionStorage.getItem('lastLayerName');
    sessionStorage.setItem('lastLayerName', layerName);
    $scope.layerName = layerName;

    $scope.newContribution = {
        layer_id: layerId,
        name: '',
        type: '',
        trigger: '',
        detail: '',
        language_id: null
    };

    $scope.loadContributions = function() {
        ContributionIAService.getAll(layerId).then(function(response) {
            $scope.contributionList = response.data;
        }).catch(function(error) {
            console.error('Error loading contributions:', error);
        });
    };

    $scope.loadLanguages = function() {
        if ($scope.licenseId) {
            LicenseService.getLanguagesByLicense($scope.licenseId).then(function(response) {
                $scope.languages = response.data;
            }).catch(function(error) {
                console.error('Error loading languages:', error);
            });
        } else {
            console.error('License ID is undefined');
        }
    };  

    $scope.goToCreateContributionIA = function() {
        $state.go('base.contributionia-new', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            periodiaId: $scope.periodiaId, 
            layerId: layerId,
            layerName: layerName });
    };

    $scope.createContribution = function() {
        if (!layerId || !$scope.file) {
            return;
        }

        var formData = new FormData();
        formData.append('file', $scope.file);

        var contributionData = { ...$scope.newContribution };
        formData.append('contribution_in', JSON.stringify(contributionData));

        $scope.upload($scope.file);

        ContributionIAService.create(formData).then(function(response) {
            alert('Contribution created successfully!');
            $scope.loadContributions();
            $state.go('base.contributionia-view',{
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                periodiaId: $scope.periodiaId, 
                layerId: layerId,
                layerName: layerName });
        }).catch(function(error) {
            console.error('Error creating contribution:', error);
        });
    };

    $scope.editContributionIA = function(contributioniaId, contributioniaName) {
        $state.go('base.contributionia-update', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            periodiaId: $scope.periodiaId, 
            layerId: layerId,
            layerName: layerName,
            contributioniaId: contributioniaId,
            contributioniaName: contributioniaName,
            });
    };

    $scope.deleteContribution = function(contributionId) {
        var isConfirmed = confirm('Are you sure you want to delete this contribution?');
        if (isConfirmed) {
            ContributionIAService.delete(contributionId).then(function(response) {
                alert('Contribution deleted successfully!');
                $scope.loadContributions();
                $state.go('base.contributionia-view', {
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    periodiaId: $scope.periodiaId, 
                    layerId: layerId,
                    layerName: layerName
                });
            }).catch(function(error) {
                console.error('Error deleting contribution:', error);
            });
        }
    };

    $scope.downloadFile = function(contributionId) {
        if (contributionId) {
            var downloadUrl = 'http://127.0.0.1:8000/api/contributionsIA/download/' + contributionId;
    
            $http({
                url: downloadUrl,
                method: 'GET',
                responseType: 'blob',
            }).then(function(response) {
                var blob = new Blob([response.data], { type: response.headers('Content-Type') });
                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href', window.URL.createObjectURL(blob));
                downloadLink.attr('download', 'ContributionFile-' + contributionId);
    
                document.body.appendChild(downloadLink[0]);
                downloadLink[0].click();
                document.body.removeChild(downloadLink[0]);
            }).catch(function(error) {
                console.error('Error downloading file:', error);
            });
        } else {
            alert('Invalid Contribution ID');
        }
    };

    $scope.cancelCreate = function() {
        $state.go('base.contributionia-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            periodiaId: $scope.periodiaId,
            layerId: layerId,
            layerName: layerName
        });
    };

    $scope.goBack = function() {
        $state.go('base.layer-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            periodiaId: $scope.periodiaId,
            layerId: layerId,
            layerName: layerName
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

    $scope.loadLanguages();
    $scope.loadContributions();
}]);
