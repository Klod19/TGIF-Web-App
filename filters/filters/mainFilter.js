function createTable(){

    console.log("works");

    var members = data.results[0].members;
    var myTable = document.getElementById("table");
    myTable.innerHTML = "";

    members.forEach(function(member) {

        //member == members[i]
        if(showMember(member)){
            var row = document.createElement("tr");
            row.insertCell().innerHTML = member.first_name;
            row.insertCell().innerHTML = member.party;
            row.insertCell().innerHTML = member.state;
            myTable.append(row);
        }


    });
}

var inputRep = document.getElementById("rep");
var inputDem = document.getElementById("dem");

var statesSelector = document.getElementById("selector");

inputRep.addEventListener("click", createTable );
inputDem.addEventListener("click", createTable );
statesSelector.addEventListener("change", createTable);



function showMember(member){
    
    var checkboxesChecked = [];
    
    var filter1value = false;
    var filter2value = false;
    
    
//ADVANCED WAY
    
    //    var checkboxesChecked2 = Array.from(document.getElementsByName("party"))
    //    .filter(function(el){
    //        return el.checked;
    //    })
    //    .map(function(el){
    //        return "djahd";
    //    });
    //    
    //    console.log(checkboxesChecked2);
    
    
    var inputRep = document.getElementById("rep");
    var inputDem = document.getElementById("dem");
    var statesSelector = document.getElementById("selector");
    
    if(inputDem.checked){
        checkboxesChecked.push("D");
    }
    if(inputRep.checked){
        checkboxesChecked.push("R");
    }
    
    if(!inputDem.checked && !inputRep.checked){
        checkboxesChecked.push("R");
        checkboxesChecked.push("D");        
    }
    
    if(checkboxesChecked.includes(member.party)){
        filter1value = true;
    }
    
    if(member.state == statesSelector.value || statesSelector.value == "all"){
        filter2value = true;
    }
    
    
    return filter1value && filter2value;
}


























