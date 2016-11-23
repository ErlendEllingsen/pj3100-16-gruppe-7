var Settings = function() {
    var self = this;

    this.name = 'DnB Smart';

    this.testPIN = '2580';

    this.functionRelease = {
        login: {
            pin: true,
            touchid: false
        }
    };    

    //end Settings 
}

var settings = new Settings();