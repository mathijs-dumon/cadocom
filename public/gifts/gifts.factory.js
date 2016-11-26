var app = angular.factory('gifts', ['$http', function($http){
  var o = {
    gifts: []
  };
  o.getAll = function() {
    return $http.get('api/gifts/list').success(function(data){
      angular.copy(data, o.gifts);
    });
  };
  return o;
}]);
