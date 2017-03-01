var Tools = function() {
    var self = this;

    this.uuid = function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        //end tools.uuid 
    }

    //end Tools 
}

var tools = new Tools();