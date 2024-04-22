angular.module('frontend').controller('ScreenUpdateController', ['$scope', 'ScreenService', '$state', '$stateParams', 'AuthService', function($scope, ScreenService, $state, $stateParams, AuthService) {
    $scope.isSuperuser = AuthService.isSuperuser();
    $scope.clientId = $stateParams.clientId;
    $scope.clientName = $stateParams.clientName;
    $scope.groupId = $stateParams.groupId;
    $scope.groupName = $stateParams.groupName;
    $scope.totemId = parseInt($stateParams.totemId || sessionStorage.getItem('lasttotemId'), 10);
    $scope.totemName = $stateParams.totemName || sessionStorage.getItem('lasttotemName');
    $scope.screenId = $stateParams.screenId;

    $scope.screenData = {
        typology: '',
        footer: ''
    };
    $scope.logo = null;
    $scope.background = null;

    $scope.loadScreenDetails = function() {
        if ($scope.screenId) {
            ScreenService.getById($scope.screenId).then(function(response) {
                if (response.data) {
                    $scope.screenData = response.data;
                } else {
                    console.error('Screen not found');
                    alert('Screen not found.');
                    $state.go('base.screen-view', { clientId: $scope.clientId,
                        clientName: $scope.clientName,
                        groupId: $scope.groupId,
                        groupName: $scope.groupName,
                        totemId: $scope.totemId,
                        totemName: $scope.totemName });
                }
            }).catch(function(error) {
                console.error('Error fetching screen details:', error);
            });
        } else {
            console.log('No screen ID provided.');
        }
    };

    $scope.updateScreen = function() {
        var formData = new FormData();
        if ($scope.logo) {
            formData.append('logo', $scope.logo);
        }
        if ($scope.background) {
            formData.append('background', $scope.background);
        }

        formData.append('screen_in', JSON.stringify($scope.screenData));

        ScreenService.update($scope.screenId, formData).then(function(response) {
            alert('Screen updated successfully!');
            $state.go('base.screen-view', { clientId: $scope.clientId,
                clientName: $scope.clientName,
                groupId: $scope.groupId,
                groupName: $scope.groupName,
                totemId: $scope.totemId,
                totemName: $scope.totemName  });
        }).catch(function(error) {
            console.error('Error updating screen:', error);
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.screen-view', {
            clientId: $scope.clientId,
            clientName: $scope.clientName,
            groupId: $scope.groupId,
            groupName: $scope.groupName,
            totemId: $scope.totemId,
            totemName: $scope.totemName
        });
    };

    $scope.loadScreenDetails();
}]);
