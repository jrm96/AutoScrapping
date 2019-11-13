-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         5.7.26 - MySQL Community Server (GPL)
-- SO del servidor:              Win64
-- HeidiSQL Versión:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para bd_autoscraping
CREATE DATABASE IF NOT EXISTS `bd_autoscraping` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci */;
USE `bd_autoscraping`;

-- Volcando estructura para procedimiento bd_autoscraping.actualizar_bol_predecida
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `actualizar_bol_predecida`(num_anio int, num_periodo int, carrera VARCHAR(100))
BEGIN

	UPDATE tbl_asignatura_a_cursar A INNER JOIN tbl_requisito_x_asignatura B
	ON A.cod_asignatura_x_plan_estudio_ck = B.cod_asignatura_x_plan_estudio_ck 
	INNER JOIN tbl_asignatura_x_plan_estudio N
	ON N.cod_asignatura_x_plan_estudio_pk = A.cod_asignatura_x_plan_estudio_ck 
	INNER JOIN tbl_plan_estudio P  
	ON N.cod_plan_estudio_fk = P.cod_plan_estudio_pk INNER JOIN tbl_carrera M 
	ON P.cod_carrera_fk = M.cod_carrera_pk 
	SET bol_predecida = TRUE
	WHERE (B.cod_asignatura_x_plan_estudio_requisito_ck IN 
		(SELECT C.cod_asignatura_x_plan_estudio_ck  FROM tbl_forma_03 C WHERE A.num_cuenta_ck = C.num_cuenta_ck)) 
	AND A.num_anio_ck = num_anio AND A.num_periodo_ck = num_periodo
	AND M.txt_nombre_carrera = carrera;
	

END//
DELIMITER ;

-- Volcando estructura para función bd_autoscraping.buscar_asignatura
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `buscar_asignatura`(`_cod_asignatura` VARCHAR(8), `_txt_nombre_asignatura` VARCHAR(100)) RETURNS int(11)
begin 
	declare resultado int;
	declare cod_asignatura varchar(8);

select cod_asignatura_pk into cod_asignatura 
		from tbl_asignatura
		where cod_asignatura_pk = _cod_asignatura;

		if cod_asignatura = _cod_asignatura
		then
			set resultado = 1;
        else
			set resultado = 0;
		insert into tbl_asignatura (cod_asignatura_pk, txt_nombre_asignatura) values (_cod_asignatura, _txt_nombre_asignatura);
        end if;
        
return resultado;
end//
DELIMITER ;

-- Volcando estructura para función bd_autoscraping.buscar_carga
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `buscar_carga`(`_num_seccion` INT, `_num_periodo` INT, `_num_anio` INT, `_cod_asignatura` VARCHAR(8), `_txt_HI` VARCHAR(6), `_txt_HF` VARCHAR(6), `_txt_dias` VARCHAR(15), `_txt_aula` VARCHAR(200), `_txt_edificio` VARCHAR(10), `_num_docente` VARCHAR(30)) RETURNS int(11)
begin 
declare resultado int;
declare num_seccion, num_periodo, num_anio int;
declare cod_asignatura varchar (8);

declare num_docente varchar (30);
declare txt_HI_, txt_HF_ varchar(6);
declare txt_dias_ varchar (15);
declare txt_aula_ varchar (200);
declare txt_edificio_ varchar (20);


select num_seccion_pk, num_periodo_pk, num_anio_pk, cod_asignatura_ck, num_docente_ck, txt_HI, txt_HF, txt_dias, txt_aula, txt_edificio
into num_seccion, num_periodo, num_anio, cod_asignatura, num_docente, txt_HI_, txt_HF_, txt_dias_, txt_aula_, txt_edificio_
from tbl_seccion
where num_seccion_pk = _num_seccion and
	  num_periodo_pk = _num_periodo and
      num_anio_pk = _num_anio and
      cod_asignatura_ck = _cod_asignatura;

if num_seccion = _num_seccion and 
   num_periodo = _num_periodo and
   num_anio = _num_anio and
   cod_asignatura = _cod_asignatura
then
	set resultado = 1;
	if  num_docente <> _num_docente or num_docente is null then
		
		update tbl_seccion
		set num_docente_ck = _num_docente
		where num_seccion_pk = _num_seccion and num_periodo_pk = _num_periodo and num_anio_pk = _num_anio and cod_asignatura_ck = _cod_asignatura;
		
	end if;

	if  txt_HI_ <> _txt_HI or txt_HI_ is null then
		
		update tbl_seccion
		set txt_HI = _txt_HI
		where num_seccion_pk = _num_seccion and num_periodo_pk = _num_periodo and num_anio_pk = _num_anio and cod_asignatura_ck = _cod_asignatura;
		
	end if;

	if  txt_HF_ <> _txt_HF or txt_HF_ is null then 
		
		update tbl_seccion
		set txt_HF = _txt_HF
		where num_seccion_pk = _num_seccion and num_periodo_pk = _num_periodo and num_anio_pk = _num_anio and cod_asignatura_ck = _cod_asignatura;
		
	end if;

	if  txt_dias_ <> txt_dias_ or txt_dias_ is null then
		
		update tbl_seccion
		set txt_dias = _txt_dias
		where num_seccion_pk = _num_seccion and num_periodo_pk = _num_periodo and num_anio_pk = _num_anio and cod_asignatura_ck = _cod_asignatura;
		
	end if;

	if  txt_aula_ <> _txt_aula or txt_aula_ is null then 
	
		update tbl_seccion
		set txt_aula = _txt_aula
		where num_seccion_pk = _num_seccion and num_periodo_pk = _num_periodo and num_anio_pk = _num_anio and cod_asignatura_ck = _cod_asignatura;
		
	end if;

	if  txt_edificio_ <> _txt_edificio or txt_edificio_ is null then 
		
		update tbl_seccion
		set txt_edificio = _txt_edificio
		where num_seccion_pk = _num_seccion and num_periodo_pk = _num_periodo and num_anio_pk = _num_anio and cod_asignatura_ck = _cod_asignatura;
		
	end if;
	
	if num_docente <> _num_docente or num_docente is null then
		
		update tbl_seccion
		set num_docente_ck = _num_docente
		where num_seccion_pk = _num_seccion and num_periodo_pk = _num_periodo and num_anio_pk = _num_anio and cod_asignatura_ck = _cod_asignatura;
	
	end if;
	
else
	set resultado = 0;
	
end if;
            
return resultado;

end//
DELIMITER ;

-- Volcando estructura para función bd_autoscraping.buscar_docente
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `buscar_docente`(`_num_docente` VARCHAR(30), `_nombre_docente` VARCHAR(60)) RETURNS int(11)
begin 
declare resultado int;
declare num_docente varchar(20);

select num_docente_pk into num_docente 
from tbl_docente
where num_docente_pk = _num_docente;

if num_docente = _num_docente
then
	set resultado = 1;
else
	set resultado = 0;
insert into tbl_docente (num_docente_pk, txt_nombre) values (_num_docente, _nombre_docente);
end if;
            
return resultado;
end//
DELIMITER ;

