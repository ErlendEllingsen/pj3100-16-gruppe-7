var State = function() {
    var self = this;

    this.init = function() {

        
        
        $.each($('section[data-state]'), function(index, element){
            $(element).attr('class', 'display');
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

    this.switch = function(state) {

        //Call leave-callback for state 
        self.current.callback.leave();

        //Switch the state  
        self.current = state; 

        //Undisplay and display 
        $('secton[data-type="state"]').css('display', 'none');
        $('secton[data-state="' + self.current.identifier + '"]').css('display', 'block'); 

        //Call enter-callback for state
        self.current.callback.enter();

    }

    this.current = self.states.login;

    //end State
}

var state = new State();

