var Init = function() {
    var self = this;

    this.init = function() {
    
        state.init();
        login.init();

        state.switch(state.states.login);

        //end Init.init
    }

    //end Init
}   


var init = new Init();

$(document).ready(function(){
    document.addEventListener("deviceready", init.init, false);
});