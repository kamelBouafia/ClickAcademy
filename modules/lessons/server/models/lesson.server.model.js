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
        unique: 'testing error message',
		trim: true
	},
    description: {
        type: String,
        default: '',
        trim: true
    },
    category:{
        type: [{
            type: String,
            enum: ['Cours collectif', 'Cours individuel', 'Cours accéléré', 'Cours par correspondance', 'Stage pratique']
        }],
        default: ['Cours collectif']
    },
    levels: [{
        type: Schema.ObjectId,
        ref: 'Level'
    }],
    formation: [{
        type: Schema.ObjectId,
        ref: 'Formation'
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
