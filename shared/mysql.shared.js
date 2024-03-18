const log4js = require("log4js");
const mysql = require("mysql2/promise");

// Import config
let MYSQL_HOST = require("../config/mysql.config.js").MSSQL_HOST;
let MYSQL_PORT = require("../config/mysql.config.js").MSSQL_PORT;
let MYSQL_USER = require("../config/mysql.config.js").MSSQL_USER;
let MYSQL_PASSWORD = require("../config/mysql.config.js").MSSQL_PASSWORD;
let MYSQL_DATABASE = require("../config/mysql.config.js").MSSQL_DATABASE;
let MYSQL_POOL_MAX = require("../config/mysql.config.js").MSSQL_POOL_MAX;

// Obtengo logger
let logger = log4js.getLogger('ServerScripts');

class MySQLConector {
  
    constructor(){}

    async logStoreProcedure(address, request, response, url) {

        let MYSQL_CONFIG = {
            user: MYSQL_USER,
            password: MYSQL_PASSWORD,
            host: MYSQL_HOST,
            database: MYSQL_DATABASE,
            port: MYSQL_PORT,
            connectionLimit: MYSQL_POOL_MAX
        };

        try {
        // Create connection to MySQL database
        const connection = await mysql.createConnection(MYSQL_CONFIG);

        // Execute INSERT query (replace with stored procedure call if needed)
        const [rows, fields] = await connection.execute(
            'CALL InsertarLogSMS(?, ?, ?, ?)',
            [address, request, response, url]
        );

        // Close connection
        await connection.end();

        return true;

        } catch (err) {
        logger.error("Ocurrio un error al ejecutar logStoreProcedure, error: ");
        logger.error(err);

        return false;
        }
    }

    async updateTokenStoreProcedure(token, hours) {

        let MYSQL_CONFIG = {
            user: MYSQL_USER,
            password: MYSQL_PASSWORD,
            host: MYSQL_HOST,
            database: MYSQL_DATABASE,
            port: MYSQL_PORT,
            connectionLimit: MYSQL_POOL_MAX
        };

        try {
        // Create connection to MySQL database
        const connection = await mysql.createConnection(MYSQL_CONFIG);

        // Execute INSERT query (replace with stored procedure call if needed)
        const [rows, fields] = await connection.execute(
            'CALL updateToken(?, ?)',
            [token, hours]
        );

        // Close connection
        await connection.end();

        return true;

        } catch (err) {
        logger.error("Ocurrio un error al ejecutar updateTokenStoreProcedure, error: ");
        logger.error(err);

        return false;
        }
    }   
    
    async getTokenStoreProcedure() {

        let MYSQL_CONFIG = {
            user: MYSQL_USER,
            password: MYSQL_PASSWORD,
            host: MYSQL_HOST,
            database: MYSQL_DATABASE,
            port: MYSQL_PORT,
            connectionLimit: MYSQL_POOL_MAX
        };

        try {
        // Create connection to MySQL database
        const connection = await mysql.createConnection(MYSQL_CONFIG);

        // Execute INSERT query (replace with stored procedure call if needed)
        const [rows, fields] = await connection.execute(
            'CALL getToken()'
        );

        // Close connection
        await connection.end();
        console.log();

        return rows[0][0];

        } catch (err) {
            logger.error("Ocurrio un error al ejecutar getTokenStoreProcedure, error: ");
            logger.error(err);

            return {estado : 3, tokenPrevio: null};
        }
    }
}

module.exports = MySQLConector;
