/*eslint-env browser*/
/*eslint "no-console": "off" */

/*var table= document.getElementById("tableHeader"); //gets the httml table "tableHeader"
var dataList = document.getElementById("senateTable");//gets the HTML table body by its id
var demInput = document.getElementById("partyFilterD");//gets the checkbox for "democratic"
var repInput = document.getElementById("partyFilterR");
var indInput = document.getElementById("partyFilterI");
var stateInput = document.getElementById("stateSelector");
demInput.addEventListener("click", makeTable);   
repInput.addEventListener("click", makeTable);
indInput.addEventListener("click", makeTable);
stateInput.addEventListener("change", makeTable);*/

var app = new Vue({
        el: '#vueApp',
        data: {
            members: [],
            allMembers: [],//backup array;will have the same content as "members", but it doesn't get played with
            states: [],
            showVue: false 
        },
        
        created: function(){ //I initialize the page calling "getData", which makes the starting table 
            this.getData();
        },
        
        methods: {
            
            getData : function () {
                var url;
                if(document.getElementById("senate_page")){
                    url = "https://api.myjson.com/bins/v79hh"
                }
                if(document.getElementById("house_page")){
                    url = "https://api.myjson.com/bins/w5j7d"
                }
                $.getJSON(url, function(obj){
                    console.log("now I have the data")
                    app.members = obj.results[0].members; // so i get the array "members" from the JSON url
                    app.allMembers = app.members; // here is set the content of "allMembers" to the one of "members"
                    app.members.forEach(function(oneGuy){ //I fill the "state" array
                        if(!app.states.includes(oneGuy.state)){
                        app.states.push(oneGuy.state)
                        }
                    })
                    app.states.sort()//I sort the "states" array
                    //the following condition is to hide the Vue element untile the data are loaded;see HTML
                    if (app.members.length > 0){
                        app.showVue = true;
                    }

                })
            },
            
            show: function () {//this was just a test; I deleted the variable "isVisible"
                console.log("show")
                this.isVisible =!this.isVisible
            },
        

            filter : function(){
                app.members = app.allMembers; //EACH TIME the function is called, I set array "members" back to its initial value, store in "allMembers"; useful to work on the starting content each time the function is called
                
                var checkboxChecked = $("input[name=party]:checked").map(function(){
                    return this.value;
                }).get(); // returns the value of the checkbox in an ARRAY; is an ARRAY!!! 
                //a) $ gets(jQuery) the input with name=party (see HTML) and that is checked;
                //b) array.map(function(){ code }) transforms the array in anythying we write between brackets; here we transform this to the value of the input we "called" (this.value) --> see HTML for the value
                //c) we apply .get() to all this, to transform the "semi-array" from jQuery to a proper Array
                
                var filteredMembers = app.members.filter(function(guy){
                    var filter1 = checkboxChecked.includes(guy.party) || checkboxChecked.length == 0;
                    var filter2 = $("#stateSelector").val() == guy.state || $("#stateSelector").val() == "all";
                    
                    return filter1 && filter2;
                }) // the function above returns booleans (true or false)
                //a) array.filter(function(paramether){ code }) filters the array: it will return ONLY what is stated in the code; 
                //b) filter1 is true if the checkbox array includes the value stored in guy.party(i.e. "D","R", or "I") OR if array checkboxChecked has no elements (lenght == 0) i.e. no boxes are checked
                //c) filter2 : $("stateSelector) gets an array with the element "stateSelector" (see HTML); .val() gets the value of this element ( .val() is a jQuery method, like .value() ); it fives the value of the stateSelector, and if it's equal to guy.state it returns true --> will show memebers with THAT state;
                //d) filter2 returns true if the value of stateSelector is "all" --> so we see everything with "-All-" selected
                app.members = filteredMembers;
        
        }
    
            
        
     },
        /*computed:{} i use this when i want something to load on changes; when something happens on the page, the code here doesn't need to be called (like for "methods"), it'll start; for example, useful for filters where we write something
        */

})
    


/*function makeTable(){
    console.log("works");
    dataList.innerHTML = "";

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
                dataList.append(row); // appends the row to the table body "senate-data"

        
    }
  }
}*/
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

/*function fillStates() {

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
    console.log(sortedStates.length);*/
    
/*function makeHeader(){
        var header = table.createTHead(); //makes an header in the table "myTable"
        header.style.fontWeight="900"//makes the fonts bold
        var headerRow = header.insertRow(0); //inserts one row headerRow in header position 0
        headerRow.insertCell(0).innerHTML = "Name";//this and the following inserts a cell in posintion (n) in the row headerRow
        headerRow.insertCell(1).innerHTML = "Party";
        headerRow.insertCell(2).innerHTML = "State";
        headerRow.insertCell(3).innerHTML = "Years in Office";
        headerRow.insertCell(4).innerHTML = "Votes with party (%)"
}*/


//now CHECKBOX FILTERING
/*function showSenators(senator) {
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
}*/




