var calendar = {};

// --- VARS ---- 
calendar.colors = {};
calendar.colors.today = '007272';

calendar.date = {};

calendar.d = moment();

calendar.date.currentSelectDate = null; 
calendar.date.selectObj = null; 

// --- VIEW ----
calendar.view = 'main'; //['main', 'create-event']


// --- COMMON FUNCS --- 
calendar.getMonthName = function(month) {  
    var names = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 
    'november', 'desember'];
    if (names[month] == undefined) return false;
    return names[month];
}

calendar.getDaysInMonth = function(d) {
    return new Date(d.getFullYear(), d.getMonth()+1, 0).getDate();

    //end .daysInMonth
}

calendar.setView = function(view) {

    $('section[data-view="' + calendar.view + '"]').css('display', 'none');
    calendar.view = view;
    $('section[data-view="' + calendar.view + '"]').css('display', 'block');

    //end .setView
}



//Calendar: Date
calendar.date.getRow = function() {
    return ('' +
    '<div>' +
        '<div class="rowContents row" style="display: block; width: 268px; margin: 0px auto 0px auto;">' +
        '</div>' +
    '</div>');
}

calendar.date.getBlock = function(i) {


    //Format: YYYY.MM.DD
    var fullDate = (calendar.d.year() + '.' + (calendar.d.month()+1) + '.' + i);

    //The data-fulldate (client) is in another format than server-event-human
    //Server-format: DD.MM.YYYY (LEADING-ZEROES)
    //fulldate-format: YYYY.MM.DD (NON-LEADING-ZEROES)
    //Create an alternative variable that is used for searching in the object...
    var searchYear = (calendar.d.year());
    var searchMonth = (calendar.d.month()+1); 
    var searchDate = (i);
    
    searchMonth = (searchMonth >= 10 ? searchMonth : '0' + searchMonth);
    searchDate = (searchDate >= 10 ? searchDate : '0' + searchDate);

    var searchDateStr = searchDate + '.' + searchMonth + '.' + searchYear;
    console.log('DEV: searchDateStr: ' + searchDateStr);

    dateHasEvents = (main.accountData.dataCalendar.eventsByDate[searchDateStr] != undefined);

    return '' +
    '<span class="calendarDateBlock" onclick="calendar.pickEvent(this);" data-fulldate="' + fullDate + '" data-year="' + calendar.d.year() + '" data-month="' + (calendar.d.month()+1) + '" data-date="' + i + '" data-hasEvents="' + (dateHasEvents ? 1 : 0) + '">' +
        i +
        (dateHasEvents ? '<div class="dateHasEvents"></div>' : '') +
    '</span>';

}

//Calendar: Event 
calendar.event = {};

calendar.event.getObject = function() {
    return ('' + 
    '<div class="panel panel-default calendarDateBlockItem">' +
        '<div class="row">' +
            '<div class="col-xs-8">' +
                '<h3>Coachella🎉☀️</h3>' +
                'Trip to the US and Coachella' +
            '</div>' +
            '<div class="col-xs-4 eventBudget">20 000,-</div>' +
            '</div>' +
        '</div>' +
    '</div>' +
    '');
}

calendar.previousMonth = function() {
    calendar.d.subtract(1, 'months');
    calendar.render();
}

calendar.nextMonth = function() {
    calendar.d.add(1, 'months');
    calendar.render();
}

calendar.pickEvent = function(sender) {

    var s = $(sender);

    if (calendar.date.selectObj != null) {

        //Is the date today? Set colors
        if ($(calendar.date.selectObj).attr('data-isToday') == 'yes') {
            $(calendar.date.selectObj).css('color', '#' + calendar.colors.today);
        }

        $(calendar.date.selectObj).attr('class', 'calendarDateBlock');
    }

    calendar.date.selectObj = s;
    $(calendar.date.selectObj).attr('class', 'calendarDateBlock calendarDateBlockSelect');

    //Calculate date selected
    calendar.date.currentSelectDate = moment(calendar.d.month() + "-" + $(s).attr('data-date') + "-" + calendar.d.year(), "MM-DD-YYYY");

    console.log('select date as moment: ' + calendar.date.currentSelectDate.toString());

    console.log('select date: ' + $(s).attr('data-date'));

    //Events processing 
    if ($(s).attr('data-hasEvents') == 1) {
        $('#calendarItemView').html(calendar.event.getObject());
    } else {
        $('#calendarItemView').html('');
    }

    //Additional styling 
    if ($(calendar.date.selectObj).attr('data-isToday') == 'yes') {
        $(calendar.date.selectObj).css('color', 'white');
    }

}