-- Volcando estructura para función bd_autoscraping.buscar_estudiante
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `buscar_estudiante`(
	`_num_cuenta` VARCHAR(20),
	`_nombre_alumno` VARCHAR(100),
	`_txt_centro_estudio` VARCHAR(100),
	`_cod_carrera` VARCHAR(100)

) RETURNS int(11)
begin 
	declare resultado int;
	declare num_cuenta varchar(20);

select num_cuenta_pk into num_cuenta 
from tbl_estudiante
where num_cuenta_pk = _num_cuenta;

if num_cuenta = _num_cuenta
then
	set resultado = 1;
	update tbl_estudiante set cod_carrera_fk = _cod_carrera where num_cuenta_pk = _num_cuenta;
else
	set resultado = 0;
	insert into tbl_estudiante (num_cuenta_pk, txt_nombre, txt_centro_estudio, cod_carrera_fk) values (_num_cuenta, _nombre_alumno, _txt_centro_estudio, _cod_carrera);
end if;
            
return resultado;
end//
DELIMITER ;

-- Volcando estructura para función bd_autoscraping.buscar_historial
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `buscar_historial`(`_num_cuenta` VARCHAR(20), `_num_seccion` INT, `_num_periodo` INT, `_num_anio` INT, `_cod_asignatura` VARCHAR(8), `_num_calificacion` INT, `_num_uv` INT, `_txt_obs` VARCHAR(20)) RETURNS int(11)
begin 
	declare resultado int;
	declare num_seccion, num_periodo, num_anio int;
	declare cod_asignatura varchar (8);
	declare num_cuenta varchar(20);

select num_cuenta_ck, cod_asignatura_ck, num_seccion_pk, num_periodo_pk, num_anio_pk
into num_cuenta, cod_asignatura, num_seccion, num_periodo, num_anio
from tbl_historial
where num_cuenta_ck = _num_cuenta and
	  cod_asignatura_ck = _cod_asignatura and 
	  num_seccion_pk = _num_seccion and
	  num_periodo_pk = _num_periodo and
      num_anio_pk = _num_anio;
      

if num_cuenta = _num_cuenta and
   cod_asignatura = _cod_asignatura and
   num_seccion = _num_seccion and 
   num_periodo = _num_periodo and
   num_anio = _num_anio
   
then
	set resultado = 1;
else
	set resultado = 0;
	if _num_uv = 0
	THEN
		insert into tbl_historial (num_cuenta_ck, cod_asignatura_ck, num_seccion_pk, num_periodo_pk, num_anio_pk, num_calificacion, num_uv, txt_obs) 
						values (_num_cuenta, _cod_asignatura, _num_seccion, _num_periodo, _num_anio, _num_calificacion, 4, _txt_obs);
	else
		insert into tbl_historial (num_cuenta_ck, cod_asignatura_ck, num_seccion_pk, num_periodo_pk, num_anio_pk, num_calificacion, num_uv, txt_obs) 
						values (_num_cuenta, _cod_asignatura, _num_seccion, _num_periodo, _num_anio, _num_calificacion, _num_uv, _txt_obs);
	end if;
end if;
            
return resultado;
end//
DELIMITER ;

-- Volcando estructura para función bd_autoscraping.buscar_periodo
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `buscar_periodo`(`_num_periodo` INT, `_num_anio` INT) RETURNS int(11)
begin 
	declare resultado int;
	declare num_periodo2, num_anio2 int;

select num_periodo_pk, num_anio_pk into num_periodo2, num_anio2 
		from tbl_periodo
		where num_periodo_pk = _num_periodo and num_anio_pk = _num_anio;

		if num_periodo2 = _num_periodo and num_anio2 = _num_anio
		then
			set resultado = 1;
        else
			set resultado = 0;
			insert into tbl_periodo (num_periodo_pk, num_anio_pk) values(_num_periodo, _num_anio);
        end if;
        
return resultado;
end//
DELIMITER ;

-- Volcando estructura para función bd_autoscraping.buscar_seccion
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `buscar_seccion`(`_num_seccion` INT, `_num_periodo` INT, `_num_anio` INT, `_cod_asignatura` VARCHAR(8)) RETURNS int(11)
begin 
	declare resultado int;
	declare num_seccion, num_periodo, num_anio int;
	declare cod_asignatura varchar (8);

select num_seccion_pk, num_periodo_pk, num_anio_pk, cod_asignatura_ck 
into num_seccion, num_periodo, num_anio, cod_asignatura
from tbl_seccion
where num_seccion_pk = _num_seccion and
	  num_periodo_pk = _num_periodo and
      num_anio_pk = _num_anio and
      cod_asignatura_ck = _cod_asignatura;


if num_seccion = _num_seccion and 
   num_periodo = _num_periodo and
   num_anio = _num_anio and
   cod_asignatura = _cod_asignatura
then
	set resultado = 1;
else
	set resultado = 0;
	if _num_seccion = 0
	then
        insert into tbl_seccion (num_periodo_pk, 		num_anio_pk, cod_asignatura_ck) values (_num_periodo, _num_anio, _cod_asignatura);
        SELECT (SELECT `AUTO_INCREMENT`
FROM  INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'bd_autoscraping'
AND   TABLE_NAME   = 'tbl_seccion')-1 INTO resultado;
	else 
            insert into tbl_seccion (num_seccion_pk, num_periodo_pk, 		num_anio_pk, cod_asignatura_ck) values (_num_seccion, _num_periodo, _num_anio, _cod_asignatura);
            set resultado = 1;

    end if;
end if;          
return resultado;
end//
DELIMITER ;

-- Volcando estructura para procedimiento bd_autoscraping.calcular_asignaturas_a_cursar
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `calcular_asignaturas_a_cursar`()
BEGIN 
	DECLARE anio INT;
	DECLARE periodo INT;
   DECLARE carrera varchar(100);
	
	SELECT v.num_anio_pk, v.num_periodo_pk INTO anio, periodo FROM vw_ultimo_periodo v;
	SELECT p.txt_valor INTO carrera FROM tbl_parametro p WHERE p.cod_parametro_pk = "cod_carrera_prediccion";
	
	DELETE m FROM tbl_asignatura_a_cursar m INNER JOIN tbl_asignatura_x_plan_estudio n
	ON m.cod_asignatura_x_plan_estudio_ck= n.cod_asignatura_x_plan_estudio_pk INNER JOIN tbl_plan_estudio p 
	ON n.cod_plan_estudio_fk=p.cod_plan_estudio_pk INNER JOIN tbl_carrera c ON p.cod_carrera_fk=c.cod_carrera_pk
	 WHERE m.num_anio_ck = anio AND m.num_periodo_ck = periodo AND c.txt_nombre_carrera= carrera; 
	
	SELECT insertar_asignaturas_a_cursar(num_cuenta_pk, anio, periodo)  
	FROM vw_estudiantes_prediccion;
	
	call actualizar_bol_predecida(anio, periodo, carrera);


END//
DELIMITER ;

-- Volcando estructura para procedimiento bd_autoscraping.estudiantes_prediccion
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `estudiantes_prediccion`()
BEGIN 
	SELECT A.num_cuenta_ck, indice_estudiante_prediccion(A.num_cuenta_ck) FROM tbl_forma_03 A WHERE (A.num_anio_ck, A.num_periodo_ck) IN
 	(select * from vw_ultimo_periodo) 
  GROUP BY A.num_cuenta_ck ORDER BY indice_estudiante_prediccion(A.num_cuenta_ck) DESC;

