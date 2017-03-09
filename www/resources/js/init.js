var Init = function() {
    var self = this;

    this.init = function() {
    
        


        
       

        //SET STATES ETC 
        state.init();
        state.switch(state.states.login);
        login.init();

        //end Init.init
    }

    

    //end Init
}   


var init = new Init();

$(document).ready(function(){
    document.addEventListener("deviceready", init.init, false);
});