class data
{
    constructor()
    {
        this.kDefaultCountryIndex = 0;
        this.kDomain = 'http://localhost:8081/'
        //kDomain: 'https://tuticket.cl:8081/'
    }

    GetValue(value) 
    {
        return value == undefined ? undefined : value;
    }
};

export let common = new data();