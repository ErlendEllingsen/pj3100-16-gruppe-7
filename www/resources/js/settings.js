var Settings = function() {
    var self = this;

    this.name = 'DnB Smart';

    this.testPIN = '2580';

    this.functionRelease = {
        login: {
            pin: true,
            touchid: true
        }
    };    

    //App user settings

    

    this.user = {
        transferToAccount: 'Sparekonto'
    };

    this.getSettingProp = function(setting, defaultValue) {
        var item = localStorage.getItem(setting);
        if (item == null) return defaultValue;
        return item;
    }

    this.load = function() {
        self.user.transferToAccount = self.getSettingProp('app_setting_transferToAccount');
        //end settings.load
    }

    this.save = function() {
        localStorage.setItem('app_setting_transferToAccount', self.user.transferToAccount);
        //end settings.save
    }


    //end Settings 
}

var settings = new Settings();