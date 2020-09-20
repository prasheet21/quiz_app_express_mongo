var currentQuiz = 1 ;
var total_score = 0 ;

(async function(){
    var response = await fetch("http://127.0.0.1:8080/getQuestions") ;
    quiz_questions = await response.json() ;
    
    createQuiz(quiz_questions[currentQuiz-1]) ;
})() ;



const createQuiz = (quiz) => {
    const body = `
    <h3>${currentQuiz}.${quiz.question}</h3>
    <div id = "quiz-options">
        <div>
            <input type="radio" name="${currentQuiz}" value="${quiz.option1}" class="quiz-${quiz._id}-option"><label>${quiz.option1}</label>
        </div>
        <div>
            <input type="radio" name="${currentQuiz}" value="${quiz.option2}" class="quiz-${quiz._id}-option"><label>${quiz.option2}</label>
        </div>
        <div>
            <input type="radio" name="${currentQuiz}" value="${quiz.option3}" class="quiz-${quiz._id}-option"><label>${quiz.option3}</label>
        </div>
        <div>
            <input type="radio" name="${currentQuiz}" value="${quiz.option4}" class="quiz-${quiz._id}-option"><label>${quiz.option4}</label>
        </div>
    </div>
    ` ;

    const parent = document.querySelector(".quiz-box") ;
    
    var questionSection = document.createElement("div") ;
    questionSection.innerHTML = body ;
    questionSection.id = "question-section" ;

    

    if (document.querySelector("#submitBtn") == null){

        //Remove the restart Button
        if (((document.querySelector("#reload") != null && document.querySelector("#result") != null))){
            parent.removeChild(document.querySelector("#reload")) ;
            parent.removeChild(document.querySelector("#result")) ;
        }

        //Create reset button
        resetBtn = document.createElement("Button") ;
        resetBtn.id = "resetBtn" ;
        resetBtn.textContent = "Reset" ;
        resetBtn.setAttribute("onclick" , "clearRadio()") ;
        parent.append(resetBtn) ;

        submitBtn = document.createElement("button") ;
        submitBtn.id = "submitBtn" ;
        submitBtn.textContent = "Submit" ;
       
        parent.append(submitBtn) ;
        parent.insertBefore(questionSection , document.querySelector("#submitBtn")) ;


        
    }else{
        parent.replaceChild(questionSection , document.querySelector("#question-section")) ;
    }
    submitBtn.onclick = function(){loadQuiz(quiz);}    
}

function checkedAny(ele){
    for (var radio of ele){
        if (radio.checked){
            return radio.value ;
        }
    }
    return undefined ;
}

function checkAnswer(index , givenAnswer) {
    if (givenAnswer == quiz_questions[index].answer){
        return true ;
    }
    return false ;
}

async function loadResult(user_score){

    currentQuiz = 1 ;
    total_score = 0 ;

    console.log("Feeding score here") ;
    

    var reloadBtn = document.querySelector("#submitBtn") ;
    reloadBtn.id = "reload" ;
    reloadBtn.style.backgroundColor = "blue" ; 
    reloadBtn.textContent = "Re-start Quiz" ;
    reloadBtn.setAttribute("onclick" , `createQuiz(quiz_questions[0])`)

    reloadBtn.parentNode.removeChild(document.querySelector("#resetBtn")) ;

    var parent = reloadBtn.parentNode ;
    var score = document.createElement("h2") ;
    score.id = "result" ;
    score.style.textAlign = "center" ;
    score.textContent = `You answered ${user_score}/${quiz_questions.length} question correctly .` ;
    console.log("Working fine here") ;
    parent.replaceChild(score , document.querySelector("#question-section")) ;

    await fetch(`http://localhost:8080/feedScore?score=${user_score}`)
}

function loadQuiz(quiz){
    
    var ele = document.querySelectorAll(`.quiz-${quiz._id}-option`) ;
    var result = checkedAny(ele) ;

    if (result == undefined){
        alert("Select any one of the option") ;
    }else{
        if (checkAnswer(currentQuiz-1 , result)){
            total_score += 1 ;
        }
        currentQuiz += 1 ;
        console.log("Almost there to call loadResult function") ;
        if (quiz_questions[currentQuiz-1] == undefined){
            console.log("I am in here to call LoadResult function") ;
            loadResult(total_score) ;
        }else{
            createQuiz(quiz_questions[currentQuiz-1])  ;
        }
    }
}

function clearRadio(){
    var ele = document.querySelectorAll("input[type='radio']")
    for (var rad of ele){
        if (rad.checked){
            rad.checked = false ;
        }
    }
}

function logout(){
    window.location.href = "login.html" ;
}
