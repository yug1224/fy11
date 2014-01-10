'use strict'

var crypto = require('crypto');
var MongoWrapper = require('../lib/mongo_wrapper');
var async = require('async');

/**
 * user class
 * @class	every user uses 1 class
 */
var User = function (host, port, db) {
	this.mongo = new MongoWrapper(host, port, db, {});
	this.col = 'user';
};

/**
 * register user data
 * @param {Objsct}  data  user data
 * @param {Function}  callback  callbackFunction
 * @public
 */
User.prototype.register = function (data, callback) {
	var authorization, saveData;
	authorization = this.makeHashVal(data.uid);
	// TODO add user name
	saveData = {
		uid : data.uid,
		authorization : authorization,
		userName : data.name,
		accept : false,
		oauth : 'facebook',
		registerTime : new Date()
	};
	// mongodb access
	this.mongo.save(
		this.col,
		saveData,
		function (err) {
			callback(err);
		}
	);
};

/**
 * add passbook token
 * @param {Objsct}  data  user data
 * @param {Function}  callback  callbackFunction
 * @public
 */
User.prototype.addPushToken = function (data, callback) {
	var query, updateData, options;
	query = {
		authorization : data.authorization
	};
	updateData = {
		$set : {pushToken : data.pushToken}
	};
	options = {
		multi: true
	};
	this.mongo.update(
		this.col,
		query,
		updateData,
		options,
		function (err) {
			callback(err);
		}
	);
};

/**
 * accept user into fy11 party
 * @param {Objsct}  data  user data
 * @param {Function}  callback  callbackFunction
 * @public
 */
User.prototype.accept = function (data, callback) {
	// TODO 受付のkeyは？
	var query, updateData, options;
	query = {
		authorization : data.authorization
	};
	updateData = {
		$set : {
			accept : true,
			acceptTime : new Date()
		}
	};
	options = {
		multi: true
	};
	this.mongo.update(
		this.col,
		query,
		updateData,
		options,
		function (err) {
			callback(err);
		}
	);
};

/**
 * get user
 * @param {Objsct}  data  user data
 * @param {Function}  callback  callbackFunction
 * @public
 */
User.prototype.get = function (data, callback) {
	var query = {
		authorization : data.authorization
	};
	this.mongo.findOne(
		this.col,
		query,
		function (err, data) {
			console.log(data);
			callback(err, data);
		}
	);
};

/**
 * delete user
 * @param {Objsct}  data  user data
 * @param {Function}  callback  callbackFunction
 * @public
 */
User.prototype.delete = function (data, callback) {
	var query = {
		authorization : data.authorization
	};
	this.mongo.remove(
		this.col,
		query,
		function (err) {
			callback(err);
		}
	);
};

/**
 * make hash with crypto
 * @param {String} data hash化する文字列
 * @return {String} hashval hash値
 * @private
 */
User.prototype.makeHashVal = function (data) {
  var hashval,
    string = JSON.stringify(data);
 hashval = crypto.createHash('md5').update(string).digest('hex');
  return hashval;
};

module.exports = User;
