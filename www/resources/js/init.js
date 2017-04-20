var Init = function() {
    var self = this;

    this.init = function() {
    
        

        FastClick.attach(document.body);
        
       

        //SET STATES ETC 
        state.init();
        state.switch(state.states.login);
        

        if (config.devmode) {
            console.log('devmode: logging in...');
            login.status.success(); //Auto-login
        } else if (config.devmode == false) { 
            login.init();
        }

        //end Init.init
    }

    

    //end Init
}   


var init = new Init();

$(document).ready(function(){
    document.addEventListener("deviceready", init.init, false);
});