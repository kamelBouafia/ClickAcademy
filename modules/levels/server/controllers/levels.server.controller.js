'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Level = mongoose.model('Level'),
    Lesson = mongoose.model('Lesson'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Level
 */
exports.create = function(req, res) {
	var level = new Level(req.body);
	level.user = req.user;
    level.lesson = req.lesson;
    //console.log('new level for '+level.user);

    level.save(function(err, response) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            Lesson.findByIdAndUpdate(
                level.lesson,
                {'$push': {levels: {'_id': level._id}}},
                function (err, contenu) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else{
                        console.log('new level yow yow dcsdoc');
                        res.jsonp(response);
                    }
                }
            );
        }
    });
    /*
    Level.find({lesson:level.lesson}).exec(function(err, levels) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            //console.log('new level request listiiiiiiiiiiiiiiiiing'+levels.length);
            //res.jsonp(levels);
            var index;
            var exist=false;
            for(index = 0; index < levels.length; index++){
                console.log('new level request listiiiiiiiiiiiiiiiiing  '+levels[index].name+' '+level.name);
                //if(parseInt(level.name)===parseInt(levels[index].name)){
                if(parseInt(levels[index].name)===1){
                    console.log('found oooooooooooone');
                    exist=true;
                }
            }
            if(exist){
                console.log('now u cannot add your level');
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else{
                console.log('u can add your level');
                level.save(function(err, response) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        Lesson.findByIdAndUpdate(
                            level.lesson,
                            {'$push': {levels: {'_id': level._id}}},
                            function (err, contenu) {
                                if (err) {
                                    return res.status(400).send({
                                        message: errorHandler.getErrorMessage(err)
                                    });
                                } else{
                                    console.log('new level yow yow dcsdoc');
                                    res.jsonp(response);
                                }
                            }
                        );
                    }
                });
            }
        }
    });*/
};

/**
 * Show the current Level
 */
exports.read = function(req, res) {
	res.jsonp(req.level);
};

/**
 * Update a Level
 */
exports.update = function(req, res) {
	var level = req.level ;

	level = _.extend(level , req.body);

	level.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(level);
		}
	});
};

/**
 * Delete an Level
 */
exports.delete = function(req, res) {
	var level = req.level ;

	level.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(level);
		}
	});
};

/**
 * List of Levels
 */
exports.list = function(req, res) {

    Level.find({lesson: req.lesson}).sort('-created').populate('user', 'displayName').exec(function(err, levels) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            //console.log('new level request listiiiiiiiiiiiiiiiiing'+levels.length);
			res.jsonp(levels);
		}
	});
};

/**
 * Level middleware
 */
exports.levelByID = function(req, res, next, id) { Level.findById(id)
    .populate('user', 'displayName')
    .populate('lesson', 'name')
    .exec(function(err, level) {
		if (err) return next(err);
		if (! level) return next(new Error('Failed to load Level ' + id));
		req.level = level ;
		next();
	});
};
