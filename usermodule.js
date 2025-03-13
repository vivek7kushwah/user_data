const mongoose = require('mongoose');
const env = require('dotenv')
env.config();
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = mongoose.Schema({
    name : String ,
    password : String ,
    kerbors_id : String
})


module.exports = mongoose.model("user", userSchema);
