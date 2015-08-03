'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Candidate Schema
 */
var CandidateSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        default: ''
    },
    lastName: {
        type: String,
        trim: true,
        default: ''
    },
    phone:{
        type: String,
        trim: true,
        default: ''
    },
    disponibilite:{
        type: [{
            type: String,
            enum: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
        }],
        default: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
    },
    active: {
        type: Boolean,
        default:false
    },

    lesson: {
        type: Schema.ObjectId,
        ref: 'Lesson'
    },
    level: {
        type: Schema.ObjectId,
        ref: 'Level'
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

mongoose.model('Candidate', CandidateSchema);
