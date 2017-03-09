var Main = function () {
    var self = this;


    //Tabbar and tabs
    this.tabbar = null;
    this.tab_home = null;
    this.tab_pages = null;
    this.tab_calendar = null;
    this.tab_event = null;

}

var main = new Main();

main.init = {};


main.init.detectStatus = function() {

    var deviceUuid = localStorage.getItem('pj3100_token');
    if (deviceUuid == undefined || deviceUuid == null) {
        main.init.newDevice();
        //end deviceUuid not set 
    } else {
        main.init.existingDevice(); 
        //end deviceUuid set
    }

}

main.init.existingDevice = function() {

    device.uuid = localStorage.getItem('pj3100_token');

    console.log('Device uuid is set to ' + device.uuid);

    //end Init.existingDevice
}

main.init.newDevice = function() {
    var uuid = tools.uuid();

    navigator.notification.prompt('Dev: token', function(input_token){

        navigator.notification.prompt('Dev: fornavn', function(input_firstName){
            
            navigator.notification.prompt('Dev: etternavn', function(input_lastName){

                //Set device vars.. 
                device.token = input_token.input1;
                device.nameFirst = input_firstName.input1;
                device.nameLast = input_lastName.input1;

                main.init.registerDevice();

                //end input-last name
            }, 'Setup');

            //end input-first name
        }, 'Setup');

        //end input-token
    }, 'Setup');

    //localStorage.setItem('pj3100_token', uuid);
    

    main.init.existingDevice(); //We can now load the device...
    //end Init.newDevice 
}

main.init.registerDevice = function() {

    tools.request({
        url: config.endpoint + 'device/register',
        type: "POST",
        data: {
            token: device.token,
            nameFirst: device.nameFirst,
            nameLast: device.nameLast
        },
			
    }, {
        requireToken: false
    }, function (data, headers) {
        alert(JSON.stringify(data));
    }, function(errObj){
        alert(JSON.stringify(errObj));
    });

    //end init.registerDevice 
}



main.setPage = function (page, callback) {

    $.get('./views/' + page + '.html', function (data) {
        console.log('[main] setPage to ' + page);
        $('section#loggedin-page').html(data);
        callback();
    });

    //end main.Setpage 
}


main.loggedIn = function () {

    main.init.detectStatus();


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
            selected: function () {
                main.setPage('main', main.loadedMethods.main);
            }
        }
    });

    main.tab_pages = main.tabbar.addTab('Sparing', '<i class="fa fa-bank"></i>', {
        events: {
            selected: function () {
                main.setPage('savings', main.loadedMethods.savings);
            }
        }
    });
    main.tab_calendar = main.tabbar.addTab('Kalender', '<i class="fa fa-calendar"></i>', {
        events: {
            selected: function () {
                main.setPage('calendar', main.loadedMethods.calendar);
            }
        }
    });
    main.tab_event = main.tabbar.addTab('Event', '<i class="fa fa-birthday-cake"></i>', {
        events: {
            selected: function () {
                main.setPage('event', main.loadedMethods.event);
            }
        }
    });

    //Render the tabbar.
    main.tabbar.render();

    //Set "home" as active.
    main.tabbar.selectTab(main.tab_home);
    main.setPage('main', main.loadedMethods.main);

    //Test circle 
    console.log('main.loggedIn');



    //end main.loggedIn
}

/**
 * PAGE LOADED METHODS 
 */

main.loadedMethods = {};
main.loadedMethods.main = function () {


    var myCircle = Circles.create({
        id: 'circle-daily-budget-remainder',
        radius: 60,
        value: 43,
        maxValue: 100,
        width: 10,
        text: function (value) {
            return '' +
                '<div class="circles-text-sum">5239,-</div>' +
                '<div class="circles-text-percentage">43%</div>';
        },
        colors: ['rgba(12, 96, 94, 1)', 'rgba(23, 177, 175, 1)'],
        duration: 400,
        wrpClass: 'circles-wrp',
        textClass: 'circles-text',
        valueStrokeClass: 'circles-valueStroke',
        maxValueStrokeClass: 'circles-maxValueStroke',
        styleWrapper: true,
        styleText: true
    });

    var ptr = new PullToReload({
        'loading-content': '<span style="font-size: 11px;"><i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i></span>',
        'callback-loading': function () {

            tools.request({
                url: config.endpoint + 'device/fetch'
            }, {
                requireToken: true
            }, function (data, headers) {

                

                setTimeout(function(){
                    ptr.loadingEnd();
                    main.accountData.freshData(data);
                }, 500);

                console.log(JSON.stringify(data));

            }, function (errObj) {
                
                setTimeout(function(){
                    ptr.loadingEnd();
                    
                }, 500);

                console.log(JSON.stringify(errObj));
            });



        }
    });

    //perform first loading
    tools.request({
            url: config.endpoint + 'device/fetch'
    }, {
        requireToken: true
    }, function (data, headers) {
        main.accountData.freshData(data);
    });


    //end loadedMethods.main
}


main.accountData = {
    data: null
};
main.accountData.freshData = function(data) {

    main.accountData.data = data;

    var ad = main.accountData;
    var add = ad.data; 

    //Calculate remainder for today.
    var spent = add.finance.transactions[add.currentDate].sum;
    var remainder = add.finance.budgets.daily - spent;
    var percentage = Math.floor((remainder / add.finance.budgets.daily) * 100); //Calculate

    //Calculate stuff
    var myCircle = Circles.create({
        id: 'circle-daily-budget-remainder',
        radius: 60,
        value: percentage,
        maxValue: 100,
        width: 10,
        text: function (value) {
            return '' +
                '<div class="circles-text-sum">' + remainder + ',-</div>' +
                '<div class="circles-text-percentage">' + percentage + '%</div>';
        },
        colors: ['rgba(12, 96, 94, 1)', 'rgba(23, 177, 175, 1)'],
        duration: 400,
        wrpClass: 'circles-wrp',
        textClass: 'circles-text',
        valueStrokeClass: 'circles-valueStroke',
        maxValueStrokeClass: 'circles-maxValueStroke',
        styleWrapper: true,
        styleText: true
    });

    //Adjust numbers
    $('#daily-budget').html(add.finance.budgets.daily + 'kr');
    $('#saldo').html(add.finance.accounts.default + 'kr');

    //end main.accountData.freshData
}



main.loadedMethods.savings = function () {



    //end loadedMethods.savings
}

main.loadedMethods.calendar = function () {



    //end loadedMethods.calendar
}

main.loadedMethods.event = function () {



    //end loadedMethods.event
}