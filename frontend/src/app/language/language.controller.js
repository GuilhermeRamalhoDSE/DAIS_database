angular.module('frontend').controller('LanguageController', ['$scope', 'LanguageService', '$state', 'AuthService', '$filter', function($scope, LanguageService, $state, AuthService, $filter) {
    $scope.languages = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.visiblePages = 3;
    $scope.newLanguage = {
        name: "",
    };

    $scope.getPaginatedData = function() {
        var filteredList = $filter('filter')($scope.languages, $scope.searchText);
        var startIndex = $scope.currentPage * $scope.pageSize;
        var endIndex = Math.min(startIndex + $scope.pageSize, filteredList.length);
        return filteredList.slice(startIndex, endIndex);
    };
    
    
    $scope.setCurrentPage = function(page) {
        if (page >= 0 && page < $scope.totalPages()) {
            $scope.currentPage = page;
        }
    };
    
    $scope.totalPages = function() {
        return Math.ceil($scope.languages.length / $scope.pageSize);
    };
    
    $scope.getPages = function() {
        var pages = [];
        var total = $scope.totalPages();
        var startPage = Math.max(0, $scope.currentPage - Math.floor($scope.visiblePages / 2));
        var endPage = Math.min(total, startPage + $scope.visiblePages);
    
        if (startPage > 0) {
            pages.push(0);
            if (startPage > 1) {
                pages.push('...');
            }
        }
    
        for (var i = startPage; i < endPage; i++) {
            pages.push(i);
        }
    
        if (endPage < total) {
            if (endPage < total - 1) {
                pages.push('...');
            }
            pages.push(total - 1);
        }
    
        return pages;
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
        $state.go('base.home-su');
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
