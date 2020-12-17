
function init(){
var myInput = document.getElementById("password");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");
var special = document.getElementById("charechter");
var lowerCaseLetters = /[a-z]/g;
var specialCharacter=/[!,#,$,%,@,>,<,=,+]/g;
var upperCaseLetters = /[A-Z]/g;
var numbers = /[0-9]/g;
    
// initialize the message to be hidden.
document.getElementById("message").style.display = "block";

// When the user clicks outside of the password field, hide the message box
myInput.onblur = function() {
  document.getElementById("message").style.display = "none";
}
myInput.onfocus = function() {
    
  document.getElementById("message").style.display = "block";
    
}
// When the user starts to type something inside the password field
myInput.onkeyup = function() {
  // Validate lowercase letters
  
  if(myInput.value.match(lowerCaseLetters)) {
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
}
    //Validate special charecter letter.

if(myInput.value.match(specialCharacter)) {
    special.classList.remove("invalid");
    special.classList.add("valid");
  } else {
    special.classList.remove("valid");
    special.classList.add("invalid");
}
  // Validate capital letters
  
  if(myInput.value.match(upperCaseLetters)) {
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  // Validate numbers
  
  if(myInput.value.match(numbers)) {
    number.classList.remove("invalid");
    number.classList.add("valid");
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }

  // Validate length
  if(myInput.value.length >= 6) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }
}
}


function when_click(){
    
    var email_check=document.getElementById("email").value;
    var pass_res= document.getElementById("password").value;
    var messages =['There was less then 6 Charecters!'
                   ,'There was no upper case!\n'
                   ,'There was no lower case\n'
                   ,'There was no numbers\n'
                   ,'There was no Characters!\n'
                   ,'The email was inccorect\n'
                  ];
    var final_message=['Please Follow the form and make sure all requirments are marked! \n'];
    var counter =[0,0,0,0,0,0];
    var lowerCaseLetters = /[a-z]/g;
    var specialCharacter=/[!,#,$,%,@,>,<,=,+]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    // Check for minimum 6 charecters
    if (pass_res.length<6)
        counter[0] ++;
    // check for having upper case
    if (!(pass_res.match(upperCaseLetters)))
        counter[1]++;
    // check for having lower case
        if (!(pass_res.match(lowerCaseLetters)))
        counter[2]++;
    // check if includes number
        if (!(pass_res.match(numbers)))
        counter[3]++;
    // check if includes Special Character
        if (!(pass_res.match(specialCharacter)))
        counter[4]++;
        if(!(email_check.match(specialCharacter)))
        counter[5]++;
    var res=[];
    var flag=0;
    for (var i =0;i<6;i++){
        if(counter[i]>0){
            flag++;
            res+= messages[i];   
        }
        
}
    
    if(flag>0){
        
        res=res.concat(final_message);
        document.getElementById("MBody").innerHTML=res;
        return false;
    }
    else{
        document.getElementById("MBody").innerHTML=document.getElementById('email').value+"<br>"+pass_res;
        
        return true;
    }
    
}
function for_update(){
  var pass= document.getElementById("password").value;
   
  var confirm = document.getElementById("passwordS").value;
  
 
  if (pass==confirm){
    return true}
    alert("passwords didn't match!")
    return false;
}
function pass_check(){
   var my_input=document.getElementById("passwordS").value;
    var result= document.getElementById("password").value;
    
    console.log(result);
    my_input.onkeyup = function(){
        if (my_input.value.match(result))
            document.getElementById("conf").style.color="green";
        else
            document.getElementById("conf").style.color="red";    
    }
}
function checker(){
    
    var pass= document.getElementById("password").value;
   
    var confirm = document.getElementById("passwordS").value;
    
   
    if (pass==confirm){
        if(when_click())
          return true;
        
        return false;
        
}
    else
        document.getElementById("MBody").innerHTML = "Your Passwords didn't match!";
        document.getElementById("MBody").style.display = 'block';
    
}

function ContactPageCheck(){
    
    var mail = document.getElementById("emailC").value;
     var name= document.getElementById("name").value;
    var sub=  document.getElementById("sub").value;
    if(mail=="" ||name==""||sub==""){
    alert("Enter all required Fiileds");
    return false
}
    else{
    if(mail.match("@")){
       
        alert("Your concern was sent to us, we wil be in touch!\nThank you");
        return true;

    }
    else{
        alert("Please enter valide Email")
        return false;}
    }
    
}