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
                    perDemMissed: 0,
                    percRepMissed: 0,
                    percIndMissed : 0,
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
                    })
            },

            
            show: function () {//this was just a test; I deleted the variable "isVisible"
                console.log("show")
                this.isVisible =!this.isVisible
            },
            

            getMembersStatistics : function(totalMembers) {
                var demMissed = 0;
                var repMissed = 0;
                var indMissed = 0;
                var totalMissed = 0;
                var demArray=[];
                var repArray=[];
                var indArray=[];
                //this loop makes 3 arrays based on party AND updates the counter
                totalMembers.forEach(function(member){
                    if(member.party == "D"){
                        app.demNumber++
                        demMissed = demMissed + parseFloat(member.missed_votes);
                    }
                    if(member.party == "R"){
                        app.repNumber++
                        repMissed = repMissed + parseFloat(member.missed_votes);
                    }
                    if(member.party == "I"){
                        app.indNumber++
                        indMissed = indMissed + parseFloat(member.missed_votes);
                    }
                    totalMissed = totalMissed + parseFloat(member.missed_votes);
                    
                })
                            
//                console.log("demMissed: " + demMissed);            
//                console.log("repMissed: " + repMissed);            
//                console.log("indMissed: " + indMissed);            
//                console.log("totalMissed: " + totalMissed);
//                var percDem = app.get_percent(demMissed, totalMissed);
//                console.log(percDem);
//                var percRep = app.get_percent(repMissed, totalMissed);
//                console.log(percRep);
                app.percDemMissed = app.get_percent(demMissed, totalMissed);
                app.percRepMissed = app.get_percent(repMissed, totalMissed);
                app.percIndMissed = app.get_percent(indMissed, totalMissed);
                console.log(app.percDemMissed);
                
                

                
                //the following gets the % loyalty and 
//                avgLoyalty = app.getLoyalVotes(demArray)
//                console.log("avgLoyalty dem")
//                console.log(avgLoyalty)
//                app.percDemLoyalVotes = avgLoyalty
//                avgLoyalty = app.getLoyalVotes(repArray);
//                app.percRepLoyalVotes = avgLoyalty;
//                avgLoyalty = app.getLoyalVotes(indArray);
//                app.percIndLoyalVotes = avgLoyalty;
                
                
                  //NOW: get the least and most loyal : work on "test", a modified version of the original data
                //these 3 are arrays, with rates connected to names
                var all_members = app.ratesToNames(totalMembers)
                console.log(all_members);
                
                var sorted_engaged = all_members.sort(function(a, b) { 
                    return parseFloat(a.missed_votes) - parseFloat(b.missed_votes);
                })
                
                console.log(sorted_engaged)
                // NOW I JUST GET THE FIRST 10% and LAST 10% out of sorted_test
                var perc = app.getTenPerc(sorted_engaged)
                console.log(perc);
                var most_engaged = app.getLowestTenPerc(sorted_engaged, perc);
//                most_engaged.map((m) => console.log(m.last_name + " " + m.missed_votes))

                
                var least_engaged = app.getHighestTenPerc(sorted_engaged, perc);
//                least_engaged.reverse().map((m) => console.log(m.last_name + " " + m.missed_votes))
               
                var sorted_loyal = all_members.sort(function(a, b){
                    return parseFloat(a.votes_with_party_pct) - parseFloat(b.votes_with_party_pct);
                })
                
                console.log("10 % LEAST LOYAL:")
                console.log(app.getLowestTenPerc(sorted_loyal, perc));
                var least_loyal = app.getLowestTenPerc(sorted_loyal, perc)
//                least_loyal.map(m => console.log(sorted_loyal.indexOf(m) +" " +m.last_name + " " + m.votes_with_party_pct));
                console.log(least_loyal.length);
                
                console.log("10% most loyal")
                var most_loyal = app.getHighestTenPerc(sorted_loyal, perc);
//                most_loyal.reverse().map(m => console.log(sorted_loyal.indexOf(m) + " " +m.last_name+" "+m.votes_with_party_pct));
                console.log(most_loyal.length);
                
                
            
            },


            
            //Change the following, for it to process the array obtained with getData
            ratesToNames: function(array) {
                console.log(array);
                array.forEach(function(member){
                    member["totalVotesWithParty"] = Math.round((member.votes_with_party_pct*member.total_votes))/100;
                    // I exclude members whose total votes are 0 and not Independent
                    if (member.total_votes == 0 && member.party != "I"){  
                        var index = array.indexOf(member)
                        array.splice(index, 1);
                      }
               })
                return array;
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
                else {
                    console.log("AVG LOYALTY: " + avgLoyalty);
                    return avgLoyalty+"%"
                }
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

            // i want to sort the least engaged in a decreasing order; write a function for this
            decreasingOrder: function (array){
                array.sort(function(a, b)
                       {
                        return b[3] - a[3];
                       });

                return array
            },
            
            get_percent: function (quantity, total){
                var result = (quantity * 100)/total
                return result.toFixed(2) + "%"
            
            },

        //methods end    
        }
})
        /*computed:{} i use this when i want something to load on changes; when something happens on the page, the code here doesn't need to be called (like for "methods"), it'll start; for example, useful for filters where we write something
        */



var cars = [

                    {
                        name: "Honda",
                        speed: 80
                    },

                    {
                        name: "BMW",
                        speed: 180
                    },

                    {
                        name: "Trabi",
                        speed: 40
                    },

                    {
                        name: "Ferrari",
                        speed: 200
                    }
                ]


                cars.sort(function(a, b) { 
                    return a.speed - b.speed;
                })

                for(var i in cars)
                    console.log(cars[i].name) // Trabi Honda BMW Ferrari 