calendar.render = function() {

    var today = moment();
    var monthAndYearToday = (today.year() == calendar.d.year() && today.month() == calendar.d.month());

    $('#calendarView').html('');

    var days = calendar.getDaysInMonth(calendar.d.toDate());
    
    var calendarObj = $('<div></div>');
    var calendarRowObj = $(calendar.date.getRow());

    
    for (var i = 0; i < days; i++) {

        if (i % 7 == 0) {
            
            $(calendarRowObj).find('.rowContents').html(
                $(calendarRowObj).find('.rowContents').html()
            );

            $(calendarObj).append($(calendarRowObj).html());

            calendarRowObj = $(calendar.date.getRow());
        }

        var blockElem = $(calendar.date.getBlock(i+1));

        //PROCESS BLOCK ELEM.. Current date??
        if (monthAndYearToday && (i+1) == today.date()) {
            $(blockElem).attr('data-isToday', 'yes');
            $(blockElem).css('color', '#' + calendar.colors.today);
        }
    
        $(calendarRowObj).find('.rowContents').append(blockElem);




    }

    //Append latest row obj
    $(calendarRowObj).find('.rowContents').html(
        $(calendarRowObj).find('.rowContents').html()
    );

    $(calendarObj).append($(calendarRowObj).html());        

    $('#calendarView').html($(calendarObj).html());

    $('#calendarMonthTitle').html(calendar.getMonthName(calendar.d.month()) + ' - ' + calendar.d.year());

    //calendar.render
}

calendar.init = function() {

    calendar.setView('main');

    calendar.render();

    //Binds
    $('#btnCalendarCreateNew').off(); //Remove previous handlers

    $('#btnCalendarCreateNew').on('click', function(){

        calendar.setView('create-event');

        //Now at create-event view 
        //Empty fields 
        $('#calendarNewEventName').val('');
        $('#calendarNewEventDesc').val('');
        $('#calendarNewEventTarget').val('');
        

        //Set date in field to selected date... 
        //Set default currentSelectDate to TODAY
        if (calendar.date.currentSelectDate == null) {
            calendar.date.currentSelectDate = moment(calendar.d.month() + "-" + new Date().getDate() + "-" + calendar.d.year(), "MM-DD-YYYY");
            console.log('Set deault value for currentSelectDate: ' + calendar.date.currentSelectDate.toString());
        } 


        $('#calendarNewEventDate').val(calendar.newEvent.convertMomentToStr(calendar.date.currentSelectDate));

        $('#btnCalendarEventCreateSubmit').off(); //Remove previous handlers...
        $('#btnCalendarEventCreateSubmit').on('click', function(){

            //Convert input-date string to MOMENT
            var date = $('#calendarNewEventDate').val();
            var dateAsMoment = moment(date, "YYYY-MM-DD");

            //Export date format as: DD.MM.YYYY
            var year = dateAsMoment.year();
            var month = (dateAsMoment.month() +1); 
            var date = (dateAsMoment.date());

            month = (month >= 10 ? month : '0' + month);
            date = (date >= 10 ? date : '0' + date);

            //Rearrange to the format 
            var exportDate = date + '.' + month + '.' + year; 

            //Payload 
            var payload = {
                title: $('#calendarNewEventName').val(),
                desc: $('#calendarNewEventDesc').val(),
                sum: $('#calendarNewEventTarget').val(),
                date: exportDate
            };
            
            console.log('Event payload:');
            console.log(JSON.stringify(payload));

            //Send payload to server
            //--- Register new event server side --
            window.plugins.spinnerDialog.show();

            tools.request({
                url: config.endpoint + 'device/event/new',
                type: "POST",
                data: payload,
                    
            }, {
                requireToken: false
            }, function (data, headers) {
                window.plugins.spinnerDialog.hide();

                if (data.status == false) {
                    navigator.notification.alert('An error occured.', function(){
                    }, 'Error');
                    return;
                }

                //Success! ... 

                //Select the event on the main view
                calendar.setView('main'); 

                //Format: YYYY.MM.DD
                var fullDate = (dateAsMoment.year() + '.' + (dateAsMoment.month()+1) + '.' + dateAsMoment.date());
                calendar.pickEvent($('#calendarView').find('.calendarDateBlock[data-fulldate="' + fullDate + '"]'));
                console.log('Picking event... (' + fullDate + ')');
                
                main.accountData.freshData(data.client);
                
                //end event submit ok 
            }, function(errObj){
                window.plugins.spinnerDialog.hide();

                navigator.notification.alert('An error occured.', function(){
                }, 'Error');
                return;
            });

            //end create event submit 
        });
        


        //end createNew click
    }); 

    //calendar.init
}



calendar.newEvent = {};


calendar.newEvent.convertMomentToStr = function(m) {

    var year = m.year();
    var month = m.month();
    var date = m.date(); 

    //Increment month since start is at 0
    month += 2; //The object actually returned is two months behind the calculation.

    month = (Number(month) >= 10 ? month : '0' + month);
    date = (Number(date) >= 10 ? date : '0' + date);

    return year + '-' + month + '-' + date; 

    //end convertMomentToStr
}

