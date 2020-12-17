
var url = require('url');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var mysql = require('mysql');
const bcrypt = require('bcrypt');
const { syncBuiltinESMExports } = require('module');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});


con.connect();


app.use(bodyParser.urlencoded({ extended: true }));

//make sure i can use the css files, and js files, with the static folder i created
app.use(express.static(__dirname + '/public'));

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
app.post("/log-in", function (req, res) {


  var email = req.body.Email1;
  var password1 = req.body.Password1;

  console.log(email + password1);

  con.query("SELECT * FROM website.user WHERE email='" + email + "' AND password=SHA1('" + password1 + "')", function (err, result, fields) {
    if (err) throw err;
    console.log(result.length);
    if (result.length == 0)
      res.send("Error");
    else {
      console.log("here")
      res.redirect('/sign-up');
    }

  }
  )



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
app.post('/sign-up', function (req, res) {
  var emailTmp = req.body.Email;
  var passwordTmp = req.body.Password;
  var firstNAme = req.body.FirstName;
  var lastName = req.body.LastName;
  var code = req.body.Promo;
  console.log(emailTmp + " " + passwordTmp + " " + firstNAme + " " + lastName + " " + code);
  var st = [
    "Your user has been created! Welcome! a confirmation massege was sent to you by mail",
    "Sorry but this email already in use, please try another email"];
  var flag = 1;

  var reso = 0;

  console.log("connected");
  con.query("SELECT * FROM website.user WHERE email='" + emailTmp + "'", function (err, result, fields) {
    if (err) throw err;
    reso = result.length;
    console.log(reso);
    if (reso == 1) {
      console.log("Here is when check if reso = 1" + reso);
      res.send(st[flag]);
    }

    if (reso == 0) {
      console.log("here is if it passed" + flag);
      flag = 0;
      console.log(flag);
      var sql = "INSERT INTO website.user (`FirstName`,`LastName`,`email`,`password`,`PromoCode`) VALUES ('" + firstNAme + "', '" + lastName + "','" + emailTmp + "',SHA1('" + passwordTmp + "'),'" + code + "')";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");


        let text2 = 'some....';
        bcrypt.hash(text2, 10, (err, hash) => {
          if (err) throw err;
          text = hash;
          console.log('happy hashing', text);
        });


        if (flag == 0) {
          var mailOptions = {
            from: 'ilan19555@gmail.com',
            to: emailTmp,
            subject: 'Welcome to My site',
            text: text2
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
      res.send(st[flag]);
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

app.post('/reset-password', function (req, res) {
  console.log("GOT")
  var email = req.body.Email;
  console.log(email);
  con.query("SELECT * FROM website.user WHERE email='" + email + "'", function (err, result, fields) {
    if (err) throw err;
     if (result.length == 0)
       res.send("Error")
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
    //
    // else {
    //   var mailOptions = {
    //     from: 'ilan19555@gmail.com',
    //     to: email,
    //     subject: select,
    //     text: "The name of the user:"
    //   };

    //   transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });

    // }


  


})

app.get('/update-password',function(req,res){
  res.sendFile(__dirname + "/updatePassword.html",);
})

app.post('/update-password',function(req,res){

  console.log("Got here")

})
app.listen(8080);
