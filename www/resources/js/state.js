var State = function() {
    var self = this;

    this.init = function() {

        
        
        $.each($('section[data-state]'), function(index, element){
            $(element).css('display', 'none');
        });

        //end init 
    }

    this.states = {
        login: {
            identifier: 'login',
            callback: {
                enter: function(){},
                leave: function(){}
            }
        },
        loggedin: {
            identifier: 'loggedin',
            callback: {
                enter: function(){},
                leave: function(){}
            }
        }
    };

    this.current = self.states.login;

    this.switch = function(state) {

        console.log('[state] Switch to ' + state.identifier);

        //Call leave-callback for state 
        self.current.callback.leave();

        //Switch the state  
        self.current = state; 

        //Undisplay and display 
        $('section[data-type="state"]').css('display', 'none');
        $('section[data-state="' + self.current.identifier + '"]').css('display', 'block'); 

        //Call enter-callback for state
        self.current.callback.enter();

    }

    

    //end State
}

var state = new State();

