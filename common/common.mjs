class data
{
    constructor()
    {
        this.kDefaultCountryIndex = 0;
        this.kDomain = 'http://localhost:8081/';
        //kDomain: 'https://tuticket.cl:8081/'
        this.kUserRole = 0;
        this.kOrganizerRole = 1;
        this.kAdminRole = 2;
        this.kDefaultRole = this.kUserRole;
        
    }

    GetValue(value) 
    {
        return value == undefined ? undefined : value;
    }
};

export let common = new data();