'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Student Schema
 */
var StudentSchema = new Schema({
    civility:{
        type: {
            type: String,
            enum: ['Mlle', 'Mme', 'M']
        },
        default: ['M']
    },
    birthday: {
        type: Date,
        default: Date.now
    },
    birthplace: {
        type: String,
        default: '',
        required: 'SVP entrez votre lieu de naissance',
        trim: true
    },
    nationality: {
        type: String,
        default: '',
        required: 'SVP entrez votre nationalité',
        trim: true
    },
    address: {
        type: String,
        default: '',
        required: 'SVP entrez votre adresse',
        trim: true
    },
    postalCode: {
        type: String,
        default: '',
        required: 'SVP entrez votre code postal',
        trim: true
    },
    town: {
        type: String,
        default: '',
        required: 'SVP entrez votre commune',
        trim: true
    },
    phone:{
        type: String,
        trim: true,
        default: ''
    },
    homePhone:{
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        trim: true,
        default: '',
        match: [/.+\@.+\..+/, 'SVL Editez une adresse email valide']
    },
    urgencyContact: {
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
        function: {
            type: String,
            trim: true,
            default: ''
        },
        address: {
            type: String,
            trim: true,
            default: ''
        },
        postalCode: {
            type: String,
            default: '',
            required: 'SVP entrez votre code postal',
            trim: true
        },
        town: {
            type: String,
            default: '',
            required: 'SVP entrez votre commune',
            trim: true
        },
        phone:{
            type: String,
            trim: true,
            default: ''
        },
        homePhone:{
            type: String,
            trim: true,
            default: ''
        },
        workPhone:{
            type: String,
            trim: true,
            default: ''
        }
    },
    formation: {
        type: String,
        default: '',
        required: 'SVP entrez votre formation',
        trim: true
    },
    formationName: {
        type: String,
        default: '',
        required: 'SVP entrez le titre de la formation',
        trim: true
    },
    preferedTime: [{
        day: {
            type: String,
            enum: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
        },
        timeSlot: [{
            begin: {
                type: String,
                default: '',
                trim: true
            },
            end: {
                type: String,
                default: '',
                trim: true
            }
        }]
    }],
    knowingUsBy: {
        type: String,
        default: '',
        trim: true
    },
    IDCopy:{
        type: Boolean,
        default:true
    },
    photos:{
        type: Boolean,
        default:true
    },
    studentCard:{
        type: Boolean,
        default:true
    },
    registrationFees:{
        type: Boolean,
        default:true
    },
    languageTestFees:{
        type: Boolean,
        default:true
    },
    formationFees:{
        type: Boolean,
        default:true
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

mongoose.model('Student', StudentSchema);
