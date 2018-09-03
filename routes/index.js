var express = require('express');
var router = express.Router();
var savePermit = require('../passport/save_permit');
var findPermit= require('../passport/find_permit');
var openPerForRev = require('../passport/open_per_for_review');
var saveRevPermit = require('../passport/save_rev_permit');
var saveRejPermit = require('../passport/save_rej_permit');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/main',
		failureRedirect: '/',
		failureFlash : true  
	}));

	// GET Registration Page
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	// GET Success Page
	router.get('/success-submit', isAuthenticated, function(req, res){
		res.render('success_submit',  { user: req.user, whichone: 'submit' });
	});

	// GET Success Closed Page
	router.get('/success-close', isAuthenticated, function(req, res){
		res.render('success_submit',  { user: req.user, whichone: 'close' });
	});

	//Handle Registration POST
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/main',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	// GET Main Page 
	router.get('/main', isAuthenticated, function(req, res){
		findPermit(req.user).then(function(fnres){
			fnres.user = req.user;
			if(req.user.authorized==='yes'){
				fnres.linkto = '/open-permit/for-review/';
				fnres.emptytext = 'There are no permits for review';
				fnres.h5text = 'Permits for review';
			}else{
				fnres.linkto = '/open-permit/reviewed/';
				fnres.emptytext = 'There are no reviewed permits';
				fnres.h5text = 'Reviewed permits';
			}
			//console.log(JSON.stringify(fnres, null, 2));
			res.render('mainauth', { data: fnres  });
		});
	});

	/* GET Create Permit Page */
	router.get('/create-permit', isAuthenticated, function(req, res){
		res.render('genper',  { user: req.user });
	});

	// GET Open Permit For Review 
	router.get('/open-permit/for-review/:id', isAuthenticated, function(req, res){
		console.log('vvvvvv: '+req.params.id);
		openPerForRev(req.params.id, req.user).then(function(fnres){
			fnres.user = req.user;
			//console.log(JSON.stringify(fnres, null, 2));
			res.render('openper',  { data : fnres });
		});
	});

	// GET Open Reviewed Permit 
	router.get('/open-permit/reviewed/:id', isAuthenticated, function(req, res){
		console.log('vvvvvv: '+req.params.id);
		openPerForRev(req.params.id, req.user).then(function(fnres){
			fnres.user = req.user;
			//console.log(JSON.stringify(fnres, null, 2));
			res.render('openper',  { data : fnres });
		});
	});


	// Handle General Permit POST
	router.post('/post-general-permit', isAuthenticated, function(req, res){
		savePermit(req.body).then(function(fnres){
			console.log(fnres);
			console.log('i am done 3rd!');
			res.redirect('/success-submit');
		});
	});	

	// Handle Response For Review POST
	router.post('/response-for-review', isAuthenticated, function(req, res){
		saveRejPermit(req.body).then(function(fnres){
			//console.log(fnres);
			console.log('i am done 3rd!');
			res.json({success : "Updated Successfully", status : 200});
		});
	});
	
	// Handle Response For Review POST
	router.post('/close-permit', isAuthenticated, function(req, res){
		saveRejPermit(req.body).then(function(fnres){
			//console.log(fnres);
			console.log('i am done 3rd!');
			res.json({success : "Updated Successfully", status : 200});
		});
	});
 
	// Handle Reviewed Permit POST
	router.post('/save-reviewed-permit', isAuthenticated, function(req, res){
		console.log(JSON.stringify(req.body));
		saveRevPermit(req.body, req.user).then(function(fnres){
			console.log(fnres);
		}).then(function(){
			console.log('kkkkk');
		}).then(function(){
			console.log('mmmmm');
			res.json({success : "Updated Successfully", status : 200});
		});
	});	

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}





