angular.module('frontend').controller('LogsController', ['$scope', 'LogsService', 'AuthService', '$state', '$stateParams', '$filter', function($scope, LogsService, AuthService, $state, $stateParams, $filter) {
    $scope.logs = [];
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.from = new Date();
    $scope.from.setMonth($scope.from.getMonth()-1);
    $scope.to = new Date();
    $scope.currentPage = 0;
    $scope.pageSize = 5;

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.logs, $scope.searchText);
        filteredList = $filter('dateFilter')(filteredList, $scope.from, $scope.to);
        filteredList = $filter('filter')(filteredList, {
            date: $scope.dateSearchText,
            client: $scope.clientSearchText,
            campaign: $scope.campaignSearchText,
            typology: $scope.typologySearchText,
            logtype: $scope.logtypeSearchText,
            information: $scope.informationSearchText
        });
        filteredList = $filter('customTotemIdFilter')(filteredList, $scope.totemIdSearchText);

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
        var filteredList = $filter('filter')($scope.logs, $scope.searchText);
        filteredList = $filter('dateFilter')(filteredList, $scope.from, $scope.to);
        filteredList = $filter('filter')(filteredList, {
            date: $scope.dateSearchText,
            client: $scope.clientSearchText,
            campaign: $scope.campaignSearchText,
            typology: $scope.typologySearchText,
            logtype: $scope.logtypeSearchText,
            information: $scope.informationSearchText
        });
        filteredList = $filter('customTotemIdFilter')(filteredList, $scope.totemIdSearchText);
        return Math.ceil(filteredList.length / $scope.pageSize);
    };

    $scope.getPages = function() {
        var pages = [];
        for (var i = 0; i < $scope.totalPages(); i++) {
            pages.push(i);
        }
        return pages;
    };

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
        $state.go('base.home-admin');
    };

    $scope.loadLogs();
}]);
