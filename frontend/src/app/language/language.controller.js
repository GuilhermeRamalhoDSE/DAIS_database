angular.module('frontend').controller('LanguageController', ['$scope', 'LanguageService', '$state', 'AuthService', function($scope, LanguageService, $state, AuthService) {
    $scope.languages = [];
    $scope.newLanguage = {
        name: "",
    };

    $scope.loadLanguages = function() {
        LanguageService.getAll().then(function(response) {
            $scope.languages = response.data;
        }, function(error) {
            console.error('Error loading languages:', error);
        });
    };

    $scope.goToNewLanguage = function() {
        $state.go('base.language-new');
    };

    $scope.createLanguage = function() {
        LanguageService.create($scope.newLanguage).then(function(response) {
            alert('Language created successfully!');
            $state.go('base.language-view'); 
        }).catch(function(error) {
            console.error('Error creating language:', error);
        });
    };

    $scope.editLanguage = function(languageId) {
        $state.go('base.language-update', { languageId: languageId });
    };

    $scope.cancelCreate = function() {
        $state.go('base.language-view');
    };

    $scope.goBack = function() {
        $state.go('base.home');
    };

    $scope.deleteLanguage = function(languageId) {
        if (confirm('Are you sure you want to delete this language?')) {
            LanguageService.delete(languageId).then(function(response) {
                alert('Language deleted successfully!');
                $scope.loadLanguages();
            }).catch(function(error) {
                console.error('Error deleting language:', error);
            });
        }
    };

    $scope.isSuperuser = function() {
        return AuthService.isSuperuser();
    };

    $scope.loadLanguages();
}]);