END//
DELIMITER ;

-- Volcando estructura para función bd_autoscraping.indice_asignatura
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `indice_asignatura`(_cod_asignatura VARCHAR(8)) RETURNS double
BEGIN 
	DECLARE num_periodos INT;
	DECLARE resultado DOUBLE;
	
	SELECT txt_valor INTO num_periodos FROM tbl_parametro WHERE cod_parametro_pk = 'num_periodos_prediccion';

	SELECT  AVG(A.num_calificacion) PROMEDIO INTO resultado
                FROM tbl_historial A
                INNER JOIN tbl_seccion B
                ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                        AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
                INNER JOIN tbl_asignatura C 
                ON B.cod_asignatura_ck = C.cod_asignatura_pk
                WHERE C.cod_asignatura_pk = _cod_asignatura
                AND (A.num_anio_pk, A.num_periodo_pk) IN (SELECT * FROM (SELECT num_anio_pk, num_periodo_pk FROM tbl_periodo
	  WHERE num_periodo_pk < 4 AND num_periodo_pk > 0 ORDER BY num_anio_pk DESC, num_periodo_pk DESC, num_periodo_pk DESC LIMIT num_periodos) AS T);
	  
	  RETURN resultado;
END//
DELIMITER ;

-- Volcando estructura para función bd_autoscraping.indice_asignatura_prediccion
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `indice_asignatura_prediccion`(
	`_cod_asignatura` VARCHAR(8)

) RETURNS double
BEGIN 
	DECLARE num_periodos INT; ## Número de periodos del parámetro de predicción
	DECLARE resultado DOUBLE; ## Promedio de índice de aprobación 
	
	SELECT txt_valor INTO num_periodos FROM tbl_parametro WHERE cod_parametro_pk = 'num_periodos_prediccion';

		SELECT M.NUM_OBS/N.SUM_NUM_OBS * 100 INTO resultado FROM (
			SELECT  COUNT(A.txt_obs) NUM_OBS, A.txt_obs OBS      
			    FROM tbl_historial A
			    INNER JOIN tbl_seccion B
			    ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
			            AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
			    INNER JOIN tbl_asignatura C 
			    ON B.cod_asignatura_ck = C.cod_asignatura_pk
			    WHERE C.cod_asignatura_pk IN (_cod_asignatura)
			   AND (B.num_anio_pk, B.num_periodo_pk) IN (SELECT * FROM (SELECT DISTINCT num_anio_pk, num_periodo_pk FROM tbl_historial 
	WHERE num_periodo_pk < 4 AND num_periodo_pk > 0 ORDER BY num_anio_pk DESC, num_periodo_pk DESC, num_periodo_pk DESC LIMIT num_periodos) AS T)
			   GROUP BY A.txt_obs
		) M INNER JOIN (
				SELECT  COUNT(A.txt_obs) SUM_NUM_OBS, A.txt_obs OBS      
			    FROM tbl_historial A
			    INNER JOIN tbl_seccion B
			    ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
			            AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
			    INNER JOIN tbl_asignatura C 
			    ON B.cod_asignatura_ck = C.cod_asignatura_pk
			    WHERE C.cod_asignatura_pk IN (_cod_asignatura)
			   AND (B.num_anio_pk, B.num_periodo_pk) IN (SELECT * FROM (SELECT DISTINCT num_anio_pk, num_periodo_pk FROM tbl_historial 
	WHERE num_periodo_pk < 4 AND num_periodo_pk > 0 ORDER BY num_anio_pk DESC, num_periodo_pk DESC, num_periodo_pk DESC LIMIT num_periodos) AS T)
		) N ON 1=1
		WHERE M.OBS = 'APR';
		
	  RETURN resultado;
END//
DELIMITER ;

-- Volcando estructura para función bd_autoscraping.indice_estudiante_prediccion
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `indice_estudiante_prediccion`(
	`_num_cuenta` VARCHAR(20)
) RETURNS double
BEGIN 
DECLARE _num_periodos INT;
DECLARE _promedio DOUBLE;

	SELECT txt_valor INTO _num_periodos FROM tbl_parametro WHERE cod_parametro_pk = 'num_periodos_prediccion';

	SELECT AVG(A.INDICE_PERIODO) INTO _promedio
      FROM 
      (
          SELECT SUM(A.num_calificacion*A.num_uv)/SUM(A.num_uv) INDICE_PERIODO, A.num_anio_pk, A.num_periodo_pk, A.num_cuenta_ck
          FROM tbl_historial A
          LEFT JOIN tbl_seccion B 
          ON ((B.num_seccion_pk = A.num_seccion_pk)
              AND (B.num_periodo_pk = A.num_periodo_pk)
              AND (B.num_anio_pk = A.num_anio_pk)
              AND (B.cod_asignatura_ck = A.cod_asignatura_ck)
          )
          WHERE (A.num_cuenta_ck = _num_cuenta) AND (A.txt_obs != 'NSP')
          AND NOT ((A.txt_obs !='APR') AND ((A.num_anio_pk = 2017) AND (A.num_periodo_pk = 2)))
          GROUP BY A.num_cuenta_ck, A.num_periodo_pk, A.num_anio_pk
          
          ORDER BY A.num_anio_pk DESC, A.num_periodo_pk DESC LIMIT _num_periodos
      ) A; 
	RETURN _promedio;
END//
DELIMITER ;

-- Volcando estructura para función bd_autoscraping.insertar_asignaturas_a_cursar
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `insertar_asignaturas_a_cursar`(
	`_num_cuenta` VARCHAR(20),
	`_anio` INT,
	`_periodo` INT

) RETURNS tinyint(1)
BEGIN 
	#Hacer un insert para que inserte en la tabla de asignaturas predecidas
	INSERT INTO tbl_asignatura_a_cursar  (num_cuenta_ck, cod_asignatura_x_plan_estudio_ck,
		num_anio_ck, num_periodo_ck)
	 SELECT _num_cuenta, a.cod_asignatura_x_plan_estudio_pk, _anio, _periodo
	 FROM tbl_asignatura_x_plan_estudio a INNER JOIN tbl_plan_estudio p 
		ON a.cod_plan_estudio_fk = p.cod_plan_estudio_pk
		WHERE p.cod_carrera_fk = 
			(SELECT e.cod_carrera_pk FROM tbl_parametro d 
			INNER JOIN tbl_carrera e
			ON d.txt_valor = e.txt_nombre_carrera
			WHERE d.cod_parametro_pk = "cod_carrera_prediccion")
	 AND a.bol_pertenece_carrera = 1 
	 AND a.cod_asignatura_fk NOT IN (
	 	
	 	(SELECT b.cod_asignatura_fk ASIGNATURA FROM tbl_forma_03 a
		INNER JOIN tbl_asignatura_x_plan_estudio b ON a.cod_asignatura_x_plan_estudio_ck = b.cod_asignatura_x_plan_estudio_pk
		 WHERE a.bol_prediccion_aprueba = 1 AND (a.num_anio_ck, a.num_periodo_ck) IN (select * from vw_ultimo_periodo)
		 AND a.num_cuenta_ck = _num_cuenta
		UNION 
		SELECT c.cod_asignatura_ck ASIGNATURA FROM tbl_historial c 
		WHERE (c.txt_obs = "APR") AND c.num_cuenta_ck = _num_cuenta)
	 	
	 ) AND requisitos_cumplidos(_num_cuenta, a.cod_asignatura_fk) = 1;
	 
	 RETURN TRUE;

