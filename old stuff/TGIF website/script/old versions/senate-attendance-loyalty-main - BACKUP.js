/*eslint-env browser*/
/*eslint "no-console": "off" */

var statistics ={
    demNumber : 0,
    repNumber : 0,
    indNumber : 0,
    percDemLoyalVotes : 0,
    percRepLoyalVotes : 0,
    percIndLoyalVotes : 0,
    /*leastLoyalDem : 0,
    leastLoyalRep : 0,
    mostLoyalDem : 0,
    mostLoyalRep : 0,*/
    leastLoyalArray: [],
    mostLoyalArray: [],
    leastEngagedArray : [],
    mostEngagedArray : [],
    
}

var senatorsTotalNumber = data.results[0].members; //total number of senators

getSenatorsStatistics();

console.log("the updated values of the keys 'demNumber' 'repNumber' 'indNumber': ")
console.log(statistics.demNumber);
console.log(statistics.repNumber);
console.log(statistics.indNumber);

console.log("the updated values of the 3 percentages of loyal votes")
console.log(statistics.percDemLoyalVotes);
console.log(statistics.percRepLoyalVotes);
console.log(statistics.percIndLoyalVotes);

// now to create the first simple table, common to the 2 pages
//this function makes the table
function makeGlanceTable(num, perc, partyRow) {
    var row = document.getElementById(partyRow);
    for(var i = 0; i < 1; i ++){
    var dataNum = document.createElement("TD");
    dataNum.innerHTML = num; 
    row.append(dataNum)
    var dataPerc = document.createElement("TD")
    dataPerc.innerHTML = perc
    row.append(dataPerc) 
    }
}

// callin the function 3 times, to obtain the first table
makeGlanceTable(statistics.repNumber, statistics.percRepLoyalVotes, "repRow")//i can set a string as paramether!!!
makeGlanceTable(statistics.demNumber, statistics.percDemLoyalVotes, "demRow")
makeGlanceTable(statistics.indNumber, statistics.percIndLoyalVotes, "indRow")

//now the least loyal and most loyal table
function makeTable(mainArray, tableId){ // I can try to use a forEach instead
    for (var k = 0; k < mainArray.length; k++){ 
        var table = document.getElementById(tableId);
        var row = document.createElement("TR");
        table.append(row);
        for(var i = 0; i < 4; i ++){
            var data = document.createElement("TD");
            data.innerHTML = mainArray[k][i];
            row.append(data)
        }
    }
}


