angular.module('frontend').controller('ButtonTypeController', ['$scope', 'ButtonTypeService', '$state', 'AuthService', '$location', function($scope, ButtonTypeService, $state, AuthService, $location) {
    $scope.buttontypes = [];
    $scope.newButtonType = {
        name: "",
    }
    
    $scope.loadButtonTypes = function() {
        ButtonTypeService.getAll().then(function(response){
            $scope.buttontypes = response.data;
        }, function(error) {
            console.error('Error loading button type:', error);
        });
    };

    $scope.goToNewButtonType = function() {
        $state.go('base.buttontype-new');
    };

    $scope.createButtonType = function() {
        ButtonTypeService.create($scope.newButtonType).then(function(response) {
            alert('Button Type created successfully!');
            $state.go('base.buttontype-view'); 
        }).catch(function(error) {
            console.error('Error creating button type:', error);
        });
    };

    $scope.editButtonType = function(buttontypeId) {
        $state.go('base.buttontype-update', { buttontypeId: buttontypeId });
    };

    $scope.cancelCreate = function() {
        $state.go('base.buttontype-view');
    };

    $scope.goBack = function() {
        $state.go('base.home');
    };

    $scope.deleteButtonType = function(buttontypeId) {
        if (confirm('Are you sure you want to delete this button type?')) {
            ButtonTypeService.delete(buttontypeId).then(function(response) {
                alert('Button Type deleted successfully!');
                $scope.loadButtonTypes();
                $state.go('base.buttontype-view'); 
            }).catch(function(error) {
                console.error('Error deleting button type:', error);
            });
        }
    };

    $scope.isHomePage = function() {
        return $location.path() === '/home';
    };

    $scope.isSuperuser = function() {
        return AuthService.isSuperuser();
    };

    $scope.loadButtonTypes();
}]);