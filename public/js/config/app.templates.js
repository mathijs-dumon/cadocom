angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("app-view.html","    <app-header></app-header>\n\n    <div id=\"banner\" class=\"page-header\"></div>\n    <div class=\"container\">\n      <div class=\"row\">\n        <ui-view></ui-view>\n      </div>\n    </div>");
$templateCache.put("giftdetail.html","<div>\n  <h2>{{ $ctrl.gift.title }}</h2>\n\n  <p>\n    {{ $ctrl.gift.description }}\n    <br />\n    <a href=\"gift.link\" title=\"External link\">\n      {{ $ctrl.gift.link }}\n    </a>\n  </p>\n</div> \n");
$templateCache.put("giftlist.html","      <h1>Your giftlist:</h1>\n\n      <div ng-repeat=\"t in $ctrl.gifts\">\n        <h3 class=\"col-md-9\">\n          <a ui-sref=\"app.giftdetail({ id: t._id })\" title=\"View details for {{t.title}}\">\n            {{t.title}}\n          </a> - a wish from <a href=\"#\" ui-sref=\"app.wishlist({id: t.owner})\" title=\"Go to wish list\">{{ t.username }}</a>\n        </h3>\n        <div class=\"col-md-3\"><div class=\"btn-group pull-right\" role=\"group\">\n          <button title=\"Delete this gift\" type=\"button\" class=\"btn btn-default\" ng-click=\"$ctrl.deleteGift(t._id)\">\n            <i class=\"fa fa-times\"></i>\n          </button>\n        </div></div>\n      </div>\n      </div>\n      \n      <div ng-hide=\"$ctrl.gifts.length\"  class=\"container\">\n        <p>\n          No gifts found!\n        </p>\n      </div>");
$templateCache.put("header.html","    <nav class=\"navbar navbar-fixed-top navbar-default\">\n      <div class=\"container-fluid\">\n        <div class=\"navbar-header\">\n          <a class=\"navbar-brand\" href=\"#\">CadoCom</a>\n          <ul class=\"nav navbar-nav navbar-left\" show-authed=\"true\">\n            <li class=\"nav-item\">\n              <a class=\"nav-link\" href=\"#\" ui-sref=\"app.index\" ui-sref-active=\"active\">Home</a>\n            </li>\n            <li class=\"nav-item\">\n              <a class=\"nav-link\" href=\"#\" ui-sref=\"app.wishlist()\" ui-sref-opts=\"{reload:true}\" ui-sref-active=\"active\">Wishlist</a>\n            </li> \n            <li class=\"nav-item\">\n              <a class=\"nav-link\" href=\"#\" ui-sref=\"app.giftlist\" ui-sref-active=\"active\">Giftlist</a>\n            </li> \n            <li class=\"nav-item\">\n              <a class=\"nav-link\" href=\"#\" ui-sref=\"app.profilelist\" ui-sref-active=\"active\">Profiles</a>\n            </li> \n          </ul>\n        </div>\n\n        <div style=\"float: right\" show-authed=\"true\">\n          <ul class=\"nav navbar-nav navbar-right\">\n            <li class=\"nav-item\">\n              <a class=\"nav-link\" href=\"#\" ui-sref=\"app.profiledetail()\" ui-sref-active=\"active\">Profile</a>\n            </li>\n            <li class=\"nav-item\">\n              <a class=\"nav-link\" href=\"#\" ui-sref=\"app.logout\" ui-sref-active=\"active\">Logout <i class=\"fa fa-sign-in\" aria-hidden=\"true\"></i></a>\n            </li> \n          </ul>\n        </div>\n\n        <div style=\"float: right\" show-authed=\"false\">\n          <ul class=\"nav navbar-nav navbar-right\">\n            <li class=\"nav-item\">\n              <a class=\"nav-link\" href=\"#\" ui-sref=\"app.login\" ui-sref-active=\"active\">Login</a>\n            </li>\n            <li class=\"nav-item\">\n              <a class=\"nav-link\" href=\"#\" ui-sref=\"app.register\" ui-sref-active=\"active\">Register</a>\n            </li> \n          </ul>\n        </div>\n\n      </div>\n    </nav>");
$templateCache.put("home.html","<div class=\"jumbotron\">\n  <h1>Welkom op Cado.Com {{ $ctrl.currentProfile.local.username }}</h1>\n  <p>Veel plezier met het verkennen van deze app!</p>\n</div>\n\n\n      ");
$templateCache.put("login.html","<div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <span class=\"pull-right\">Need an account? <a href=\"#\" ui-sref=\"app.register\">Register</a>!</span>\n    Sign in\n  </div>\n  <div class=\"panel-body\">\n    <form class=\"form-horizontal\" ng-submit=\"$ctrl.login()\">\n      <div ng-show=\"message\" class=\"alert alert-danger row\">\n        <span>{{ message }}</span>\n      </div>\n      <div class=\"form-group row\">\n        <label for=\"username\" class=\"col-sm-2 control-label\">Username</label>\n        <div class=\"col-sm-3\">\n          <input type=\"text\" class=\"form-control\" id=\"username\" placeholder=\"Username\" ng-model=\"user.username\" />\n        </div>\n      </div>\n\n      <div class=\"form-group row\">\n        <label for=\"password\" class=\"col-sm-2 control-label\">Password</label>\n        <div class=\"col-sm-3\">\n          <input type=\"password\" class=\"form-control\" id=\"password\" placeholder=\"Password\" ng-model=\"user.password\" />\n        </div>\n      </div>\n\n      <div class=\"form-group row\">\n        <div class=\"col-sm-offset-3 col-sm-2\">\n          <button type=\"submit\" class=\"btn btn-primary\">Sign in</button>\n        </div>\n      </div>\n    </form>\n  </div>\n</div>");
$templateCache.put("profile.html","\n<h1>{{ $ctrl.profile.local.username }}\'s profile</h1>\n<div class=\"container\">\n  <div class=\"row\">\n    <strong>Id</strong>: {{ $ctrl.profile._id }}\n  </div>\n</div>\n<div class=\"container\">\n  <div class=\"row\">\n    <button ng-click=\"$ctrl.unregister()\" class=\"btn btn-default\">Unregister</button>\n  </div>\n</div>");
$templateCache.put("profilelist.html","      <h1>User profiles:</h1>\n\n      <div ng-repeat=\"t in $ctrl.profiles\" class=\"container\">\n        <h3 class=\"col-md-9\"><a ui-sref=\"app.profiledetail({ id: t._id })\" title=\"View details for {{t.local.username}}\">\n            {{t.local.username}}\n          </a>\n        </h3>\n        <div class=\"col-md-3\"><div class=\"btn-group pull-right\" role=\"group\">\n          <button type=\"button\" class=\"btn btn-default\" ui-sref=\"app.wishlist({userId: t._id})\">\n            <i class=\"fa fa-eye \"></i>&nbsp; View wishlist\n          </button>\n        </div></div>\n      </div>\n\n      <div ng-hide=\"$ctrl.profiles.length\"  class=\"container\">\n        <p>\n          No profiles found!\n        </p>\n      </div>");
$templateCache.put("register.html","<div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <span class=\"pull-right\"><a href=\"#\" ui-sref=\"app.login\">Back to login</a></span>\n    Registration\n  </div>\n  <div class=\"panel-body\">\n    <form class=\"form-horizontal\" ng-submit=\"$ctrl.register()\">\n      <div ng-show=\"message\" class=\"alert alert-danger row\">\n        <span>{{ message }}</span>\n      </div>\n      <div class=\"form-group row\">\n        <label class=\"col-sm-2 control-label\" for=\"username\">Username</label>\n        <div class=\"col-sm-3\">\n          <input id=\"username\" class=\"form-control\" type=\"text\" placeholder=\"Username\" ng-model=\"user.username\" />\n        </div>\n      </div>\n      <div class=\"form-group row\">\n        <label class=\"col-sm-2 control-label\" for=\"password\">Password</label>\n        <div class=\"col-sm-3\">\n          <input id=\"password\" class=\"form-control\" type=\"password\" placeholder=\"Password\" ng-model=\"user.password\" />\n        </div>\n      </div>\n      <div class=\"form-group row\">\n        <label class=\"col-sm-2 control-label\" for=\"password2\">Password (again)</label>\n        <div class=\"col-sm-3\">\n          <input id=\"password2\" class=\"form-control\" type=\"password\" placeholder=\"Password (again)\" ng-model=\"user.password2\" />\n        </div>\n      </div>\n      <div class=\"form-group row\">\n        <div class=\"col-sm-offset-2 col-sm-2\">\n          <button type=\"submit\" class=\"btn btn-primary\">Register</button>\n        </div>\n      </div>\n    </form>\n  </div>\n</div>");
$templateCache.put("wishdetail.html","  <h2>{{$ctrl.wish.title}}</h2>\n\n  <p>\n    {{$ctrl.wish.description}}\n    <br />\n    <a href=\"$ctrl.wish.link\" title=\"External link\">\n      {{$ctrl.wish.link}}\n    </a>\n  </p>\n");
$templateCache.put("wishlist.html","      <h1>{{$ctrl.username}} wishlist:</h1>\n\n      <div ng-repeat=\"t in $ctrl.wishes\" class=\"container\">\n        <h3 class=\"col-md-9\"><a ui-sref=\"app.wishdetail({ id: t._id })\" title=\"View details for {{t.title}}\">\n            {{t.title}}\n          </a>\n        </h3>\n        <div class=\"col-md-3\"><div class=\"btn-group pull-right\" role=\"group\">\n          <button title=\"Delete this wish\" ng-show=\"$ctrl.isOwner\" type=\"button\" class=\"btn btn-default\" ng-click=\"$ctrl.deleteWish(t._id)\">\n            <i class=\"fa fa-times\"></i>\n          </button>\n          <button title=\"Edit this wish\" ng-show=\"$ctrl.isOwner\" type=\"button\" class=\"btn btn-default\" >\n            <i class=\"fa fa-pencil-square-o\"></i>\n          </button>\n          <button title=\"I\'m going to get this!\" ng-show=\"!$ctrl.isOwner && !(t.isDonated==undefined || t.isDonated)\" type=\"button\" class=\"btn btn-default\" ng-click=\"$ctrl.donateWish(t._id)\">\n            <i class=\"fa fa-check\"></i>\n          </button>\n          <button title=\"Somebody else is getting this!\" ng-show=\"!t.isDonated==undefined && t.isDonated\" type=\"button\" disabled class=\"btn btn-default\">\n            <i class=\"fa fa-check\"></i>\n          </button>\n        </div></div>\n      </div>\n      <div ng-hide=\"$ctrl.wishes.length\"  class=\"container\">\n        <p>\n          No wishes found!\n        </p>\n      </div>\n\n      <hr />\n\n      <form ng-show=\"$ctrl.isOwner\" ng-submit=\"$ctrl.addWish()\" style=\"margin-top:30px;\">\n        <h3>Add a new whish</h3>\n\n        <div class=\"form-group\">\n          <input type=\"text\"\n            class=\"form-control\"\n            placeholder=\"Title\"\n            ng-model=\"wishtitle\"></input>\n        </div>\n        <div class=\"form-group\">\n          <textarea type=\"textarea\" rows=10\n          class=\"form-control\"\n          placeholder=\"Description\"\n          ng-model=\"description\"></textarea>\n        </div>\n        <div class=\"form-group\">\n          <input type=\"text\"\n          class=\"form-control\"\n          placeholder=\"Link\"\n          ng-model=\"link\"></input>\n        </div>\n        <button type=\"submit\" class=\"btn btn-primary\">Post</button>\n      </form>");}]);