function getSenatorsStatistics (){
    
    console.log(senatorsTotalNumber.length);
    var demArray =[];
    var repArray =[];
    var indArray =[];
    //this loop makes 3 array based on party
    for (var i = 0; i < senatorsTotalNumber.length; i++){ 
        if (senatorsTotalNumber[i].party == "D"){
            demArray.push(senatorsTotalNumber[i])
        }
        if (senatorsTotalNumber[i].party == "R") {
            repArray.push(senatorsTotalNumber[i])
        }
        if (senatorsTotalNumber[i].party == "I") {
            indArray.push(senatorsTotalNumber[i])
        }
    }
    console.log("the length of the arrays demArray, repArray, indArray")
    console.log(demArray.length);
    console.log(repArray.length);
    console.log(indArray.length);
    
    // the following 3 arrays store the % of votes with party; useful to calculate the loyalty 
    var percDem =[];
    var percRep = [];
    var percInd = [];
    console.log("3 arrays to store all the votes loyal to the party")
    console.log(percDem);
    console.log(percRep);
    console.log(percInd);
    
     // the following 3 functions to get the % of the loyal votes per party; they work, but I'd like a lighter way (see comment below)
    
    function getLoyalDemVotes() {
    var sumVotes = 0;  
    for (var i = 0; i < demArray.length; i++){
        sumVotes = sumVotes + demArray[i].votes_with_party_pct;
        percDem.push(demArray[i].votes_with_party_pct)
        }
    var avgLoyalty = Math.round(sumVotes/demArray.length)
    console.log(sumVotes);
    console.log(avgLoyalty);
    statistics.percDemLoyalVotes = avgLoyalty+"%"
    }
    
    
    function getLoyalRepVotes() {
    var sumVotes = 0;  
    for (var i = 0; i < repArray.length; i++){
        sumVotes = sumVotes + repArray[i].votes_with_party_pct;
        percRep.push(repArray[i].votes_with_party_pct)
        }
    var avgLoyalty = Math.round(sumVotes/repArray.length)
    console.log(sumVotes);
    console.log(avgLoyalty);
    statistics.percRepLoyalVotes = avgLoyalty+"%"
    }
    
    
    function getLoyalIndVotes() {
    var sumVotes = 0;  
    for (var i = 0; i < indArray.length; i++){
        sumVotes = sumVotes + indArray[i].votes_with_party_pct;
        percInd.push(indArray[i].votes_with_party_pct)
        }
    var avgLoyalty = Math.round(sumVotes/indArray.length)
    console.log(sumVotes);
    console.log(avgLoyalty);
    statistics.percIndLoyalVotes = avgLoyalty+"%"
    }
    getLoyalDemVotes();
    getLoyalRepVotes();
    getLoyalIndVotes();
    
    // here I update the statistics values of the demNumber, repNumber, indNumber
    statistics.demNumber = demArray.length //I don't need to stringify because I'm working with pure JS and not with JSON
    statistics.repNumber = repArray.length 
    statistics.indNumber = indArray.length;

    //NOW: get the least loyal and most loyal DIVIDED PER PARTY
    //these 3 are arrays, with rates connected to names
    var nameRatesDem = ratesToNames(demArray);
    var nameRatesRep = ratesToNames(repArray);
    var nameRatesInd = ratesToNames(indArray);
    var sortedDem = nameRatesDem.sort(sortNumber);
    var sortedRep = nameRatesRep.sort(sortNumber);
    var sortedInd = nameRatesInd.sort(sortNumber);
    console.log("sorted arrays name-% loyal votes");
    console.log(sortedDem);
    console.log(sortedRep);
    console.log(sortedInd);
    // now get the 10% of the 3 sorted arrays; they return 6, 5, 0
    var tenPercDem = getTenPerc(sortedDem);
    var tenPercRep = getTenPerc(sortedRep);
    var tenPercInd = getTenPerc(sortedInd);
    //the following get the lowest 10% out of each of the 3 arrays
    getLowestTenPerc(sortedDem, tenPercDem)
    getLowestTenPerc(sortedRep, tenPercRep)
    getLowestTenPerc(sortedInd, tenPercInd)
    // it works
}
/* I WOULD LIKE TO IMPLEMENT THIS TO HAVE A GENERAL FUNCTION TO STORE ALL THE LOYAL VOTES
    MAYBE WITH forEach? OR maybe adding mor paramethers to the function
function getLoyalVotes(array) {
    var sumVotes = 0;  
    for (var i = 0; i < array.length; i++){
        sumVotes = sumVotes + array[i].votes_with_party_pct;
        }
    var avgLoyalty = sumVotes/array.length
    console.log(sumVotes);
    console.log(avgLoyalty);
    return avgLoyalty;
}



function sortVotes(array){
    getLoyalVotes(array);
    for (var k = 0 ; k < array.lenght; k ++) {
        var partyId = senatorsTotalNumber[k].party
        if (partyId == "D") {
            statistics.percDemLoyalVotes = avgLoyalty
        }
        if (partyId == "R") {
            statistics.percRepLoyalVotes = avgLoyalty
        }
        if (partyId == "I") {
            statistics.percIndLoyalVotes = avgLoyalty
        }
    }
}
*/


// this funtion sort the integers in an array in an increasing order
function sortNumber(a, b) {
    return a[3] - b[3]; //here I'm using an index  "3" because I'm working with the value corresponding to index "3" of the arrays forming the elements of the sorted array 
}
//this function gets the 10% of the length of an array
function getTenPerc(array){
    var tenPerc = Math.round((10*array.length)/100)
    return tenPerc;
}

// this function gets the lowest 10% of the array; paramether "perc" is to be tenPercDem, tenPercRep, tenPercInd
function getLowestTenPerc(array, perc) {
    var lowestTenPerc =[];
    array.some(function(member, index){ // the method ".some" breaks when the callback returns "true"
              lowestTenPerc.push(member);
              return index == perc-1 //here it returns true; the loop stops
    })
    console.log(lowestTenPerc);
    return lowestTenPerc //it's an array!
}

function getHighestTenPerc(array, perc) {
    var highestTenPerc = [];
    array.forEach(function(member, index){
        var length = array.length ;
        if (index >= length-perc){
            highestTenPerc.push(member)
        }
    })
    console.log(highestTenPerc);
    return highestTenPerc;
}

// this function connects NAMES (of the whole group) with : a) total votes with party b) % of votes with party c) party affiliation

