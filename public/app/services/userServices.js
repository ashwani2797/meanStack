angular.module('userServices',[])

.factory('User', function($http){
	var userFactory = {};

	//User.create(regData )
	userFactory.create = function(regData){
		return $http.post('/api/users',regData);
	}

	//User.checkUsername(regData )
	userFactory.checkUsername = function(regData){
		return $http.post('/api/checkusername',regData);
	}

	//User.checkEmail(regData )
	userFactory.checkEmail = function(regData){
		return $http.post('/api/checkemail',regData);
	}

	//User.activateAccount(token)
	userFactory.activateAccount = function(token){
		return $http.put('/api/activate/' + token);
	}
	//User.checkCredentials(loginData);
	userFactory.checkCredentials = function(loginData){
		return $http.post('/api/resend',loginData);
	}

	//User.resendLink(username);
	userFactory.resendLink = function(username){
		return $http.put('/api/resend', username);
	}

	userFactory.sendUsername = function(userData){
		return $http.get('/api/resetusername/' + userData);
	}

	userFactory.sendPassword = function(resetData){
		console.log(resetData);
		return $http.put('/api/resetpassword' ,resetData);
	};

	userFactory.resetUser = function(token){
		return $http.get('/api/resetPassword/' + token);
	};

	userFactory.savePassword = function(regData){
		return $http.put('/api/savepassword',regData);
	}
	return userFactory;
});


	
