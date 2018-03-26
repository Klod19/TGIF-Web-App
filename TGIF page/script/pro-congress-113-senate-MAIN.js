/*eslint-env browser*/
/*eslint "no-console": "off" */


var dataList = document.getElementById("senate-data");//gets the HTML table by its id
var senators = data.results[0].members;//creates an array "senators" retrieved from var data -> element at index 0 of array results -> object key "members"

//verify the following data on the console:
console.log(senators);
console.log(senators.length);
console.log(data.results);
console.log(data.results.length);

var demInput = document.getElementById("partyFilterD");//gets the checkbox for "democratic"
var repInput = document.getElementById("partyFilterR");
var indInput = document.getElementById("partyFilterI");
var stateInput = document.getElementById("statesFilter");
demInput.addEventListener("click", makeTable);   
repInput.addEventListener("click", makeTable);
indInput.addEventListener("click", makeTable);
stateInput.addEventListener("change", makeTable);
  

fillStates();
makeTable();

/* alternative to make a table header: works, but it's very unpractical: too many lines for one table entry
var header = dataList.createTHead();
var headerRow = document.createElement("TR");
header.append(headerRow);
var content = document.createTextNode("Name");
var cellH = document.createElement("TD");
headerRow.append(cellH)
cellH.appendChild(content) */

function makeTable(){
    console.log("works");
    dataList.innerHTML = "";
    makeHeader(); //makes an header by calling the function below

    for (var i = 0; i < senators.length; i++){ // goes through the array "senators"
         var senator = senators[i];
        if (showSenators(senator)){
        
               
                var row = document.createElement("TR"); //table row
                row.setAttribute("class", "tableRow");
                var name = senators[i].first_name;// creates a variable with the name of senator "i"
                var midName = senators[i].middle_name;
                var lastName = senators[i].last_name;
                var nameMidLast = name + " " + midName + " " + lastName;
                var nameLast = name + " " + lastName;
                //now to make variables to set up links:
                var url = senators[i].url;
                var linkA = nameLast.link(url);
                var linkB = nameMidLast.link(url);
                var party = senators[i].party;
                var state = senators[i].state;
                var seniority = senators[i].seniority;
                var votesWithParty = senators[i].votes_with_party_pct;
                //now start building the table
                if (midName == null) { // when midName is null, return name + lastName instead
                    row.insertCell(0).innerHTML = linkA;//inserts a cell in the row -> innerHTML to set its content with the value (string or link)
                }
                    else {
                    row.insertCell(0).innerHTML = linkB;
                }
                row.insertCell(1).innerHTML = party;
                row.insertCell(2).innerHTML = state;
                row.insertCell(3).innerHTML = seniority;
                row.insertCell(4).innerHTML = votesWithParty+"%";
                dataList.append(row);

             /*
                //ANOTHER WAY OF CREATING CELLS, a bit longer
                var cell = document.createElement("TD");
                var contentName = document.createTextNode(name + " " + lastName)
                cell.appendChild(contentName);
                row.appendChild(cell);

                var cellDup = document.createElement("TD");
                var contentNameDup = document.createTextNode(name + " " + lastName)
                cellDup.appendChild(contentNameDup);
                row.appendChild(cellDup); 
                */
        
    }
  }
}

function fillStates() {

    var stateArray = []; //empty array
    for (var j = 0; j < senators.length; j++){
       var stateOfOrigin = senators[j].state //gets the state based on the senator

            if (! stateArray.includes(stateOfOrigin)){ //this and the next line put a state in the empty array IF it doesn't contain it yet

            stateArray.push(stateOfOrigin);  
            }
    }

    var sortedStates = stateArray.sort(); //to order the array alphabetically
    sortedStates.unshift("All"); // to push string "All" at the beginning of the array
    for (var z = 0; z < sortedStates.length; z++){
           var option = document.createElement("OPTION")
           document.getElementById("statesFilter").append(option);
           option.append(sortedStates[z]);
    }
    
    
    console.log(stateArray);
    console.log(stateArray.length);
    console.log(sortedStates);
    console.log(sortedStates.length);
    
}

function makeHeader(){
        var header = dataList.createTHead(); //makes and header in the table "dataList"
        header.style.fontWeight="900"//makes the fonts bold
        var headerRow = header.insertRow(0); //inserts one row headerRow in header position 0
        headerRow.insertCell(0).innerHTML = "Name";//this and the following inserts a cell in posintion (n) in the row headerRow
        headerRow.insertCell(1).innerHTML = "Party";
        headerRow.insertCell(2).innerHTML = "State";
        headerRow.insertCell(3).innerHTML = "Years in Office";
        headerRow.insertCell(4).innerHTML = "Votes with party (%)"
}
//now CHECKBOX FILTERING



function showSenators(senator) {
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
    
    if(checkedBoxesArray.includes(senator.party)){
       filterBoxes = true;
   }
    
   if( stateInput.value == senator.state || stateInput.value == "All"){
       filterStates = true;
   }
  
   
   return filterBoxes && filterStates;
}




