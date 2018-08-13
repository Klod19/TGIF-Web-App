/*eslint-env browser*/
/*eslint "no-console": "off" */
var reprs ;


$.getJSON("https://api.myjson.com/bins/w5j7d", function(obj){/*!!: retrieved data MUST be in .json format*/
    console.log("i have the data")
    /* data arrive; THEN i change "members" to value of "data"*/
    reprs = obj.results[0].members;
    /*call the function, now that "members" is defined*/
    fillStates(); /* it goes HERE, so that "reprs", taken from "data" would be defined; outside of the getJSON it's not defined*/
    makeTable(); 
    
});



var dataList = document.getElementById("house-data");//gets the HTML table body by its id
var table = document.getElementById("myTable");
var demInput = document.getElementById("partyFilterD");//gets the checkbox for "democratic"
var repInput = document.getElementById("partyFilterR");
var indInput = document.getElementById("partyFilterI");
var stateInput = document.getElementById("statesFilter");
demInput.addEventListener("click", makeTable);   
repInput.addEventListener("click", makeTable);
indInput.addEventListener("click", makeTable);
stateInput.addEventListener("change", makeTable);

makeHeader(); 


function makeTable(){
    dataList.innerHTML= "";//to empty the table each time we play with filters;
    for (var i=0; i<reprs.length; i++){
       var repr = reprs[i];
        if (showReprs(repr)){
            var row = document.createElement("TR");
            var name = repr.first_name;// creates a variable with the name of senator "i"
            var midName = repr.middle_name;
            var lastName = repr.last_name;
            var nameMidLast = name + " " + midName + " " + lastName;
            var nameLast = name + " " + lastName;
            //now to make variables to set up links:
            var url = repr.url;
            var linkA = nameLast.link(url);
            var linkB = nameMidLast.link(url);
            var party = repr.party;
            var state = repr.state;
            var seniority = repr.seniority;
            var votesWithParty = repr.votes_with_party_pct;
            //now start building the table
            if (midName == null) { // when midName is null, return name + lastName instead
                    row.insertCell(0).innerHTML = linkA;//inserts a cell in the row -> innerHTML to set its content with the value (string or link)
                    }
            else {
                    row.insertCell(0).innerHTML = linkB;
                    }            
             row.insertCell(1).innerHTML= party;
             row.insertCell(2).innerHTML= state;
             row.insertCell(3).innerHTML= seniority;
             row.insertCell(4).innerHTML= votesWithParty+"%";
             dataList.append(row);
       }
    }
}

function fillStates(){
    var stateArray =[];
    for (var j=0; j<reprs.length; j++){
        var stateOfOrigin = reprs[j].state;
        if (!stateArray.includes(stateOfOrigin)){
            stateArray.push(stateOfOrigin);
        }
    }
    var sortedStates = stateArray.sort();
    sortedStates.unshift("All");
    for(var k = 0; k < sortedStates.length; k++) {
    
        var option = document.createElement("OPTION");
        document.getElementById("statesFilter").append(option);
        option.append(sortedStates[k]);
        
    }
       
}

function makeHeader(){
        var header = table.createTHead(); //makes and header in the table "dataList"
        header.style.fontWeight="900"//makes the fonts bold
        var headerRow = header.insertRow(0); //inserts one row headerRow in header position 0
        headerRow.insertCell(0).innerHTML = "Name";//this and the following inserts a cell in posintion (n) in the row headerRow
        headerRow.insertCell(1).innerHTML = "Party";
        headerRow.insertCell(2).innerHTML = "State";
        headerRow.insertCell(3).innerHTML = "Years in Office";
        headerRow.insertCell(4).innerHTML = "Votes with party (%)"
}

function showReprs(repr) {
   var checkedBoxesArray = [];
   var filterBoxes = false;
   var filterStates = false;

   
   if(demInput.checked) {
        checkedBoxesArray.push("D");  
   }
   if(repInput.checked) {
       checkedBoxesArray.push("R");
   }
   if(indInput.checked) {
       checkedBoxesArray.push("I");
   }
   
    
   if(!demInput.checked && !repInput.checked && !indInput.checked){
       checkedBoxesArray.push("D");
       checkedBoxesArray.push("R");
       checkedBoxesArray.push("I");
   }
    
    if(checkedBoxesArray.includes(repr.party)){
       filterBoxes = true;
   }
    
   if( stateInput.value == repr.state || stateInput.value == "All"){
       filterStates = true;
   }
  
   
   return filterBoxes && filterStates;
}
