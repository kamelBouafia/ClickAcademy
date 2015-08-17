'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Level Schema
 */
var LevelSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'SLV éditez le nom du niveau',
		trim: true
	},
    description: {
        type: String,
        default: '',
        trim: true
    },
    price: {
        type: Number,
        required: 'SLV éditez le prix du niveau'
    },
    lesson: {
        type: Schema.ObjectId,
        ref: 'Lesson'
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

mongoose.model('Level', LevelSchema);
