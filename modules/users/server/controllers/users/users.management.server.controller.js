/**
 * Created by 15-D010sk on 16/08/2015.
 */

var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');


initUser = function(req,res){
    delete req.body.roles;
    var user = new User(req.body);
    return user;
}

saveUser = function(res,user){
    user.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else{
            res.jsonp(user);
        }
    })
}

exports.addProf = function(req,res){
    var user = initUser(req,res);
    user.roles.push('professor');
    saveUser(res,user);
}

exports.addPres = function(){
    var user = initUser(req,res);
    user.roles.push('agent');
    saveUser(res,user);
}


exports.addStudent = function(){
    var user = initUser(req,res);
    user.roles.push('student');
    saveUser(res,user);
}
