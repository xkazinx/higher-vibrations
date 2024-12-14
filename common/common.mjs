class data
{
    constructor()
    {
        this.kDefaultCountryIndex = 0;
        this.kDomain = 'http://localhost:8081/';
        this.kUserRole = 0;
        this.kOrganizerRole = 1;
        this.kAdminRole = 2;
        this.kDefaultRole = this.kUserRole;
        this.kMaxExpireTime = 2147483647;
        this.kUserVerified = 1;   
        this.kClientDomains = ['http://localhost:3000'];
        this.kSessionSecret = ')DG)DFWFRY$TFG';
        this.kDatabaseAuth = 
        {
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'higher_vibrations',
            port: 3306,
            connectionLimit: 100,
        };
    }

    GetValue(value) 
    {
        return value == undefined ? undefined : value;
    }
};

export let common = new data();