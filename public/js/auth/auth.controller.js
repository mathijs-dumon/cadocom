class AuthCtrl {
  constructor($rootScope, $scope, $state, ProfileService) {
    'ngInject';

    this._$rootScope = $rootScope;
    this._$scope = $scope;
    this._$state = $state;
    this.ProfileService = ProfileService;

    // Redirect if user is authed:
    if (this.ProfileService.isAuthed())
        this._$state.go('app.index');

  }

  login() {
      this.ProfileService
        .login(this._$scope.user.username, this._$scope.user.password)
        .success(() => {
          // No error: authentication OK
          this._$rootScope.message = 'Authentication successful!';
          this._$state.go("app.index");
        })
        .error(() => {
          // Error: authentication failed
          this._$rootScope.message = 'Incorrect username or password!';
          this._$state.go("app.login");
        });
  }

  register() {
      if (this._$scope.user.password != this._$scope.user.password2) {
        this._$rootScope.message = 'Passwords didn\'t match';
        this._$state.go("app.register");
      } else {        
        this.ProfileService
          .register(this._$scope.user.username, this._$scope.user.password)
          .success(() => {
            // No error: authentication OK
            this._$rootScope.message = 'Registration successful!';
            this._$state.go("app.index");
          })
          .error(() => {
            // Error: authentication failed
            this._$rootScope.message = 'Registration failed!';
            this._$state.go("app.register");
          });
      }
  }
};

export default AuthCtrl;