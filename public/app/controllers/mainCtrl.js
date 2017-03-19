angular.module('mainController',['authServices','userServices'])

.controller('mainCtrl',function(Auth,$timeout,$location,$rootScope,$window,$interval,$route,User,AuthToken){
var app = this;
app.checkSession = function(){
	if(Auth.isLoggedIn()){
		app.checkingSession = true;
		var interval = $interval(function(){
			var token = $window.localStorage.getItem('token');
			if(token == null){
				$interval.cancel(interval);
			} else {
				self.parseJwt = function(token) {
					var base64Url = token.split('.')[1];
					var base64 = base64Url.replace('-','+').replace('_','/');
					return JSON.parse($window.atob(base64));
				}
				var expireTime = self.parseJwt(token);
				var timeStamp = Math.floor(Date.now() / 1000); 
				var timeCheck = expireTime.exp - timeStamp;
				if( timeCheck <= 25){
					showModal(1);
					$interval.cancel(interval);
				} else {
					//console.log('Not get expired');
				}
			}


		},2000);
	}
};

app.checkSession();

var showModal = function(option) {

	app.choiceMade = false;
	app.modalHeader = undefined; 
	app.modalBody = undefined;
	app.hideButtons = false;
	
	if(option === 1){
		 app.choiceMade = false;
		app.modalHeader = 'Timeout warning';
		app.modalBody = 'Your session will expire in 5s.Would you like to renew your session?';
		 $("#myModal").modal({backdrop: "static"});
		 

	} else if(option === 2){
	app.hideButtons = true;	
	app.modalHeader = 'Logging out';
	$("#myModal").modal({backdrop: "static"});
	$timeout(function(){
		Auth.logout();
		$location.path('/');
		 hideModal();
		$route.reload(); 
	},2000);
	}

	$timeout(function(){
		 	if(!app.choiceMade){
		 		//console.log('Logged out');
		 		hideModal();
		 	}
		 },4000);






}

app.renewSession = function(){
	app.choiceMade = true;

	User.renewSession(app.username).then(function(data){
		if(data.data.success){

			AuthToken.setToken(data.data.token);
			app.checkSession();
		} else {
			app.modalBody = data.data.message;
		}
	});
	hideModal();
};


app.endSession = function(){
	app.choiceMade = true;
	hideModal();
	$timeout(function(){
		showModal(2);
	},1000);
};

var hideModal = function(){
		 $("#myModal").modal('hide');
};

    app.loadme = false;
	$rootScope.$on('$routeChangeStart', function(){
		if(!app.checkingSession) app.checkSession();
			
			if(Auth.isLoggedIn()){
				//console.log('Success: User is logged In');
				app.isLoggedIn = true; 
				Auth.getUser().then(function(data){
				app.username = data.data.username;
				app.email = data.data.email;
				
				User.getPermission().then(function(data){
					if(data.data.permission === 'admin' || data.data.permission === 'moderator'){
						app.authorized = true;
						app.loadme = true;
					} else{
						app.loadme = true;
					}
				});

				
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
 		app.disabled = true;
 		$window.location = $window.location.protocol + '//' +$window.location.host + '/auth/facebook';
 	}
 	this.twitter = function(){
 		/*console.log($window.location.host);
 		console.log($window.location.protocol);*/
 		app.disabled = true;
 		$window.location = $window.location.protocol + '//' +$window.location.host + '/auth/twitter';
 	}

 	this.google = function(){
 		/*console.log($window.location.host);
 		console.log($window.location.protocol);*/
 		app.disabled = true;
 		$window.location = $window.location.protocol + '//' +$window.location.host + '/auth/google';
 	}

	this.doLogin  = function(loginData){
		app.loading = true;
		app.errorMsg = false;
		app.successMsg = false;
		app.expired = false;
		app.disabled = true;
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
					app.checkSession(); 
				}, 2000);
				
			} else {

				if(data.data.expired){
					app.expired = true;
					app.loading = false;
					app.errorMsg = data.data.message;	

				} else{
					app.disabled = false;
					app.loading = false;
					app.errorMsg = true;
					app.errorMsg = data.data.message;	
				}
				
			}
		});
	}

	app.logout = function(){
		showModal(2);
		/*Auth.logout();
		$location.path('/logout');	
		$timeout(function() {
					$location.path('/');	
				}, 2000);*/
	}
});






