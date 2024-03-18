// Import libraries
const log4js = require("log4js");
let rp = require("request-promise-native");

// Import config
let SMS_URL = require("../config/integrations.config").SMS_URL;
let SMS_AUTH = require("../config/integrations.config").SMS_AUTH;
let SMS_CLIENTID = require("../config/integrations.config").SMS_CLIENTID;
let SMS_CLIENTSECRET = require("../config/integrations.config").SMS_CLIENTSECRET;
let SMS_TIMEOUT = require("../config/integrations.config").SMS_TIMEOUT;
let SMS_TOKENDURATION = require("../config/integrations.config").SMS_TOKENDURATION;

// Obtengo logger
let logger = log4js.getLogger('ServerScripts');

// Importo clase SQLConector
const MySQLConector = require('./mysql.shared.js');
const mysqlConector = new MySQLConector();

// Function to consume queue
class SMSSender{

  
  constructor(){}

  async autenticar(){
    try{
      let requestAuth = {
        grant_type: "client_credentials",
        client_id: SMS_CLIENTID,
        client_secret: SMS_CLIENTSECRET
      }

      // Armo el request
      let url = SMS_AUTH;
      
      let options = {
        url: url,
        method: "POST",
        body: requestAuth,
        json: true,
        strictSSL: false,
        timeout: SMS_TIMEOUT,
        headers:{
          "Content-Type": "application/json"
        }
      }

      let responseAuth;
      let sqlResponse;

      // Ejecuto el POST
      await rp(options).then(function (response) {
        responseAuth = response;
      })  

      sqlResponse = await mysqlConector.updateTokenStoreProcedure(responseAuth.access_token, SMS_TOKENDURATION);
      
      return responseAuth.access_token;
    }
    catch{
      logger.error("Ocurrio un error al Autenticar al WS del proveedor, error: ")
      logger.error(err);   
      return null; 
    }
  }

  async sendSMS(request){
    let message = request.message;
    let id = request.id;
    let msisdns = request.addresses;

    try {

        let responseToken;
        let token;
        let estado;

        responseToken = await mysqlConector.getTokenStoreProcedure();

        estado = responseToken.estado;
        token = responseToken.tokenPrevio;

        if(estado == 1){
          token = await autenticar();
        }

        if(!token){
          logger.error("Ocurrio un error al obtener token");
          return false;
        }

        // Formo el request
        var contacts = []

        for(let msisdn of msisdns){
          contacts.push(
            {
                mobile:{
                    number: msisdn
                }
            })
        }

        // Formo el body del request del proveedor
        let requestSMS = {
            contacts: contacts,
            template: message
        }
        
        // Armo el request
        let url = SMS_URL;
        
        let options = {
          url: url,
          method: "POST",
          body: requestSMS,
          json: true,
          strictSSL: false,
          timeout: SMS_TIMEOUT,
          headers:{
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          }
        }

        let responseSMS;
        let sqlResponse;

        // Ejecuto el POST
        await rp(options).then(function (response) {
          responseSMS = response;
        })  
        sqlResponse = await mysqlConector.logStoreProcedure(msisdns.toString(), JSON.stringify(requestSMS), JSON.stringify(responseSMS), SMS_URL);

    } catch (err) {
      logger.error("Ocurrio un error al enviar SMS al proveedor, error: ")
      logger.error(err);
      sqlResponse = await mysqlConector.logStoreProcedure(msisdns.toString(), JSON.stringify(requestSMS), err, SMS_URL);
    }
  }
}

module.exports = SMSSender;
