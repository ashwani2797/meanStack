angular.module('managementController',[])

.controller('managementCtrl',function(User){
	var app = this;
	app.accessDenied = true;
	app.loading = true;
	app.errorMsg = false;
	app.editAccess = false;
	app.deleteAccess = false;
	app.limit = 5;

	getUsers = function() {
		User.getUsers().then(function(data){
			if(data.data.success) {
				if(data.data.permission === 'admin' || data.data.permission === 'moderator'){
					app.users = data.data.users;
					app.loading = false;
					app.accessDenied = false;
					if( data.data.permission === 'admin'){
						app.editAccess = true;
						app.deleteAccess  =true;
					} else if( data.data.permission === 'moderator'){
						app.editAccess = true;
					}
				} else {
					app.errorMsg = 'Insufficient Permissions';
					app.loading  =false;
				}
			} else {
				app.errorMsg = data.data.message;
			}
		});
	}

	getUsers();
	app.showMore = function(number){
		app.showMoreError = false;
		if(number > 0){
			app.limit = number;
		} else {
			app.showMoreError = "Please enter a valid number";
		}

	};

	app.showAll = function(){
		app.limit = undefined;
		app.showMoreError = false;	
	};

	app.deleteUser = function(username) {
		User.deleteUser(username).then(function(data){
			if(data.data.success) {
				getUsers();
			} else {
				app.showMoreError = data.data.message;
			}
		})
	}

})

.controller('editCtrl',function($scope,$routeParams , User,$timeout){
	var app = this;
	$scope.nameTab = 'active';
	app.phase1 = true;

	User.getUser($routeParams.id).then(function(data){
		if(data.data.success){
			$scope.newName = data.data.user.name;
			$scope.newEmail = data.data.user.email;
			$scope.newUsername = data.data.user.username;
			$scope.newPermission = data.data.user.permission; 
			app.currentUser = data.data.user._id;
		} else {
			app.errorMsg = data.data.message;
		}
	})

	app.namePhase = function(){
		$scope.nameTab = 'active';
		$scope.usernameTab = 'default';
		$scope.emailTab = 'default';
		$scope.permissionTab = 'default';
		app.phase1 = true;
		app.phase2 = false;
		app.phase3 = false;
		app.phase4 = false;
		app.errorMsg = false;

	};

	app.emailPhase = function(){
		$scope.nameTab = 'default';
		$scope.usernameTab = 'default';
		$scope.emailTab = 'active';
		$scope.permissionTab = 'default';
		app.phase1 = false;
		app.phase2 = false;
		app.phase3 = true;
		app.phase4 = false;
		app.errorMsg = false;	

	};

	app.usernamePhase = function(){
		$scope.nameTab = 'default';
		$scope.usernameTab = 'active';
		$scope.emailTab = 'default';
		$scope.permissionTab = 'default';
		app.phase1 = false;
		app.phase2 = true;
		app.phase3 = false;
		app.phase4 = false;
		app.errorMsg = false;

	};

	app.permissionsPhase = function(){
		$scope.nameTab = 'default';
		$scope.usernameTab = 'default';
		$scope.emailTab = 'default';
		$scope.permissionTab = 'active';
		app.phase1 = false;
		app.phase2 = false;
		app.phase3 = false;
		app.phase4 = true;
		app.disableUser = false;
		app.disableModerator = false;
		app.disableAdmin = false;

		if($scope.newPermission === 'user'){
			app.disableUser = true;
		} else if($scope.newPermission === 'moderator'){
			app.disableModerator = true;
		}else if($scope.newPermission === 'admin'){
			app.disableAdmin = true;
		}


	};

	app.updateName  = function(newName , valid){
		app.errorMsg = false;
		app.disable = true;
		

		if(valid){
			var  userObject = {};
			userObject._id = app.currentUser;
			userObject.name = $scope.newName;
			User.editUser(userObject).then(function(data){
				if(data.data.success){
					app.successMsg = data.data.message;
					$timeout(function(){
						app.nameForm.name.$setPristine();
						app.nameForm.name.$setUntouched();
						app.successMsg = false;
						app.disable = false;
					},2000);
				} else {
					app.errorMsg = data.data.message;
					app.disable = false;
				}	
			});

		} else {
			app.disable = false;
			app.errorMsg = "Please ensure form is filled out properly";
		}


	};

		app.updateEmail  = function(newEmail , valid){
		app.errorMsg = false;
		app.disable = true;
		

		if(valid){
			var  userObject = {};
			userObject._id = app.currentUser;
			userObject.email = $scope.newEmail;
			User.editUser(userObject).then(function(data){
				if(data.data.success){
					app.successMsg = data.data.message;
					$timeout(function(){
						app.emailForm.email.$setPristine();
						app.emailForm.email.$setUntouched();
						app.successMsg = false;
						app.disable = false;
					},2000);
				} else {
					app.errorMsg = data.data.message;
					app.disable = false;
				}	
			});

		} else {
			app.disable = false;
			app.errorMsg = "Please ensure form is filled out properly";
		}


	};

		app.updateUsername  = function(newUsername , valid){
		app.errorMsg = false;
		app.disable = true;
		

		if(valid){
			var  userObject = {};
			userObject._id = app.currentUser;
			userObject.username = $scope.newUsername;
			User.editUser(userObject).then(function(data){
				if(data.data.success){
					app.successMsg = data.data.message;
					$timeout(function(){
						app.usernameForm.username.$setPristine();
						app.usernameForm.username.$setUntouched();
						app.successMsg = false;
						app.disable = false;
					},2000);
				} else {
					app.errorMsg = data.data.message;
					app.disable = false;
				}	
			});

		} else {
			app.disable = false;
			app.errorMsg = "Please ensure form is filled out properly";
		}


	};

			app.updatePermissions  = function(newPermission ){
		app.errorMsg = false;
		app.disable = true;
		app.disableAdmin = true;
		app.disableModerator = true;
		app.disableAdmin = true;

			var  userObject = {};
			userObject._id = app.currentUser;
			userObject.permission = newPermission;
			User.editUser(userObject).then(function(data){
				if(data.data.success){
					app.successMsg = data.data.message;
					$timeout(function(){
		
						app.successMsg = false;
						app.disable = false;

						if( newPermission === 'user'){
							$scope.newPermission = 'user';
							app.disableUser = true;
							app.disableModerator = false;
							app.disableAdmin = false;
						} else if( newPermission === 'moderator'){
							$scope.newPermission = 'moderator';
							app.disableUser = false;
							app.disableModerator = true;
							app.disableAdmin = false;
						}else if( newPermission === 'admin'){
							$scope.newPermission = 'admin';
							app.disableUser = false;
							app.disableModerator = false;
							app.disableAdmin = true;
						}

					},2000);
				} else {

					app.errorMsg = data.data.message;
					app.disable = false;
					$timeout(function(){
						app.errorMsg = false;
							app.disableUser = false;
							app.disableModerator = false;
							app.disableAdmin = false;

							if($scope.newPermission === 'user'){
								app.disableUser = true;
							} else if($scope.newPermission === 'moderator'){
								app.disableModerator = true;
							}else if($scope.newPermission === 'admin'){
								app.disableAdmin = true;
							}

					},2000);
				}	
			});

	};

});