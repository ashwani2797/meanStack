angular.module('mainController',['authServices'])

.controller('mainCtrl',function(Auth,$timeout,$location,$rootScope,$window){
var app = this;

    app.loadme = false;
	$rootScope.$on('$routeChangeStart', function(){
			if(Auth.isLoggedIn()){
				console.log('Success: User is logged In');
				app.isLoggedIn = true; 
				Auth.getUser().then(function(data){
				console.log(data.data.username);
				app.username = data.data.username;
				app.email = data.data.email;
				app.loadme = true;
				});
			}
			else{
				app.loadme = true;
				console.log('Failure:User is NOT logged IN');
				app.isLoggedIn = false; 
				app.username = "";
				app.email = ""; 
			}
			if( $location.hash() == '_=_') $location.hash(null);	
	});
 
 	this.facebook  = function(){
 		/*console.log($window.location.host);
 		console.log($window.location.protocol);*/
 		$window.location = $window.location.protocol + '//' +$window.location.host + '/auth/facebook';
 	}
 	this.twitter = function(){
 		/*console.log($window.location.host);
 		console.log($window.location.protocol);*/
 		$window.location = $window.location.protocol + '//' +$window.location.host + '/auth/twitter';
 	}

 	this.google = function(){
 		/*console.log($window.location.host);
 		console.log($window.location.protocol);*/
 		$window.location = $window.location.protocol + '//' +$window.location.host + '/auth/google';
 	}

	this.doLogin  = function(loginData){
		app.loading = true;
		app.errorMsg = false;
		app.successMsg = false;
		console.log('form submitted');



		Auth.login(app.loginData).then(function(data){
			console.log(data.data.success);
			console.log(data.data.message);
			if(data.data.success){
				app.loading = false;
				//create a success message
				app.successMsg = data.data.message + '...redirecting ......';
				//redirect to home page
				$timeout(function() {
					$location.path('/about');	
					app.loginData = {};
					app.errorMsg = false;
					app.successMsg = false;
				}, 2000);
				
			} else {
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	}

	this.logout = function(){
		Auth.logout();
		$location.path('/logout');	
		$timeout(function() {
					$location.path('/');	
				}, 2000);
	}
});






