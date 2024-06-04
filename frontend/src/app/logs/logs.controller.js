angular.module('frontend').controller('LogsController', ['$scope', 'LogsService', 'AuthService', '$state', '$stateParams', '$filter', function($scope, LogsService, AuthService, $state, $stateParams, $filter) {
    $scope.logs = [];
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.from = new Date();
    $scope.from.setMonth($scope.from.getMonth()-1);
    $scope.to = new Date();

    $scope.loadLogs = function() {
        var licenseId = AuthService.getLicenseId();
        if (!licenseId) {
            return;
        }
        LogsService.getLogsByLicense(licenseId).then(function(response) {
            $scope.logs = response.data;
        }).catch(function(error) {
            console.error('Error loading logs:', error);
        });
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

    $scope.exportToCSV = function() {
        var csvContent = "data:text/csv;charset=utf-8,";

        var headers = ["Date", "Totem ID", "Client", "Campaign", "Totem Type", "Log Type", "Information"];
        csvContent += headers.join(",") + "\n";

        $scope.logs.forEach(function(log) {
            var row = [
                $filter('date')(log.date, 'medium'),
                log.totem_id,
                log.client,
                log.campaign,
                log.typology,
                log.logtype,
                log.information
            ];
            csvContent += row.join(",") + "\n";
        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "logs.csv");
        document.body.appendChild(link);

        link.click();
    };

    $scope.goBack = function() {
        $state.go('base.totem-view', {clientId: clientId, clientName: clientName, groupId: groupId, groupName: groupName, totemId: totemId, totemName: totemName});
    };

    $scope.loadLogs();
}]);