END//
DELIMITER ;

-- Volcando estructura para procedimiento bd_autoscraping.insertar_carga
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertar_carga`(IN `_cod_asignatura` VARCHAR(8), IN `_txt_nombre_asignatura` VARCHAR(200), IN `_num_seccion` INT, IN `_num_periodo` INT, IN `_num_anio` INT, IN `_txt_HI` VARCHAR(6), IN `_txt_HF` VARCHAR(6), IN `_txt_dias` VARCHAR(15), IN `_txt_aula` VARCHAR(200), IN `_txt_edificio` VARCHAR(10), IN `_num_docente` VARCHAR(30), IN `_txt_nombre_docente` VARCHAR(60))
begin 

declare respuesta_periodo int; 
declare respuesta_asignatura int; 
declare respuesta_carga int; 
declare respuesta_docente int; 
declare respuesta_seccion int; 

set respuesta_periodo = buscar_periodo(_num_periodo, _num_anio);

set respuesta_asignatura = buscar_asignatura(_cod_asignatura, _txt_nombre_asignatura);

set respuesta_docente = buscar_docente(_num_docente, _txt_nombre_docente);

set respuesta_seccion = buscar_seccion(_num_seccion, _num_periodo, _num_anio, _cod_asignatura);

set respuesta_carga = buscar_carga(_num_seccion, _num_periodo, _num_anio, _cod_asignatura, 
_txt_HI, _txt_HF, _txt_dias, _txt_aula, _txt_edificio, _num_docente);

end//
DELIMITER ;

-- Volcando estructura para procedimiento bd_autoscraping.insertar_forma
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertar_forma`(
	IN `_periodo` INT,
	IN `_anio` INT,
	IN `_cod_asignatura` VARCHAR(8),
	IN `_nombre_asignatura` VARCHAR(100),
	IN `_num_cuenta` VARCHAR(20)





)
BEGIN
	DECLARE respuesta_periodo INT;
	DECLARE respuesta_asignatura INT;
	DECLARE cod_carrera INT;
	DECLARE cod_plan_estudio INT;
	DECLARE cod_asignatura_plan INT;
	DECLARE respuesta_forma INT;
	
	SET respuesta_periodo = buscar_periodo(_periodo, _anio);
	SET respuesta_asignatura = buscar_asignatura(_cod_asignatura, _nombre_asignatura);
	
	SELECT cod_carrera_fk INTO cod_carrera FROM tbl_estudiante WHERE num_cuenta_pk = _num_cuenta;
	SELECT cod_plan_estudio_pk INTO cod_plan_estudio FROM tbl_plan_estudio WHERE cod_carrera_fk = cod_carrera LIMIT 1;
	
	IF cod_plan_estudio IS NULL THEN
		INSERT INTO tbl_plan_estudio (cod_carrera_fk) VALUES (cod_carrera);
		SELECT cod_plan_estudio_pk INTO cod_plan_estudio FROM tbl_plan_estudio WHERE cod_carrera_fk = cod_carrera LIMIT 1;
	END IF;
	
	SELECT cod_asignatura_x_plan_estudio_pk INTO cod_asignatura_plan FROM tbl_asignatura_x_plan_estudio 
	WHERE cod_asignatura_fk = _cod_asignatura AND cod_plan_estudio_fk = cod_plan_estudio 
	ORDER BY cod_asignatura_x_plan_estudio_pk DESC LIMIT 1;
	
	IF cod_asignatura_plan IS NULL THEN
		INSERT INTO tbl_asignatura_x_plan_estudio(cod_plan_estudio_fk, cod_asignatura_fk, bol_pertenece_carrera) 
		VALUES(cod_plan_estudio, _cod_asignatura, 2);
		
		SELECT cod_asignatura_x_plan_estudio_pk INTO cod_asignatura_plan FROM tbl_asignatura_x_plan_estudio 
		WHERE cod_asignatura_fk = _cod_asignatura AND cod_plan_estudio_fk = cod_plan_estudio 
		ORDER BY cod_asignatura_x_plan_estudio_pk DESC LIMIT 1;
	END IF;
	
	SELECT count(*) INTO respuesta_forma FROM tbl_forma_03 WHERE num_cuenta_ck = _num_cuenta AND num_anio_ck = _anio 
	AND num_periodo_ck = _periodo AND cod_asignatura_x_plan_estudio_ck = cod_asignatura_plan;

	IF respuesta_forma = 0 THEN
		INSERT INTO tbl_forma_03 (num_cuenta_ck, num_anio_ck, num_periodo_ck, cod_asignatura_x_plan_estudio_ck)
		VALUES (_num_cuenta, _anio, _periodo, cod_asignatura_plan);
	END IF;


	
END//
DELIMITER ;

-- Volcando estructura para procedimiento bd_autoscraping.insertar_historial
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertar_historial`(
	IN `_num_cuenta` VARCHAR(20),
	IN `_txt_nombre_alumno` VARCHAR(100),
	IN `_cod_asignatura` VARCHAR(8),
	IN `_txt_nombre_asignatura` VARCHAR(200),
	IN `_num_seccion` INT,
	IN `_num_periodo` INT,
	IN `_num_anio` INT,
	IN `_num_calificacion` INT,
	IN `_num_uv` INT,
	IN `_txt_obs` VARCHAR(20),
	IN `_txt_centro_estudio` VARCHAR(100),
	IN `_txt_carrera` VARCHAR(100)




)
begin 

	declare respuesta_periodo int; 
	declare respuesta_asignatura int; 
	declare respuesta_estudiante int;
	declare respuesta_seccion int; 
	declare respuesta_historial int;
	declare cod_carrera int;
	
select cod_carrera_pk into cod_carrera from tbl_carrera where txt_nombre_carrera = _txt_carrera limit 1;

if cod_carrera is null then
	insert into tbl_carrera (txt_nombre_carrera) values (_txt_carrera);
	select cod_carrera_pk into cod_carrera from tbl_carrera where txt_nombre_carrera = _txt_carrera limit 1;
end if;

set respuesta_periodo = buscar_periodo(_num_periodo, _num_anio);

set respuesta_asignatura = buscar_asignatura(_cod_asignatura, _txt_nombre_asignatura);

set respuesta_estudiante = buscar_estudiante(_num_cuenta, _txt_nombre_alumno, _txt_centro_estudio, cod_carrera);

set respuesta_seccion = buscar_seccion(_num_seccion, _num_periodo, _num_anio, _cod_asignatura);

if respuesta_seccion != 1
THEN
	set respuesta_historial = buscar_historial (_num_cuenta, respuesta_seccion, _num_periodo, _num_anio, _cod_asignatura, _num_calificacion, _num_uv, _txt_obs);
else
    set respuesta_historial = buscar_historial (_num_cuenta, _num_seccion, _num_periodo, _num_anio, _cod_asignatura, _num_calificacion, _num_uv, _txt_obs);
end if;

end//
DELIMITER ;

-- Volcando estructura para procedimiento bd_autoscraping.insertar_indices
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertar_indices`(
	IN `_num_cuenta` VARCHAR(20),
	IN `_num_anio` INT,
	IN `_num_periodo` INT,
	IN `_indice_global` INT,
	IN `_indice_periodo` INT
)
BEGIN
	DELETE FROM tbl_indice WHERE num_cuenta_pk = _num_cuenta AND num_anio_pk = _num_anio AND num_periodo_pk = _num_periodo;
	
	INSERT INTO tbl_indice(num_cuenta_pk, num_anio_pk, num_periodo_pk, num_indice_periodo, num_indice_global)
	VALUES (_num_cuenta, _num_anio, _num_periodo, _indice_global, _indice_periodo);

