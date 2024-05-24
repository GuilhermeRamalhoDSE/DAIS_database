angular.module('frontend').controller('FormationController', ['$scope', 'FormationService', 'LicenseService', 'AuthService', '$state', '$stateParams', '$http', '$q', '$interval', 'Upload', function($scope, FormationService, LicenseService, AuthService, $state, $stateParams, $http, $q, $interval, Upload) {


    $scope.formationList = [];
    $scope.file = null;

    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.periodiaId = $stateParams.periodiaId;
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
            periodiaId: $scope.periodiaId, 
            layerId: layerId,
            layerName: layerName });
    };

    $scope.createFormation = function() {
        if (!layerId || !$scope.file) {
            return;
        }
    
        var formData = new FormData();
        formData.append('file', $scope.file);
    
        var formationData = { ...$scope.newFormation };
        formData.append('formation_in', JSON.stringify(formationData));
    
        $scope.upload($scope.file);
    
        FormationService.create(formData).then(function(response) {
            alert('Formation created successfully!');
            $scope.loadFormations();
            $state.go('base.formation-view',{
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                periodiaId: $scope.periodiaId, 
                layerId: layerId,
                layerName: layerName });
        }).catch(function(error) {
            console.error('Error creating formation:', error);
        });
    };

    $scope.editFormation = function(formationId, formationName) {
        $state.go('base.formation-update', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            periodiaId: $scope.periodiaId, 
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
                    periodiaId: $scope.periodiaId, 
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
            var downloadUrl = 'https://daisdatabasedse.it/api/formations/download/' + formationId;
    
            $http({
                url: downloadUrl,
                method: 'GET',
                responseType: 'blob',
            }).then(function(response) {
                var blob = new Blob([response.data], { type: response.headers('Content-Type') });
                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href', window.URL.createObjectURL(blob));
                downloadLink.attr('download', 'formationFile-' + formationId);
    
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
    

    $scope.cancelCreate = function() {
        $state.go('base.formation-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            periodiaId: $scope.periodiaId,
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
            periodiaId: $scope.periodiaId,
            layerId: layerId,
            layerName: layerName
        });
    };
    
    $scope.loadLanguages();
    $scope.loadVoices();
    $scope.loadFormations();
}]);
