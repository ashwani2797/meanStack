angular.module('mainController',['authServices'])

.controller('mainCtrl',function(Auth,$timeout,$location){
var app = this;
app.errorMsg = false;
app.successMsg = false;

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
				}, 2000);
				
			} else {
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	}
});






