var express = require("express") ;
// const jwt = require('jsonwebtoken') ;
const bcrypt = require("bcrypt")
var bodyparser = require("body-parser") ;
var mongoDb = require('mongodb') ;
const cors = require('cors') ;

let mongo = mongoDb.MongoClient ;

email = ["prasheetp@gmail.com"]

var port = 8080 ;

let database = undefined ;
mongo.connect("mongodb://127.0.0.1:27017/quiz_app" , { useUnifiedTopology: true } , (err , db) => {
    database = db.db() ;    
}) ;

var app = express() ;
app.use(cors({
    origin : '*'
})) ;

app.use(bodyparser.json()) ;
app.use(express.static('public')) ;

//API to get admin of time of admin login
app.get('/getAdmin' , async(req , res) => {
    let all_admins = await database.collection("admin_details").find({username:req.query.username}).toArray() ;
    
    console.log("All admins are here") ;
    console.log(all_admins) ;
    if (all_admins.length != 0)
        res.json(all_admins[0]) ;
    else
        res.json({}) ;
}) ;

//API to update admin password
app.post('/updateAdminPassword' , (req , res) => {
    console.log(req.body) ;
    database.collection("admin_details").updateOne({username:req.body.username} ,{ $set : {password:req.body.password}})
    res.send("password changed") ;
})

//API to update admin details
app.post('/updateAdminDetails' , async(req , res) => {
    let resp = await database.collection("admin_details").updateOne({username:req.body.who_is_admin} , {$set : req.body.new_Details})
    console.log(resp) ;
    res.json(resp) ;
})

//api to get all questions
app.get('/getQuestions' ,async (req , res) => {
    let questions = await database.collection("qna").find({}).toArray() ;
    res.json(await questions) ;
});

//API to delete the given question
app.get('/deleteQuestion' , async(req , res) => {
    console.log(" i am here to delete element") ;
    await database.collection("qna").deleteOne({question:req.query.question}) ;
    res.send("deleted successfully")
});

//API to insert question to db(ADMIN)
app.post('/insertQuestion' , async(req , res) => {
    console.log(req.body) ;
    let questions = await database.collection("qna").find({}).toArray() ;
    let alreadyExist = false ;
    for (que of questions){
        console.log(que) ;
        if (req.body.questions == que.question){
            alreadyExist = true ;
            break ;
        }
    }
    if (alreadyExist)
        res.send("Already_Exist") ;
    else
        database.collection("qna").insertOne(req.body) ;
})

//API to verify the user credentials at the time of login 
app.post('/verifyCredentials' , async (req , res) => {
    var email = req.body.emailId ;
    var pass = req.body.password ;
    console.log("User input password : " , pass) ;
    
    let userExist = false ;
    let correctCred  ;
    let users = await database.collection("reg_desk").find({}).toArray() ;
    console.log("this is whole database " , users) ;
    console.log("User email is : " , email) ;
    for (var usr of users){
        console.log("Email in database is : " , usr.emailId) ;
        if (usr.emailId == email){
            userExist = true ;
            console.log("Comming to the user .. !!!") ;
            console.log(usr) ;

            //callback hell - something creepy
            correctCred = await bcrypt.compare(pass,usr.password)
            console.log("Final checkup") ;
            console.log("This is userExist " , userExist) ;
            console.log('This is correctCred' , correctCred) ;
        }
    }

    if (userExist && correctCred)
        res.end("verified") ;
    else if (userExist && !correctCred)
        res.end("NotVerified")
    else 
        res.end("user not exist") ;
}) ;

//API to register new user
app.post('/registerNewUser' ,(req , res) => {
    var emailId = req.body.emailId ;
    if (email.includes(emailId)){
        res.send("registered") ;
    }else{
        let password = req.body.password ;
        console.log("Before " , req.body) ;
        bcrypt.genSalt(10 , (err , salt) => {
            bcrypt.hash(password , salt , async(err , result) => {
                console.log("this is hashed version of password " , result) ;
                req.body.password = result ;
                console.log("After " , req.body) ;
                await database.collection("reg_desk").insertOne(req.body) ;
                
            } )
        })
        email.push(req.body.emailId)
        res.send("registered now") ;
        //TODO : Redirect to login.html
        // return res.redirect('/login.html') ;
        // console.log(`dir name : ${__dirname}/login.html`) ;
        // res.sendFile('./login.html') ;
    }
}) ;

//API to add the user logs to database at the time of login
app.get("/addLoginHistory" , async(req , res) => {
    let lastlogin = req.query.lastlogin ;
    let user = req.query.user ;
    let data = {lastlogin , user} ;
    await database.collection("login_history").insertOne(data) ;
})

//API to feed the score after the game is over
app.get('/feedScore' ,async (req , res) => {
    let score = req.query.score ;
    let user = (await database.collection("login_history").find({}).toArray()).slice(-1)[0].user ;
    console.log(user) ;
    await database.collection("score_board").insertOne({user : user , score : score}) ;

    // 
})

//API which fetches the scores
app.get('/getScores' , async (req , res) => {
    let scores = await(database.collection("score_board").find({user:req.query.user_name}).toArray()) ;
    res.json(scores) ;
})

//API gives lastlogin of user
app.get('/getLastLogin', async(req , res) => {
    let user = (await database.collection("login_history").find({}).toArray()).slice(-1)[0].user ;
    res.send(user) ;
})

app.listen(port , async() => {
    console.log("Server successfully started") ;
}) ;

