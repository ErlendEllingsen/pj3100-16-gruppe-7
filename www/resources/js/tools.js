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

    this.request = function() {

        $.ajax({
            
        });

        //end tools.request 
    }

    //end Tools 
}

var tools = new Tools();


tools.requireToken = function(connectionObject, status, successCallback, errorCallback) {

    console.log("requireToken called");

    tools.request({
      url: config.endpoint + "device/init",
  	  data: null,
      type: 'GET'
    }, {

    }, function(data, headers){

        config.token = data.uuid;

        //Do the original request
        if (connectionObject === false) {
          successCallback();
        } else {
          status.requireToken = false;
          tools.request(connectionObject, status, successCallback, errorCallback);  
        } 
        


    }, function(errorObj) {
      errorCallback(errorObj);
    });

    //end tools.requireToken
}


tools.request = function(connectionObject, status, successCallback, errorCallback) {
    
    var requestObject = {
      url: connectionObject.url,
      type: connectionObject.type,
      success: function(data, headers) {

        //Check for missing token

        var checkToken = (data.status == false || data.status == 'false') && data.msg == 'invalid uuid';

        if (status.requireToken != undefined && status.requireToken == true && checkToken) {
          tools.requireToken(connectionObject, status, successCallback, errorCallback);
          return;
        }

        //Check for token
        successCallback(data, headers);

      },
      error: function(errorObj) {
        errorCallback(errorObj);
      }
    };

    //APPLY HEADER
    if (config.token != null) {
        requestObject.headers = {
            'dnbsmart-uuid': config.token
        };
    }

    //Check for POST
    if (connectionObject.type == 'POST') requestObject.data = connectionObject.data;

    //Do the request itself
    $.ajax(requestObject);




    //end tools.request
  }