END//
DELIMITER ;

-- Volcando estructura para función bd_autoscraping.num_periodos_inactivo
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `num_periodos_inactivo`(
	`_num_cuenta` VARCHAR(20)

) RETURNS int(11)
BEGIN 
	DECLARE res INT DEFAULT 0;
	
		
	### Obtiene el número de periodos inactivo
	SELECT COUNT(*) INTO res
	FROM tbl_periodo
	WHERE num_periodo_pk < 4 AND num_periodo_pk > 0 
	AND CONCAT(num_anio_pk, num_periodo_pk) > 
	
		(SELECT CONCAT( c.num_anio_pk, c.num_periodo_pk ) con FROM 
			(
				SELECT DISTINCT a.num_anio_pk, a.num_periodo_pk FROM tbl_historial a 
				WHERE a.num_cuenta_ck=_num_cuenta AND a.num_periodo_pk < 4 AND a.num_periodo_pk > 0 
				UNION (
				SELECT b.num_anio_ck, b.num_periodo_ck FROM tbl_forma_03 b
				WHERE b.num_cuenta_ck= _num_cuenta AND b.num_periodo_ck < 4 AND b.num_periodo_ck > 0 )
			) c ORDER BY c.num_anio_pk DESC, c.num_periodo_pk DESC LIMIT 1)
	AND CONCAT(num_anio_pk, num_periodo_pk) <=
		(SELECT CONCAT(num_anio_pk, num_periodo_pk) FROM vw_ultimo_periodo);
		
	
	update tbl_estudiante e set e.num_periodos_inactivo = res where e.num_cuenta_pk = _num_cuenta;
		
	RETURN res;
	
END//
DELIMITER ;

-- Volcando estructura para procedimiento bd_autoscraping.periodos_prediccion
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `periodos_prediccion`()
BEGIN 
	DECLARE _num_periodos INT;
	
	SELECT txt_valor INTO _num_periodos FROM tbl_parametro WHERE cod_parametro_pk = 'num_periodos_prediccion';
	
	SELECT num_anio_pk, num_periodo_pk FROM tbl_periodo 
		WHERE num_periodo_pk < 4 AND num_periodo_pk > 0 
		ORDER BY num_anio_pk DESC , num_periodo_pk DESC LIMIT _num_periodos;

END//
DELIMITER ;

-- Volcando estructura para función bd_autoscraping.predecir_aprobacion
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `predecir_aprobacion`(_cod_asignatura_x_plan int, _indice_aprobacion DOUBLE) RETURNS int(11)
BEGIN 
	
	DECLARE num_estudiantes_aprobados INT DEFAULT 0;
	
	
	SELECT round(COUNT(*) * _indice_aprobacion/100) INTO num_estudiantes_aprobados
	FROM tbl_forma_03 A 
	WHERE A.cod_asignatura_x_plan_estudio_ck = _cod_asignatura_x_plan
		AND (A.num_anio_ck, A.num_periodo_ck) IN
	 	(SELECT * FROM (SELECT num_anio_pk, num_periodo_pk FROM tbl_periodo
		  WHERE num_periodo_pk < 4 AND num_periodo_pk > 0 ORDER BY num_anio_pk DESC, num_periodo_pk DESC, num_periodo_pk DESC LIMIT 1) AS T); 


	UPDATE tbl_forma_03 A SET A.bol_prediccion_aprueba = true
	WHERE A.cod_asignatura_x_plan_estudio_ck = _cod_asignatura_x_plan
		AND (A.num_anio_ck, A.num_periodo_ck) IN
	 	(SELECT * FROM (SELECT num_anio_pk, num_periodo_pk FROM tbl_periodo
		  WHERE num_periodo_pk < 4 AND num_periodo_pk > 0 ORDER BY num_anio_pk DESC, num_periodo_pk DESC, num_periodo_pk DESC LIMIT 1) AS T) 
	ORDER BY indice_estudiante_prediccion(A.num_cuenta_ck) DESC LIMIT num_estudiantes_aprobados;

	RETURN num_estudiantes_aprobados;
END//
DELIMITER ;

-- Volcando estructura para función bd_autoscraping.requisitos_cumplidos
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `requisitos_cumplidos`(_cod_num_cuenta VARCHAR(20), _cod_asignatura VARCHAR(8)) RETURNS tinyint(1)
BEGIN 
	DECLARE res boolean DEFAULT false;
	DECLARE verificador VARCHAR(8);

	SELECT c.cod_asignatura_fk INTO verificador
	FROM tbl_asignatura_x_plan_estudio a INNER JOIN tbl_requisito_x_asignatura b 
	ON a.cod_asignatura_x_plan_estudio_pk = b.cod_asignatura_x_plan_estudio_ck 
	INNER JOIN tbl_asignatura_x_plan_estudio c ON c.cod_asignatura_x_plan_estudio_pk = b.cod_asignatura_x_plan_estudio_requisito_ck
	WHERE a.cod_asignatura_fk = _cod_asignatura
	AND c.cod_asignatura_fk NOT IN (
	
		SELECT b.cod_asignatura_fk REQUISITO FROM tbl_forma_03 a
		INNER JOIN tbl_asignatura_x_plan_estudio b ON a.cod_asignatura_x_plan_estudio_ck = b.cod_asignatura_x_plan_estudio_pk
		 WHERE a.bol_prediccion_aprueba = 1 AND (a.num_anio_ck, a.num_periodo_ck) IN (select * from vw_ultimo_periodo)
		 AND a.num_cuenta_ck = _cod_num_cuenta
		UNION 
		SELECT c.cod_asignatura_ck REQUISITO FROM tbl_historial c 
		WHERE (c.txt_obs = "APR") AND c.num_cuenta_ck = _cod_num_cuenta
	) LIMIT 1;
	
	if verificador IS NULL then 
		set res = TRUE;
	END if;
	
	RETURN res;
END//
DELIMITER ;

-- Volcando estructura para procedimiento bd_autoscraping.reset_prediccion
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `reset_prediccion`()
BEGIN
	UPDATE tbl_forma_03 a INNER JOIN tbl_estudiante b 
	ON a.num_cuenta_ck = b.num_cuenta_pk INNER JOIN tbl_carrera c ON b.cod_carrera_fk=c.cod_carrera_pk
	SET a.bol_prediccion_aprueba = 0
	WHERE c.txt_nombre_carrera=(SELECT d.txt_valor FROM tbl_parametro d WHERE d.cod_parametro_pk = "cod_carrera_prediccion")
	AND (a.num_anio_ck, a.num_periodo_ck) IN (SELECT * FROM vw_ultimo_periodo);
	
