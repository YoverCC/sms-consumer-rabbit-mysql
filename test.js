const MySQLConector = require('./shared/mysql.shared.js');
const sqlConector = new MySQLConector();


// Funcion para iniciar el consumidor
async function InitApp(){
    //await  sqlConector.logStoreProcedure('+51965260488', '{asd:{lld}}', '{ddd:{www}}','https://test.com');

    //response = await sqlConector.getTokenStoreProcedure();

    //console.log(response)

    //await sqlConector.updateTokenStoreProcedure('asd', 4);
    var msisdns = ['+519222', '+424242'];
    var message = 'Hola';
    var objecto = [];
    for(let msisdn of msisdns)
    {
        console.log(msisdn);
        objecto.push(
            {
                mobile:{
                    number: msisdn
                }
            })
    }
    var request = {
        contacts: objecto,
        template: message
    }

    console.log(JSON.stringify(request))
    console.log(request)

}

InitApp();