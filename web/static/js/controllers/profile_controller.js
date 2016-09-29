angular.module("fabfit")
.controller('profileController',
  ['$scope','$state','$http', '$cookies',
    function ($scope, $state, $http, $cookies) {
  $scope.fetchProfile = ()=>{
    $http({
      url:'/api/login/verify',
      method: 'POST',
      data: {
        'username': $cookies.get('name')
      }
    }).then((response)=>{
      if(!response.data.data.authorized){
        $cookies.remove('token')
        $cookies.remove('name')
        $cookies.remove('loggedIn')
        $state.go("login")
      }else{
        console.log('Fetched Profile');
      }
    })
  }
  $scope.logout = ()=>{
    $http({
      url: '/api/logout',
      method:'DELETE',
      data: {
        "username": $cookies.get('name')
      }
    }).then((response)=>{
      $cookies.remove('token')
      $cookies.remove('name')
      $cookies.remove('loggedIn')
      $state.go("login")
    },(error)=>{
      console.log(error);
    })
  }
}])
