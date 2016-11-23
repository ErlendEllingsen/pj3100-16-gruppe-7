var Login = function() {
    var self = this;

    this.initTouchId = function() {
        window.plugins.touchid.isAvailable(
            function() {

                window.plugins.touchid.verifyFingerprint(
                    'Scan your fingerprint please', // this will be shown in the native scanner popup
                    function(msg) {
                        alert('ok: ' + msg)
                    }, // success handler: fingerprint accepted
                    function(msg) {
                        alert('not ok: ' + JSON.stringify(msg))
                    } // error handler with errorcode and localised reason
                );

                //alert('available!');
            }, // success handler: TouchID available
            function(msg) {
                console.log('touch-id not available, message: ' + msg);
                self.initPin();
            } // error handler: no TouchID available
        );

        //end initTouchId
    }

    this.initPin = function() {
        self.displayPIN();
    }

    this.init = function() {
        
        if (settings.functionRelease.login.touchid) {
            this.initTouchId();
        } else if (settings.functionRelease.login.pin) {
            this.initPin();
        }
        

        
    }

    /**
     * PIN-CODE 
     */

    this.pin = {
        entry: '',
        update: function() {

            self.pin.entry = $('#fieldInput').val();
            
            //If above 4, re-set
            if (self.pin.entry.length >= 4) {
                self.pin.entry = '';
                $('#fieldInput').val('');
            }

            //Visualize inputed entries..
            $('div[data-type="entry-digit"]').html('-');
            
            for (var i = 0; i < self.pin.entry.length; i++) {
                $('div[data-type="entry-digit"][data-digit="' + (i+1) + '"]').html('*');
            }

            console.log($('#fieldInput').val());

            //end Login.pin.update
        }
    };

    this.status = {};

    this.status.success = function() {

    }

    this.status.failure = function() {

    }

    this.displayPIN = function() {

        
        $('#fieldInput').focus();
        
        



        //end Login.displayPIN
    }

    this.hidePIN = function() {



        //end Login.hidePIN
    }

    //end Login
}

var login = new Login();