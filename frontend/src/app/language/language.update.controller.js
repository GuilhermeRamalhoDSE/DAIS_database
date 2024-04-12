angular.module('frontend').controller('LanguageUpdateController', ['$scope', 'LanguageService', '$state', '$stateParams', function($scope, LanguageService, $state, $stateParams) {
    $scope.language = {};

    $scope.loadLanguageData = function() {
        const languageId = $stateParams.languageId;
        LanguageService.getById(languageId).then(function(response) {
            if (response.data) {
                $scope.language = response.data; 
            } else {
                console.error('No data received for language');
                alert('No data found for this language.');
            }
        }).catch(function(error) {
            console.error('Error fetching language data:', error);
            alert('Error fetching language data.');
        });
    };

    $scope.updateLanguage = function() {
        LanguageService.update($scope.language.id, $scope.language).then(function(response) {
            alert('Language updated successfully!');
            $state.go('base.language-view');
        }).catch(function(error) {
            console.error('Error updating language:', error);
            alert('Error updating language.');
        });
    };

    $scope.cancelUpdate = function() {
        $state.go('base.language-view');
    };

    $scope.loadLanguageData();
}]);
