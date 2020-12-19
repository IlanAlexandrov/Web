

var url = require('url');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
//var mysql = require('mysql');
//var pg = require('pg');
 conString = process.env.DATABASE_URL||"postgres://ouvmdownggiddy:8a530e591dd1b10df9551f54953f2a3d154c9f861983e2ddb1b9a6a3bd8be125@ec2-35-169-77-211.compute-1.amazonaws.com:5432/d3lkt0ksqvgegj";
//var client = new pg.Client(conString);
let port = process.env.PORT || 3000;
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query(
      "CREATE TABLE IF NOT EXISTS users (ID INT,Name VARCHAR(45),FamilyName VARCHAR(45),Email VARCHAR(45),PromoCode VARCHAR(45),Country VARCHAR(45) NULL,City VARCHAR(45) NULL,Street VARCHAR(45) NULL,ZipCode VARCHAR(45) NULL,Password VARCHAR(45) NULL,Spare1 VARCHAR(45) NULL,Spare2 VARCHAR(45) NULL,Spare3 INT NULL,Spare INT NULL)"
    )
     
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })



    
  
//make sure i can use the css files, and js files, with the static folder i created
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/log-in', function (req, res) {
  res.sendFile(__dirname + "/LogIn.html",);

});

app.get('/Contact-Us', function (req, res) {
  res.sendFile(__dirname + "/Contact.html",);
})

app.get('/sign-up', function (req, res) {
  res.sendFile(__dirname + "/SignUpPage.html",);

}

)

//check if the email and password is in the db, if so will refer to another page
// if not, will send an error message
app.post("/log-in", async function (req, resol) {

    
  var email = req.body.Email1;
  var password1 = req.body.Password1;

  console.log(email + password1);
  var text ='select password from userforweb where passwords=$1';
  var r =[password1];
    const client = await pool.connect();
  client.query(text,r,(err,res)=>{
    if(res!=undefined)
    resol.send("Error");
    else{
      console.log("HERE");
      resol.redirect('/sign-up');
    }
  })
})


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ilan19555@gmail.com',
    pass: 'xntjirppktwdesrl'
  }
});




//check if the email already in the "DB" if so, will return error,
// if not, will return to the user a confirmation massege and send confirmation massage to email.
app.post('/sign-up', async function (req, resul) {
  var emailTmp = req.body.Email;
  var passwordTmp = req.body.Password;
  var firstNAme = req.body.FirstName;
  var lastName = req.body.LastName;
  var code = req.body.Promo;
  console.log(emailTmp + " " + passwordTmp + " " + firstNAme + " " + lastName + " " + code);
    console.log("HEREEEEEEE")
  var st = [
    "Your user has been created! Welcome! a confirmation massege was sent to you by mail",
    "Sorry but this email already in use, please try another email"];
  var flag = 1;
  var text = 'select email from userforweb where email =$1'
  var values = [emailTmp];
    const client = await pool.connect();
  client.query(text,values,(err,res)=>{
  
  if(res.rows[1]!=undefined)
  {
    console.log("GOT HERE")
    
    resul.send(st[flag]);
  }
  else{
    flag=0;
    text ='insert into userforweb(firstname,lastname,email,passwords) values($1,$2,$3,$4)'
    values = [firstNAme,lastName,emailTmp,passwordTmp];
    client.query(text,values,(err,res)=>{
    if(err){
    console.log(err);
    }else 
    console.log("good")
})
if (flag == 0) {
  var mailOptions = {
    from: 'ilan19555@gmail.com',
    to: emailTmp,
    subject: 'Welcome to My site',
    text: "hello from the other side"
  };


  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
resul.send(st[flag]);
  }
 })
})

app.post('/contact-us', function (req, res) {
  var name = req.body.name;
  var email1 = req.body.email;
  var select = req.body.selected;
  var tx = req.body.tex;

  var mailOptions = {
    from: 'ilan19555@gmail.com',
    to: 'ilan19555@gmail.com',
    subject: select,
    text: "The name of the user: " + name + "\n" + "The text is: " + tx + "\n Send from: " + email1
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.redirect('/sign-up');
  console.log(tx);
})

app.get('/getAllData', function (req, res) {
  //Adding Json file data:

  var data = {
    id: 1,
    name: 'John Smith',
    hometown: 'myHomeTown',
    occupation: 'myOccupation'

  };
  var data2 = {
    id: 2,
    name: 'John Smith 2',
    hometown: 'myHomeTown 2',
    occupation: 'myOccupation 2'

  };

  var o = {}
  var key = 'Data';
  o[key] = [];
  o[key].push(data);
  o[key].push(data2);
  res.send(JSON.stringify(o));
})

app.get('/', function (req, res) {
  res.redirect('/SignUp');

})

app.get('/reset-password', function (req, res) {
  res.sendFile(__dirname + "/ForgetPassword.html",);
})

app.post('/reset-password', function (req, resul) {
  console.log("GOT")
  var email = req.body.Email;
  console.log(email);

  var text = 'select * from userforweb where email=$1';
  var act= [email];
  client.query(text,act,(err,res)=>{
    if(res==undefined)
    {
      resul.send("Error");
    }
    else{
      var mailOptions = {
        from: 'ilan19555@gmail.com',
        to: email,
        subject: 'Welcome to My site',
        text: "me"
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
  })
  
})

app.get('/update-password',function(req,res){
  res.sendFile(__dirname + "/updatePassword.html",);
})

app.post('/update-password',function(req,res){

  console.log("Got here")

})
app.listen(port, () => {
	console.log('App listening on port %d!', port);
});
