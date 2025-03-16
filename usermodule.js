const mongoose = require('mongoose');
const env = require('dotenv')
env.config();
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB Error:", err));

const userSchema = mongoose.Schema({
    name : String ,
    password : String ,
    kerbors_id : String,
    posts : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : "post"
    }]
})


module.exports = mongoose.model("user", userSchema);
