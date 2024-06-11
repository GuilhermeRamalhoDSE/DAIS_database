angular.module('frontend').controller('CampaignAIUpdateController', ['$scope', 'CampaignAIService', 'AuthService', '$state', '$stateParams', '$q', '$interval', function($scope, CampaignAIService, AuthService, $state, $stateParams, $q, $interval) {
    $scope.isSuperuser = AuthService.isSuperuser();

    var clientId = $stateParams.clientId;
    var clientName = $stateParams.clientName;
    var groupId = $stateParams.groupId;
    var groupName = $stateParams.groupName;
    var campaignaiId = $stateParams.campaignaiId;
    $scope.campaignAIData = {};
    $scope.logo = null;
    $scope.background = null;

    $scope.loadCampaignAIDetails = function() {
        if (!campaignaiId) {
            console.error('No CampaignAI ID provided.');
            alert('No Campaign ID provided.');
            $state.go('base.campaignai-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
            return;
        }
        CampaignAIService.getCampaignAIById(campaignaiId).then(function(response) {
            if (response.data) {
                $scope.campaignAIData = response.data;

                ['start_date', 'end_date'].forEach(function(dateField) {
                    if ($scope.campaignAIData[dateField]) {
                        $scope.campaignAIData[dateField] = new Date($scope.campaignAIData[dateField]);
                    }
                });

            } else {
                console.error('CampaignAI not found');
                alert('Campaign not found.');
                $state.go('base.campaignai-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
            }
        }).catch(function(error) {
            console.error('Error fetching CampaignAI details:', error);
            alert('Error fetching CampaignAI details: Check console for details.');
        });
    };

    $scope.updateCampaignAI = function() {
        
        var formData = new FormData();
        
        if ($scope.logo) {
            formData.append('logo', $scope.logo);
        }
        if ($scope.background) {
            formData.append('background', $scope.background);
        }
    
        var campaignAIDataToUpdate = angular.copy($scope.campaignAIData);
        if (campaignAIDataToUpdate.start_date && campaignAIDataToUpdate.end_date) {
            campaignAIDataToUpdate.start_date = moment(campaignAIDataToUpdate.start_date, "DD/MM/YYYY").format('YYYY-MM-DD');
            campaignAIDataToUpdate.end_date = moment(campaignAIDataToUpdate.end_date, "DD/MM/YYYY").format('YYYY-MM-DD');
        }
    
        formData.append('campaignai_in', JSON.stringify(campaignAIDataToUpdate));
    
    
        $scope.upload().then(function() {
            CampaignAIService.updateCampaignAI(campaignaiId, formData).then(function(response) {
                alert('Campaign updated successfully!');
                $state.go('base.campaignai-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
            }).catch(function(error) {
                console.error('Error updating CampaignAI:', error);
                alert('Error updating CampaignAI: Check console for details.');
            });
        });
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
 

    $scope.cancelUpdate = function() {
        $state.go('base.campaignai-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
    };

    $scope.loadCampaignAIDetails();
}]);
