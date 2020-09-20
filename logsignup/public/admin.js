let parentContent = document.querySelector(".content") ;
admin_username = location.search.substring(1) ;


const showAdminDetails = async() => {
    let admin_details = await(await fetch(`http://localhost:8080/getAdmin?username=${admin_username}`)).json();
    console.log(admin_details) ;
    body = `<h2 style = "width : fit-content ;margin:10px auto ;">Admin Details</h2>
    <table id = "admin_details_table">
        <tr>
            <td>Name : </td>
            <td>${admin_details.name}</td>
        </tr>
        <tr>
            <td>Designation : </td>
            <td>${admin_details.designation}</td>
        </tr>
        <tr>
            <td>About : </td>
            <td>${admin_details.about}</td>
        </tr>
        <tr>
            <td>Social Rating(Self) : </td>
            <td>${admin_details.sr} of 5</td>
        </tr>
        <tr>
            <td>LinkedIn : </td>
            <td>${admin_details.linkedin}</td>
        </tr>
        <tr>
            <td>Github : </td>
            <td>${admin_details.github}</td>
        </tr>
        <tr>
            <td>Facebook : </td>
            <td>${admin_details.facebook}</td>
        </tr>
        <tr>
            <td>Email Id : </td>
            <td>${admin_details.email}</td>
        </tr>
        
        
    </table>` ;
    document.querySelector(".content").innerHTML = body ;
}
showAdminDetails() ;

async function delete_question(ref){
    let question = (ref.parentNode.parentNode.querySelector("#ele_question").textContent).slice(2) ;
    console.log(question) ;
    await fetch(`http://localhost:8080/deleteQuestion?question=${question}`) ;
    showAllQuestion() ;
}

const showAllQuestion = async() => {
    let all_questions = await(await fetch("http://localhost:8080/getQuestions")).json() ;
    document.querySelector(".content").innerHTML = "<h1><u>List of Questions</u></h1>" ;
    let i = 1 ;
    for (question of all_questions){
        
        console.log(question) ;
        body = `<table class = "all_questions">
            <tr><td id="ele_question">${i}.${question.question}</td><td class="remove_question"><button id = "remBtn_${i}">Remove</button></td></tr>
            <tr><td>${question.option1}</td></tr>
            <tr><td>${question.option2}</td></tr>
            <tr><td>${question.option3}</td></tr>
            <tr><td>${question.option4}</td></tr>
        </table>` ;
        document.querySelector(".content").innerHTML += body ;
        document.querySelector(`#remBtn_${i}`).setAttribute('onclick' , 'delete_question(this)') ;
        i += 1 ;
        
    }
    
}


const addQuestions = async() => {

    body = `<h2 style = "width:fit-content ; margin:20px auto ;"><u>Adding New Question</u></h2>
    <table id="insert_question">
    <tr>
        <td><label for="question">** Enter new Question</label></td>
    </tr>
    <tr>
        <td><input type="text" id="new_question" placeholder="Enter you new question here"></td>
    </tr>
    <tr>
        <td><label for="options">** Enter four options that corresponds to the given question</label></td>
    </tr>
    <tr><td><input class = "opt-1" type="text" placeholder="Option-1"></td></tr>
    <tr><td><input class = "opt-2" type="text" placeholder="Option-2"></td></tr>
    <tr><td><input class = "opt-3" type="text" placeholder="Option-3"></td></tr>
    <tr><td><input class = "opt-4" type="text" placeholder="Option-4"></td></tr>
    <tr>
        <td><label for="answer">** Enter answer for the Question</label></td>
    </tr>
    <tr>
        <td><input type="text" id="answer" placeholder="Full Answer in text (Case sensitive)"></td>
    </tr>
    </table>
    <button id="saveQuestion">Save/Insert</button>` ;

    document.querySelector(".content").innerHTML = body ;  
    document.querySelector("#saveQuestion").onclick = async() => {
        console.log("Hey there .. i am here") ;
        let question = document.querySelector("#new_question").value.trim() ;
        let opt1 = document.querySelector(".opt-1").value.trim() ;
        let opt2 = document.querySelector(".opt-2").value.trim() ;
        let opt3 = document.querySelector(".opt-3").value.trim() ;
        let opt4 = document.querySelector(".opt-4").value.trim() ;
        let answer = document.querySelector("#answer").value.trim() ;
        if (question == "" || opt1 == "" || opt2 == "" || opt3 == "" || opt4 == "" || answer == ""){
            alert("Field Cannot be empty") ;
        }else{
            let data = {
                "question":question , 
                "option1" : opt1 , 
                "option2" : opt2 , 
                "option3" : opt3 , 
                "option4" : opt4 , 
                "answer" : answer
            }

            let res = await fetch(`http://localhost:8080/insertQuestion` , {
                method:'POST' , 
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(data) 
            }) ;
            res = res.text() ;
            if (res == "Already_Exist")
                alert("This question already exist") ;
            else
                console.log("Successfully Inserted") ;
        }
    } ;
}

