var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	id: String,
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String,
	authorized: String,
	field: String,
	authorization_level: String,
	nk: String,
	key: String,
	signature: String
});