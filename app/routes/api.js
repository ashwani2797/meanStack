var User = require('../models/user');
var jwt  = require('jsonwebtoken');
var secret = 'harrypotter';
module.exports = function(router){
	//USER REGESTRATION ROUTE
	//http://localhost:8085/api/users
	router.post('/users', function(req , res){
	//res.send('testing user route');
	var user = new User();
	user.username = req.body.username;
	user.password = req.body.password;
	user.email = req.body.email;
	user.name = req.body.name; 
	//console.log(req.body);

	if( req.body.username == null || req.body.username == '' || req.body.email == null || req.body.email == '' || req.body.password == null || req.body.password == '' || req.body.name == null || req.body.name == ''  ){
			res.json({ success:false,message: 'Ensure that username , email and password is provided'});
	}
	else{
	user.save(function(err){
		if(err){
			if(err.errors != null){
				if(err.errors.name)
					res.json({ success:false,message: err.errors.name.message});
				else if(err.errors.email)
					res.json({ success:false,message: err.errors.email.message});
				else if(err.errors.username)
					res.json({ success:false,message: err.errors.username.message});
				else if(err.errors.password)
					res.json({ success:false,message: err.errors.password.message});
				else
					res.json({ success: false,message:err});
			} else if(err){
					if(err.code == 11000){
						res.json({ success:false,message: 'email or username already taken'});
						/*
						if(err.errmsg[61] == "u")
							res.json({ success: false , message:'The username is already taken'});
						else if(err.errmsg[61] == "e")
							res.json({ success: false , message:'The email is already taken'});
					*/
					}
						
					else
						res.json({ success:false,message: err});

			}
					

			
		}
		else
			res.json({ success:true,message: 'User Created !'});
		});

	}

});

	//For checking available username 
	//http://Localhost:8085/api/checkusername
	router.post('/checkusername',function(req,res){
		//res.send(req.body.username);
		User.findOne({ username:req.body.username}).select('username ').exec(function(err,user){
			if(err) throw err;
			if(user){
				res.json({ success:false , message: 'The username already taken'});
			} else {
				res.json({ success:true , message:'Valid username'});
			}
			
		})
	});

		//For checking email
	//http://Localhost:8085/api/checkemail
	router.post('/checkemail',function(req,res){
		//res.send(req.body.username);
		User.findOne({email:req.body.email}).select('email').exec(function(err,user){
			if(err) throw err;
			if(user){
				res.json({ success:false , message: 'The email already taken'});
			} else {
				res.json({ success:true , message:'Valid email'});
			}
			
		})
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
					else{
						var token = jwt.sign({ username : user.username , email : user.email },secret,{expiresIn:'24h'});
					    res.json({success:true,message:'User authenticated',token:token});

					}
				} else {
					res.json({success: false ,message:'password not provided'});
				}
			}
		})
	});

	router.use(function(req,res,next){
		var token = req.body.token || req.body.query || req.headers['x-access-token'];
		if(token){
			jwt.verify(token,secret,function(err,decoded){
				if(err){
					res.json({success:false,message :'Invalid token'});
				} else {
					req.decoded = decoded;
					next();
				}

			});

		} else {
			res.json({success:false , message:' NO token provided'});
		}

	});
  
	router.post('/me',function(req,res){
		res.send(req.decoded);
	})
	return router;
}


