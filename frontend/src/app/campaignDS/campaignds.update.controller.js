angular.module('frontend').controller('CampaignDSUpdateController', ['$scope', 'CampaignDSService', 'AuthService', '$state', '$stateParams', '$q', '$interval', function($scope, CampaignDSService, AuthService, $state, $stateParams, $q, $interval) {
    $scope.isSuperuser = AuthService.isSuperuser();

    var clientId = $stateParams.clientId;
    var clientName = $stateParams.clientName;
    var groupId = $stateParams.groupId;
    var groupName = $stateParams.groupName;
    var campaigndsId = $stateParams.campaigndsId;
    $scope.campaignDSData = {};
    $scope.logo = null;
    $scope.background = null;

    $scope.loadCampaignDSDetails = function() {
        if (!campaigndsId) {
            console.error('No CampaignDS ID provided.');
            alert('No Campaign ID provided.');
            $state.go('base.campaignds-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
            return;
        }
        CampaignDSService.getCampaignDSById(campaigndsId).then(function(response) {
            if (response.data) {
                $scope.campaignDSData = response.data;

                ['start_date', 'end_date'].forEach(function(dateField) {
                    if ($scope.campaignDSData[dateField]) {
                        $scope.campaignDSData[dateField] = new Date($scope.campaignDSData[dateField]);
                    }
                });

            } else {
                console.error('CampaignDS not found');
                alert('Campaign not found.');
                $state.go('base.campaignds-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
            }
        }).catch(function(error) {
            console.error('Error fetching CampaignDS details:', error);
            alert('Error fetching CampaignDS details: Check console for details.');
        });
    };

    $scope.updateCampaignDS = function() {
        
        var formData = new FormData();
        
        if ($scope.logo) {
            formData.append('logo', $scope.logo);
        }
        if ($scope.background) {
            formData.append('background', $scope.background);
        }
    
        var campaignDSDataToUpdate = angular.copy($scope.campaignDSData);
        if (campaignDSDataToUpdate.start_date && campaignDSDataToUpdate.end_date) {
            campaignDSDataToUpdate.start_date = moment(campaignDSDataToUpdate.start_date, "DD/MM/YYYY").format('YYYY-MM-DD');
            campaignDSDataToUpdate.end_date = moment(campaignDSDataToUpdate.end_date, "DD/MM/YYYY").format('YYYY-MM-DD');
        }
    
        formData.append('campaignds_in', JSON.stringify(campaignDSDataToUpdate));
    
    
        $scope.upload($scope.campaignDSData.background).then(function() {
            CampaignDSService.updateCampaignDS(campaigndsId, formData).then(function(response) {
                alert('Campaign updated successfully!');
                $state.go('base.campaignds-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
            }).catch(function(error) {
                console.error('Error updating CampaignDS:', error);
                alert('Error updating CampaignDS: Check console for details.');
            });
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
 

    $scope.cancelUpdate = function() {
        $state.go('base.campaignds-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
    };

    $scope.loadCampaignDSDetails();
}]);
