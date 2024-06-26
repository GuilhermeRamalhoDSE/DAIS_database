angular.module('frontend').controller('FormationController', ['$scope', 'FormationService', 'LicenseService', 'AuthService', '$state', '$stateParams', '$http', '$q', '$interval', '$filter', function($scope, FormationService, LicenseService, AuthService, $state, $stateParams, $http, $q, $interval, $filter) {

    $scope.formationList = [];
    $scope.file = null;
    $scope.inputType = 'file'
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.visiblePages = 3;
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.campaignaiId = $stateParams.campaignaiId;
    $scope.campaignaiName = $stateParams.campaignaiName;
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();
    $scope.languages = [];
    $scope.voices = [];

    let layerId = parseInt($stateParams.layerId || sessionStorage.getItem('lastLayerId'), 10);
    sessionStorage.setItem('lastLayerId', layerId.toString());

    let layerName = $stateParams.layerName || sessionStorage.getItem('lastLayerName');
    sessionStorage.setItem('lastLayerName', layerName);
    $scope.layerName = layerName;

    $scope.newFormation = {
        layer_id: layerId,
        name: '',
        trigger: '',
        language_id: null,
        voice_id: null
    };

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.formationList, $scope.searchText);
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
        return Math.ceil($scope.formationList.length / $scope.pageSize);
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

    $scope.loadFormations = function() {
        FormationService.getAll(layerId).then(function(response) {
            $scope.formationList = response.data;
        }).catch(function(error) {
            console.error('Error loading formations:', error);
        });
    };

    $scope.loadLanguages = function() {
        if ($scope.licenseId) {
            LicenseService.getLanguagesByLicense($scope.licenseId).then(function(response) {
                $scope.languages = response.data;
            }).catch(function(error) {
                console.error('Error loading languages:', error);
            });
        } else {
            console.error('License ID is undefined');
        }
    }; 

    $scope.loadVoices = function() {
        if ($scope.licenseId) {
            LicenseService.getVoicesByLicense($scope.licenseId).then(function(response) {
                $scope.voices = response.data;
            }).catch(function(error) {
                console.error('Error loading voices:', error);
            });
        } else {
            console.error('License ID is undefined');
        }
    }; 

    $scope.goToCreateFormation = function() {
        $state.go('base.formation-new', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            campaignaiId: $scope.campaignaiId, 
            campaignaiName: $scope.campaignaiName, 
            layerId: layerId,
            layerName: layerName });
    };

    $scope.generateTextFile = function(textInput) {
        if (!textInput) {
            alert("Please enter text to generate the file.");
            return;
        }

        var blob = new Blob([textInput], { type: 'text/plain' });
        var fileName = "textFile_" + Date.now() + ".txt";
        var file = new File([blob], fileName, { type: 'text/plain' });

        $scope.file = file;

        alert("Text file generated and ready for upload.");
    };

    $scope.createFormation = function() {
        var formData = new FormData();

        if ($scope.file) {
            formData.append('file', $scope.file);   
        }
        
        formData.append('formation_in', JSON.stringify($scope.newFormation));
    
        $scope.upload().then(function() {
            FormationService.create(formData).then(function(response) {
                alert('Formation created successfully!');
                $scope.loadFormations();
                $state.go('base.formation-view', {
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    campaignaiId: $scope.campaignaiId,
                    campaignaiName: $scope.campaignaiName,
                    layerId: layerId,
                    layerName: layerName
                });
            }).catch(function(error) {
                console.error('Error creating formation:', error);
            });
        });
    };    

    $scope.fileChanged = function(element) {
        $scope.file = element.files[0];
    };

    $scope.editFormation = function(formationId, formationName) {
        $state.go('base.formation-update', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            campaignaiId: $scope.campaignaiId, 
            campaignaiName: $scope.campaignaiName, 
            layerId: layerId,
            layerName: layerName,
            formationId: formationId,
            formationName: formationName,
        });
    };

    $scope.deleteFormation = function(formationId) {
        var isConfirmed = confirm('Are you sure you want to delete this formation?');
        if (isConfirmed) {
            FormationService.delete(formationId).then(function(response) {
                alert('formationId deleted successfully!');
                $scope.loadFormations();
                $state.go('base.formation-view', {
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    campaignaiId: $scope.campaignaiId, 
                    campaignaiName: $scope.campaignaiName, 
                    layerId: layerId,
                    layerName: layerName
                });
            }).catch(function(error) {
                console.error('Error deleting formation:', error);
            });
        }
    };

    $scope.downloadFile = function(formationId) {
        if (formationId) {
            var downloadUrl = 'http://127.0.0.1:8000/api/formations/download/' + formationId;
    
            $http({
                url: downloadUrl,
                method: 'GET',
                responseType: 'blob',
            }).then(function(response) {
                var blob = new Blob([response.data], { type: response.headers('Content-Type') });
                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href', window.URL.createObjectURL(blob));
                downloadLink.attr('download', 'formationFile-' + formationId + '.txt');
    
                document.body.appendChild(downloadLink[0]);
                downloadLink[0].click();
                document.body.removeChild(downloadLink[0]);
            }).catch(function(error) {
                console.error('Error downloading file:', error);
            });
        } else {
            alert('Invalid formation ID');
        }
    };

    $scope.viewFile = function(filePath) {
        if (filePath) {
            window.open('http://127.0.0.1:8000/' + filePath, '_blank');
        } else {
            alert('File path not available.');
        }
    };

    $scope.cancelCreate = function() {
        $state.go('base.formation-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            campaignaiId: $scope.campaignaiId, 
            campaignaiName: $scope.campaignaiName, 
            layerId: layerId,
            layerName: layerName
        });
    };

    $scope.goBack = function() {
        $state.go('base.layer-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            campaignaiId: $scope.campaignaiId, 
            campaignaiName: $scope.campaignaiName, 
            layerId: layerId,
            layerName: layerName
        });
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
    
    $scope.loadLanguages();
    $scope.loadVoices();
    $scope.loadFormations();
}]);
