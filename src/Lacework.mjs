import axios from 'axios';
import https from 'https'

class Lacework{

    constructor({account, subaccount, apiKey, apiSecret, expiry = 3600, verifyTLS = false, apiVersion = 'v1'}){
        this.account = account
        this.subaccount = subaccount
        this.apiKey = apiKey
        this.apiSecret = apiSecret
        this.baseURL = `https://${account}.lacework.net/api`
        this.accessToken = null
        this.expiry = expiry
    }

    async init(){
        let params = {keyId: this.apiKey, expiryTime: this.expiry}
        let resp = await this._api({path:`/access/tokens`, method: 'post', data: params, apiVersion: 'v1'})
        this.accessToken = resp.data[0].token
      };


      async _api({path = '', method = 'get', data = null, apiVersion='v1'}){

        let result = {}
      
        let request = {
          method,
          url: `${this.baseURL}/${apiVersion}${path}`,
          headers: {
            'Content-Type': 'application/json'
          },
          httpsAgent: new https.Agent({  
          rejectUnauthorized: this.verifyTLS
          }),
        }

        
      
        this.accessToken == null ? request.headers["X-LW-UAKS"] = this.apiSecret : request.headers.Authorization = `Bearer ${this.accessToken}`
        
      
        if(data != null && method == 'post'){
          request.data = data
        }

        if(data != null && method == 'get'){
          request.params = data
        }

      
        await axios(request)
          .then(response => {
            return response.data 
          })
          .then(data => {
            result = data
          })
          .catch((error) => {
            console.log(error);
          });
      
          return result;
      };

}

export default Lacework;

