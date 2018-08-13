/*eslint-env browser*/
/*eslint "no-console": "off" */





var app = new Vue({
        el: '#vueApp',
        data: {
            members: [],
            allMembers: [],//backup array;will have the same content as "members", but it doesn't get played with
            states: [],
            
                    demNumber : 0,
                    repNumber : 0,
                    indNumber : 0,
                    percDemLoyalVotes : 0,
                    percRepLoyalVotes : 0,
                    percIndLoyalVotes : 0,
                    leastLoyalArray: [],
                    mostLoyalArray: [],
                    leastEngagedArray : [],
                    mostEngagedArray : [],
    
                
            showVue: false,
            templateRep : '<div>{{ message }}</div>'
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
                    var totalMembers;  //total number of reps/senators
                    console.log(app.allMembers);
                    totalMembers = obj.results[0].members;
                    app.allMembers = totalMembers;
                    console.log(app.allMembers)
                    app.getMembersStatistics(totalMembers);
                    // callin the function 3 times, to obtain the first table
//                    makeGlanceTable(statistics.repNumber, statistics.percRepLoyalVotes, "repRow")//i can set a string as paramether!!!
//                    makeGlanceTable(statistics.demNumber, statistics.percDemLoyalVotes, "demRow")
//                    makeGlanceTable(statistics.indNumber, statistics.percIndLoyalVotes, "indRow")
                    // a) I get an array with names, loyal vote % and number, party affiliation
                    var ratedArray = app.ratesToNames(totalMembers);
                    // b) I sort this array in a crescent order
                    var sortedArray = ratedArray.sort(app.sortNumber);
                    // c) I get the 10% of that sorted array
                    var tenPerc = app.getTenPerc(sortedArray);
                    // d) I get the first 10% of the sorted array (i.e. the least loyal) and the last 10% of the same array (i.e. the most loyal)
                    var wholeLeastLoyal = app.getLowestTenPerc(sortedArray, tenPerc);
                    var wholeMostLoyal = app.getHighestTenPerc(sortedArray, tenPerc);
                    // e) I want to sort the most loyal in a decreasing order:
                    var sortedMostLoyal = app.decreasingOrder(wholeMostLoyal);
                    app.storeLoyals(wholeLeastLoyal, sortedMostLoyal);
                    //now to sort the array in an increasing order:
                    var missedVotesArray = app.missedVotesToNames(totalMembers);
                    // now I have the least engaged sorted in a decreasing order   
                    var sortedMissedArray = missedVotesArray.sort(app.sortNumber)
                    var leastEngaged = app.getHighestTenPerc(sortedMissedArray, tenPerc);
                    app.missedVotesToNames(totalMembers)    
                    var sortedLeastEngaged = app.decreasingOrder(leastEngaged);   
                    // now the most engaged (the first 10% of the array)
                    var mostEngaged = app.getLowestTenPerc(sortedMissedArray, tenPerc);
                    app.storeEngaged(sortedLeastEngaged, mostEngaged);
//                    buildTables()
                    console.log(ratedArray);
                    })
            },

            
            show: function () {//this was just a test; I deleted the variable "isVisible"
                console.log("show")
                this.isVisible =!this.isVisible
            },
            

            getMembersStatistics : function(totalMembers) {
                var demArray =[];
                var repArray =[];
                var indArray =[];
                
                //this loop makes 3 array based on party
                for (var i = 0; i < totalMembers.length; i++){ 
                    if (totalMembers[i].party == "D"){
                        demArray.push(totalMembers[i]);
                        app.demNumber++
                    }
                    if (totalMembers[i].party == "R") {
                        repArray.push(totalMembers[i]);
                        app.repNumber++
                    }
                    if (totalMembers[i].party == "I") {
                        indArray.push(totalMembers[i]);
                        app.indNumber++
                    }
                }
                  //NOW: get the least loyal and most loyal DIVIDED PER PARTY
                //these 3 are arrays, with rates connected to names
                var nameRatesDem = app.ratesToNames(demArray);
                var nameRatesRep = app.ratesToNames(repArray);
                var nameRatesInd = app.ratesToNames(indArray);
                var sortedDem = nameRatesDem.sort(app.sortNumber);
                var sortedRep = nameRatesRep.sort(app.sortNumber);
                var sortedInd = nameRatesInd.sort(app.sortNumber);

                // now get the 10% of the 3 sorted arrays;
                var tenPercDem = app.getTenPerc(sortedDem);
                var tenPercRep = app.getTenPerc(sortedRep);
                var tenPercInd = app.getTenPerc(sortedInd);
                //the following get the lowest 10% out of each of the 3 arrays


                // the following 3 arrays store the % of votes with party; useful to calculate the loyalty 
            //    var percDem =[];
            //    var percRep = [];
            //    var percInd = [];
                var avgLoyalty = 0;
                console.log("here the demArray:")
                console.log(demArray)
                console.log(indArray);

                avgLoyalty = app.getLoyalVotes(demArray)
                console.log("avgLoyalty dem")
                console.log(avgLoyalty)
                app.percDemLoyalVotes = avgLoyalty
                avgLoyalty = app.getLoyalVotes(repArray);
                app.percRepLoyalVotes = avgLoyalty;
                avgLoyalty = app.getLoyalVotes(indArray);
                app.percIndLoyalVotes = avgLoyalty;

                app.getLowestTenPerc(sortedDem, tenPercDem)
                app.getLowestTenPerc(sortedRep, tenPercRep)
                app.getLowestTenPerc(sortedInd, tenPercInd)
                // it works
            },


            getLoyalVotes: function (array) {
                var sumVotes = 0;
                var percArray = []
                array.forEach(function(member){
                    sumVotes = sumVotes + parseFloat(member.votes_with_party_pct)//because in the house JSON data the value of "votes_with_party_pct" is a string
                    percArray.push(member.votes_with_party_pct);
                })
                var avgLoyalty = Math.round(sumVotes/array.length);
                if (array.length == 0){
                    avgLoyalty = "-"
                    return avgLoyalty
                }
                else {return avgLoyalty+"%"}
            },




            // this function connects NAMES (of the whole group) with : a) total votes with party b) % of votes with party c) party affiliation
            //MAKE AN OBJECT OUT OF IT
            ratesToNames: function(array) {
                console.log(array);
                var namesAndRates = [];
                array.forEach(function(member){
                    var obj ={}
                    obj["first_name"] = member.first_name;
                    obj["last_name"] = member.last_name;
                    if(member.middle_name){
                        obj["middle_name"] = member.middle_name;
                    }
                    obj["party"] = member.party;
                    obj["url"] = member.url;
                    obj["totalMissed"] = member.missed_votes;
                    obj["percMissed"]= member.missed_votes_pct;
                    obj["percVotesWithParty"] = member.votes_with_party_pct;
                    obj["totalVotesWithParty"] = Math.round((member.votes_with_party_pct*member.total_votes))/100;
                    // I exclude members whose total votes are 0 and not Independent
                    if (member.total_votes != 0 || member.party == "I"){  
                        namesAndRates.push(obj)
                      }

               })
                console.log(namesAndRates);
                return namesAndRates;
            },




            // this funtion sort the integers in an array in an increasing order
            sortNumber: function (a, b) {
                return a[3] - b[3]; //here I'm using an index  "3" because I'm working with the value corresponding to index "3" of the arrays forming the elements of the sorted array 
            },
            //this function gets the 10% of the length of an array
            getTenPerc: function(array){
                var tenPerc = Math.round((10*array.length)/100)
                return tenPerc;
            },

            // this function gets the lowest 10% of the array; paramether "perc" is to be tenPercDem, tenPercRep, tenPercInd
            getLowestTenPerc: function (array, perc) {
                var lowestTenPerc =[];
                array.some(function(member, index){ // the method ".some" breaks when the callback returns "true"
                          lowestTenPerc.push(member);
                          return index == perc-1 //here it returns true; the loop stops
                })
                return lowestTenPerc //it's an array!
            },

            getHighestTenPerc: function(array, perc) {
                var highestTenPerc = [];
                array.forEach(function(member, index){
                    var length = array.length ;
                    if (index >= length-perc){
                        highestTenPerc.push(member)
                    }
                })
                return highestTenPerc;
            },



            //the following gets the overall 10% that voted least loyal to their parties



            //this function puts the least loyal and most loyal arrays in their respective keys of the objcet "statistics"
            storeLoyals: function (array1, array2){
                array1.forEach(function(member1){
                app.leastLoyalArray.push(member1)
                })
                array2.forEach(function(member2){    
                app.mostLoyalArray.push(member2);    
                })
            },


            // NOW to get the number of missed votes and the % of missed votes per member
            // I start getting a whole array with : names, party affiliation, total missed votes, % of missed votes
            missedVotesToNames: function(array) {
                var namesAndVotes =[];
                array.forEach(function(member){
                    var name = member.last_name + "," + " " + member.first_name
                    var partyId = member.party;
                    var totalMissed = member.missed_votes;
                    var percMissed= member.missed_votes_pct;
                    namesAndVotes.push([name, partyId, totalMissed, percMissed ]);
                    })
                    return namesAndVotes;
            },



            // i want to sort the least engaged in a decreasing order; write a function for this
            decreasingOrder: function (array){
            array.sort(function(a, b)
                       {
                        return b[3] - a[3];
                       });

                return array
            },



            //now to store the 2 arrays least and most engaged in "data"
            storeEngaged: function(array1, array2) {
                array1.forEach(function(member1){
                    app.leastEngagedArray.push(member1);
                })


                array2.forEach(function(member2){
                    app.mostEngagedArray.push(member2);
                })
                console.log (array2)
                console.log(app.mostEngagedArray);

            },
        //methods end    
        }
})
        /*computed:{} i use this when i want something to load on changes; when something happens on the page, the code here doesn't need to be called (like for "methods"), it'll start; for example, useful for filters where we write something
        */




            // now to create the first simple table, common to the 2 pages
            //this function makes the table
