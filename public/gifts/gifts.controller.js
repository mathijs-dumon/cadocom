app.controller('GiftsCtrl', [
    '$scope',
    '$stateParams',
    'gifts',
    function($scope, $stateParams, gifts) {
        $scope.gift = gifts.gifts[$stateParams.id];
    }
]);