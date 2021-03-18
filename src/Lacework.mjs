import axios from 'axios';
import https from 'https'

class Lacework{

    constructor({account, subaccount, apiKey, apiSecret, verifyTLS = false, apiVersion = 'v1'}){
        this.account = account
        this.subaccount = subaccount
        this.apiKey = apiKey
        this.apiSecret = apiSecret
        this.baseURL = `https://${account}.lacework.net/api/${apiVersion}`
        this.accessToken = null
    }

    async init(){
        let params = {keyId: this.apiKey, expiryTime: 3600}
        let resp = await this._api({path:'/access/tokens', method: 'post', data: params})
        this.accessToken = resp.data[0].token
      };


      async _api({path = '', method = 'get', data = null}){

        let result = {}
      
        let request = {
          method,
          url: `${this.baseURL}${path}`,
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