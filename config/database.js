// config/database.js
module.exports = {
	'url' : (process.env.NODE_ENV === 'production')? process.env.DATABASE_URL : 'mongodb://localhost/passport'  
};

// module.exports.url = process.env.DATABASE_URL;

//module.exports = process.env.DATABASE_URL;