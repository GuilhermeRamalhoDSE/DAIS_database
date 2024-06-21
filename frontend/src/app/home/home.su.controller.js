angular.module('frontend').controller('HomeSUController', ['$scope', 'AuthService', '$state', '$timeout', 'LicenseService', function($scope, AuthService, $state, $timeout, LicenseService) {

    $scope.charts = {};
    $scope.activeLicensesList = [];
    $scope.inactiveLicensesList = [];

    $scope.loadLicenseData = function() {
        LicenseService.getLicenseSummary().then(function(response) {
            const data = response.data;
            $scope.totalLicenses = data.total;
            $scope.activeLicenses = data.active;
            $scope.inactiveLicenses = data.inactive;

            $scope.percentActiveLicenses = (data.active / data.total) * 100;
            $scope.percentInactiveLicenses = (data.inactive / data.total) * 100;

            $scope.loadLicenseLists();

            $scope.initCharts();
        }, function(error) {
            console.error("Error loading license data:", error);
        });
    };

    $scope.loadLicenseLists = function() {
        LicenseService.getAll().then(function(response) {
            const licenses = response.data;
            $scope.activeLicensesList = licenses.filter(license => license.active);
            $scope.inactiveLicensesList = licenses.filter(license => !license.active);
        }, function(error) {
            console.error("Error loading license lists:", error);
        });
    };

    $scope.initCharts = function() {
        $timeout(function() {
            const chartData = [
                {
                    id: 'chartActiveLicenses',
                    percent: $scope.percentActiveLicenses,
                    color: '#5cb85c',
                    label: $scope.activeLicenses + ' active licenses'
                },
                {
                    id: 'chartInactiveLicenses',
                    percent: $scope.percentInactiveLicenses,
                    color: '#d9534f',
                    label: $scope.inactiveLicenses + ' inactive licenses'
                }
            ];

            chartData.forEach(data => {
                const ctx = document.getElementById(data.id).getContext('2d');
                if ($scope.charts[data.id]) {
                    $scope.charts[data.id].destroy();
                }
                $scope.charts[data.id] = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [data.percent, 100 - data.percent],
                            backgroundColor: [data.color, '#e5e5e5']
                        }],
                        labels: [data.label, '']
                    },
                    options: {
                        cutout: '80%',
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                enabled: false
                            }
                        }
                    }
                });
            });
        }, 100);
    };

    $scope.editLicense = function(licenseId) {
        $state.go('base.licenses-update', { licenseId: licenseId }); 
    };

    $scope.loadLicenseData();
}]);
