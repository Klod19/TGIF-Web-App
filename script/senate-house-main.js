/*eslint-env browser*/
/*eslint "no-console": "off" */

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
                    app.members = obj.results[0].members; // so i get the array "members" from the JSON url
                    app.allMembers = app.members; // here is set the content of "allMembers" to the one of "members"
                    app.members.forEach(function(member){ //I fill the "state" array
                        if(!app.states.includes(member.state)){
                        app.states.push(member.state)
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
                this.isVisible =!this.isVisible
            },
        

            filter : function(){
                //EACH TIME the function is called, I set array "members" back to its initial value, stored in "allMembers"; useful to work on the starting content each time the function is called
                app.members = app.allMembers; 
                
                
                //the following returns the value of the checkbox in an ARRAY; is an ARRAY!!! 
                //a) $ gets(jQuery) the input with name=party (see HTML) and that is checked;
                //b) array.map(function(){ code }) transforms the array in anythying we write between brackets; here we            transform this to the value of the input we "called" (this.value) --> see HTML for the value
                //c) we apply .get() to all this, to transform the "semi-array" from jQuery to a proper Array
                
                var checkboxChecked = $("input[name=party]:checked").map(function(){
                    return this.value;
                }).get(); 
                
                
                
                // the following function returns booleans
                //a) array.filter(function(paramether){ code }) filters the array: it will return ONLY what is stated in the code; 
                //b) filter1 is true if the checkbox array includes the value stored in guy.party(i.e. "D","R", or "I") OR if array checkboxChecked has no elements (lenght == 0) i.e. no boxes are checked
                //c) filter2 : $("stateSelector) gets an array with the element "stateSelector" (see HTML); .val() gets the value of this element ( .val() is a jQuery method, like .value() ); it fives the value of the stateSelector, and if it's equal to guy.state it returns true --> will show memebers with THAT state;
                //d) filter2 returns true if the value of stateSelector is "all" --> so we see everything with "-All-" selected
                var filteredMembers = app.members.filter(function(member){
                    var filter1 = checkboxChecked.includes(member.party) || checkboxChecked.length == 0;
                    var filter2 = $("#stateSelector").val() == member.state || $("#stateSelector").val() == "all";
                    
                    return filter1 && filter2;
                }) 
                //let's make the members array EQUAL to the filtered array
                app.members = filteredMembers;
        
        }
    
            
        
     },
        /*computed:{} i use this when i want something to load on changes; when something happens on the page, the code here doesn't need to be called (like for "methods"), it'll start; for example, useful for filters where we write something
        */

})
    