//            function makeGlanceTable(num, perc, partyRow) {
//                var row = document.getElementById(partyRow);
//                for(var i = 0; i < 1; i ++){
//                var dataNum = document.createElement("TD");
//                dataNum.innerHTML = num; 
//                row.append(dataNum)
//                var dataPerc = document.createElement("TD")
//                dataPerc.innerHTML = perc
//                row.append(dataPerc) 
//                }
//            }

            //now the least loyal and most loyal table
//            function makeTable(mainArray, tableId){ // I can try to use a forEach instead
//                for (var k = 0; k < mainArray.length; k++){ 
//                    var table = document.getElementById(tableId);
//                    var row = document.createElement("TR");
//                    table.append(row);
//                    for(var i = 0; i < 4; i ++){
//                        var data = document.createElement("TD");
//                        data.innerHTML = mainArray[k][i];
//                        row.append(data)
//                    }
//                }
//            }

//            buildTables(){ // need an if condtion otherwise the HTML will look for 2 lines, then the next HTML for 2 lines NOT EXISTING in its code
//                if(document.getElementById("least_loyal_table") == null){
//
//                // calls the function to make the 2 tables in the 2 different pages
//                makeTable(statistics.leastEngagedArray, "least_engaged_table");
//                makeTable(statistics.mostEngagedArray, "most_engaged_table");
//
//                }else{
//
//                makeTable(statistics.leastLoyalArray, "least_loyal_table");
//                makeTable(statistics.mostLoyalArray, "most_loyal_table");
//                }
//            }

   
