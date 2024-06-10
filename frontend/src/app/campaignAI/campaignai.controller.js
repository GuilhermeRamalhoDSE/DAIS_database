angular.module('frontend').controller('CampaignAIController', ['$scope', 'CampaignAIService', 'AuthService', '$state', '$stateParams', '$http', '$filter','$q', '$interval', function($scope, CampaignAIService, AuthService, $state, $stateParams, $http, $filter, $q, $interval) {
    $scope.campaignList = [];
    $scope.isSuperuser = AuthService.isSuperuser(); 
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.logo = null;
    $scope.background = null;

    let groupId = parseInt($stateParams.groupId || sessionStorage.getItem('lastGroupId'), 10);
    sessionStorage.setItem('lastGroupId', groupId.toString());

    let groupName = $stateParams.groupName || sessionStorage.getItem('lastGroupName');
    if (groupName) {
        sessionStorage.setItem('lastGroupName', groupName);
    } else {
        groupName = sessionStorage.getItem('lastGroupName');
    }
    $scope.groupName = groupName;

    let clientId = parseInt($stateParams.clientId || sessionStorage.getItem('lastClientId'), 10);
    sessionStorage.setItem('lastClientId', clientId.toString());

    if (isNaN(clientId)) {
        alert('Invalid or missing clientId');
        $state.go('base.client-view');
    }

    let clientName = $stateParams.clientName || sessionStorage.getItem('lastClientName');
    if (clientName) {
        sessionStorage.setItem('lastClientName', clientName);
    } else {
        clientName = sessionStorage.getItem('lastClientName');
    }
    $scope.clientName = clientName;

    $scope.newCampaign = {
        group_id: groupId,
        name:"",
        start_date: "",
        end_date: "",
        footer: "",
        active: true 
    };
    
    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.campaignList, $scope.searchText);
        var startIndex = $scope.currentPage * $scope.pageSize;
        var endIndex = Math.min(startIndex + $scope.pageSize, filteredList.length);
        return filteredList.slice(startIndex, endIndex);
    };
    
    
    $scope.setCurrentPage = function(page) {
        if (page >= 0 && page < $scope.totalPages()) {
            $scope.currentPage = page;
        }
    };
    
    $scope.totalPages = function() {
        return Math.ceil($scope.campaignList.length / $scope.pageSize);
    };
    
    $scope.getPages = function() {
        var pages = [];
        for (var i = 0; i < $scope.totalPages(); i++) {
            pages.push(i);
        }
        return pages;
    };
    
    $scope.loadCampaigns = function() {
        if (!groupId) {
            return;
        }
        CampaignAIService.getAllCampaignAI(groupId).then(function(response) {
            $scope.campaignList = response.data;
            if ($scope.currentPage >= $scope.totalPages()) {
                $scope.currentPage = $scope.totalPages() - 1;
            }
        }).catch(function(error) {
            console.error('Error loading campaigns:', error);
        });
    };

    $scope.goToCreateCampaign = function() {
        $state.go('base.campaignai-new', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
    };
    
    $scope.createCampaign = function() {
        var formData = new FormData();
    
        if ($scope.logo) {
            formData.append('logo', $scope.logo);
        }
        if ($scope.background) {
            formData.append('background', $scope.background);
        }
    
        var campaignData = angular.copy($scope.newCampaign);
        if (campaignData.start_date && campaignData.end_date) {
            campaignData.start_date = moment(campaignData.start_date, "DD/MM/YYYY").format('YYYY-MM-DD');
            campaignData.end_date = moment(campaignData.end_date, "DD/MM/YYYY").format('YYYY-MM-DD');
        }
    
        formData.append('campaign_in', JSON.stringify(campaignData));
        

        $scope.upload($scope.newCampaign.background).then(function() {
            CampaignAIService.createCampaignAI(formData).then(function(response) {
                alert('Campaign created successfully!');
                $scope.loadCampaigns();
                $state.go('base.campaignai-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
            }).catch(function(error) {
                console.error('Error creating campaign:', error);
                alert('Error creating campaign: Check console for details.');
            });
        });  
    };      

    $scope.editCampaign = function(campaignId) {
        $state.go('base.campaignai-update', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaignaiId: campaignId });
    };

    $scope.cancelCreate = function() {
        $state.go('base.campaignai-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
    };

    $scope.goBack = function() {
        $state.go('base.group-view', { clientId: clientId, clientName: clientName,groupId: groupId, groupName: groupName });
    };

    $scope.goToLayers = function(campaignId, campaignName) {
        $state.go('base.layer-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaignaiId: campaignId, campaignaiName: campaignName });
    };

    $scope.resetForm = function() {
        $scope.newCampaign = {
            group_id: groupId,
            start_date: "",
            end_date: "",
            active: true 
        };
    };

    $scope.downloadLogoFile = function(campaignId) {
        if (campaignId) {
            var downloadUrl = 'http://127.0.0.1:8000/api/campaignai/download/logo/' + campaignId;
    
            $http({
                url: downloadUrl,
                method: 'GET',
                responseType: 'blob',
            }).then(function(response) {
                var blob = new Blob([response.data], { type: response.headers('Content-Type') });
                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href', window.URL.createObjectURL(blob));
                downloadLink.attr('download', 'LogoFile-' + campaignId); 
    
                document.body.appendChild(downloadLink[0]);
                downloadLink[0].click();
                document.body.removeChild(downloadLink[0]);
            }).catch(function(error) {
                console.error('Error downloading logo:', error);
            });
        } else {
            alert('Invalid Screen ID');
        }
    };

    $scope.viewLogo = function(logoPath) {
        if (logoPath) {
            window.open('http://127.0.0.1:8000/' + logoPath, '_blank');
        } else {
            alert('Logo path not available.');
        }
    };
    
    
    $scope.downloadBackgroundFile = function(campaignId) {
        if (campaignId) {
            var downloadUrl = 'http://127.0.0.1:8000/api/campaignai/download/background/' + campaignId;
    
            $http({
                url: downloadUrl,
                method: 'GET',
                responseType: 'blob',
            }).then(function(response) {
                var blob = new Blob([response.data], { type: response.headers('Content-Type') });
                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href', window.URL.createObjectURL(blob));
                downloadLink.attr('download', 'BackgroundFile-' + campaignId); 
    
                document.body.appendChild(downloadLink[0]);
                downloadLink[0].click();
                document.body.removeChild(downloadLink[0]);
            }).catch(function(error) {
                console.error('Error downloading logo:', error);
            });
        } else {
            alert('Invalid Screen ID');
        }
    };

    $scope.viewBackground = function(backgroundPath) {
        if (backgroundPath) {
            window.open('http://127.0.0.1:8000/' + backgroundPath, '_blank');
        } else {
            alert('Background path not available.');
        }
    };

    $scope.deleteCampaign = function(campaignAIId) {
        if (confirm('Are you sure you want to delete this campaign?')) {
            CampaignAIService.deleteCampaignAI(campaignAIId).then(function(response) {
                alert('Campaign deleted successfully!');
                $scope.loadCampaigns(); 
            }).catch(function(error) {
                console.error('Error deleting campaign:', error);
                alert('Failed to delete campaign: ' + error.data.message);
            });
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
 
    $scope.loadCampaigns();
}]);
