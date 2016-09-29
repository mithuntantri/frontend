angular.module("fabfit", ['ui.router', 'ngCookies', 'satellizer', 'ngMaterial', 'ngFacebook'])
.run(['$rootScope', '$state', '$stateParams', '$timeout', '$cookies',
    function($rootScope, $state, $stateParams, $timeout, $cookies) {

    (function(){
       if (document.getElementById('facebook-jssdk')) {return;}
       var firstScriptElement = document.getElementsByTagName('script')[0];
       var facebookJS = document.createElement('script');
       facebookJS.id = 'facebook-jssdk';
       facebookJS.src = '//connect.facebook.net/en_US/all.js';
       firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
     }());

    let loggedIn = $cookies.get('loggedIn')
    let token = $cookies.get('token')
    let name = $cookies.get('name')
    if(loggedIn === "true"){
        $rootScope.loggedIn = true
    }

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
      if (error === "Not Authorised") {
        $state.go("login")
        // alert("You are not logged in")
      } else if(error === "Already Logged In"){
        $state.go("login")
      } else if (error === "Token Invalid") {
        $state.go("login")
      }
    })
    // A `tokenexpired` event
    $rootScope.$on('tokenexpired', function () {
      $cookies.remove('token')
      $cookies.remove('loggedIn')
      $rootScope.loggedIn = false
      $state.go("login")
    })
}])
// A $http interceptor for injecting token and checking for token expiry
.factory('tokenInterceptor', ['$q', '$rootScope', '$cookies',function($q, $rootScope, $cookies){
    var Interceptor = {
        'request': function(config) {
            if ($cookies.get('token')) {
                config.headers['X-Authorization-Token'] = $cookies.get('token')
            }
            return config;
        },
        'responseError': function (rejection) {
            if (rejection.status === 401) {
                $rootScope.$broadcast('tokenexpired')
                return rejection
            }
            return $q.reject(rejection)
        }
    }
    return Interceptor;
}])

  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider,
                    $authProvider, $facebookProvider){
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('tokenInterceptor');
    $urlRouterProvider.otherwise("/");
    // $urlRouterProvider.when('/', '/');

    $facebookProvider.setAppId('');

    // State definitions
    $stateProvider
        .state("login", {
            url: "/",
            templateUrl: "partials/home.html",
            controller: "loginController",
            resolve:{
                gotoLogin: ['$state', '$q', function ($state, $q) {
                    $state.go('login')
                    return $q.resolve()
                }],
                alreadyLoggedIn: ['$q', '$cookies', function($q, $cookies) {
                    if($cookies.get('token')){
                        return $q.reject("Already Logged In")
                    }
                }]
            }
        })
        .state("dashboard", {
            url: "/dashboard",
            templateUrl: "partials/dashboard.html",
            controller: "dashboardController",
            resolve: {
              loginRequired: ['$q','$cookies', function($q,$cookies){
                if(!$cookies.get('token')) {
                  return $q.reject("Not Authorised");
                }
              }]
            }
        })
        .state("profile", {
            url: "/profile",
            templateUrl: "partials/profile.html",
            controller: "profileController",
            resolve: {
              loginRequired: ['$q', '$cookies',function($q,$cookies){
                if(!$cookies.get('token')) {
                  return $q.reject("Not Authorised");
                }
              }]
            }
        })
})
