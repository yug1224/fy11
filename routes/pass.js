var request = require('request');

exports.get = function(req, res){
	console.log('se: ' + JSON.stringify(req.session));
	var id = req.session.passport.user.id;

	request.post({
		url: 'http://localhost:3003/create',
		qs: {
			uid: id,
			serialNumber: 'softbankfy11'
		}
	}, function(err, response, body){
		if(err){
			console.log(err);
			res.send(err, 500);
		}else{
			console.log(body);
			res.redirect('http://fy11.cloudapp.net:3003/download?uid=' + id);
		}
	});
};
