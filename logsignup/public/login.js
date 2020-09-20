admin_username = undefined ;

async function load_credentials(emailId , password){

    if (emailId.trim() != "" && password.trim() != ""){
        var data = {emailId , password} ;
    var response = await fetch("http://127.0.0.1:8080/verifyCredentials" , {
        method : 'POST' , 
        headers : {
            'Content-Type' : 'application/json'
        } , 
        body : JSON.stringify(data)
    }) ;
    console.log(response) ;
    var text = await response.text() ;
    console.log("text: " + text) ;

    if (text == "verified"){
        window.location.href = "index.html" ;
        let lastlogin = new Date() ;
        await fetch(`http://localhost:8080/addLoginHistory?user=${emailId}&lastlogin=${lastlogin}`) ;
    }
    else if (text == 'NotVerified')
        alert("Invalid Credentials") ;
    else
        alert('This Id is not Recognized .... Please Register !!!') ;

    clearCredBox() ;
    }else{
        alert("Field cannot be empty") ;
    }
}

function popup_toast(text){
    let popup = document.createElement("div") ;
    popup.id = "toast" ;
    popup.textContent = text ;
    let parent = document.querySelector("#main-container") ;
    parent.appendChild(popup) ;
}

function remove_popupToast(){
    let parent = document.querySelector("#main-container") ;
    parent.removeChild(document.querySelector("#toast")) ;
}

async function admin_login() {

    let div = document.createElement("div") ;
    div.className = "modal" ;
    let heading = document.createElement("h2") ;
    heading.id = "admin_heading";
    heading.innerText = "Admin Login Panel" ;
    let parent = document.querySelector("#main-container") ;
    parent.appendChild(div) ;
    let div_email = document.createElement('div') ;
    div_email.className = "credDiv" ;
    let i_email = document.createElement("i") ;
    i_email.className = "fas fa-user-shield" ;
    let div_pass = document.createElement('div') ;
    div_pass.className = "credDiv" ;
    let i_pass = document.createElement("i") ;
    i_pass.className = "fas fa-lock-open";
    let email_textarea = document.createElement("input")
    email_textarea.placeholder = "Admin Email/Username" ;
    let password_textarea = document.createElement("input") ;
    password_textarea.placeholder = "Admin Password/Key";
    password_textarea.type = "password" ;
    div_email.appendChild(i_email) ;
    div_email.appendChild(email_textarea) ;
    div_pass.appendChild(i_pass) ;
    div_pass.appendChild(password_textarea) ;
    let button_div = document.createElement("div") ;
    button_div.className = "groupButton" ;
    let btn_cancel = document.createElement("button") ;
    btn_cancel.id = "btn_cancel" ;
    btn_cancel.textContent = "Cancel" ;
    btn_cancel.onclick = () => {
        let parent = document.querySelector("#main-container") ;
        parent.removeChild(document.querySelector(".modal")) ;
    };
    
    let btn_login = document.createElement("button") ;
    btn_login.id = "btn_login" ;
    btn_login.textContent = "Login" ;
    btn_login.onclick = async() => {
        console.log("HEllo this i sasdfa;sf") ;
        console.log(email_textarea.value) ;
        let admin_obj = await(await fetch(`http://localhost:8080/getAdmin?username=${email_textarea.value}`)).json() ;
        console.log("this is admin obj" , admin_obj) ;
        if (email_textarea.value.trim() == "" || password_textarea.value.trim() == ""){
            popup_toast("Something is missing ... Please retry .. !!!") ;
            setTimeout(function(){
                remove_popupToast();
            } , 2000) ;
        }else{
            if (admin_obj != {}){
                if (email_textarea.value === admin_obj.username && password_textarea.value === admin_obj.password){
                    console.log("You are done") ;
                    admin_username = email_textarea.value.trim() ;
                    console.log(`Admin_username in login is :   ${admin_username}`) ;
                    window.location.href = `admin.html?${admin_username}`
                }else{
                    console.log(admin_obj.username , " " , admin_obj.password) ;
                    popup_toast("Invalid Credentials for Admin Login ...!!!") ;
                    setTimeout(function(){
                        remove_popupToast();
                    } , 2000) ;
                }
            }else{
                console.log("I am really sorry ... I cannot do a success login") ;
            }
        }
    };

    button_div.appendChild(btn_login) ;
    button_div.appendChild(btn_cancel) ;

    div.appendChild(heading) ;
    div.appendChild(div_email) ;
    div.appendChild(div_pass) ;
    div.appendChild(button_div) ;
    
}

function clearCredBox(){
    var email = document.querySelector("#email") ;
    email.value = "" ;
    var password = document.querySelector("#passcode") ;
    password.value = "" ;
}