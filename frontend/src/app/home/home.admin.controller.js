angular.module('frontend').controller('HomeAdminController', ['$scope', 'AuthService', 'ClientService', 'LicenseService', 'CampaignDSService', 'CampaignAIService', '$state', '$timeout', function($scope, AuthService, ClientService, LicenseService, CampaignDSService, CampaignAIService, $state, $timeout) {
    $scope.formLicense = {}; 
    $scope.campaignData = [];
    $scope.campaignAIData = [];
    $scope.filteredCampaignData = [];
    $scope.filteredCampaignAIData = [];
    $scope.clients = [];
    $scope.selectedClient = null;
    $scope.userName = '';
    $scope.remainingTotems = 0;
    $scope.percentUsedTotemsDS = 0;
    $scope.percentUsedTotemsAI = 0;
    $scope.percentRemainingTotems = 0;
    $scope.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $scope.selectedMonth = new Date().getMonth();
    $scope.selectedYear = new Date().getFullYear();
    $scope.subtitle = "Campaigns in the month of " + new Date().toLocaleString('default', { month: 'long' });
    
    var licenseId = AuthService.getLicenseId();
   
    $scope.loadLicenseData = function() {
        LicenseService.getById(licenseId).then(function(response) {
            if (response.data && response.data.length > 0) {
                var licenseData = response.data[0];
                
                if (licenseData.start_date) {
                    licenseData.start_date = new Date(licenseData.start_date);
                }
                if (licenseData.end_date) {
                    licenseData.end_date = new Date(licenseData.end_date);
                }
                
                $scope.formLicense = licenseData;
                $scope.calculateTotems();
                $scope.initCharts();  // Certifique-se de chamar initCharts após calculateTotems
            } else {
                console.error('License not found');
                alert('License not found.');
                $state.go('base.licenses-view'); 
            }
        }).catch(function(error) {
            console.error('Error fetching license data:', error);
            alert('Error fetching license data.');
        });
    };

    $scope.loadClients = function() {
        ClientService.getAll().then(function(response) {
            $scope.clients = response.data;
        });
    };

    $scope.calculateTotems = function() {
        $scope.usedTotemsDS = 0;
        $scope.usedTotemsAI = 0;

        let uniqueGroupsDS = new Set();
        let uniqueGroupsAI = new Set();

        $scope.filteredCampaignData.forEach(function(campaign) {
            if (!uniqueGroupsDS.has(campaign.group.id)) {
                uniqueGroupsDS.add(campaign.group.id);
                $scope.usedTotemsDS += campaign.group.total_totems || 0;
            }
        });

        $scope.filteredCampaignAIData.forEach(function(campaign) {
            if (!uniqueGroupsAI.has(campaign.group.id)) {
                uniqueGroupsAI.add(campaign.group.id);
                $scope.usedTotemsAI += campaign.group.total_totems || 0;
            }
        });

        const totalTotems = $scope.formLicense.total_totem || 0;
        $scope.remainingTotems = totalTotems - ($scope.usedTotemsDS + $scope.usedTotemsAI);

        $scope.percentUsedTotemsDS = totalTotems > 0 ? Math.floor(($scope.usedTotemsDS / totalTotems) * 100) : 0;
        $scope.percentUsedTotemsAI = totalTotems > 0 ? Math.floor(($scope.usedTotemsAI / totalTotems) * 100) : 0;
        $scope.percentRemainingTotems = totalTotems > 0 ? Math.floor(($scope.remainingTotems / totalTotems) * 100) : 0;
    };

    $scope.charts = {};

    $scope.initCharts = function() {
        $timeout(function() {
            const chartData = [
                {
                    id: 'chartTotemsDS',
                    percent: $scope.percentUsedTotemsDS,
                    color: '#5cb85c'
                },
                {
                    id: 'chartTotemsAI',
                    percent: $scope.percentUsedTotemsAI,
                    color: '#f0ad4e'
                },
                {
                    id: 'chartRemainingTotems',
                    percent: $scope.percentRemainingTotems,
                    color: '#d9534f'
                }
            ];

            chartData.forEach(data => {
                const ctx = document.getElementById(data.id);
                if (ctx) {
                    const ctx2d = ctx.getContext('2d');
                    if ($scope.charts[data.id]) {
                        $scope.charts[data.id].destroy();
                    }
                    $scope.charts[data.id] = new Chart(ctx2d, {
                        type: 'doughnut',
                        data: {
                            datasets: [{
                                data: [data.percent, 100 - data.percent],
                                backgroundColor: [data.color, '#e5e5e5']
                            }]
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
                } else {
                    console.error('Element not found for chart id: ' + data.id);
                }
            });
        }, 100);
    };

    $scope.filterCampaignsByClient = function() {
        if ($scope.selectedClient) {
            CampaignDSService.getCampaignsByClientAndTypology($scope.selectedClient)
                .then(function(response) {
                    $scope.filteredCampaignData = response.data;
                    $scope.generateGanttChart();
                })
                .catch(function(error) {
                    console.error('Error fetching filtered campaign data:', error);
                });
        } else {
            $scope.filteredCampaignData = $scope.campaignData;
            $scope.generateGanttChart();
        }
    };
       
    $scope.loadCampaignDSData = function() {
        CampaignDSService.getAllCampaignDSWithDates(licenseId)
            .then(function(response) {
                $scope.campaignData = response.data;
                $scope.filteredCampaignData = $scope.campaignData;
                $scope.calculateTotems();
                $scope.initCharts();
                $scope.generateGanttChart();
            })
            .catch(function(error) {
                console.error('Error fetching campaign data:', error);
            });
    };

    $scope.filterCampaignsByClientAI = function() {
        if ($scope.selectedClientAI) {
            CampaignAIService.getAllCampaignAIWithClient($scope.selectedClientAI)
                .then(function(response) {
                    $scope.filteredCampaignAIData = response.data;
                    $scope.generateGanttChartAI();
                })
                .catch(function(error) {
                    console.error('Error fetching AI campaign data:', error);
                });
        } else {
            $scope.filteredCampaignAIData = $scope.campaignAIData;
            $scope.generateGanttChartAI();
        }
    };

    $scope.loadCampaignAIData = function() {
        CampaignAIService.getAllCampaignAIWithDates(licenseId)
            .then(function(response) {
                $scope.campaignAIData = response.data;
                $scope.filteredCampaignAIData = $scope.campaignAIData;
                $scope.calculateTotems();
                $scope.initCharts();
                $scope.generateGanttChartAI();
            })
            .catch(function(error) {
                console.error('Error fetching campaign AI data:', error);
            });
    };

    $scope.editClient = function(clientId) {
        $state.go('base.client-update', { clientId: clientId });
    };

    $scope.viewGroups = function(clientId, clientName) {
        $state.go('base.group-view', { clientId: clientId, clientName: clientName });
    };

    if (licenseId) {
        LicenseService.getById(licenseId)
            .then(function(response) {
                $scope.licenses = response.data;
            })
            .catch(function(error) {
                console.error('Error fetching license details:', error);
            });
    }

    $scope.setMonth = function(monthIndex) {
        $scope.selectedMonth = monthIndex;
        $scope.updateGanttChart();
    };

    $scope.setMonthAI = function(monthIndex) {
        $scope.selectedMonth = monthIndex;
        $scope.updateGanttChartAI();
    };

    $scope.updateGanttChart = function() {
        $scope.generateGanttChart();
        document.getElementById('chartSubtitle').innerText = `Campaigns in the month of ${$scope.monthNames[$scope.selectedMonth]}`;
    };

    $scope.updateGanttChartAI = function() {
        $scope.generateGanttChartAI();
        document.getElementById('chartSubtitleAI').innerText = `Campaigns in the month of ${$scope.monthNames[$scope.selectedMonth]}`;
    };

    $scope.generateGanttChart = function() {
        var chartDom = document.getElementById('ganttChart');
        var myChart = echarts.init(chartDom);
    
        var parseDate = d3.timeParse("%Y-%m-%d");
        var firstDateOfMonth = new Date($scope.selectedYear, $scope.selectedMonth, 1); 
        var lastDateOfMonth = new Date($scope.selectedYear, $scope.selectedMonth + 1, 0); 
    
        var data = $scope.filteredCampaignData
            .map(function(d) {
                var startDate = parseDate(d.start_date);
                var endDate = parseDate(d.end_date);
    
                if (startDate > lastDateOfMonth || endDate < firstDateOfMonth) {
                    return null; 
                }
    
                if (startDate < firstDateOfMonth) {
                    startDate = firstDateOfMonth;
                }
    
                if (endDate > lastDateOfMonth) {
                    endDate = lastDateOfMonth;
                }
    
                return {
                    name: d.name,
                    startDate: startDate.getTime(), 
                    endDate: endDate.getTime() 
                };
            })
            .filter(d => d !== null);
    
        var campaignNames = data.map(d => d.name);
        var seriesData = data.map(function(d, i) {
            return {
                name: d.name,
                value: [d.name, d.startDate, d.endDate],
                itemStyle: {
                    normal: {
                        color: ['#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD', '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'][i % 15]
                    }
                }
            };
        });
    
        var option = {
            tooltip: {
                formatter: function(params) {
                    var startDate = new Date(params.value[1]).toLocaleDateString();
                    var endDate = new Date(params.value[2]).toLocaleDateString();
                    return `${params.name}: ${startDate} - ${endDate}`;
                }
            },
            grid: {
                left: '20%', 
                right: '10%',
                top: '10%',
                bottom: '10%'
            },
            xAxis: {
                type: 'time',
                min: firstDateOfMonth.getTime(),
                max: lastDateOfMonth.getTime(),
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    formatter: function (value, index) {
                        var date = new Date(value);
                        var day = date.getDate().toString().padStart(2, '0'); 
                        var month = date.toLocaleString('default', { month: 'short' }).split('.')[0]; 
                        return `${month}-${day}`;
                    }
                },
                splitLine: { 
                    show: true,
                    lineStyle: {
                        type: 'solid',
                        color: '#eee'
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: campaignNames,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    interval: 0,
                    rotate: 0,
                    formatter: function(value) {
                        return value; 
                    },
                    rich: {
                        align: 'left',
                        width: 120,
                        overflow: 'break',
                        ellipsis: '...'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'solid',
                        color: '#eee'
                    }
                }
            },
            series: [{
                type: 'custom',
                renderItem: function(params, api) {
                    var categoryIndex = api.value(0);
                    var start = api.coord([api.value(1), categoryIndex]);
                    var end = api.coord([api.value(2), categoryIndex]);
                    var height = api.size([0, 1])[1] * 0.6;
    
                    return {
                        type: 'rect',
                        shape: {
                            x: start[0],
                            y: start[1] - height / 2,
                            width: end[0] - start[0],
                            height: height,
                            r: [5, 5, 5, 5]
                        },
                        style: api.style()
                    };
                },
                itemStyle: {
                    opacity: 0.8
                },
                encode: {
                    x: [1, 2],
                    y: 0
                },
                data: seriesData
            }]
        };
    
        myChart.setOption(option);
    };    

    $scope.generateGanttChartAI = function() {
        var chartDom = document.getElementById('ganttChartAI');
        var myChart = echarts.init(chartDom);

        var parseDate = d3.timeParse("%Y-%m-%d");
        var firstDateOfMonth = new Date($scope.selectedYear, $scope.selectedMonth, 1); 
        var lastDateOfMonth = new Date($scope.selectedYear, $scope.selectedMonth + 1, 0); 

        var data = $scope.filteredCampaignAIData
            .map(function(d) {
                var startDate = parseDate(d.start_date);
                var endDate = parseDate(d.end_date);

                if (startDate > lastDateOfMonth || endDate < firstDateOfMonth) {
                    return null; 
                }

                if (startDate < firstDateOfMonth) {
                    startDate = firstDateOfMonth;
                }

                if (endDate > lastDateOfMonth) {
                    endDate = lastDateOfMonth;
                }

                return {
                    name: d.name,
                    startDate: startDate.getTime(), 
                    endDate: endDate.getTime() 
                };
            })
            .filter(d => d !== null);

        var campaignNames = data.map(d => d.name);
        var seriesData = data.map(function(d, i) {
            return {
                name: d.name,
                value: [d.name, d.startDate, d.endDate],
                itemStyle: {
                    normal: {
                        color: ['#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD', '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'][i % 15]
                    }
                }
            };
        });

        var option = {
            tooltip: {
                formatter: function(params) {
                    var startDate = new Date(params.value[1]).toLocaleDateString();
                    var endDate = new Date(params.value[2]).toLocaleDateString();
                    return `${params.name}: ${startDate} - ${endDate}`;
                }
            },
            grid: {
                left: '20%', 
                right: '10%',
                top: '10%',
                bottom: '10%'
            },
            xAxis: {
                type: 'time',
                min: firstDateOfMonth.getTime(),
                max: lastDateOfMonth.getTime(),
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    formatter: function (value, index) {
                        var date = new Date(value);
                        var day = date.getDate().toString().padStart(2, '0'); 
                        var month = date.toLocaleString('default', { month: 'short' }).split('.')[0]; 
                        return `${month}-${day}`;
                    }
                },
                splitLine: { 
                    show: true,
                    lineStyle: {
                        type: 'solid',
                        color: '#eee'
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: campaignNames,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    interval: 0,
                    rotate: 0,
                    formatter: function(value) {
                        return value; 
                    },
                    rich: {
                        align: 'left',
                        width: 120,
                        overflow: 'break',
                        ellipsis: '...'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'solid',
                        color: '#eee'
                    }
                }
            },
            series: [{
                type: 'custom',
                renderItem: function(params, api) {
                    var categoryIndex = api.value(0);
                    var start = api.coord([api.value(1), categoryIndex]);
                    var end = api.coord([api.value(2), categoryIndex]);
                    var height = api.size([0, 1])[1] * 0.6;

                    return {
                        type: 'rect',
                        shape: {
                            x: start[0],
                            y: start[1] - height / 2,
                            width: end[0] - start[0],
                            height: height,
                            r: [5, 5, 5, 5]
                        },
                        style: api.style()
                    };
                },
                itemStyle: {
                    opacity: 0.8
                },
                encode: {
                    x: [1, 2],
                    y: 0
                },
                data: seriesData
            }]
        };

        myChart.setOption(option);
    };

    $scope.loadClients();
    $scope.loadCampaignDSData();
    $scope.loadCampaignAIData();
    $scope.updateGanttChart();
    $scope.updateGanttChartAI();
    $scope.loadLicenseData();
}]);
