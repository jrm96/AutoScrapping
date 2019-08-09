-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.14 - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for bd_autoscraping
CREATE DATABASE IF NOT EXISTS `bd_autoscraping` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci */;
USE `bd_autoscraping`;

-- Dumping structure for function bd_autoscraping.buscar_asignatura
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

-- Dumping structure for function bd_autoscraping.buscar_carga
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

-- Dumping structure for function bd_autoscraping.buscar_docente
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

-- Dumping structure for function bd_autoscraping.buscar_estudiante
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
else
	set resultado = 0;
insert into tbl_estudiante (num_cuenta_pk, txt_nombre, txt_centro_estudio, cod_carrera_fk) values (_num_cuenta, _nombre_alumno, _txt_centro_estudio, _cod_carrera);
end if;
            
return resultado;
end//
DELIMITER ;

-- Dumping structure for function bd_autoscraping.buscar_historial
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

-- Dumping structure for function bd_autoscraping.buscar_periodo
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

-- Dumping structure for function bd_autoscraping.buscar_seccion
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

-- Dumping structure for procedure bd_autoscraping.insertar_carga
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

-- Dumping structure for procedure bd_autoscraping.insertar_historial
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

	declare respuesta_periodo tinyint; 
	declare respuesta_asignatura tinyint; 
	declare respuesta_estudiante tinyint;
	declare respuesta_seccion tinyint; 
	declare respuesta_historial tinyint;
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

