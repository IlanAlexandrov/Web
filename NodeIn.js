

var url = require('url');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
const encryption = require("./encryption");
//var mysql = require('mysql');
//var pg = require('pg');
conString = process.env.DATABASE_URL || "postgres://ouvmdownggiddy:8a530e591dd1b10df9551f54953f2a3d154c9f861983e2ddb1b9a6a3bd8be125@ec2-35-169-77-211.compute-1.amazonaws.com:5432/d3lkt0ksqvgegj";
//var client = new pg.Client(conString);
let port = process.env.PORT || 3000;
var urlCrypt = require('url-crypt')('~{ry*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');
const { Pool } = require('pg');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/db', async (req, resu) => {
  try {
    const client = await pool.connect();
    //await client.query('drop table users');
    await client.query("delete from promocode")
    const result1 = await client.query(
      "CREATE TABLE IF NOT EXISTS users (ID INT UNIQUE,Name VARCHAR(45) DEFAULT '',FamilyName VARCHAR(45) DEFAULT '',Email VARCHAR(45) DEFAULT '',PhoneNumber VARCHAR(45) DEFAULT '',PromoCode VARCHAR(45) DEFAULT '',Country VARCHAR(45) DEFAULT '',City VARCHAR(45) DEFAULT '',Street VARCHAR(45) DEFAULT '',ZipCode VARCHAR(45) DEFAULT '',Password VARCHAR(45) DEFAULT '',Spare1 VARCHAR(45) NULL,Spare2 VARCHAR(45) NULL,Spare3 INT NULL,Spare INT NULL)"
    )
    const result2 = await client.query(
      "CREATE TABLE IF NOT EXISTS promocode (ID INT UNIQUE,PromoCode VARCHAR(45) DEFAULT '',Description VARCHAR(45) DEFAULT '')"
    )
    var text = 'insert into promocode (ID,PromoCode,Description) values($1,$2,$3)'
    var valu = [1, '3XCRt', '10% discount'];
    var valu1 = [2, '4DFG', 'My desc.'];
    var valu2 = [3, '6DSQW', 'My new description'];
    await client.query(text, valu, (err, res) => {
      if (err)
        console.log(err)
    })
    await client.query(text, valu1, (err, res) => {
      if (err)
        console.log(err)
    })
    await client.query(text, valu2, (err, res) => {
      if (err)
        console.log(err)
    })
    await client.query("delete from users")

    await client.query('SELECT * FROM promocode', (err, res) => {
      console.log("HERE");
      console.log(res.rows)
      resu.redirect('/sign-up');
    })

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.get('/sign-up/:base64', async function (req, res) {
  var resul;
  var idNum;
  const client = await pool.connect();

  try {

    resul = urlCrypt.decryptObj(req.params.base64);
  } catch (e) {
    return res.status(404).send('Bad');
  }
  client.query('select * from users order by ID DESC', (err, resi) => {
    if (resi.rows.length == 0)
      idNum = 1;
    else
      idNum = resi.rows[0].id + 1;
    console.log(resi.rows)
    console.log("ID NUM IS: " + idNum)

   var EncryptedPassword = encryption.encrypt(resul.PasswordU);

    console.log(idNum)
    text = 'insert into users(Name,FamilyName,Email,Password,ID) values($1,$2,$3,$4,$5)'
    values = [resul.FirstNAmeU, resul.LastNameU, resul.EmailU, EncryptedPassword, idNum];

    client.query(text, values, (err, res) => {
      if (err) {
        console.log(err);
      } else
        console.log("good")
    })
    res.redirect('/log-in');
  })


})



//make sure i can use the css files, and js files, with the static folder i created
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/log-in', function (req, res) {

  if (req.cookies.Id != undefined){
    console.log("ERH");
    res.sendFile(__dirname + "/index.html");
  }
    
  else
    res.sendFile(__dirname + "/LogIn.html");
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
  var rememberOn = req.body.Flag;

  var EncryptedPassword = encryption.encrypt(password1);

  console.log("THE REMEMBER MEIS: " + rememberOn)
  console.log(email + password1);
  var text = 'select * from users where Password=$1 and Email=$2';
  var r = [EncryptedPassword, email];
  const client = await pool.connect();
  client.query('select * from users', (err, res) => {
    console.log(res.rows[0]);
  })
  client.query(text, r, (err, res) => {
    if (res.rows.length == 0) {
      resol.send("Error");
    }
    else {
      //setting cookies until press log-out
      if (rememberOn) {
        resol.cookie('Id', res.rows[0].id);
        resol.cookie('FirstNAmeU', res.rows[0].name);
        resol.cookie('EmailU', res.rows[0].email);
      }
      else {
        //setting coockies for one houre
        resol.cookie('Id', res.rows[0].id, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true });
        resol.cookie('FirstNAmeU', res.rows[0].name, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true });
        resol.cookie('EmailU', res.rows[0].email, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true });
      }

      console.log(res.rows[0].name)
      console.log("HERE");
      resol.send('/index');
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
  var flagForCheck=0;
  var emailTmp = req.body.Email;
  var passwordTmp = req.body.Password;
  var firstNAme = req.body.FirstName;
  var lastName = req.body.LastName;
  var code = req.body.Promo;
  var data = {
    FirstNAmeU: firstNAme,
    LastNameU: lastName,
    EmailU: emailTmp,
    PasswordU: passwordTmp,
    CodeU: code
  };

  var base64 = urlCrypt.cryptObj(data);

  var registrationiLink = 'https://electronicsweb1.herokuapp.com/Sign-Up/' + base64;
  console.log(emailTmp + " " + passwordTmp + " " + firstNAme + " " + lastName + " " + code);
  console.log("HEREEEEEEE")
  var st = [
    "Your user has been created! Welcome! a confirmation massege was sent to you by mail",
    "Sorry but this email already in use, please try another email"];
  var flag = 1;
  var text = 'select Email from users where Email =$1'
  var values = [emailTmp];
  const client = await pool.connect();
  console.log(code);
  if (code != "") {


    await client.query('select * from promocode where PromoCode=$1', [code], (err, resi) => {
      if (err)
        console.log(err);
      if (resi.rows.length == 0) {
        flagForCheck++;
        console.log("Got to the no promo")
        resul.send("This promo code is not in the system.");
      }
    })
  }

  if(flagForCheck==0)
  {

  
   client.query(text, values, (err, res) => {
    console.log(res.rows[1]);
    if (res.rows.length != 0) {
      console.log("GOT HERE")

      resul.send(st[flag]);
    }
    else {
      flag = 0;

      if (flag == 0) {
        var mailOptions = {
          from: 'ilan19555@gmail.com',
          to: emailTmp,
          subject: 'Email verification',
          text: "Paste the url below into your browser to Emailify!" + registrationiLink,
          html: '<h1>Wellcome to Electronic web site!</h1><br>' +
            '<span>Here you will find everything you need! but first..</span>' +
            '<br><h3>Please click on the link below to complete your registeration!</h3><br>' +
            '<a href = "' + registrationiLink + '">EmailifyNow!</a><br>' +
            '<span>Thank you, Team web.</span>'

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
}

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

app.post('/reset-password', async function (req, resul) {
  console.log("GOT")
  var email = req.body.Email;
  console.log(email);
  const client = await pool.connect();
  var text = 'select * from users where Email=$1';
  var act = [email];
  client.query(text, act, (err, res) => {
    if (res.rows.length == 0) {
      resul.send("Error");
    }
    else {
      var data = {
        Email: email
      };
      var base64 = urlCrypt.cryptObj(data);

      var resetPasswordLink = 'https://electronicsweb1.herokuapp.com/update-password/' + base64;
      var mailOptions = {
        from: 'ilan19555@gmail.com',
        to: email,
        subject: 'Reset Password!',
        text: "Click on the link to refer to reset password link",
        html: '<h1 style="color:red;">Reset Password Now!</h1>' +
          +'<h3>Please click on the link below to reset your password</h3>' +
          '<a href = "' + resetPasswordLink + '">EmailifyNow!</a>'
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

app.get('/update-password/:base64', function (req, res) {
  res.sendFile(__dirname + "/updatePassword.html",);
})

app.post('/update-password', async function (req, reso) {
  const client = await pool.connect();
  client.query('SELECT * FROM users', (err, res) => {
    console.log("HERE");
    console.log(res.rows)

  })
  try {
    console.log(req.body.Email)
    resul = urlCrypt.decryptObj(req.body.Email);
    console.log("Succedd")
  } catch (e) {
    console.log("HERR")
    return reso.status(404).send('Bad');
  }
  newPass = req.body.Password1;
  var EncryptedPassword = encryption.encrypt(newPass);
  console.log(newPass);
  console.log("Got here")
  var text = "select * from users where Email=$1 and Password=$2"
  var inser = [resul.Email, EncryptedPassword]
  client.query(text, inser, (err, res) => {
    if (res.rows.length != 0) {
      reso.send("Error")
    } else {
      console.log("good");
      text = "update users set Password=$1 where email=$2"
      inser = [EncryptedPassword, resul.Email]
      client.query(text, inser, (err, res) => {
        if (err)
          console.log(err);
      })

      client.query('SELECT * FROM users', (err, res) => {
        console.log("HERE");
        console.log(res.rows)

      })
      reso.redirect('/log-in')
    }

  })

})

app.get('/index', function (req, res) {
  if (req.cookies.Id != undefined) {
    console.log("CHECK?!?!" + req.cookies.Id)
    res.sendFile(__dirname + '/index.html')
  }

  else {
    console.log("WE GOT IT!")
    res.redirect('/log-in')
  }

})

app.post('/index', function (req, res) {

  var iD = req.cookies.Id;
  console.log("THE COKIE IS:" + iD);

  res.send(req.cookies.FirstNAmeU);

})




app.get("/BuyPc", function (req, res) {
  res.sendFile(__dirname + '/BuyPc.html');
})

app.get('/BuyCellPhone', function (req, res) {
  res.sendFile(__dirname + '/BuyCellPhone.html')
})

app.get('/about', function (req, res) {

  res.sendFile(__dirname + '/about.html')
})

app.get('/profile', function (req, res) {
  res.sendFile(__dirname + '/profile.html')
})
app.post('/getProfile', async function (req, reso) {
  var iD = req.cookies.Id;


  var dat;
  var tex = 'select * from users where ID=$1'
  var re = [iD];
  const client = await pool.connect();
  client.query(tex, re, (err, res) => {
    if (err)
      console.log(err);
    console.log(res.rows[0])
    dat = {
      firstName: res.rows[0].name,
      lastName: res.rows[0].familyname,
      email: res.rows[0].email,
      country: res.rows[0].country,
      city: res.rows[0].city,
      street: res.rows[0].street,
      zipCode: res.rows[0].zipcode,
      phone: res.rows[0].phonenumber,
      pass: res.rows[0].password,
      id: res.rows[0].id
    }
    reso.send(dat);
  })





})
app.post('/updateProfile', async function (req, reso) {
  var newUser = req.body.UserName;
  var newLast = req.body.lastName;
  var newemail = req.body.email;
  var newphone = req.body.phone;
  var newcountry = req.body.country;
  var newcity = req.body.city;
  var newzipCode = req.body.zipCode;
  var prevEmail = req.body.prevEmail;
  var newStreet = req.body.street;
  console.log(newUser + " " + newLast + " " + newemail + " " + newphone + " " + newcountry + " " + newcity + " " + newzipCode + " " + prevEmail)
  var text = 'update users set Name=$1, FamilyName=$2,PhoneNumber=$3,Country=$4,City=$5,Street=$6,ZipCode=$7 where ID=$8';
  var options = [newUser, newLast, newphone, newcountry, newcity, newStreet, newzipCode, req.body.Id];
  const client = await pool.connect();
  client.query(text, options, (err, res) => {
    if (err)
      console.log(err)

  })
  if (newemail != prevEmail) {
    client.query('select * from users where Email=$1', [newemail], (err, res) => {
      if (err)
        console.log(err);
      else {
        if (res.rows.length != 0)
          reso.send("This email is already in the system, therfore we can't change it. your other data has been saved.")
        else {
          var data = {
            IdOfUser: req.body.Id,
            emailOfUser: newemail
          };

          var base64 = urlCrypt.cryptObj(data);

          var registrationiLink = 'https://electronicsweb1.herokuapp.com/updateMail/' + base64;
          var mailOptions = {
            from: 'ilan19555@gmail.com',
            to: prevEmail,
            subject: 'Email verification',
            text: "Paste the url below into your browser to Emailify!" + registrationiLink,
            html: '<h1>Change Email</h1><br>' +
              '<h4>You just wish to change your email, we need to confirm that it is you.</h4><br>' +
              '<span> Click on the link below to complete the change</span><br>' +
              '<a href = "' + registrationiLink + '">ChangeEmailNow</a>'
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          reso.send("The profile has been updated! and email sent to you to change your mail!")
        }
      }
    })
  }
  else {
    reso.send("The details has changed successfuly!")
  }


})

app.post('/remove', function (req, res) {
  res.clearCookie("Id");
  res.clearCookie("EmailU");
  res.clearCookie("FirstNAmeU")
  res.send("Test")

})
app.get('/updateMail/:base64', async function (req, reso) {
  const client = await pool.connect();

  try {
    resul = urlCrypt.decryptObj(req.params.base64);
  } catch (e) {
    return res.status(404).send('Bad');
  }
  var text = 'update users set Email=$1 where ID=$2'
  var pu = [resul.emailOfUser, resul.IdOfUser];
  client.query(text, pu, (err, res) => {
    if (err)
      console.log(err);
    else {
      console.log("updated!")
      reso.redirect('/log-in')
    }
  })

})
app.post('/updatePasswordProfile', async function (req, reso) {
  var text = 'update users set Password=$1 where Email=$2'
  const client = await pool.connect();
  var EncryptedPassword = encryption.encrypt(req.body.password);
  var variu = [EncryptedPassword, req.body.email];
  client.query(text, variu, (err, res) => {
    if (err)
      console.log(err)
    else
      reso.send("good")
  })
  client.query('select * from users where Email=$1', [req.body.email], (err, res) => {
    console.log(res.rows[0]);
  })
})

app.get('*',function(req,res){
  res.sendFile(__dirname + '/404Error.html')
})

app.listen(port, () => {
  console.log('App listening on port %d!', port);
});
