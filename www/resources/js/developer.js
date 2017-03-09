var developer = {}; 


developer.clearCache = function() {

    //Remove items
    if (localStorage.getItem('pj3100_token') != undefined) localStorage.removeItem('pj3100_token'); //keys: token, name_first, name_last
    if (localStorage.getItem('pj3100_name_first') != undefined) localStorage.removeItem('pj3100_name_first');
    if (localStorage.getItem('pj3100_name_last') != undefined) localStorage.removeItem('pj3100_name_last');

    navigator.notification.alert('Cache is cleared!', function(){}, 'Info');

    //end developer.clearCache 
}