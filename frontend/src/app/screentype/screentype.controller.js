angular.module('frontend').controller('ScreenTypeController', ['$scope', 'ScreenTypeService', '$state', 'AuthService', '$location', function($scope, ScreenTypeService, $state, AuthService, $location) {
    $scope.screentypes = [];
    $scope.newScreenType = {
        name: "",
    }
    
    $scope.loadScreenTypes = function() {
        ScreenTypeService.getAll().then(function(response){
            $scope.screentypes = response.data;
        }, function(error) {
            console.error('Error loading screen type:', error);
        });
    };

    $scope.goToNewScreenType = function() {
        $state.go('base.screentype-new');
    };

    $scope.createScreenType = function() {
        ScreenTypeService.create($scope.newScreenType).then(function(response) {
            alert('Screen Type created successfully!');
            $state.go('base.screentype-view'); 
        }).catch(function(error) {
            console.error('Error creating screen type:', error);
        });
    };

    $scope.editScreenType = function(screentypeId) {
        $state.go('base.screentype-update', { screentypeId: screentypeId });
    };

    $scope.isHomePage = function() {
        return $location.path() === '/home';
    };

    $scope.cancelCreate = function() {
        $state.go('base.screentype-view');
    };

    $scope.goBack = function() {
        $state.go('base.home');
    };

    $scope.deleteScreenType = function(screentypeId) {
        if (confirm('Are you sure you want to delete this screen type?')) {
            ScreenTypeService.delete(screentypeId).then(function(response) {
                alert('Screen Type deleted successfully!');
                $scope.loadScreenTypes();
                $state.go('base.screentype-view'); 
            }).catch(function(error) {
                console.error('Error deleting screen type:', error);
            });
        }
    };

    $scope.isSuperuser = function() {
        return AuthService.isSuperuser();
    };

    $scope.loadScreenTypes();
}]);