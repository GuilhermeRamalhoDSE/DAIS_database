angular.module('frontend').controller('ContributionAIController', ['$scope', 'ContributionAIService', 'LicenseService', 'AuthService', '$state', '$stateParams', '$http', 'Upload', '$q', '$interval', function($scope, ContributionAIService, LicenseService, AuthService, $state, $stateParams, $http, Upload, $q, $interval) {
    $scope.contributionList = [];
    $scope.file = null;

    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.campaignaiId = $stateParams.campaignaiId;
    $scope.campaignaiName = $stateParams.campaignaiName;
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();
    $scope.languages = [];

    let layerId = parseInt($stateParams.layerId || sessionStorage.getItem('lastLayerId'), 10);
    sessionStorage.setItem('lastLayerId', layerId.toString());

    let layerName = $stateParams.layerName || sessionStorage.getItem('lastLayerName');
    sessionStorage.setItem('lastLayerName', layerName);
    $scope.layerName = layerName;

    $scope.newContribution = {
        layer_id: layerId,
        name: '',
        type: '',
        trigger: '',
        detail: '',
        language_id: null
    };

    $scope.loadContributions = function() {
        ContributionAIService.getAll(layerId).then(function(response) {
            $scope.contributionList = response.data;
        }).catch(function(error) {
            console.error('Error loading contributions:', error);
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

    $scope.goToCreateContributionAI = function() {
        $state.go('base.contributionai-new', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            campaignaiId: $scope.campaignaiId, 
            campaignaiName: $scope.campaignaiName, 
            layerId: layerId,
            layerName: layerName });
    };

    $scope.createContribution = function() {
        if (!layerId || !$scope.file) {
            return;
        }

        var formData = new FormData();
        formData.append('file', $scope.file);

        var contributionData = { ...$scope.newContribution };
        formData.append('contribution_in', JSON.stringify(contributionData));

        $scope.upload($scope.file).then(function() {
            ContributionAIService.create(formData).then(function(response) {
                alert('Contribution created successfully!');
                $scope.loadContributions();
                $state.go('base.contributionai-view',{
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    campaignaiId: $scope.campaignaiId, 
                    campaignaiName: $scope.campaignaiName, 
                    layerId: layerId,
                    layerName: layerName });
            }).catch(function(error) {
                console.error('Error creating contribution:', error);
            });
        });
    };

    $scope.editContributionAI = function(contributionaiId, contributionaiName) {
        $state.go('base.contributionai-update', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            campaignaiId: $scope.campaignaiId, 
            campaignaiName: $scope.campaignaiName, 
            layerId: layerId,
            layerName: layerName,
            contributionaiId: contributionaiId,
            contributionaiName: contributionaiName,
            });
    };

    $scope.deleteContribution = function(contributionId) {
        var isConfirmed = confirm('Are you sure you want to delete this contribution?');
        if (isConfirmed) {
            ContributionAIService.delete(contributionId).then(function(response) {
                alert('Contribution deleted successfully!');
                $scope.loadContributions();
                $state.go('base.contributionai-view', {
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
                console.error('Error deleting contribution:', error);
            });
        }
    };

    $scope.downloadFile = function(contributionId) {
        if (contributionId) {
            var downloadUrl = 'http://127.0.0.1:8000/api/contributionsAI/download/' + contributionId;
    
            $http({
                url: downloadUrl,
                method: 'GET',
                responseType: 'blob',
            }).then(function(response) {
                var blob = new Blob([response.data], { type: response.headers('Content-Type') });
                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href', window.URL.createObjectURL(blob));
                downloadLink.attr('download', 'ContributionFile-' + contributionId);
    
                document.body.appendChild(downloadLink[0]);
                downloadLink[0].click();
                document.body.removeChild(downloadLink[0]);
            }).catch(function(error) {
                console.error('Error downloading file:', error);
            });
        } else {
            alert('Invalid Contribution ID');
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
        $state.go('base.contributionai-view', {
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

    $scope.upload = function(file) {
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
    
        if (file.type.startsWith('image/')) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    var maxWidth = 400;
                    var maxHeight = 400;
                    var width = img.width;
                    var height = img.height;
    
                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }
    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
    
                    var resizedFile = dataURLtoFile(canvas.toDataURL('image/jpeg'), file.name);
                    $scope.file = resizedFile;
    
                    $scope.$apply();
                };
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
            var video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.controls = true;
            video.style.maxWidth = '400px'; 
            video.style.height = 'auto'; 
            document.getElementById('preview').innerHTML = '';
            document.getElementById('preview').appendChild(video);
        } else {
            document.getElementById('preview').innerHTML = 'Preview not available for this file type.';
        }
    
        return deferred.promise; 
    };
    

    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    $scope.$watch('file', function(newFile, oldFile) {
        if (newFile !== oldFile && newFile) {
            if (newFile.type.startsWith('image/')) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    var imgElement = document.createElement('img');
                    imgElement.src = event.target.result;
                    document.getElementById('preview').innerHTML = '';
                    document.getElementById('preview').appendChild(imgElement);
                };
                reader.readAsDataURL(newFile);
            } else if (newFile.type.startsWith('video/')) {
                var videoElement = document.createElement('video');
                videoElement.src = URL.createObjectURL(newFile);
                videoElement.controls = true;
                document.getElementById('preview').innerHTML = '';
                document.getElementById('preview').appendChild(videoElement);
            } else {
                document.getElementById('preview').innerHTML = 'Preview not available for this file type.';
            }
        }
    });
    
    $scope.loadLanguages();
    $scope.loadContributions();
}]);
