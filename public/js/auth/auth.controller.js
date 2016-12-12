export class AuthCtrl {
  constructor($rootScope, $scope, $location, ProfileService) {
    'ngInject';

    this._$rootScope = $rootScope;
    this._$scope = $scope;
    this._$location = $location;
    this.ProfileService = ProfileService;

    this._$rootScope.title = 'Welcome';

    // Redirect if user is authed:
    if (this.ProfileService.isAuthed())
        this.$location.url('/');

  }

  login() {
      this.ProfileService
        .login(this._$scope.user.username, this._$scope.user.password)
        .success(function(user){
          // No error: authentication OK
          this._$rootScope.message = 'Authentication successful!';
          this._$location.url('/');
        })
        .error(function(){
          // Error: authentication failed
          this._$rootScope.message = 'Incorrect username or password!';
          this._$location.url('/login');
        });
  };

  register() {
      this.ProfileService
        .register(this._$scope.user.username, this._$scope.user.password)
        .success(function(user){
          // No error: authentication OK
          this._$rootScope.message = 'Registration successful!';
          this._$location.url('/');
        })
        .error(function(){
          // Error: authentication failed
          this._$rootScope.message = 'Registration failed!';
          this._$location.url('/register');
        });
  };
};