var Init = function() {
    var self = this;

    this.init = function() {
    
        state.init();
        state.switch(state.states.login);
        login.init();


        var deviceUuid = localStorage.getItem('dnbsmart_device_uuid');
        if (deviceUuid == undefined || deviceUuid == null) {
            self.newDevice();
            //end deviceUuid not set 
        } else {
            self.existingDevice(); 
            //end deviceUuid set
        }
       

        

        //end Init.init
    }

    this.existingDevice = function() {

        device.uuid = localStorage.getItem('dnbsmart_device_uuid');

        console.log('Device uuid is set to ' + device.uuid);

        //end Init.existingDevice
    }

    this.newDevice = function() {
        var uuid = tools.uuid();
        localStorage.setItem('dnbsmart_device_uuid', uuid);

        self.existingDevice(); //We can now load the device...
        //end Init.newDevice 
    }

    //end Init
}   


var init = new Init();

$(document).ready(function(){
    document.addEventListener("deviceready", init.init, false);
});