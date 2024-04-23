angular.module('frontend').controller('ScreenController', ['$scope', 'ScreenService', '$state', '$stateParams', 'AuthService', '$http', function($scope, ScreenService, $state, $stateParams, AuthService, $http) {
    $scope.screenList = [];
    $scope.logo = null;
    $scope.background = null;
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.isSuperuser = AuthService.isSuperuser();

    let totemId = parseInt($stateParams.totemId || sessionStorage.getItem('lasttotemId'), 10);
    sessionStorage.setItem('lasttotemId', totemId.toString());

    let totemName = $stateParams.totemName || sessionStorage.getItem('lasttotemName');
    sessionStorage.setItem('lasttotemName', totemName);
    $scope.totemName = totemName;

    $scope.newScreen = {
        totem_id: totemId,
        typology: '',
        footer: ''
    };

    $scope.loadScreens = function() {
        ScreenService.getAll(totemId).then(function(response) {
            $scope.screenList = response.data;
        }).catch(function(error) {
            console.error('Error loading screens:', error);
        });
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
        if (!totemId || !$scope.logo || !$scope.background) {
            return;
        }

        var formData = new FormData();
        formData.append('logo', $scope.logo);
        formData.append('background', $scope.background);

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
    };

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

    $scope.loadScreens();
}]);
