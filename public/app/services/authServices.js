 angular.module('authServices',[])

.factory('Auth', function($http){
	var authFactory = {};

	//user.create(regData )
	authFactory.login = function(loginData){
		return $http.post('/api/authenticate',loginData);
	}
	return authFactory;
});
