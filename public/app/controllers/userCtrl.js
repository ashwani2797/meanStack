angular.module('userControllers',['userServices'])

.controller('regCtrl', function($http,$location,$timeout,User){

	var app = this;

	this.regUser  = function(regData){
		app.loading = true;
		app.errorMsg = false;
		app.successMsg = false;
		console.log('form submitted');


		User.create(app.regData).then(function(data){
			console.log(data.data.success);
			console.log(data.data.message);
			if(data.data.success){
				app.loading = false;
				//create a success message
				app.successMsg = data.data.message + '...redirecting ......';
				//redirect to home page
				$timeout(function() {
					$location.path('/');	
				}, 2000);
				
			} else {
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	}
})

.controller('facebookCtrl',function($routeParams,Auth,$location,$window){
	var app = this;

	if($window.location.pathname == '/facebookerror'){
		app.errorMsg = 'facebook email not found in database';

	}else{
		Auth.facebook($routeParams.token);
		$location.path('/');	
	}
	
	
})

.controller('twitterCtrl',function($routeParams,Auth,$location,$window){
	var app = this;

	if($window.location.pathname == '/twittererror'){
		app.errorMsg = 'twitter email not found in database';

	}else{
		Auth.facebook($routeParams.token);
		$location.path('/');	
	}
	
	
})

.controller('googleCtrl',function($routeParams,Auth,$location,$window){
	var app = this;

	if($window.location.pathname == '/googleerror'){
		app.errorMsg = 'google email not found in database';

	}else{
		Auth.facebook($routeParams.token);
		$location.path('/');	
	}
	
	
});   