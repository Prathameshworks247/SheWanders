import { Schema, model } from 'mongoose';

const coordinateSchemaNumber = new mongoose.Schema({
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

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
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

const User=model('User',userSchema);

export default User;