angular.module('frontend').controller('ContributionIAUpdateController', ['$scope', 'ContributionIAService', 'LicenseService', 'AuthService', '$state', '$stateParams', 'Upload', '$q', '$interval', function($scope, ContributionIAService, LicenseService, AuthService, $state, $stateParams, Upload, $q, $interval) {
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.periodiaId = $stateParams.periodiaId;
    $scope.layerName = $stateParams.layerName;
    $scope.layerId = $stateParams.layerId;
    
    $scope.contributioniaId = $stateParams.contributioniaId;
    $scope.contributioniaName = $stateParams.contributioniaName;
    
    $scope.contributionData = {};
    $scope.file = null;
    $scope.languages = [];

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

    $scope.loadContributionDetails = function() {
        if(!$scope.contributioniaId){
            console.log('No contribution ID provided.');
            alert('No contribution ID provided.')
            $state.go('base.contributionia-view', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                periodiaId: $scope.periodiaId,
                layerId: $scope.layerId,
                layerName: $scope.layerName,
             });
             return;
        }
        ContributionIAService.getById($scope.contributioniaId).then(function(response) {
            if (response.data) {
                $scope.contributionData = response.data;
                $scope.contributionData.language_id = response.data.language.id; 
            } else {
                console.error('Contribution not found');
                alert('Contribution not found.');
                $state.go('base.contributionia-view', { 
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    periodiaId: $scope.periodiaId,
                    layerId: $scope.layerId,
                    layerName: $scope.layerName,
                });
            }
        }).catch(function(error) {
            console.error('Error fetching contribution details:', error);
        });
    }; 

    $scope.updateContribution = function() {
        var formData = new FormData();
    
        if ($scope.file) {
            formData.append('file', $scope.file);
        }
    
        formData.append('data', JSON.stringify($scope.contributionData));
    
        $scope.upload($scope.file).then(function() {
            ContributionIAService.update($scope.contributioniaId, formData).then(function(response) {
                alert('Contribution updated successfully!');
                $state.go('base.contributionia-view', { 
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    periodiaId: $scope.periodiaId,
                    layerId: $scope.layerId,
                    layerName: $scope.layerName,
                });
            }).catch(function(error) {
                console.error('Error updating contribution:', error);
            });
        }).catch(function(error) {
            console.error('Error uploading file:', error);
        });
    };
    
    $scope.cancelUpdate = function() {
        $state.go('base.contributionia-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            periodiaId: $scope.periodiaId,
            layerId: $scope.layerId,
            layerName: $scope.layerName
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

    $scope.loadContributionDetails();
    $scope.loadLanguages();
}]);
