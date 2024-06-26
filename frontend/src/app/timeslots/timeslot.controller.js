angular.module('frontend').controller('TimeSlotController', ['$scope', 'TimeslotService', '$state', '$stateParams', '$filter',
function($scope, TimeslotService, $state, $stateParams, $filter) {
    $scope.timeslots = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.visiblePages = 3;
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;

    let campaigndsId = parseInt($stateParams.campaigndsId || sessionStorage.getItem('lastPerioddsId'), 10);
    sessionStorage.setItem('lastPerioddsId', campaigndsId.toString());

    let campaigndsName = $stateParams.campaigndsName || sessionStorage.getItem('lastCampaignName');
    if (campaigndsName) {
        sessionStorage.setItem('lastCampaigndsName', campaigndsName);
    } else {
        campaigndsName = sessionStorage.getItem('lastCampaigndsName');
    }
    $scope.campaigndsName = campaigndsName;

    function formatTimeForInput(date) {
        var localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return localDate.toISOString().substring(11, 16); 
    }

    $scope.newTimeslot = {
        start_time: '',
        end_time: '',
        campaignds_id: campaigndsId
    };

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.timeslots, $scope.searchText);
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
        return Math.ceil($scope.timeslots.length / $scope.pageSize);
    };

    $scope.getPages = function() {
        var pages = [];
        var total = $scope.totalPages();
        var startPage = Math.max(0, $scope.currentPage - Math.floor($scope.visiblePages / 2));
        var endPage = Math.min(total, startPage + $scope.visiblePages);
    
        if (startPage > 0) {
            pages.push(0);
            if (startPage > 1) {
                pages.push('...');
            }
        }
    
        for (var i = startPage; i < endPage; i++) {
            pages.push(i);
        }
    
        if (endPage < total) {
            if (endPage < total - 1) {
                pages.push('...');
            }
            pages.push(total - 1);
        }
    
        return pages;
    };

    $scope.loadTimeslots = function() {
        TimeslotService.getAllTimeslots(campaigndsId).then(function(response) {
            $scope.timeslots = response.data;
        }).catch(function(error) {
            console.error('Error loading timeslots:', error);
        });
    };

    $scope.createTimeslot = function() {
        var startTime = moment($scope.newTimeslot.start_time).tz('Europe/Rome', true);
        var endTime = moment($scope.newTimeslot.end_time).tz('Europe/Rome', true);

        var timeslotData = {
            campaignds_id: campaigndsId,
            start_time: startTime.format('HH:mm:ss'),
            end_time: endTime.format('HH:mm:ss')
        };
    
        TimeslotService.createTimeslot(timeslotData).then(function(response) {
            alert('Timeslot created successfully!');
            $scope.loadTimeslots();
            $state.go('base.timeslot-view', {
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                campaigndsId: campaigndsId,
                campaigndsName: campaigndsName
            });
        }).catch(function(error) {
            console.error('Error creating timeslot:', error);
            alert('Error creating timeslot: Check console for details.');
        });
    };
    
    $scope.editTimeslot = function(timeslotId) {
        $state.go('base.timeslot-update', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            campaigndsId: campaigndsId,
            campaigndsName: campaigndsName,
            timeslotId: timeslotId
        });
    };

    $scope.deleteTimeslot = function(timeslotId) {
        if (confirm('Are you sure you want to delete this timeslot?')) {
            TimeslotService.deleteTimeslot(timeslotId).then(function(response) {
                alert('Timeslot deleted successfully!');
                $scope.loadTimeslots();
            }).catch(function(error) {
                console.error('Error deleting timeslot:', error);
            });
        }
    };

    $scope.goBack = function() {
        $state.go('base.campaignds-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            campaigndsId: campaigndsId,
            campaigndsName: campaigndsName
        });
    };

    $scope.goToContribution = function(timeslotId) {
        $state.go('base.contributionds-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            campaigndsId: campaigndsId,
            campaigndsName: campaigndsName,
            timeslotId: timeslotId
        });
    };

    $scope.cancelCreate = function() {
        $state.go('base.timeslot-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            campaigndsId: campaigndsId,
            campaigndsName: campaigndsName
        });
    };

    $scope.goToCreateTimeslot = function() {
        $state.go('base.timeslot-new', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            campaigndsId: campaigndsId,
            campaigndsName: campaigndsName
        });
    };

    $scope.resetForm = function() {
        $scope.newTimeslot = {
            start_time: '',
            end_time: '', 
            campaignds_id: campaigndsId
        };
    };

    $scope.toggleRandomOrder = function(timeslot) {
        if (timeslot.is_random) {
            TimeslotService.unsetRandomOrder(timeslot.id)
                .then(function(response) {
                    timeslot.is_random = false;
                    $scope.loadTimeslots();
                })
                .catch(function(error) {
                    console.error('Error setting time slot to sequential order:', error);
                });
        } else {
            TimeslotService.setRandomOrder(timeslot.id)
                .then(function(response) {
                    timeslot.is_random = true;
                    $scope.loadTimeslots();  
                })
                .catch(function(error) {
                    console.error('Error setting time slot to random order:', error);
                });
        }
    };

    $scope.loadTimeslots();
    $scope.resetForm();
}]);
