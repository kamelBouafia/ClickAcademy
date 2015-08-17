'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Agent Schema
 */
var AgentSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Agent name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Agent', AgentSchema);