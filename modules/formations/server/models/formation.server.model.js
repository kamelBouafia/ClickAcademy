'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Formation Schema
 */
var FormationSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Formation name',
		trim: true
	},
    description: {
        type: String,
        default: '',
        trim: true
    },
    lessons: [{
        type: Schema.ObjectId,
        ref: 'Lesson'
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

mongoose.model('Formation', FormationSchema);
