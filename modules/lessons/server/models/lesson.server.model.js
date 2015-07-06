'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Lesson Schema
 */
var LessonSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'SLV éditez le nom du cours',
		trim: true
	},
    description: {
        type: String,
        default: '',
        trim: true
    },
    levels: [{
        type: Schema.ObjectId,
        ref: 'Level'
    }],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Lesson', LessonSchema);
