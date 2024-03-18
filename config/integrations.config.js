// RABBIT MQ
exports.RABBITMQ_SERVER = "amqp://localhost";
exports.RABBITMQ_QUEUE = "sms_flujos";
exports.RABBIT_SETTINGS_DURABLE = true;

// SMS GRUPOMOK SAKARI
exports.SMS_URL = " https://api.sakari.io/v1/accounts/64876d61346c77cd5145333d/messages";
exports.SMS_AUTH = "https://api.sakari.io/oauth2/token";
exports.SMS_CLIENTID = "c463a95c-98c1-45ac-8858-cc38aca6f4f4";
exports.SMS_CLIENTSECRET = "522efdf5-3783-4621-a4fe-fc01114296b5";
exports.SMS_TIMEOUT = 10000;
exports.SMS_TOKENDURATION = 3; // Duracion en horas del token generado