CREATE DATABASE grupomok;

USE grupomok;

CREATE TABLE LogSMS (
    SMSId int NOT NULL AUTO_INCREMENT,
    Address varchar(100) NULL,
    Body text NULL,
    Response text NULL,
	Url text NULL,
	TmStmp datetime NULL,
    PRIMARY KEY (SMSId)
);


CREATE TABLE Token (
    bearerToken text NOT NULL,
	TmStmp datetime NULL
);

#Store procedure getToken

DELIMITER //

CREATE PROCEDURE getToken()
BEGIN

	DECLARE nowDatetime DATETIME; 
	DECLARE previousDatetime DATETIME;
	DECLARE previousToken TEXT;
	DECLARE respuesta INT;

	SET nowDatetime = UTC_TIMESTAMP();
	SELECT TmStmp, bearerToken INTO previousDatetime, previousToken FROM Token ORDER BY TmStmp DESC LIMIT 1;
		
	IF previousDatetime IS NULL THEN
		SET respuesta = 1;
	ELSE
		IF previousDatetime < nowDatetime
		THEN
			SET respuesta = 1;
		ELSE
			SET respuesta = 2;
        END IF;
	END IF;

	SELECT respuesta as 'estado', previousToken as 'tokenPrevio';
	
END //

DELIMITER ;

# Store procedure updateToken

DELIMITER //

CREATE PROCEDURE updateToken(
    IN tokenValue TEXT,
	IN hoursDuration INT
)
BEGIN

	DECLARE nowDatetime DATETIME;
    DECLARE previousDatetime DATETIME;
    DECLARE newDatetime DATETIME; 
    
	SET nowDatetime = UTC_TIMESTAMP();
	SELECT TmStmp INTO previousDatetime FROM Token LIMIT 1;
	SET newDatetime = DATE_ADD(UTC_TIMESTAMP(), INTERVAL hoursDuration HOUR);
	IF previousDatetime IS NULL THEN
		INSERT INTO Token (bearerToken, TmStmp) VALUES (tokenValue, newDatetime);
	ELSE
		UPDATE Token SET bearerToken = tokenValue, TmStmp = newDatetime;
	END IF;
	
END //

DELIMITER ;

# Store procedure InsertarLogSMS

DELIMITER //

CREATE PROCEDURE InsertarLogSMS(
	IN Address VARCHAR(100),
	IN Body TEXT,
	IN Response TEXT,
	IN Url TEXT
)
BEGIN
    INSERT INTO LogSMS (Address, Body, Response, Url, TmStmp) VALUES (Address, Body, Response, Url, UTC_TIMESTAMP());
END //

DELIMITER ;