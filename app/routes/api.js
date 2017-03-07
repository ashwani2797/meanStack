var User        = require('../models/user');
var jwt         = require('jsonwebtoken');
var secret      = 'harrypotter';
var nodemailer  = require('nodemailer');
module.exports  = function(router){

var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "fcashwani2797@gmail.com",
        pass: "Demo@localhost"
    }
});


	//USER REGESTRATION ROUTE
	//http://localhost:8085/api/users
	router.post('/users', function(req , res){
	//res.send('testing user route');
	var user = new User();
	user.username = req.body.username;
	user.password = req.body.password;
	user.email = req.body.email;
	user.name = req.body.name; 
	user.temporarytoken = jwt.sign({ username : user.username , email : user.email },secret,{expiresIn:'24h'});

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
		else{

				var message = {
 				  from: 'Localhost Staff, staff@localhost.com',
				  to: user.email,
				  subject: 'Activation Link',
				  text: 'Hello' +user.name +'Thanks for registering at localhost.com. Please click on the link below to complete your activation: http://localhost:8085/activate/'+ user.temporarytoken,
				  html: 'Hello<strong>' +user.name +'</strong>,<br><br>Thanks for registering at localhost.com. Please click on the link below to complete your activation:<br><a href="http://localhost:8085/activate/'+ user.temporarytoken+'">http://localhost:8085/activate/</a>',
				}
				console.log('Sending Mail');
				transport.sendMail(message, function(error){
				if(error){
				  console.log('Error occured');
				  console.log(error.message);
				  return;
				}
				console.log('Message sent successfully!');
			});

			res.json({ success:true,message: 'Account registered!Please check your email for activation link.'});


			}
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
		User.findOne({ username:req.body.username}).select('email username password active').exec(function(err,user){
			if(err) throw err;
			if(!user){ 
				res.json({success:false,message:'Could not authenticate user'});
			}else if(user){
				if(req.body.password){
					var validPassword = user.comparePassword(req.body.password);
					if(!validPassword)
					res.json({success: false ,message:'Could Not authenticate password'});
					else if(!user.active){
						res.json({success: false ,message:'Account not yet activated, Check your email for activation link', expired : true});
					} else{
						var token = jwt.sign({ username : user.username , email : user.email },secret,{expiresIn:'24h'});
					    res.json({success:true,message:'User authenticated',token:token});

					}
				} else {
					res.json({success: false ,message:'password not provided'});
				}
			}
		})
	});

	router.put('/activate/:token',function(req,res){
		User.findOne({temporarytoken : req.params.token}, function( err,user){
			if(err) throw err;
			var token = req.params.token;


			jwt.verify(token,secret,function(err,decoded){
				if(err){
					res.json({success:false,message :'Activation Link Expired'});
				} else if(!user) {
					res.json({success:false,message :'Activation Link Expired'});

				} else {
					user.temporarytoken = false;
					user.active =true;
					user.save(function(err){
						if(err){
							console.log(err);
						}else{

								var message = {
				 				  from: 'Localhost Staff, staff@localhost.com',
								  to: user.email,
								  subject: 'Localhost account activated',
								  text: 'Hello' +user.name +'Your account has been successfully activated',
								  html: 'Hello<strong>' +user.name +'</strong><br><br><br>Your account has been successfully activated',
								}
								console.log('Sending Mail');
								transport.sendMail(message, function(error){
								if(error){
								  console.log('Error occured');
								  console.log(error.message);
								  return;
								}
								console.log('Message sent successfully!');
							});
							res.json({ success: true , message:'Account activated'});
						}
					});

				}

			});
		})
	})



router.post('/resend',function(req,res){
		//res.send(req.body.username);
		User.findOne({ username:req.body.username}).select('username password active').exec(function(err,user){
			if(err) throw err;
			if(!user){ 
				res.json({success:false,message:'Could not authenticate user'});
			}else if(user){
				if(req.body.password){
					var validPassword = user.comparePassword(req.body.password);
					if(!validPassword)
					res.json({success: false ,message:'Could Not authenticate password'});
					else if(user.active){
						res.json({success: false ,message:'Account is already activated'});
					}  else {
					res.json({ success:true , user : user});
				}
			}
			}
		})
	});

router.put('/resend',function(req,res){
	User.findOne({ username:req.body.username}).select('name email temporarytoken username').exec(function(err,user){
		if(err) throw err;
		user.temporarytoken = jwt.sign({ username : user.username , email : user.email },secret,{expiresIn:'24h'});
		user.save(function(err){
			if(err){
				console.log(err);
			} else {

					var message = {
	 				  from: 'Localhost Staff, staff@localhost.com',
					  to: user.email,
					  subject: 'Activation Link request',
					  text: 'Hello' +user.name +'You recently requested a new activation Link. Please click on the link below to complete your activation: http://localhost:8085/activate/'+ user.temporarytoken,
					  html: 'Hello<strong>' +user.name +'</strong>,<br><br>You recently requested a new activation Link. Please click on the link below to complete your activation:<br><a href="http://localhost:8085/activate/'+ user.temporarytoken+'">http://localhost:8085/activate/</a>'
					}
					console.log('Sending Mail');
					transport.sendMail(message, function(error){
					if(error){
					  console.log('Error occured');
					  console.log(error.message);
					  return;
					}
					console.log('Message sent successfully!');
				});
				res.json({success:true , message:'Activation Link has been send to ' + user.email +'!' });
			}
		});

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


