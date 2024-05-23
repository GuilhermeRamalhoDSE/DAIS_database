angular.module('frontend').controller('ScreenController', ['$scope', 'ScreenService', '$state', '$stateParams', 'AuthService', 'LicenseService', '$http', '$q', '$interval', 'Upload', function($scope, ScreenService, $state, $stateParams, AuthService, LicenseService, $http, $q, $interval, Upload) {
    $scope.screenList = [];
    $scope.screenTypes = [];
    $scope.logo = null;
    $scope.background = null;
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.licenseId = AuthService.getLicenseId();

    let totemId = parseInt($stateParams.totemId || sessionStorage.getItem('lasttotemId'), 10);
    sessionStorage.setItem('lasttotemId', totemId.toString());

    let totemName = $stateParams.totemName || sessionStorage.getItem('lasttotemName');
    sessionStorage.setItem('lasttotemName', totemName);
    $scope.totemName = totemName;

    $scope.newScreen = {
        totem_id: totemId,
        typology_id: null,
        footer: ''
    };


    $scope.loadScreens = function() {
        ScreenService.getAll(totemId).then(function(response) {
            $scope.screenList = response.data;
        }).catch(function(error) {
            console.error('Error loading screens:', error);
        });
    };

    $scope.loadScreenType = function() {
        if ($scope.licenseId) {
            LicenseService.getScreenTypeByLicense($scope.licenseId).then(function(response) {
                $scope.screenTypes = response.data;
            }).catch(function(error) {
                console.error('Error loading screen types:', error);
            });
        } else {
            console.error('License ID is undefined');
        }
    }; 

    $scope.goToCreateScreen = function() {
        $state.go('base.screen-new', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            totemId: totemId,
            totemName: totemName });
    };

    $scope.createScreen = function() {
        var formData = new FormData();
    
        if ($scope.logo) {
            $scope.upload($scope.logo).then(function() {
                formData.append('logo', $scope.logo);
                
                if ($scope.background) {
                    $scope.upload($scope.background).then(function() {
                        formData.append('background', $scope.background);
                        uploadScreenData(formData);
                    });
                } else {
                    uploadScreenData(formData);
                }
            });
        } else if ($scope.background) {
            $scope.upload($scope.background).then(function() {
                formData.append('background', $scope.background);
                uploadScreenData(formData);
            });
        } else {
            uploadScreenData(formData);
        }
    };
    
    function uploadScreenData(formData) {
        var screenData = { ...$scope.newScreen };
        formData.append('screen_in', JSON.stringify(screenData));
    
        ScreenService.create(formData).then(function(response) {
            alert('Screen created successfully!');
            $scope.loadScreens();
            $state.go('base.screen-view', { 
                clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                totemId: totemId,
                totemName: totemName });
        }).catch(function(error) {
            console.error('Error creating screen:', error);
        });
    }    

    $scope.editScreen = function(screenId) {
        $state.go('base.screen-update', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            totemId: totemId,
            totemName: totemName,
            screenId: screenId });
    };

    $scope.deleteScreen = function(screenId) {
        var isConfirmed = confirm('Are you sure you want to delete this screen?');
        if (isConfirmed) {
            ScreenService.delete(screenId).then(function(response) {
                alert('Screen deleted successfully!');
                $scope.loadScreens();
                $state.go('base.screen-view', { 
                    clientId: $scope.clientId,
                    clientName: $scope.clientName,
                    groupId: $scope.groupId,
                    groupName: $scope.groupName,
                    totemId: totemId,
                    totemName: totemName });
            }).catch(function(error) {
                console.error('Error deleting screen:', error);
            });
        }
    };

    $scope.downloadLogoFile = function(screenId) {
        if (screenId) {
            var downloadUrl = 'http://127.0.0.1:8000/api/screens/download/logo/' + screenId;
    
            $http({
                url: downloadUrl,
                method: 'GET',
                responseType: 'blob',
            }).then(function(response) {
                var blob = new Blob([response.data], { type: response.headers('Content-Type') });
                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href', window.URL.createObjectURL(blob));
                downloadLink.attr('download', 'LogoFile-' + screenId); 
    
                document.body.appendChild(downloadLink[0]);
                downloadLink[0].click();
                document.body.removeChild(downloadLink[0]);
            }).catch(function(error) {
                console.error('Error downloading logo:', error);
            });
        } else {
            alert('Invalid Screen ID');
        }
    };
    
    $scope.downloadBackgroundFile = function(screenId) {
        if (screenId) {
            var downloadUrl = 'http://127.0.0.1:8000/api/screens/download/background/' + screenId;
    
            $http({
                url: downloadUrl,
                method: 'GET',
                responseType: 'blob',
            }).then(function(response) {
                var blob = new Blob([response.data], { type: response.headers('Content-Type') });
                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href', window.URL.createObjectURL(blob));
                downloadLink.attr('download', 'BackgroundFile-' + screenId); 
    
                document.body.appendChild(downloadLink[0]);
                downloadLink[0].click();
                document.body.removeChild(downloadLink[0]);
            }).catch(function(error) {
                console.error('Error downloading logo:', error);
            });
        } else {
            alert('Invalid Screen ID');
        }
    };

    $scope.cancelCreate = function() {
        $state.go('base.screen-view', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            totemId: totemId,
            totemName: totemName });
    };

    $scope.goBack = function() {
        $state.go('base.totem-view', { 
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            totemId: totemId,
            totemName: totemName});
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
    
        return deferred.promise; 
    };

    $scope.loadScreens();
    $scope.loadScreenType();
}]);
