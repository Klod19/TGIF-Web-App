/*eslint-env browser*/
/*eslint "no-console": "off" */





var app = new Vue({
        el: '#vueApp',
        data: {
            allMembers: [],//backup array;will have the same content as "members", but it doesn't get played with
            
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
                    totalMembers = obj.results[0].members;
                    app.allMembers = totalMembers;
                    app.get_glance_tables(totalMembers);
                    app.get_engaged_loyal(totalMembers);
                    if (app.allMembers.length > 0){
                        app.showVue = true;
                    }
                })
            },

            
            show: function () {//this was just a test; I deleted the variable "isVisible"
                console.log("show")
                this.isVisible =!this.isVisible
            },
            
            
            get_glance_tables : function(array) {
                var all_members = app.ratesToNames(array)
                //missed votes per party, and the total of missed votes
                var demMissed = 0;
                var repMissed = 0;
                var indMissed = 0;
                var totalMissed = 0;
                
                //following: the loyal votes, divided per party
                var demLoyal = 0;
                var demTotal =0;
                var repLoyal = 0;
                
                //the following are the sums of the numbers of votes done by each party;
                //useful to calculate the party loyalty
                var repTotal = 0;
                var indLoyal = 0;
                var indTotal = 0;
                
                all_members.forEach(function(member){
                    if(member.totalVotesWithParty === undefined){
                        console.log("UNDEFINED VOTES WITH PARTY!")
                        console.log(member);
                    }
                    
                    if(member.party == "D"){
                        app.demNumber++
                        demMissed = demMissed + parseFloat(member.missed_votes);
                        demLoyal = demLoyal + member.totalVotesWithParty;
                        demTotal = demTotal + parseFloat(member.total_votes);
                    }
                    if(member.party == "R"){
                        app.repNumber++
                        repMissed = repMissed + parseFloat(member.missed_votes);
                        repLoyal = repLoyal + member.totalVotesWithParty;
                        repTotal = repTotal + parseFloat(member.total_votes);

                    }
                    if(member.party == "I"){
                        app.indNumber++
                        indMissed = indMissed + parseFloat(member.missed_votes);
                        indLoyal = indLoyal + member.totalVotesWithParty;
                        indTotal = indTotal + parseFloat(member.total_votes);

                    }
                    totalMissed = totalMissed + parseFloat(member.missed_votes);
                })

                
                //ENGAGEMENT ON THE GLANCE TABLE
                app.percDemMissed = app.get_percent(demMissed, totalMissed);
                app.percRepMissed = app.get_percent(repMissed, totalMissed);
                app.percIndMissed = app.get_percent(indMissed, totalMissed);
                
                //LOYALTY ON THE GLANCE TABLE
                app.percDemLoyalVotes = app.get_percent(demLoyal, demTotal);
                app.percRepLoyalVotes = app.get_percent(repLoyal, repTotal);
                app.percIndLoyalVotes = app.get_percent(indLoyal, indTotal);
                
            },
            
            get_engaged_loyal: function (array) {
                //get rid of the guys with 0 total votes
                var no_zero_votes = array.filter(m => m.total_votes != "0");
                //NOW: TABLES (ENGAGED AND LOYAL)
                
                //ENGAGED
                var sorted_engaged = no_zero_votes.sort(function(a, b) { 
                    return parseFloat(a.missed_votes) - parseFloat(b.missed_votes);
                })
                //perc is OK also with loyalty
                var perc = app.getTenPerc(sorted_engaged)
                
                app.mostEngagedArray = app.getLowestTenPerc(sorted_engaged, perc);
                
                app.leastEngagedArray = app.getHighestTenPerc(sorted_engaged, perc).reverse();
                
                //LOYAL
                var sorted_loyal = no_zero_votes.sort(function(a, b){
                    return parseFloat(a.votes_with_party_pct) - parseFloat(b.votes_with_party_pct);
                })
                
                app.leastLoyalArray = app.getLowestTenPerc(sorted_loyal, perc)
                
                app.mostLoyalArray = app.getHighestTenPerc(sorted_loyal, perc).reverse();     
            },

            
            // the following to processes the array obtained with getData, adding the total of loyal votes
            // to each Object "member"
            ratesToNames: function(array) {
                array.forEach(function(member){
                    var party_votes = parseFloat(member.votes_with_party_pct);
                    var total_votes = parseFloat(member.total_votes);
                    member["totalVotesWithParty"] = Math.round((party_votes*total_votes)/100);
               })
                return array;
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
                if (quantity == 0 || total == 0){
                    return "-"
                }
                var result = (quantity * 100)/total
                return result.toFixed(2) + "%"
            
            },

        //methods end    
        }
})
        /*computed:{} i use this when i want something to load on changes; when something happens on the page, the code here doesn't need to be called (like for "methods"), it'll start; for example, useful for filters where we write something
        */

