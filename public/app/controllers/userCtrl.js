angular.module('userControllers',['userServices'])

.controller('regCtrl', function($http,$location,$timeout,User){

	var app = this;

	this.regUser  = function(regData , valid){
		app.loading = true;
		app.errorMsg = false;
		app.successMsg = false;
		console.log('form submitted');

		if(valid){
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
		} else {
			app.loading = false;
			app.errorMsg = "Please ensure form is filled out properly";
		}
		
	};

	this.checkUsername = function(regData){ 
		app.checkingUsername = true;
		app.usernameMsg = false;
		app.usernameInvalid = false;
		User.checkUsername(app.regData ).then(function(data){
			if(data.data.success){
				app.checkingUsername = false;
				app.usernameInvalid = false;
				app.usernameMsg = data.data.message;
			} else {
				app.checkingUsername = false;
				app.usernameInvalid = true;
				app.usernameMsg = data.data.message;
			}
		});
	}

	this.checkEmail = function(regData){ 
		app.checkingEmail = true;
		app.emailMsg = false;
		app.emailInvalid = false;
		User.checkEmail(app.regData ).then(function(data){
			if(data.data.success){
				app.checkingEmail = false;
				app.emailInvalid = false;
				app.emailMsg = data.data.message;
			} else {
				app.checkingEmail = false;
				app.emailInvalid = true;
				app.emailMsg = data.data.message;
			}
		});
	}


})

	.directive('match',function(){
		return {
			restrict:'A',
			controller:function($scope) {
				$scope.confirmed = false;
				$scope.doConfirm = function(values){
					values.forEach(function(ele){
						if($scope.confirm == ele)
							$scope.confirmed = true;
						else
							$scope.confirmed = false;
					});
				}
			},
			link: function(scope,element,attrs){
				attrs.$observe('match',function(){
					scope.matches = JSON.parse(attrs.match);
					scope.doConfirm(scope.matches);
				});
				scope.$watch('confirm',function(){
					scope.matches = JSON.parse(attrs.match);
					scope.doConfirm(scope.matches);
				});
			}
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