-- Dumping structure for table bd_autoscraping.tbl_areas
CREATE TABLE IF NOT EXISTS `tbl_areas` (
  `cod_area_pk` int(11) NOT NULL,
  `txt_nombre_area` varchar(100) COLLATE utf8_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`cod_area_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Dumping data for table bd_autoscraping.tbl_areas: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_areas` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_areas` ENABLE KEYS */;

-- Dumping structure for table bd_autoscraping.tbl_asignatura
CREATE TABLE IF NOT EXISTS `tbl_asignatura` (
  `cod_asignatura_pk` varchar(8) COLLATE utf8_spanish_ci NOT NULL,
  `cod_area_pk` int(11) DEFAULT NULL,
  `txt_nombre_asignatura` varchar(200) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`cod_asignatura_pk`),
  KEY `fk_tbl_asignatura_tbl_areas1_idx` (`cod_area_pk`),
  CONSTRAINT `fk_tbl_asignatura_tbl_areas1` FOREIGN KEY (`cod_area_pk`) REFERENCES `tbl_areas` (`cod_area_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Dumping data for table bd_autoscraping.tbl_asignatura: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_asignatura` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_asignatura` ENABLE KEYS */;

-- Dumping structure for table bd_autoscraping.tbl_asignatura_predecida
CREATE TABLE IF NOT EXISTS `tbl_asignatura_predecida` (
  `num_cuenta_ck` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `cod_asignatura_x_plan_estudio_ck` int(11) NOT NULL,
  `num_anio_ck` int(11) NOT NULL,
  `num_periodo_ck` int(11) NOT NULL,
  `bol_predecida` tinyint(4) DEFAULT NULL,
  `num_periodos_inactivo` int(11) DEFAULT NULL,
  PRIMARY KEY (`cod_asignatura_x_plan_estudio_ck`,`num_anio_ck`,`num_periodo_ck`,`num_cuenta_ck`),
  KEY `fk_tbl_predicciones_tbl_asignatura_x_plan_estudio1_idx` (`cod_asignatura_x_plan_estudio_ck`),
  KEY `fk_tbl_predicciones_tbl_periodo1_idx` (`num_anio_ck`,`num_periodo_ck`),
  KEY `fk_tbl_predicciones_tbl_estudiante1_idx` (`num_cuenta_ck`),
  CONSTRAINT `fk_tbl_predicciones_tbl_asignatura_x_plan_estudio1` FOREIGN KEY (`cod_asignatura_x_plan_estudio_ck`) REFERENCES `tbl_asignatura_x_plan_estudio` (`cod_asignatura_x_plan_estudio_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_predicciones_tbl_estudiante1` FOREIGN KEY (`num_cuenta_ck`) REFERENCES `tbl_estudiante` (`num_cuenta_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_predicciones_tbl_periodo1` FOREIGN KEY (`num_anio_ck`, `num_periodo_ck`) REFERENCES `tbl_periodo` (`num_anio_pk`, `num_periodo_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Dumping data for table bd_autoscraping.tbl_asignatura_predecida: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_asignatura_predecida` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_asignatura_predecida` ENABLE KEYS */;

-- Dumping structure for table bd_autoscraping.tbl_asignatura_x_plan_estudio
CREATE TABLE IF NOT EXISTS `tbl_asignatura_x_plan_estudio` (
  `cod_asignatura_x_plan_estudio_pk` int(11) NOT NULL AUTO_INCREMENT,
  `cod_plan_estudio_fk` int(11) NOT NULL,
  `cod_asignatura_fk` varchar(8) COLLATE utf8_spanish_ci NOT NULL,
  `bol_pertenece_carrera` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`cod_asignatura_x_plan_estudio_pk`),
  KEY `fk_tbl_asignatura_x_plan_estudio_tbl_plan_estudio1_idx` (`cod_plan_estudio_fk`),
  KEY `fk_tbl_asignatura_x_plan_estudio_tbl_asignatura1_idx` (`cod_asignatura_fk`),
  CONSTRAINT `fk_tbl_asignatura_x_plan_estudio_tbl_asignatura1` FOREIGN KEY (`cod_asignatura_fk`) REFERENCES `tbl_asignatura` (`cod_asignatura_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_asignatura_x_plan_estudio_tbl_plan_estudio1` FOREIGN KEY (`cod_plan_estudio_fk`) REFERENCES `tbl_plan_estudio` (`cod_plan_estudio_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Dumping data for table bd_autoscraping.tbl_asignatura_x_plan_estudio: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_asignatura_x_plan_estudio` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_asignatura_x_plan_estudio` ENABLE KEYS */;

-- Dumping structure for table bd_autoscraping.tbl_carrera
CREATE TABLE IF NOT EXISTS `tbl_carrera` (
  `cod_carrera_pk` int(11) NOT NULL AUTO_INCREMENT,
  `txt_nombre_carrera` varchar(100) COLLATE utf8_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`cod_carrera_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Dumping data for table bd_autoscraping.tbl_carrera: ~2 rows (approximately)
/*!40000 ALTER TABLE `tbl_carrera` DISABLE KEYS */;
INSERT INTO `tbl_carrera` (`cod_carrera_pk`, `txt_nombre_carrera`) VALUES
	(1, 'INGENIERIA EN SISTEMAS'),
	(3, 'asdf');
/*!40000 ALTER TABLE `tbl_carrera` ENABLE KEYS */;

-- Dumping structure for table bd_autoscraping.tbl_docente
CREATE TABLE IF NOT EXISTS `tbl_docente` (
  `num_docente_pk` varchar(30) COLLATE utf8_spanish_ci NOT NULL,
  `txt_nombre` varchar(60) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`num_docente_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Dumping data for table bd_autoscraping.tbl_docente: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_docente` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_docente` ENABLE KEYS */;

-- Dumping structure for table bd_autoscraping.tbl_estudiante
CREATE TABLE IF NOT EXISTS `tbl_estudiante` (
  `num_cuenta_pk` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `cod_carrera_fk` int(11) NOT NULL COMMENT 'Antes era txt_carrera varchar 100',
  `txt_nombre` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `txt_centro_estudio` varchar(100) COLLATE utf8_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`num_cuenta_pk`),
  KEY `fk_tbl_estudiante_tbl_carrera1_idx` (`cod_carrera_fk`),
  CONSTRAINT `fk_tbl_estudiante_tbl_carrera1` FOREIGN KEY (`cod_carrera_fk`) REFERENCES `tbl_carrera` (`cod_carrera_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Dumping data for table bd_autoscraping.tbl_estudiante: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_estudiante` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_estudiante` ENABLE KEYS */;

-- Dumping structure for table bd_autoscraping.tbl_forma_03
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

-- Dumping data for table bd_autoscraping.tbl_forma_03: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_forma_03` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_forma_03` ENABLE KEYS */;

-- Dumping structure for table bd_autoscraping.tbl_historial
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

-- Dumping data for table bd_autoscraping.tbl_historial: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_historial` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_historial` ENABLE KEYS */;

-- Dumping structure for table bd_autoscraping.tbl_indice
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

-- Dumping data for table bd_autoscraping.tbl_indice: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_indice` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_indice` ENABLE KEYS */;

-- Dumping structure for table bd_autoscraping.tbl_periodo
CREATE TABLE IF NOT EXISTS `tbl_periodo` (
  `num_periodo_pk` int(11) NOT NULL,
  `num_anio_pk` int(11) NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  PRIMARY KEY (`num_anio_pk`,`num_periodo_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Dumping data for table bd_autoscraping.tbl_periodo: ~3 rows (approximately)
/*!40000 ALTER TABLE `tbl_periodo` DISABLE KEYS */;
INSERT INTO `tbl_periodo` (`num_periodo_pk`, `num_anio_pk`, `fecha_inicio`, `fecha_fin`) VALUES
	(3, 2006, NULL, NULL),
	(1, 2011, NULL, NULL),
	(1, 2019, NULL, NULL);
/*!40000 ALTER TABLE `tbl_periodo` ENABLE KEYS */;

-- Dumping structure for table bd_autoscraping.tbl_plan_estudio
CREATE TABLE IF NOT EXISTS `tbl_plan_estudio` (
  `cod_plan_estudio_pk` int(11) NOT NULL AUTO_INCREMENT,
  `cod_carrera_fk` int(11) NOT NULL,
  PRIMARY KEY (`cod_plan_estudio_pk`),
  KEY `fk_tbl_plan_estudio_tbl_carrera1_idx` (`cod_carrera_fk`),
  CONSTRAINT `fk_tbl_plan_estudio_tbl_carrera1` FOREIGN KEY (`cod_carrera_fk`) REFERENCES `tbl_carrera` (`cod_carrera_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Dumping data for table bd_autoscraping.tbl_plan_estudio: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_plan_estudio` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_plan_estudio` ENABLE KEYS */;

-- Dumping structure for table bd_autoscraping.tbl_requisito_x_asignatura
CREATE TABLE IF NOT EXISTS `tbl_requisito_x_asignatura` (
  `cod_asignatura_x_plan_estudio_ck` int(11) NOT NULL,
  `cod_asignatura_x_plan_estudio_requisito_ck` int(11) NOT NULL,
  PRIMARY KEY (`cod_asignatura_x_plan_estudio_ck`,`cod_asignatura_x_plan_estudio_requisito_ck`),
  KEY `fk_tbl_requisito_x_asignatura_tbl_asignatura_x_plan_estudio_idx` (`cod_asignatura_x_plan_estudio_requisito_ck`),
  CONSTRAINT `fk_tbl_requisito_x_asignatura_tbl_asignatura_x_plan_estudio1` FOREIGN KEY (`cod_asignatura_x_plan_estudio_ck`) REFERENCES `tbl_asignatura_x_plan_estudio` (`cod_asignatura_x_plan_estudio_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_requisito_x_asignatura_tbl_asignatura_x_plan_estudio2` FOREIGN KEY (`cod_asignatura_x_plan_estudio_requisito_ck`) REFERENCES `tbl_asignatura_x_plan_estudio` (`cod_asignatura_x_plan_estudio_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Dumping data for table bd_autoscraping.tbl_requisito_x_asignatura: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_requisito_x_asignatura` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_requisito_x_asignatura` ENABLE KEYS */;

-- Dumping structure for table bd_autoscraping.tbl_seccion
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Dumping data for table bd_autoscraping.tbl_seccion: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_seccion` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_seccion` ENABLE KEYS */;

-- Dumping structure for table bd_autoscraping.tbl_tipo_usuario
CREATE TABLE IF NOT EXISTS `tbl_tipo_usuario` (
  `cod_tipo_usuario_pk` int(11) NOT NULL AUTO_INCREMENT,
  `txt_tipo_usuario` varchar(45) COLLATE utf8_spanish_ci NOT NULL,
  `cod_interno` varchar(20) COLLATE utf8_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`cod_tipo_usuario_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Dumping data for table bd_autoscraping.tbl_tipo_usuario: ~2 rows (approximately)
/*!40000 ALTER TABLE `tbl_tipo_usuario` DISABLE KEYS */;
INSERT INTO `tbl_tipo_usuario` (`cod_tipo_usuario_pk`, `txt_tipo_usuario`, `cod_interno`) VALUES
	(1, 'Administrador', 'ADMINISTRADOR'),
	(2, 'Coordinador', 'COORDINADOR');
/*!40000 ALTER TABLE `tbl_tipo_usuario` ENABLE KEYS */;

-- Dumping structure for table bd_autoscraping.tbl_usuario
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

-- Dumping data for table bd_autoscraping.tbl_usuario: ~1 rows (approximately)
/*!40000 ALTER TABLE `tbl_usuario` DISABLE KEYS */;
INSERT INTO `tbl_usuario` (`cod_usuario_pk`, `cod_tipo_usuario_fk`, `txt_nombre`, `num_empleado`, `txt_contrasenia`) VALUES
	(5, 1, 'jefe', '5492', 'bcdcb29ed2aab16d48c11485264df665e906bdd9');
/*!40000 ALTER TABLE `tbl_usuario` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
