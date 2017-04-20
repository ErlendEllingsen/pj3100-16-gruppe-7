var calendar = {};

calendar.colors = {};
calendar.colors.today = '007272';

//Calendar: Date

calendar.date = {};

calendar.d = moment();

calendar.date.selectObj = null; 

calendar.date.getRow = function() {
    return ('' +
    '<div>' +
        '<div class="rowContents row" style="display: block; width: 268px; margin: 0px auto 0px auto;">' +
        '</div>' +
    '</div>');
}

calendar.date.getBlock = function(i) {
    
    var dateHasEvents = (Math.random() >= 0.85); 

    return '' +
    '<span class="calendarDateBlock" onclick="calendar.pickEvent(this);" data-date="' + i + '" data-hasEvents="' + (dateHasEvents ? 1 : 0) + '">' +
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
                '<h3>Hyttetur med GuTTTAAA</h3>' +
                'Lorem ipsum dolor sit amet' +
            '</div>' +
            '<div class="col-xs-4 eventBudget">34 000,-</div>' +
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
    calendar.render();
    //calendar.init
}

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