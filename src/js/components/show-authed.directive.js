function ShowAuthed(ProfileService) {
  'ngInject';

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      scope.ProfileService = ProfileService;

      let updateHeader = () => {
          var value = scope.ProfileService.isAuthed();
          console.log("AUTHED:" + value);
          if (value) {
            if (attrs.showAuthed === 'true') {
              element.css({ display: 'inherit'})
            } else {
              element.css({ display: 'none'})
            }
          // not authed
          } else {
            if (attrs.showAuthed === 'true') {
              element.css({ display: 'none'})
            } else {
              element.css({ display: 'inherit'})
            }
          }

      };

      scope.$on('$stateChangeSuccess', updateHeader); // check whenever we load a new state
      scope.$on('userLoggedIn', updateHeader); // update when user logs in
      scope.$on('userLoggedOut', updateHeader); // update when user logs out

      updateHeader()
    }
  };
}

export default ShowAuthed;