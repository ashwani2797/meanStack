angular.module('emailController',['userServices'])

.controller('emailCtrl',function($routeParams,User,$timeout,$location){
		app = this;
   	  User.activateAccount($routeParams.token).then(function(data){
  			  	app.successMsg = false;
  			  	app.errorMsg = false;
  			  	if(data.data.success){
  			  		app.successMsg = data.data.message + '.....Redirecting After 5 seconds';
              $timeout(function(){
                $location.path('/login');
              },5000);
  			  	} else {
  			  		 app.errorMsg = data.data.message + '.....Redirecting After 5 seconds';
                $timeout(function(){
                  $location.path('/login');
                },5000);


  			  	}  	});
})
.controller('resendCtrl',function(User){
  app = this;
  app.errorMsg = false;
  app.successMsg = false;
  app.checkCredentials = function(loginData){
    app.disabled = true;
      User.checkCredentials(app.loginData).then(function(data){
        if(data.data.success){
          app.errorMsg = false;
          User.resendLink(app.loginData).then(function(data){
            if(data.data.success){
              app.successMsg = data.data.message;
            }
          });
        } else {
              app.disabled = false;
          app.errorMsg = data.data.message;
        }
        
      });

  };

});