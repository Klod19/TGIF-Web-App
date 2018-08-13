/*eslint-env browser*/
/*eslint "no-console": "off" */

var statistics = {
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

var membersTotalNumber = data.results[0].members; //total number of reps

getMembersStatistics();



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


function getMembersStatistics(){
    
    var demArray =[];
    var repArray =[];
    var indArray =[];
    //this loop makes 3 array based on party
    for (var i = 0; i < membersTotalNumber.length; i++){ 
        if (membersTotalNumber[i].party == "D"){
            demArray.push(membersTotalNumber[i])
        }
        if (membersTotalNumber[i].party == "R") {
            repArray.push(membersTotalNumber[i])
        }
        if (membersTotalNumber[i].party == "I") {
            indArray.push(membersTotalNumber[i])
        }
    }
      // here I update the statistics values of the demNumber, repNumber, indNumber
    statistics.demNumber = demArray.length //I don't need to stringify because I'm working with pure JS and not with JSON
    statistics.repNumber = repArray.length 
    statistics.indNumber = indArray.length;
    
    console.log(indArray)
    
      //NOW: get the least loyal and most loyal DIVIDED PER PARTY
    //these 3 are arrays, with rates connected to names
    var nameRatesDem = ratesToNames(demArray);
    var nameRatesRep = ratesToNames(repArray);
    var nameRatesInd = ratesToNames(indArray);
    var sortedDem = nameRatesDem.sort(sortNumber);
    var sortedRep = nameRatesRep.sort(sortNumber);
    var sortedInd = nameRatesInd.sort(sortNumber);
  
    // now get the 10% of the 3 sorted arrays; they return 6, 5, 0
    var tenPercDem = getTenPerc(sortedDem);
    var tenPercRep = getTenPerc(sortedRep);
    var tenPercInd = getTenPerc(sortedInd);
    //the following get the lowest 10% out of each of the 3 arrays
    
    
    // the following 3 arrays store the % of votes with party; useful to calculate the loyalty 
    
    // the function doesn't show the party loyalty in the html table, it keeps beig "0" or "2"
    
    function getLoyalVotes(array, percArray) {
        var sumVotes = 0; 
        for (var i = 0; i < array.length; i++){
            sumVotes = sumVotes + array[i].votes_with_party_pct;
            percArray.push(array[i].votes_with_party_pct)
            }
        var avgLoyalty = Math.round(sumVotes/array.length)
        console.log(avgLoyalty + " " + "test");
        if (array.length == 0){
            avgLoyalty = "-"
            return avgLoyalty
            }
        else {return avgLoyalty+"%"}             
    }
    
    var percDem =[];
    var percRep = [];
    var percInd = [];
    var avgLoyalty = 0;
    console.log(demArray)
    console.log(indArray);

    console.log("does it work?")
    console.log(avgLoyalty);
    avgLoyalty = getLoyalVotes(demArray, percDem)
    statistics.percDemLoyalVotes = avgLoyalty
    avgLoyalty = getLoyalVotes(repArray, percRep);
    statistics.percRepLoyalVotes = avgLoyalty;
    avgLoyalty = getLoyalVotes(indArray, percInd);
    statistics.percIndLoyalVotes = avgLoyalty;
    
    getLowestTenPerc(sortedDem, tenPercDem)
    getLowestTenPerc(sortedRep, tenPercRep)
    getLowestTenPerc(sortedInd, tenPercInd)
    // it works
}


// this function connects NAMES (of the whole group) with : a) total votes with party b) % of votes with party c) party affiliation

function ratesToNames (array) {
    var namesAndRates = [];
    array.forEach(function(member){
    var name = member.last_name + " " + member.first_name
    var partyId = member.party;
    var percVotesWithParty = member.votes_with_party_pct;
    var totalVotesWithParty = Math.round((percVotesWithParty*member.total_votes))/100;
    if (member.total_votes != 0){  // I exclude members whose total votes are 0
        namesAndRates.push([name, partyId, totalVotesWithParty, percVotesWithParty])
      }
        
   })
    return namesAndRates;
}




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
    return highestTenPerc;
}



//the following gets the overall 10% that voted least loyal to their parties

// a) I get an array with names, loyal vote % and number, party affiliation
var ratedArray = ratesToNames(membersTotalNumber);

// b) I sort this array in a crescent order
var sortedArray = ratedArray.sort(sortNumber);

// c) I get the 10% of that sorted array
var tenPerc = getTenPerc(sortedArray);

// d) I get the first 10% of the sorted array (i.e. the least loyal) and the last 10% of the same array (i.e. the most loyal)
var wholeLeastLoyal = getLowestTenPerc(sortedArray, tenPerc);
var wholeMostLoyal = getHighestTenPerc(sortedArray, tenPerc);
// e) I want to sort the most loyal in a decreasing order:
var sortedMostLoyal = decreasingOrder(wholeMostLoyal)

//this function puts the least loyal and most loyal arrays in their respective keys of the objcet "statistics"
function storeLoyals(array1, array2){
    array1.forEach(function(member1){
    statistics.leastLoyalArray.push(member1)
    })
    array2.forEach(function(member2){    
    statistics.mostLoyalArray.push(member2);    
    })
}





//call the function above; it works
storeLoyals(wholeLeastLoyal, sortedMostLoyal);

// NOW to get the number of missed votes and the % of missed votes per member
// I start getting a whole array with : names, party affiliation, total missed votes, % of missed votes
function missedVotesToNames(array) {
    var namesAndVotes =[];
    array.forEach(function(member){
        var name = member.last_name + "," + " " + member.first_name
        var partyId = member.party;
        var totalMissed = member.missed_votes;
        var percMissed= member.missed_votes_pct;
        namesAndVotes.push([name, partyId, totalMissed, percMissed ]);
        })
        return namesAndVotes;
}

missedVotesToNames(membersTotalNumber)
var missedVotesArray = missedVotesToNames(membersTotalNumber);

//it works; now to sort the array in an increasing order:
var sortedMissedArray = missedVotesArray.sort(sortNumber)
var leastEngaged = getHighestTenPerc(sortedMissedArray, tenPerc);

// now the most engaged (the first 10% of the array)
var mostEngaged = getLowestTenPerc(sortedMissedArray, tenPerc);

// i want to sort the least engaged in a decreasing order; write a function for this
function decreasingOrder(array){
array.sort(function(a, b)
           {
            return b[3] - a[3];
           });

    return array
}

// now I have the least engaged sorted in a decreasing order
var sortedLeastEngaged = decreasingOrder(leastEngaged);

//now to store the 2 arrays least and most engaged in obj "statistics", as values of keys
function storeEngaged(array1, array2) {
    array1.forEach(function(member1){
        statistics.leastEngagedArray.push(member1);
    })
 
    
    array2.forEach(function(member2){
        statistics.mostEngagedArray.push(member2);
    })
  
}

storeEngaged(sortedLeastEngaged, mostEngaged);
// it works!



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