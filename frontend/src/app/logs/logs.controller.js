angular.module('frontend').controller('LogsController', ['$scope', 'LogsService', 'AuthService', '$state', '$stateParams', function($scope, LogsService, AuthService, $state, $stateParams) {
    $scope.logs = [];
    $scope.isSuperuser = AuthService.isSuperuser();

    let totemId = $stateParams.totemId;
    let totemName = $stateParams.totemName;
    $scope.totemName = totemName;

    let groupId = $stateParams.groupId;
    let groupName = $stateParams.groupName;
    $scope.groupName = groupName;

    let clientId = $stateParams.clientId;
    let clientName = $stateParams.clientName;
    $scope.clientName = clientName;

    $scope.newLog = {
        totem_id: totemId,
        information: ""
    };

    $scope.loadLogs = function() {
        if (!totemId) {
            return;
        }
        LogsService.getLogsByTotem(totemId).then(function(response) {
            $scope.logs = response.data;
        }).catch(function(error) {
            console.error('Error loading logs:', error);
        });
    };

    $scope.goToCreateLog = function() {
        $state.go('base.logs-new', {clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, totemId: totemId, totemName: totemName});
    };

    $scope.createLog = function() {
        var logData = angular.copy($scope.newLog);
        console.log("Creating log with data:", logData);
        LogsService.createLog(logData).then(function(response) {
            alert('Log created successfully!');
            $scope.loadLogs();
            $state.go('base.logs-view', {clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, totemId: totemId, totemName: totemName});
        }).catch(function(error) {
            console.error('Error creating log:', error);
            alert('Error creating log: Check console for details.');
        });
    };

    $scope.cancelCreate = function() {
        $state.go('base.logs-view', {clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, totemId: totemId, totemName: totemName});
    };

    $scope.deleteLog = function(logId) {
        if (!logId) {
            return;
        }
        if (confirm('Are you sure you want to delete this log?')) {
            LogsService.deleteLog(logId).then(function(response) {
                alert('Log successfully deleted!');
                $scope.loadLogs();
            }).catch(function(error) {
                console.error('Error deleting log:', error);
                alert('Error deleting log: Check console for details.');
            });
        }
    };

    $scope.goBack = function() {
        $state.go('base.totem-view', {clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, totemId: totemId, totemName: totemName});
    };

    $scope.resetForm = function() {
        $scope.newLog = {
            totem_id: totemId,
            information: ""
        };
    };

    $scope.loadLogs();
}]);
