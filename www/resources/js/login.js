var Login = function() {
    var self = this;

    this.initTouchId = function() {
        window.plugins.touchid.isAvailable(
            function() {

                window.plugins.touchid.verifyFingerprint(
                    'Lås opp ' + settings.name, // this will be shown in the native scanner popup
                    function(msg) {
                        //alert('ok: ' + msg)

                        self.status.success();
                        console.log('touchid: ok: ' + msg);

                    }, // success handler: fingerprint accepted
                    function(msg) {

                        //Error occured, fall back to PIN.
                        self.initPin();

                        console.log('touchid: not ok: ' + JSON.stringify(msg))
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
                //TODO: SUBMIT HERE... 
                var validationResult = self.pin.validate(self.pin.entry);
                if (validationResult) {
                    self.status.success();
                    return;
                }

                //Vibrate - signal to the user that the code is invaid..
                navigator.vibrate(1500);

                self.pin.entry = '';
                $('#fieldInput').val('');
            }

            //Visualize inputed entries..
            //Visualise every as dash (not filled)
            $('div[data-type="entry-digit"]').html('' + 
                '<i style="font-size: 25px;" class="fa fa-minus"></i>'
            );
            
            //Visualize as cirlces (filled)
            for (var i = 0; i < self.pin.entry.length; i++) {
                $('div[data-type="entry-digit"][data-digit="' + (i+1) + '"]').html('' +
                '<i style="font-size: 25px;" class="fa fa-circle"></i>'
                );
            }

            console.log($('#fieldInput').val());

            //end Login.pin.update
        },
        lost: function() {

            //Match state
            if (state.current != state.states.login) return;

            console.log('pin was lost');
            setTimeout(function(){
                self.displayPIN();
            }, 500);
        },
        validate: function(code) {

            //Check code towards test settings PIN 
            if (code != settings.testPIN) {
                $('section[data-type="state"][data-state="login"]')
                    .find('div[data-type="entry-error"]')
                    .css('display', 'block');

                return false;
            }

            
            return true;

            //end login.pin.validate
        }
    };

    this.status = {};

    this.status.success = function() {

        //Unblur the field 
        $('#fieldInput').blur();

        //Switch state 
        state.switch(state.states.loggedin);

        //Add tab bar 
        //Initialize the tabbar
        main.tabbar = new AppTabBar.Tabbar('tab_bar', {
            color: '#000', 
			background_color: '#FFF',
            font_size: '14px',
            tab_selected_style: {
                color: '#0C605E', 
			    background_color: '#FFF',
            }
        });
        main.tabbar.init();

        //Add tabs
        main.tab_home = main.tabbar.addTab('Oversikt', '<i class="fa fa-bar-chart"></i>', {
            events: {
                selected: function(){
                    
                }
            }
        });

        main.tab_pages = main.tabbar.addTab('Sparing', '<i class="fa fa-bank"></i>');
        main.tab_calendar = main.tabbar.addTab('Kalender', '<i class="fa fa-calendar"></i>');
        main.tab_event = main.tabbar.addTab('Event', '<i class="fa fa-birthday-cake"></i>');


        //Render the tabbar.
        main.tabbar.render();

        //Test circle 
        $.get('./views/main.html', function(data){

            $('section#loggedin-page').html(data);

            var myCircle = Circles.create({
                id:                  'circle-daily-budget-remainder',
                radius:              60,
                value:               43,
                maxValue:            100,
                width:               10,
                text:                function(value){
                    return '<strong>' + value + '%</strong><br>test';
                },
                colors:              ['rgba(12, 96, 94, 0.4)', '#0C605E'],
                duration:            400,
                wrpClass:            'circles-wrp',
                textClass:           'circles-text',
                valueStrokeClass:    'circles-valueStroke',
                maxValueStrokeClass: 'circles-maxValueStroke',
                styleWrapper:        true,
                styleText:           false
            });

            //end get views/main
        });

        

        //Set "home" as active.
        main.tabbar.selectTab(tab_home);

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