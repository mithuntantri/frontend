class mainService {
  constructor($rootScope) {
    this.$rootScope = $rootScope
  }
}
mainService.$inject = ['$rootScope']
angular.module("fabfit").service("mainService",mainService)