function ratesToNames (array) {
    var namesAndRates = [];
    array.forEach(function(senator){
    var name = senator.last_name + " " + senator.first_name
    var partyId = senator.party;
    var percVotesWithParty = senator.votes_with_party_pct;
    var totalVotesWithParty = Math.round((percVotesWithParty*senator.total_votes))/100;
    namesAndRates.push([name, partyId, totalVotesWithParty, percVotesWithParty])
    })
    console.log(namesAndRates);
    return namesAndRates;
}

//the following gets the overall 10% that voted least loyal to their parties

// a) I get an array with names, loyal vote % and number, party affiliation
var ratedArray = ratesToNames(senatorsTotalNumber);

// b) I sort this array in a crescent order
var sortedArray = ratedArray.sort(sortNumber);

// c) I get the 10% of that sorted array
var tenPerc = getTenPerc(sortedArray);

// d) I get the first 10% of the sorted array (i.e. the least loyal) and the last 10% of the same array (i.e. the most loyal)
var wholeLeastLoyal = getLowestTenPerc(sortedArray, tenPerc);
var wholeMostLoyal = getHighestTenPerc(sortedArray, tenPerc);
// e) I want to sort the most loyal in a decreasing order:
console.log("a decreasing order array for the most loyal:")
var sortedMostLoyal = decreasingOrder(wholeMostLoyal)

//this function puts the least loyal and most loyal arrays in their respective keys of the objcet "statistics"
function storeLoyals(array1, array2){
    array1.forEach(function(member1){
    statistics.leastLoyalArray.push(member1)
    })
    console.log("this is now the array 'least loyal':")
    console.log(statistics.leastLoyalArray)
    array2.forEach(function(member2){    
    statistics.mostLoyalArray.push(member2);    
    })
    console.log("this is now the array 'most loyal':")
    console.log(statistics.mostLoyalArray)  
}





//call the function above; it works
storeLoyals(wholeLeastLoyal, sortedMostLoyal);

// NOW to get the number of missed votes and the % of missed votes per senator
// I start getting a whole array with : names, party affiliation, total missed votes, % of missed votes
function missedVotesToNames(array) {
    var namesAndVotes =[];
    array.forEach(function(senator){
        var name = senator.last_name + "," + " " + senator.first_name
        var partyId = senator.party;
        var totalMissed = senator.missed_votes;
        var percMissed= senator.missed_votes_pct;
        namesAndVotes.push([name, partyId, totalMissed, percMissed ]);
        })
        return namesAndVotes;
}

missedVotesToNames(senatorsTotalNumber)
var missedVotesArray = missedVotesToNames(senatorsTotalNumber);

//it works; now to sort the array in an increasing order:
var sortedMissedArray = missedVotesArray.sort(sortNumber)
var leastEngaged = getHighestTenPerc(sortedMissedArray, tenPerc);

// now the most engaged (the first 10% of the array)
var mostEngaged = getLowestTenPerc(sortedMissedArray, tenPerc);
console.log("following: the 10% least engaged; the 10% most engaged")
console.log(leastEngaged);
console.log(mostEngaged);

// i want to sort the least engaged in a decreasing order; write a function for this
function decreasingOrder(array){
array.sort(function(a, b)
           {
            return b[3] - a[3];
           });
    console.log(array);
    return array
}

// now I have the least engaged sorted in a decreasing order
var sortedLeastEngaged = decreasingOrder(leastEngaged);

//now to store the 2 arrays least and most engaged in obj "statistics", as values of keys
function storeEngaged(array1, array2) {
    array1.forEach(function(member1){
        statistics.leastEngagedArray.push(member1);
    })
    console.log("the updated least engaged array, in the statistics")
    console.log(statistics.leastEngagedArray)
    
    array2.forEach(function(member2){
        statistics.mostEngagedArray.push(member2);
    })
    console.log("the updated most engaged array, in the statistics")
    console.log(statistics.mostEngagedArray)
}

storeEngaged(sortedLeastEngaged, mostEngaged);
// it works!
console.log("testing the most loyal")
console.log(statistics.mostLoyalArray)


function buildTables(){ // need an if condtion otherwise the HTML will look for 2 lines, then the next HTML for 2 lines NOT EXISTING in its code
    if(document.getElementById("least_loyal_table") == null){

    // calls the function to make the 2 tables in the 2 different pages
    makeTable(statistics.leastEngagedArray, "least_engaged_table");
    makeTable(statistics.mostEngagedArray, "most_engaged_table");

    }else{

    makeTable(statistics.leastLoyalArray, "least_loyal_table");
    makeTable(statistics.mostLoyalArray, "most_loyal_table");
    }
}

buildTables()