END//
DELIMITER ;

-- Volcando estructura para procedimiento bd_autoscraping.sp_calcular_indices
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_calcular_indices`()
BEGIN

INSERT INTO tbl_indice (num_cuenta_pk, num_periodo_pk, num_anio_pk, num_indice_periodo, num_indice_global)
SELECT A.num_cuenta_ck, A.num_periodo_pk, A.num_anio_pk ANIO, INDICE_PERIODO, INDICE_GLOBAL
            FROM 
            (
                SELECT SUM(A.num_calificacion*A.num_uv)/SUM(A.num_uv) INDICE_PERIODO, A.num_anio_pk, A.num_periodo_pk, A.num_cuenta_ck
                FROM tbl_historial A
                LEFT JOIN tbl_seccion B 
                ON ((B.num_seccion_pk = A.num_seccion_pk)
                    AND (B.num_periodo_pk = A.num_periodo_pk)
                    AND (B.num_anio_pk = A.num_anio_pk)
                    AND (B.cod_asignatura_ck = A.cod_asignatura_ck)
                )
                WHERE (A.txt_obs != 'NSP')
                AND NOT ((A.txt_obs !='APR') AND ((A.num_anio_pk = 2017) AND (A.num_periodo_pk = 2)))
                GROUP BY A.num_cuenta_ck, A.num_periodo_pk, A.num_anio_pk
            ) A 
            INNER JOIN 
            (
                SELECT SUM(NOTAS)/SUM(UVS) INDICE_GLOBAL, A.num_anio_pk, A.num_periodo_pk, CUENTA 
                FROM tbl_historial A 
                INNER JOIN 
                (
                    SELECT A.num_anio_pk, A.num_periodo_pk, A.num_cuenta_ck CUENTA,
                    SUM(A.num_calificacion*A.num_uv) NOTAS, SUM(A.num_uv) UVS, CONCAT(A.num_anio_pk, A.num_periodo_pk) ANIO_PERIODO
                    FROM tbl_historial A
                    LEFT JOIN tbl_seccion B 
                    ON ((B.num_seccion_pk = A.num_seccion_pk)
                        AND (B.num_periodo_pk = A.num_periodo_pk)
                        AND (B.num_anio_pk = A.num_anio_pk)
                        AND (B.cod_asignatura_ck = A.cod_asignatura_ck)
                    )
                    WHERE (A.txt_obs != 'NSP')
                    AND NOT ((A.txt_obs !='APR') AND ((A.num_anio_pk = 2017) AND (A.num_periodo_pk = 2)))
                    GROUP BY A.num_cuenta_ck, A.num_periodo_pk, A.num_anio_pk
                ) B
                ON (B.ANIO_PERIODO <= CONCAT(A.num_anio_pk, A.num_periodo_pk))
                WHERE (A.txt_obs != 'NSP')
                AND NOT ((A.txt_obs !='APR') AND ((A.num_anio_pk = 2017) AND (A.num_periodo_pk = 2)))
                GROUP BY A.num_periodo_pk, A.num_anio_pk
            ) B
            ON (A.num_anio_pk = B.num_anio_pk AND A.num_periodo_pk = B.num_periodo_pk)
            INNER JOIN TBL_ESTUDIANTE C
            ON (A.num_cuenta_ck = C.num_cuenta_pk)
            ORDER BY A.num_anio_pk ASC, A.num_periodo_pk ASC;

END//
DELIMITER ;

-- Volcando estructura para tabla bd_autoscraping.tbl_areas
CREATE TABLE IF NOT EXISTS `tbl_areas` (
  `cod_area_pk` int(11) NOT NULL AUTO_INCREMENT,
  `txt_nombre_area` varchar(100) COLLATE utf8_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`cod_area_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_autoscraping.tbl_asignatura
