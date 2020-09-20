

(async () => {
    let user_name = await(await fetch("http://localhost:8080/getLastLogin")).text()
    let scores = await(await fetch(`http://localhost:8080/getScores?user_name=${user_name}`)).json() ;
    let table_parent = document.querySelector("#table-content") ;
    let user = document.createElement("h1") ;
    user.style.width = "fit-content" ;
    user.style.margin = "10px auto" ;
    
    user.innerHTML = `Score Board of  "<u>${user_name}</u>"`
    let table = document.createElement("table") ;
    body = `
        <tr>
            <th style = "font-size : 20px">Rounds</th>
            <th style = "font-size : 20px">Scores</th>
        </tr>
    ` ;

    table.innerHTML = body ;
    let bgcount = 0 ;
    for (score of scores){
        
        console.log(bgcount) ;
        table.appendChild(createListScore(bgcount , score)) ;
        bgcount += 1 ;
    }
    table_parent.appendChild(user) ;
    table_parent.appendChild(table) ;
})() ;

function createListScore(bgcount , score) {
    let li = document.createElement("tr") ;
    body = `
        <td>
            ${bgcount+1}
        </td>
        <td>
            ${score.score}
        </td>
    ` ;
    li.innerHTML = body ;
    if (bgcount % 2 == 0){
        console.log("bgcount : " + bgcount) ;
        li.style.color = "black" ;
        li.style.backgroundColor = "white" ;
    }else{
        li.style.color = "white" ;
        li.style.backgroundColor = "black"
    }
    return li ;
}
