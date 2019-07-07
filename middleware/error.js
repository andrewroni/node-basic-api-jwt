// Error handler 

module.exports = app => {
	app.use((error, req, res, next) => {
		if (error.name === 'ValidationError') {
			return res.status(400).json({ 
				success: false,
				message: error.details[0].message 
			});
		}
		
		res.status(500).json({ 
			success: false,
			message: error.message 
		});
		next();
	});
};