CREATE TABLE IF NOT EXISTS `tbl_asignatura` (
  `cod_asignatura_pk` varchar(8) COLLATE utf8_spanish_ci NOT NULL,
  `cod_area_pk` int(11) DEFAULT NULL,
  `txt_nombre_asignatura` varchar(200) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`cod_asignatura_pk`),
  KEY `cod_area1` (`cod_area_pk`),
  CONSTRAINT `cod_area1` FOREIGN KEY (`cod_area_pk`) REFERENCES `tbl_areas` (`cod_area_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_autoscraping.tbl_asignatura_a_cursar
CREATE TABLE IF NOT EXISTS `tbl_asignatura_a_cursar` (
  `num_cuenta_ck` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `cod_asignatura_x_plan_estudio_ck` int(11) NOT NULL,
  `num_anio_ck` int(11) NOT NULL,
  `num_periodo_ck` int(11) NOT NULL,
  `bol_predecida` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`cod_asignatura_x_plan_estudio_ck`,`num_anio_ck`,`num_periodo_ck`,`num_cuenta_ck`),
  KEY `fk_tbl_predicciones_tbl_asignatura_x_plan_estudio1_idx` (`cod_asignatura_x_plan_estudio_ck`),
  KEY `fk_tbl_predicciones_tbl_periodo1_idx` (`num_anio_ck`,`num_periodo_ck`),
  KEY `fk_tbl_predicciones_tbl_estudiante1_idx` (`num_cuenta_ck`),
  CONSTRAINT `fk_tbl_predicciones_tbl_asignatura_x_plan_estudio1` FOREIGN KEY (`cod_asignatura_x_plan_estudio_ck`) REFERENCES `tbl_asignatura_x_plan_estudio` (`cod_asignatura_x_plan_estudio_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_predicciones_tbl_estudiante1` FOREIGN KEY (`num_cuenta_ck`) REFERENCES `tbl_estudiante` (`num_cuenta_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_predicciones_tbl_periodo1` FOREIGN KEY (`num_anio_ck`, `num_periodo_ck`) REFERENCES `tbl_periodo` (`num_anio_pk`, `num_periodo_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_autoscraping.tbl_asignatura_x_plan_estudio
CREATE TABLE IF NOT EXISTS `tbl_asignatura_x_plan_estudio` (
  `cod_asignatura_x_plan_estudio_pk` int(11) NOT NULL AUTO_INCREMENT,
  `cod_plan_estudio_fk` int(11) NOT NULL,
  `cod_asignatura_fk` varchar(8) COLLATE utf8_spanish_ci NOT NULL,
  `bol_pertenece_carrera` tinyint(4) DEFAULT NULL,
  `bol_asignatura_optativa` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`cod_asignatura_x_plan_estudio_pk`),
  KEY `fk_tbl_asignatura_x_plan_estudio_tbl_plan_estudio1_idx` (`cod_plan_estudio_fk`),
  KEY `fk_tbl_asignatura_x_plan_estudio_tbl_asignatura1_idx` (`cod_asignatura_fk`),
  CONSTRAINT `fk_tbl_asignatura_x_plan_estudio_tbl_asignatura1` FOREIGN KEY (`cod_asignatura_fk`) REFERENCES `tbl_asignatura` (`cod_asignatura_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_asignatura_x_plan_estudio_tbl_plan_estudio1` FOREIGN KEY (`cod_plan_estudio_fk`) REFERENCES `tbl_plan_estudio` (`cod_plan_estudio_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=947 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_autoscraping.tbl_carrera
CREATE TABLE IF NOT EXISTS `tbl_carrera` (
  `cod_carrera_pk` int(11) NOT NULL AUTO_INCREMENT,
  `txt_nombre_carrera` varchar(100) COLLATE utf8_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`cod_carrera_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_autoscraping.tbl_docente
CREATE TABLE IF NOT EXISTS `tbl_docente` (
  `num_docente_pk` varchar(30) COLLATE utf8_spanish_ci NOT NULL,
  `txt_nombre` varchar(60) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`num_docente_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_autoscraping.tbl_estudiante
CREATE TABLE IF NOT EXISTS `tbl_estudiante` (
  `num_cuenta_pk` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `cod_carrera_fk` int(11) NOT NULL COMMENT 'Antes era txt_carrera varchar 100',
  `txt_nombre` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `txt_centro_estudio` varchar(100) COLLATE utf8_spanish_ci DEFAULT NULL,
  `num_periodos_inactivo` int(11) DEFAULT NULL,
  `bol_egresado_inactivo` int(11) DEFAULT NULL,
  PRIMARY KEY (`num_cuenta_pk`),
  KEY `fk_tbl_estudiante_tbl_carrera1_idx` (`cod_carrera_fk`),
  CONSTRAINT `fk_tbl_estudiante_tbl_carrera1` FOREIGN KEY (`cod_carrera_fk`) REFERENCES `tbl_carrera` (`cod_carrera_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_autoscraping.tbl_forma_03
CREATE TABLE IF NOT EXISTS `tbl_forma_03` (
  `num_cuenta_ck` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `num_anio_ck` int(11) NOT NULL,
  `num_periodo_ck` int(11) NOT NULL,
  `cod_asignatura_x_plan_estudio_ck` int(11) NOT NULL,
  `bol_prediccion_aprueba` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`num_anio_ck`,`num_periodo_ck`,`cod_asignatura_x_plan_estudio_ck`,`num_cuenta_ck`),
  KEY `fk_tbl_forma_03_tbl_asignatura_x_plan_estudio1_idx` (`cod_asignatura_x_plan_estudio_ck`),
  KEY `fk_tbl_forma_03_tbl_periodo1_idx` (`num_anio_ck`,`num_periodo_ck`),
  KEY `fk_tbl_forma_03_tbl_estudiante1_idx` (`num_cuenta_ck`),
  CONSTRAINT `fk_tbl_forma_03_tbl_asignatura_x_plan_estudio1` FOREIGN KEY (`cod_asignatura_x_plan_estudio_ck`) REFERENCES `tbl_asignatura_x_plan_estudio` (`cod_asignatura_x_plan_estudio_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_forma_03_tbl_estudiante1` FOREIGN KEY (`num_cuenta_ck`) REFERENCES `tbl_estudiante` (`num_cuenta_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_forma_03_tbl_periodo1` FOREIGN KEY (`num_anio_ck`, `num_periodo_ck`) REFERENCES `tbl_periodo` (`num_anio_pk`, `num_periodo_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_autoscraping.tbl_historial
CREATE TABLE IF NOT EXISTS `tbl_historial` (
  `num_cuenta_ck` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `cod_asignatura_ck` varchar(8) COLLATE utf8_spanish_ci NOT NULL,
  `num_seccion_pk` int(11) NOT NULL,
  `num_periodo_pk` int(11) NOT NULL,
  `num_anio_pk` int(11) NOT NULL,
  `num_calificacion` int(11) NOT NULL,
  `num_uv` int(11) NOT NULL,
  `txt_obs` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`num_cuenta_ck`,`cod_asignatura_ck`,`num_seccion_pk`,`num_periodo_pk`,`num_anio_pk`),
  KEY `fk_tbl_historial_tbl_estudiante1_idx` (`num_cuenta_ck`),
  KEY `fk_tbl_historial_tbl_seccion1_idx` (`num_seccion_pk`,`cod_asignatura_ck`,`num_periodo_pk`,`num_anio_pk`),
  CONSTRAINT `fk_tbl_historial_tbl_estudiante1` FOREIGN KEY (`num_cuenta_ck`) REFERENCES `tbl_estudiante` (`num_cuenta_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_historial_tbl_seccion1` FOREIGN KEY (`num_seccion_pk`, `cod_asignatura_ck`, `num_periodo_pk`, `num_anio_pk`) REFERENCES `tbl_seccion` (`num_seccion_pk`, `cod_asignatura_ck`, `num_periodo_pk`, `num_anio_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_autoscraping.tbl_indice
CREATE TABLE IF NOT EXISTS `tbl_indice` (
  `num_cuenta_pk` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `num_periodo_pk` int(11) NOT NULL,
  `num_anio_pk` int(11) NOT NULL,
  `num_indice_periodo` int(11) NOT NULL,
  `num_indice_global` int(11) NOT NULL,
  PRIMARY KEY (`num_periodo_pk`,`num_anio_pk`,`num_cuenta_pk`),
  KEY `fk_tbl_indice_tbl_estudiante1_idx` (`num_cuenta_pk`),
  KEY `fk_tbl_indice_tbl_periodo1_idx` (`num_anio_pk`,`num_periodo_pk`),
  CONSTRAINT `fk_tbl_indice_tbl_estudiante1` FOREIGN KEY (`num_cuenta_pk`) REFERENCES `tbl_estudiante` (`num_cuenta_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_indice_tbl_periodo1` FOREIGN KEY (`num_anio_pk`, `num_periodo_pk`) REFERENCES `tbl_periodo` (`num_anio_pk`, `num_periodo_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_autoscraping.tbl_parametro
CREATE TABLE IF NOT EXISTS `tbl_parametro` (
  `cod_parametro_pk` char(50) COLLATE utf8_spanish_ci NOT NULL,
  `txt_descripcion` varchar(500) COLLATE utf8_spanish_ci DEFAULT NULL,
  `txt_valor` varchar(1000) COLLATE utf8_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`cod_parametro_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_autoscraping.tbl_periodo
CREATE TABLE IF NOT EXISTS `tbl_periodo` (
  `num_periodo_pk` int(11) NOT NULL,
  `num_anio_pk` int(11) NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  PRIMARY KEY (`num_anio_pk`,`num_periodo_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_autoscraping.tbl_plan_estudio
CREATE TABLE IF NOT EXISTS `tbl_plan_estudio` (
  `cod_plan_estudio_pk` int(11) NOT NULL AUTO_INCREMENT,
  `cod_carrera_fk` int(11) NOT NULL,
  `num_aprobadas_requeridas` int(11) DEFAULT NULL,
  `num_optativas_aprobadas_requeridas` int(11) DEFAULT NULL,
  PRIMARY KEY (`cod_plan_estudio_pk`),
  KEY `fk_tbl_plan_estudio_tbl_carrera1_idx` (`cod_carrera_fk`),
  CONSTRAINT `fk_tbl_plan_estudio_tbl_carrera1` FOREIGN KEY (`cod_carrera_fk`) REFERENCES `tbl_carrera` (`cod_carrera_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_autoscraping.tbl_requisito_x_asignatura
CREATE TABLE IF NOT EXISTS `tbl_requisito_x_asignatura` (
  `cod_asignatura_x_plan_estudio_ck` int(11) NOT NULL,
  `cod_asignatura_x_plan_estudio_requisito_ck` int(11) NOT NULL,
  PRIMARY KEY (`cod_asignatura_x_plan_estudio_ck`,`cod_asignatura_x_plan_estudio_requisito_ck`),
  KEY `fk_tbl_requisito_x_asignatura_tbl_asignatura_x_plan_estudio_idx` (`cod_asignatura_x_plan_estudio_requisito_ck`),
  CONSTRAINT `fk_tbl_requisito_x_asignatura_tbl_asignatura_x_plan_estudio1` FOREIGN KEY (`cod_asignatura_x_plan_estudio_ck`) REFERENCES `tbl_asignatura_x_plan_estudio` (`cod_asignatura_x_plan_estudio_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_requisito_x_asignatura_tbl_asignatura_x_plan_estudio2` FOREIGN KEY (`cod_asignatura_x_plan_estudio_requisito_ck`) REFERENCES `tbl_asignatura_x_plan_estudio` (`cod_asignatura_x_plan_estudio_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_autoscraping.tbl_seccion
CREATE TABLE IF NOT EXISTS `tbl_seccion` (
  `num_seccion_pk` int(11) NOT NULL AUTO_INCREMENT,
  `num_periodo_pk` int(11) NOT NULL,
  `num_anio_pk` int(11) NOT NULL,
  `cod_asignatura_ck` varchar(8) COLLATE utf8_spanish_ci NOT NULL,
  `num_docente_ck` varchar(30) COLLATE utf8_spanish_ci DEFAULT NULL,
  `txt_HI` varchar(6) COLLATE utf8_spanish_ci NOT NULL,
  `txt_HF` varchar(6) COLLATE utf8_spanish_ci NOT NULL,
  `txt_aula` varchar(200) COLLATE utf8_spanish_ci DEFAULT NULL,
  `txt_edificio` varchar(10) COLLATE utf8_spanish_ci NOT NULL,
  `txt_dias` varchar(15) COLLATE utf8_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`num_seccion_pk`,`cod_asignatura_ck`,`num_periodo_pk`,`num_anio_pk`),
  KEY `fk_tbl_seccion_tbl_asignatura1_idx` (`cod_asignatura_ck`),
  KEY `fk_tbl_seccion_tbl_docente1_idx` (`num_docente_ck`),
  KEY `fk_tbl_seccion_tbl_periodo1_idx` (`num_anio_pk`,`num_periodo_pk`),
  CONSTRAINT `fk_tbl_seccion_tbl_asignatura1` FOREIGN KEY (`cod_asignatura_ck`) REFERENCES `tbl_asignatura` (`cod_asignatura_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_seccion_tbl_docente1` FOREIGN KEY (`num_docente_ck`) REFERENCES `tbl_docente` (`num_docente_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_seccion_tbl_periodo1` FOREIGN KEY (`num_anio_pk`, `num_periodo_pk`) REFERENCES `tbl_periodo` (`num_anio_pk`, `num_periodo_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10511 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_autoscraping.tbl_tipo_usuario
CREATE TABLE IF NOT EXISTS `tbl_tipo_usuario` (
  `cod_tipo_usuario_pk` int(11) NOT NULL AUTO_INCREMENT,
  `txt_tipo_usuario` varchar(45) COLLATE utf8_spanish_ci NOT NULL,
  `cod_interno` varchar(20) COLLATE utf8_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`cod_tipo_usuario_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_autoscraping.tbl_usuario
CREATE TABLE IF NOT EXISTS `tbl_usuario` (
  `cod_usuario_pk` int(11) NOT NULL AUTO_INCREMENT,
  `cod_tipo_usuario_fk` int(11) NOT NULL,
  `txt_nombre` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `num_empleado` varchar(30) COLLATE utf8_spanish_ci NOT NULL,
  `txt_contrasenia` varchar(300) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`cod_usuario_pk`),
  KEY `fk_tbl_usuario_tbl_tipo_usuario1_idx` (`cod_tipo_usuario_fk`),
  CONSTRAINT `fk_tbl_usuario_tbl_tipo_usuario1` FOREIGN KEY (`cod_tipo_usuario_fk`) REFERENCES `tbl_tipo_usuario` (`cod_tipo_usuario_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para vista bd_autoscraping.vw_estudiantes_prediccion
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vw_estudiantes_prediccion` (
	`num_cuenta_pk` VARCHAR(20) NOT NULL COLLATE 'utf8_spanish_ci',
	`cod_carrera_fk` INT(11) NOT NULL COMMENT 'Antes era txt_carrera varchar 100',
	`txt_nombre` VARCHAR(100) NOT NULL COLLATE 'utf8_spanish_ci',
	`txt_centro_estudio` VARCHAR(100) NULL COLLATE 'utf8_spanish_ci',
	`num_periodos_inactivo` INT(11) NULL
) ENGINE=MyISAM;

-- Volcando estructura para vista bd_autoscraping.vw_ultimo_periodo
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vw_ultimo_periodo` (
	`num_anio_pk` INT(11) NOT NULL,
	`num_periodo_pk` INT(11) NOT NULL
) ENGINE=MyISAM;

-- Volcando estructura para vista bd_autoscraping.vw_estudiantes_prediccion
-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vw_estudiantes_prediccion`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_estudiantes_prediccion` AS select `a`.`num_cuenta_pk` AS `num_cuenta_pk`,`a`.`cod_carrera_fk` AS `cod_carrera_fk`,`a`.`txt_nombre` AS `txt_nombre`,`a`.`txt_centro_estudio` AS `txt_centro_estudio`,`a`.`num_periodos_inactivo` AS `num_periodos_inactivo` from `tbl_estudiante` `a` where (`a`.`cod_carrera_fk` = (select `b`.`cod_carrera_pk` from `tbl_carrera` `b` where (`b`.`txt_nombre_carrera` = (select `c`.`txt_valor` from `tbl_parametro` `c` where (`c`.`cod_parametro_pk` = 'cod_carrera_prediccion')))));

-- Volcando estructura para vista bd_autoscraping.vw_ultimo_periodo
-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vw_ultimo_periodo`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_ultimo_periodo` AS (select `t`.`num_anio_pk` AS `num_anio_pk`,`t`.`num_periodo_pk` AS `num_periodo_pk` from (select `bd_autoscraping`.`tbl_periodo`.`num_anio_pk` AS `num_anio_pk`,`bd_autoscraping`.`tbl_periodo`.`num_periodo_pk` AS `num_periodo_pk` from `bd_autoscraping`.`tbl_periodo` where ((`bd_autoscraping`.`tbl_periodo`.`num_periodo_pk` < 4) and (`bd_autoscraping`.`tbl_periodo`.`num_periodo_pk` > 0)) order by `bd_autoscraping`.`tbl_periodo`.`num_anio_pk` desc,`bd_autoscraping`.`tbl_periodo`.`num_periodo_pk` desc,`bd_autoscraping`.`tbl_periodo`.`num_periodo_pk` desc limit 1) `t`);

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
