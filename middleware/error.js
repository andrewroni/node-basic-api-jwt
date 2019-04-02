// Error handler 

module.exports = app => {
	app.use((error, req, res, next) => {

		res.status(500).json({ 
			success: false,
			message: error.message 
		});
		next();
	});
};

