function getNewUser(name , email , password , confirmPassword , contact){
    if (name == "" || email == "" || password == "" || confirmPassword == ""){
        alert("Some value is not filled correctly ... !!! Plese check once more ") ;
    }
    else if (password != confirmPassword){
        alert("Password does not match") ;
    }
    else if (!document.querySelector(".tncCheckBox").checked){
        alert("You need to accept all terms and condition") ;
    }
    else{
        registerNewUser(name , email , password , contact) ;
    }
}

const registerNewUser = async(name , emailId , password , contact) =>{
    
    var data = {name , emailId , password , contact} ;
    console.log(data) ;
    body = {
        method : "POST" , 
        headers : {
            'Content-Type':'application/json'
        } ,
        body : JSON.stringify(data) 
    } ;
    console.log("body " , body) ;
    var response = await fetch("http://127.0.0.1:8080/registerNewUser" , body) ;
    var text = await response.text() ;
    if (text == "registered"){
        alert("This user is already Registered")
    }else{
        window.location.replace("http://127.0.0.1:8080/login.html") ;
    }
}