const adminSettings = async() => {
    let password_confirm = prompt("Please comfirm your admin password once again") ;
    console.log("this is password_confirm" , password_confirm) ;
    console.log("This is admin_username " ,admin_username) ;
    console.log("admin") ;
    let username = await(await fetch(`http://localhost:8080/getAdmin?username=${admin_username}`)).json() ;
    console.log(username) ;
    console.log("SOmethinaf" , username) ;
    if (password_confirm != null){
        
        if (password_confirm == username.password){
            let admin_details = await(await fetch(`http://localhost:8080/getAdmin?username=${admin_username}`)).json();    
            body = `<h2 style = "width : fit-content ;margin:20px auto ;">Admin Settings</h2>
            <table id = "admin_details_edit">
                <tr>
                    <td class = "head">Name : </td>
                    <td><input id="name" type = "text" value = "${admin_details.name}"/></td>
                </tr>
                <tr>
                    <td class = "head">Designation : </td>
                    <td><input id="desig" type = "text" value = "${admin_details.designation}"/></td>
                </tr>
                <tr>
                    <td class = "head">About : </td>
                    <td><input id="abt" type = "text" value = "${admin_details.about}"/></td>
                </tr>
                <tr>
                    <td class = "head">Social Rating(Self) : </td>
                    <td><input id="sr" type = "text" value = "${admin_details.sr}"/></td>
                </tr>
                <tr>
                    <td class = "head">LinkedIn : </td>
                    <td><input id="linkedin" type = "text" value = "${admin_details.linkedin}"/></td>
                </tr>
                <tr>
                    <td class = "head">Github : </td>
                    <td><input id="git" type = "text" value = "${admin_details.github}"/></td>
                </tr>
                <tr>
                    <td class = "head">Facebook : </td>
                    <td><input id="fb" type = "text" value = "${admin_details.facebook}"/></td>
                </tr>
                <tr>
                    <td class = "head">Email Id : </td>
                    <td><input id="email" type = "text" value = "${admin_details.email}"/></td>
                </tr>
                <div id="admin_save_btn">
                    <button id="saveSettings">Save</button>
                    <button id="change_pass">Change Password</button> 
                </div>
                
            </table>` ;
            document.querySelector(".content").innerHTML = body ;
            document.querySelector("#saveSettings").onclick = async() => {
                let data = {
                    new_Details : {
                        "name" : document.querySelector("#name").value ,
                    "designation" : document.querySelector("#desig").value ,
                    "about" : document.querySelector("#abt").value ,
                    "sr" : document.querySelector("#sr").value ,
                    'linkedin' : document.querySelector("#linkedin").value ,
                    'github' : document.querySelector("#git").value ,
                    'facebook' : document.querySelector("#fb").value ,
                    'email': document.querySelector("#email").value ,
                    } , 
                    who_is_admin : admin_username
                }
                console.log("This is admin data : " , data) ;
                await fetch("http://localhost:8080/updateAdminDetails" , {
                    method:'POST' , 
                    headers : {
                        'Content-Type' : 'application/json'
                    } , 
                    body:JSON.stringify(data)
                }) ;
                console.log("Updation Successful") ;
                popup_toast("Admin Details Updated Successfully") ;
                setTimeout(remove_popupToast , 2000) ;
            } ;
            document.querySelector("#change_pass").onclick = () => {
                
               
             
                        let admin = `<h2><u>Change Admin Password</u></h2>
                        <input class="chng_pass" type="password" placeholder="Old Password">
                        <input class="chng_pass pass" type = "password" placeholder="New Password">
                        <input class="chng_pass cnfpass" type="text" placeholder="Confirm New Password">
                        <input id="resetPassword" type="submit" value="Reset">` ;
    
                        document.querySelector(".content").innerHTML = admin ;
                        
                        document.querySelector("#resetPassword").onclick = async() => {
                            let bool = true ;
                            for (items of document.querySelectorAll(".chng_pass")){
                                if (items.value == ''){
                                    bool = false ;
                                    break ;
                                }
                            }
                            if (bool){
                                if (document.querySelector(".pass").value == document.querySelector(".cnfpass").value){
                                    let res = await fetch("http://localhost:8080/updateAdminPassword" , {
                                        method: 'POST' , 
                                        headers : {
                                            'Content-Type':'application/json'
                                        },
                                        body:JSON.stringify({"username" : admin_username ,"password" :document.querySelector(".cnfpass").value})
                                    });
                                    let done = await res.text() ;
                                    popup_toast("Admin password successfully changed") ;
                                    setTimeout(remove_popupToast , 2000)
                                    document.querySelector(".content").innerHTML = body ;
                                }else{
                                    alert("Password does not match") ;
                                }
                            }else{
                                popup_toast("Fields cannot be empty") ;
                                setTimeout(remove_popupToast , 2000) ;
                            }
                        };
                
            } ;
        }else{
            popup_toast("Access Denied (password mismatch)") ;
            setTimeout(remove_popupToast , 2000) ;
        }
    }
}

const logoutAdmin = async() => {
    window.location.href = "login.html" ;
}


//Functions from login.js
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