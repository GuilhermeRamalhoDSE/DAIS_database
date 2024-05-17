angular.module('frontend').controller('ContributionIAUpdateController', ['$scope', 'ContributionIAService', 'LicenseService', 'AuthService', '$state', '$stateParams', 'Upload', '$q', '$interval', function($scope, ContributionIAService, LicenseService, AuthService, $state, $stateParams, Upload, $q, $interval) {
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.periodiaId = $stateParams.periodiaId;
    $scope.layerName = $stateParams.layerName;
    $scope.layerId = $stateParams.layerId;
    
    $scope.contributioniaId = $stateParams.contributioniaId;
    $scope.contributioniaName = $stateParams.contributioniaName;
    
    $scope.contributionData = {};
    $scope.file = null;
    $scope.languages = [];

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

    $scope.loadContributionDetails = function() {
        if(!$scope.contributioniaId){
            console.log('No contribution ID provided.');
            alert('No contribution ID provided.')
            $state.go('base.contributionia-view', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                periodiaId: $scope.periodiaId,
                layerId: $scope.layerId,
                layerName: $scope.layerName,
             });
             return;
        }
        ContributionIAService.getById($scope.contributioniaId).then(function(response) {
            if (response.data) {
                $scope.contributionData = response.data;
                $scope.contributionData.language_id = response.data.language.id; 
            } else {
                console.error('Contribution not found');
                alert('Contribution not found.');
                $state.go('base.contributionia-view', { 
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    periodiaId: $scope.periodiaId,
                    layerId: $scope.layerId,
                    layerName: $scope.layerName,
                });
            }
        }).catch(function(error) {
            console.error('Error fetching contribution details:', error);
        });
    }; 

    $scope.updateContribution = function() {
        var formData = new FormData();
    
        if ($scope.file) {
            formData.append('file', $scope.file);
        }
    
        formData.append('data', JSON.stringify($scope.contributionData));
    
        $scope.upload($scope.file).then(function() {
            ContributionIAService.update($scope.contributioniaId, formData).then(function(response) {
                alert('Contribution updated successfully!');
                $state.go('base.contributionia-view', { 
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    periodiaId: $scope.periodiaId,
                    layerId: $scope.layerId,
                    layerName: $scope.layerName,
                });
            }).catch(function(error) {
                console.error('Error updating contribution:', error);
            });
        }).catch(function(error) {
            console.error('Error uploading file:', error);
        });
    };
    
    $scope.cancelUpdate = function() {
        $state.go('base.contributionia-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            periodiaId: $scope.periodiaId,
            layerId: $scope.layerId,
            layerName: $scope.layerName
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

    $scope.loadContributionDetails();
    $scope.loadLanguages();
}]);
