import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
{
name:{
type:String,
required:true,
trim:true
},

email:{
type:String,
required:true,
unique:true,
lowercase:true,
trim:true
},

password:{
type:String,
required:true
},

phone:{
type:String,
default:""
},

gender:{
type:String,
enum:["male","female","other",""],
default:""
},

profilePicture:{
type:String,
default:""
},

role:{
type:String,
enum:["user","admin"],
default:"user"
},

status:{
type:String,
enum:["active","blocked"],
default:"active"
},

resetToken:{
type:String,
default:null
},

resetTokenExpire:{
type:Date,
default:null
}

},
{timestamps:true}
);

userSchema.pre("save",async function(next){

if(!this.isModified("password")) return next();

const salt=await bcrypt.genSalt(10);
this.password=await bcrypt.hash(this.password,salt);
next();

});

userSchema.methods.matchPassword=async function(enteredPassword){

return await bcrypt.compare(enteredPassword,this.password);

};

export default mongoose.models.User || mongoose.model("User",userSchema);