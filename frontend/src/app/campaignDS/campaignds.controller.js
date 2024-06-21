angular.module('frontend').controller('CampaignDSController', ['$scope', 'CampaignDSService', 'AuthService', '$state', '$stateParams', '$window', '$filter','$q', '$interval', function($scope, CampaignDSService, AuthService, $state, $stateParams, $window, $filter, $q, $interval) {
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
        CampaignDSService.getAllCampaignDS(groupId).then(function(response) {
            $scope.campaignList = response.data;
            if ($scope.currentPage >= $scope.totalPages()) {
                $scope.currentPage = $scope.totalPages() - 1;
            }
        }).catch(function(error) {
            console.error('Error loading campaigns:', error);
        });
    };

    $scope.goToCreateCampaign = function() {
        $state.go('base.campaignds-new', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
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
        

        $scope.upload().then(function() {
            CampaignDSService.createCampaignDS(formData).then(function(response) {
                alert('Campaign created successfully!');
                $scope.loadCampaigns();
                $state.go('base.campaignds-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
            }).catch(function(error) {
                if (error.data && error.data.detail && error.data.detail === "A campaign already exists in this period.") {
                    alert('Cannot create campaign: A campaign already exists in this period.');
                } else {
                    console.error('Error creating campaign:', error);
                    alert('Error creating campaign: Check console for details.');
                }
            });
        });  
    };      

    $scope.editCampaign = function(campaignId) {
        $state.go('base.campaignds-update', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaigndsId: campaignId });
    };

    $scope.cancelCreate = function() {
        $state.go('base.campaignds-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
    };

    $scope.goBack = function() {
        $state.go('base.group-view', { clientId: clientId, clientName: clientName,groupId: groupId, groupName: groupName });
    };

    $scope.goToTimeSlot = function(campaignId, campaignName) {
        $state.go('base.timeslot-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, campaigndsId: campaignId, campaigndsName: campaignName });
    };

    $scope.resetForm = function() {
        $scope.newCampaign = {
            group_id: groupId,
            start_date: "",
            end_date: "",
            active: true 
        };
    };

    $scope.uploadLogo = function(campaigndsId, campaigndsName, logo) {
        var campaigndsData = new FormData();
        campaigndsData.append('logo', logo);

        const payload = {
            name: campaigndsName,
        };
        
        campaigndsData.append('campaignds_in', JSON.stringify(payload));

        $scope.upload().then(function() {
            CampaignDSService.updateCampaignDS(campaigndsId, campaigndsData).then(function(response) {
                alert('Campaign logo uploaded successfully!');
                $scope.loadCampaigns();
                $window.location.reload();
            }).catch(function(error) {
                console.error('Error uploading campaign DS logo:', error);
            });
        });
    };

    $scope.triggerLogoInput = function(campaigndsId, campaigndsName) {
        var logoInput = document.getElementById('logoInput' + campaigndsId);
        logoInput.click();

        logoInput.onchange = function(event) {
            var file = event.target.files[0];
            $scope.uploadLogo(campaigndsId, campaigndsName, file);
        };
    };

    $scope.viewLogo = function(logoPath) {
        if (logoPath) {
            window.open('https://daisdatabasedse.it/' + logoPath, '_blank');
        } else {
            alert('Logo path not available.');
        }
    };
    
    $scope.uploadBackground = function(campaigndsId, campaigndsName, background) {
        var campaigndsData = new FormData();
        campaigndsData.append('background', background);

        const payload = {
            name: campaigndsName,
        };
        
        campaigndsData.append('campaignds_in', JSON.stringify(payload));

        $scope.upload().then(function() {
            CampaignDSService.updateCampaignDS(campaigndsId, campaigndsData).then(function(response) {
                alert('Campaign background uploaded successfully!');
                $scope.loadCampaigns();
                $window.location.reload();
            }).catch(function(error) {
                console.error('Error uploading campaign DS background:', error);
            });
        });
    };

    $scope.triggerBackgroundInput = function(campaigndsId, campaigndsName) {
        var backgroundInput = document.getElementById('backgroundInput' + campaigndsId);
        backgroundInput.click();

        backgroundInput.onchange = function(event) {
            var file = event.target.files[0];
            $scope.uploadBackground(campaigndsId, campaigndsName, file);
        };
    };

    $scope.viewBackground = function(backgroundPath) {
        if (backgroundPath) {
            window.open('https://daisdatabasedse.it/' + backgroundPath, '_blank');
        } else {
            alert('Background path not available.');
        }
    };

    $scope.deleteCampaign = function(campaignDSId) {
        if (confirm('Are you sure you want to delete this campaign?')) {
            CampaignDSService.deleteCampaignDS(campaignDSId).then(function(response) {
                alert('Campaign deleted successfully!');
                $scope.loadCampaigns(); 
            }).catch(function(error) {
                console.error('Error deleting campaign:', error);
                alert('Failed to delete campaign: ' + error.data.message);
            });
        }
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
 
    $scope.loadCampaigns();
}]);
