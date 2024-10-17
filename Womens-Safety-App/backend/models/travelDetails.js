import mongoose, { Schema, model } from 'mongoose';

const coordinateSchemaNumber=new mongoose.Schema({
    lat: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
            return /^-?\d+\.?\d{0,8}$/.test(v.toString());
            },
            message: props => `${props.value} is not a valid coordinate! Must have 8 or fewer decimal places.`
        }
    },
    lng: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
            return /^-?\d+\.?\d{0,8}$/.test(v.toString());
            },
            message: props => `${props.value} is not a valid coordinate! Must have 8 or fewer decimal places.`
        }
    }
});

const travelDetailsSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    fromCoords:{
        type: coordinateSchemaNumber,
        required: true
    },
    toCoords:{
        type: coordinateSchemaNumber,
        required: true
    }
});

const TravelDetails=model('TravelDetails',travelDetailsSchema);

export default TravelDetails;