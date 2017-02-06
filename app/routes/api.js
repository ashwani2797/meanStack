var User = require('../models/user');
module.exports = function(router){
	//USER REGESTRATION ROUTE
	//http://localhost:8085/api/users
	router.post('/users', function(req , res){
	//res.send('testing user route');
	var user = new User();
	user.username = req.body.username;
	user.password = req.body.password;
	user.email = req.body.email;
	//console.log(req.body);

	if( req.body.username == null || req.body.username == '' || req.body.email == null || req.body.email == '' || req.body.password == null || req.body.password == '' ){
			res.json({ success:false,message: 'Ensure that username , email and password is provided'});
	}
	else{
	user.save(function(err){
		if(err)
			res.json({ success:false,message: 'Username or email alread exist'});

		else
			res.json({ success:true,message: 'User Created !'});
		});

	}

});
	//User LOGIN ROUTE
	//http://Localhost:8085/api/authenticate
	router.post('/authenticate',function(req,res){
		//res.send(req.body.username);
		User.findOne({ username:req.body.username}).select('email username password').exec(function(err,user){
			if(err) throw err;
			if(!user){ 
				res.json({success:false,message:'Could not authenticate user'});
			}else if(user){
				if(req.body.password){
					var validPassword = user.comparePassword(req.body.password);
					if(!validPassword)
					res.json({success: false ,message:'Could Not authenticate password'});
					else
					res.json({success:true,message:'User authenticated'});

				} else {
					res.json({success: false ,message:'password not provided'});
				}
				
			
			}

		})
		

	});
	return router;
}