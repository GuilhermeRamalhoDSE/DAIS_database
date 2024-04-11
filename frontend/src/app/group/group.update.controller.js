angular.module('frontend').controller('GroupUpdateController', ['$scope', 'GroupService', '$state', '$stateParams', 'AuthService', function($scope, GroupService, $state, $stateParams, AuthService) {
    $scope.group = {};
    $scope.isSuperuser = AuthService.isSuperuser();

    // Opções para o campo 'typology'
    $scope.typologyOptions = [
        {value: 'Artificial Intelligence', label: 'Intelligenza artificiale'},
        {value: 'Digital Signage', label: 'Digital Signage'}
    ];

    $scope.loadGroupData = function() {
        const groupId = $stateParams.groupId; // Supondo que o ID do grupo é passado como um parâmetro de estado
        
        GroupService.getById(groupId).then(function(response) {
            if (response.data) {
                $scope.group = response.data;
            } else {
                console.error('Group not found');
                alert('Group not found.');
                $state.go('base.group-view'); // Ajuste para o estado de visualização adequado
            }
        }).catch(function(error) {
            console.error('Error fetching group data:', error);
            alert('Error fetching group data.');
        });
    };

    $scope.updateGroup = function() {
        if ($scope.group && $scope.group.id) {
            const payload = {
                name: $scope.group.name,
                typology: $scope.group.typology,
                comments: $scope.group.comments
                // Adicione outros campos conforme necessário
            };
            // Se o usuário é superusuário, permite alterar o license_id; senão, ignora essa propriedade no payload
            if ($scope.isSuperuser) {
                payload.license_id = $scope.group.license_id;
            }
            
            GroupService.update($scope.group.id, payload).then(function(response) {
                alert('Group updated successfully!');
                $state.go('base.group-view'); // Ajuste conforme o estado de visualização do grupo
            }).catch(function(error) {
                console.error('Error updating group:', error);
                alert('Error updating group.');
            });
        }
    };

    $scope.cancelUpdate = function() {
        $state.go('base.group-view'); // Ajuste conforme necessário
    };

    $scope.loadGroupData();
}]);
