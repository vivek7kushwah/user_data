const mongoose = require('mongoose');
const env = require('dotenv')
env.config();
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB Error:", err));

const postSchema = mongoose.Schema({
    content: { type: String, default: "No content provided" },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    date : {
        type : Date,
        default : Date.now()
    },
    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }]

})


module.exports = mongoose.model("post", postSchema);
