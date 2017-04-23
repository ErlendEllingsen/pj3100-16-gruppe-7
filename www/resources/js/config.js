var config = {
    devmode: true,
    token: '',
    endpoint: 'https://dnbsmart.jungleflake.com/api/'
};

if (config.devmode) config.endpoint = 'http://localhost:8080/api/';
