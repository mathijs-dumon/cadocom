// Define the `user` module
angular.module('user', [])

.factory('auth', ['$http', '$window', function($http, $window) {
    var auth = {};

    auth.tokenName = 'cadoCom-token';

    auth.saveToken = function (token) {
      $window.localStorage[auth.tokenName] = token;
    };

    auth.getToken = function () {
        return $window.localStorage[auth.tokenName];
    };

    auth.isLoggedIn = function () {
        var token = auth.getToken();

        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } else
            return false;
    };

    auth.currentUser = function () {
        if (auth.isLoggedIn()) {
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.username;
        }
    };
 
    auth.register = function(user) {
        return $http.post('/user/register', user).success(function(data){
            auth.saveToken(data.token);
        });
    };

    auth.logIn = function(user){
        return $http.post('/user/login', user).success(function(data){
            auth.saveToken(data.token);
        });
    };

    auth.logOut = function(){
        $window.localStorage.removeItem(auth.tokenName);
    };

    return auth;
}])

.controller('AuthCtrl', [
    '$scope', '$state', 'auth',
    function($scope, $state, auth){
        $scope.user = {};

        $scope.register = function(){
            auth.register($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('home');
            });
        };

        $scope.logIn = function(){
            auth.logIn($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('home');
            });
        };
    }
])
.state('login', {
    url: '/login',
    templateUrl: '/login.html',
    controller: 'AuthCtrl',
    onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
            $state.go('home');
        }
    }]
})
.state('register', {
  url: '/register',
  templateUrl: '/register.html',
  controller: 'AuthCtrl',
  onEnter: ['$state', 'auth', function($state, auth){
    if(auth.isLoggedIn()){
      $state.go('home');
    }
  }]
});

;