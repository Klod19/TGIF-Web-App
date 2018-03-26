
// the following works like the classic for loop

var array = ["n1", "n2", "n3"];
array.forEach(function(x, index){
    console.log(x.party)
})

//!! function is generic! its paramether to, goes through the whole array, we colud write x, member, whatever we like
// !! the second paramether (index) returns the index, but i can name it as i like IMPORTANT IS it's the second paramether

var statistics = {
    nReps: 0,
    nDems: 0,
    nInds: 0,
}


var reps = [];
var dems = [];
var inds = [];



arrayOfPoliticians.forEach(function(member){
   if(member.party == "R"){
    statistics.nReps++; //this increments directly the value of nReps in the statistics; better than using arrays
    }
   if(member.party == "D"){
    statistics.nDems++;
    }                       
   if(member.party == "R"){
    statistics.nInds++;
    }
    
                
})

//EVEN BETTER than if: switch
arrayOfPoliticians.forEach(function(member){
switch(member.party) { // with switch I check some expression (in parenthesis)
    case "R" // like "if R "
        statistics.nReps++
        break;
    case "D"
        statistics.nDems++
        break;
    case "I"
        statistics.nInds++
    }
    
})
    
//!! important: look on the "break" and "continue" features in a for loop
