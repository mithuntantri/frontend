angular.module("fabfit").controller('loginController',
              ['$scope','$state', '$rootScope', '$http', '$cookies', '$auth', '$facebook',
              function($scope, $rootScope, $state, $http, $cookies, $auth, $facebook){
  $scope.login = ()=>{
    console.log($scope.name);
    $http({
      url: '/api/login',
      method: 'POST',
      data:{
        'name': $scope.name
      }
    }).then((response)=>{
      console.log(response);
      $cookies.put('token',response.data.secret)
		  $cookies.put('loggedIn',"true")
      $cookies.put('name', $scope.name)
      $state.go("dashboard")
    },(error)=>{
      console.log(error);
    })
  }
  $scope.expire = true
  $('.modal.loginmodal').modal({
      closable: false,
      allowMultiple: false,
      duration: 200,
      detachable: false,
      observeChanges: true,
      context: 'none',
      selector: {
          close: '.fa.fa-times'
      }
  });
  $scope.openModal = () =>{
    console.log('Opening Modal');
    $('.modal.loginmodal').modal('show')
  }
  $scope.login_active = true
  $scope.signup_active = false
  $scope.modalTab = (tab)=>{
    if(tab === 'login'){
      $scope.login_active = true
      $scope.signup_active = false
    }
    else {
      $scope.login_active = false
      $scope.signup_active = true
    }
  }
  $scope.user = {
    "username":"",
    "password":""
  }
  $scope.secureLogin = ()=>{
    $http({
      url: '/api/login',
      method: 'POST',
      data: {
        "username": $scope.user.username,
        "password": $scope.user.password,
        "login_width_otp": false,
        "expiry": false
      }
    }).then((response)=>{
      if(response.data.status === 'success'){
        console.log(response);
        $cookies.put('token',response.data.data.secret)
  		  $cookies.put('loggedIn',"true")
        $cookies.put('name', $scope.user.username)
        $('.modal.loginmodal').modal('hide')
        $state.go("dashboard")
      }
    }, (error)=>{
      console.log(error);
    })
  }
  $scope.isLoggedIn = false;
  $scope.fblogin = function() {
    $facebook.login().then(function() {
      refresh();
    });
  }
  $scope.fblogout = function () {
    $facebook.logout().then(function() {
      refresh();
    })
  }
  function refresh() {
    $facebook.api("/me").then(
      function(response) {
        console.log('facebook:',response);
        $scope.UserName = response.name;
        $scope.isLoggedIn = true;
      },
      function(err) {
      });
  }

  refresh();
}])
