angular.module('frontend').controller('PeriodDSController', ['$scope', 'PeriodDSService', 'AuthService', '$state', '$stateParams', function($scope, PeriodDSService, AuthService, $state, $stateParams) {
    $scope.periods = [];
    $scope.isSuperuser = AuthService.isSuperuser(); 

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

    $scope.newPeriod = {
        group_id: groupId,
        start_date: "",
        end_date: "",
        active: true 
    };

    $scope.loadPeriods = function() {
        if (!groupId) {
            return;
        }
        PeriodDSService.getAllPeriodDSs(groupId).then(function(response) {
            $scope.periodList = response.data;
        }).catch(function(error) {
            console.error('Error loading periods:', error);
        });
    };

    $scope.goToCreatePeriod = function() {
        $state.go('base.periodds-new', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
    };

    $scope.createPeriod = function() {
        var periodData = angular.copy($scope.newPeriod);
        if (periodData.start_date && periodData.end_date) {
            periodData.start_date = moment(periodData.start_date, "DD/MM/YYYY").format('YYYY-MM-DD');
            periodData.end_date = moment(periodData.end_date, "DD/MM/YYYY").format('YYYY-MM-DD');
        }
        
        PeriodDSService.createPeriodDS(periodData).then(function(response) {
            alert('Period created successfully!');
            $scope.loadPeriods();
            $state.go('base.periodds-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
        }).catch(function(error) {
            console.error('Error creating period:', error);
            alert('Error creating period: Check console for details.');
        });
    };

    $scope.editPeriod = function(periodId) {
        $state.go('base.periodds-update', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, perioddsId: periodId });
    };

    $scope.goBack = function() {
        $state.go('base.group-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
    };

    $scope.resetForm = function() {
        $scope.newPeriod = {
            group_id: groupId,
            start_date: "",
            end_date: "",
            active: true 
        };
    };

    $scope.loadPeriods();
}]);
