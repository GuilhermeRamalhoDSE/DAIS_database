angular.module('frontend').controller('PeriodIAController', ['$scope', 'PeriodIAService', 'AuthService', '$state', '$stateParams', function($scope, PeriodIAService, AuthService, $state, $stateParams) {
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
        PeriodIAService.getAllPeriodIAs(groupId).then(function(response) {
            $scope.periodList = response.data;
        }).catch(function(error) {
            console.error('Error loading periods:', error);
        });
    };

    $scope.goToCreatePeriod = function() {
        $state.go('base.periodia-new', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
    };

    $scope.createPeriod = function() {
        var periodData = angular.copy($scope.newPeriod);
        if (periodData.start_date && periodData.end_date) {
            periodData.start_date = moment(periodData.start_date, "DD/MM/YYYY").format('YYYY-MM-DD');
            periodData.end_date = moment(periodData.end_date, "DD/MM/YYYY").format('YYYY-MM-DD');
        }

        PeriodIAService.createPeriodIA(periodData).then(function(response) {
            alert('Period created successfully!');
            $scope.loadPeriods();
            $state.go('base.periodia-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName });
        }).catch(function(error) {
            console.error('Error creating period:', error);
            alert('Error creating period: Check console for details.');
        });
    };

    $scope.editPeriod = function(periodId) {
        $state.go('base.periodia-update', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, periodiaId: periodId });
    };
    $scope.goToLayers = function(periodId) {
        $state.go('base.layer-view', { clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, periodiaId: periodId });
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
