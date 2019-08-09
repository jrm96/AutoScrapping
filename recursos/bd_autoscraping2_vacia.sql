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

-- Dumping data for table bd_autoscraping.tbl_areas: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_areas` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_areas` ENABLE KEYS */;

-- Dumping data for table bd_autoscraping.tbl_asignatura: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_asignatura` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_asignatura` ENABLE KEYS */;

-- Dumping data for table bd_autoscraping.tbl_asignatura_predecida: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_asignatura_predecida` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_asignatura_predecida` ENABLE KEYS */;

-- Dumping data for table bd_autoscraping.tbl_asignatura_x_plan_estudio: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_asignatura_x_plan_estudio` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_asignatura_x_plan_estudio` ENABLE KEYS */;

-- Dumping data for table bd_autoscraping.tbl_carrera: ~2 rows (approximately)
/*!40000 ALTER TABLE `tbl_carrera` DISABLE KEYS */;
INSERT INTO `tbl_carrera` (`cod_carrera_pk`, `txt_nombre_carrera`) VALUES
	(1, 'INGENIERIA EN SISTEMAS'),
	(3, 'asdf');
/*!40000 ALTER TABLE `tbl_carrera` ENABLE KEYS */;

-- Dumping data for table bd_autoscraping.tbl_docente: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_docente` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_docente` ENABLE KEYS */;

-- Dumping data for table bd_autoscraping.tbl_estudiante: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_estudiante` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_estudiante` ENABLE KEYS */;

-- Dumping data for table bd_autoscraping.tbl_forma_03: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_forma_03` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_forma_03` ENABLE KEYS */;

-- Dumping data for table bd_autoscraping.tbl_historial: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_historial` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_historial` ENABLE KEYS */;

-- Dumping data for table bd_autoscraping.tbl_indice: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_indice` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_indice` ENABLE KEYS */;

-- Dumping data for table bd_autoscraping.tbl_periodo: ~3 rows (approximately)
/*!40000 ALTER TABLE `tbl_periodo` DISABLE KEYS */;
INSERT INTO `tbl_periodo` (`num_periodo_pk`, `num_anio_pk`, `fecha_inicio`, `fecha_fin`) VALUES
	(3, 2006, NULL, NULL),
	(1, 2011, NULL, NULL),
	(1, 2019, NULL, NULL);
/*!40000 ALTER TABLE `tbl_periodo` ENABLE KEYS */;

-- Dumping data for table bd_autoscraping.tbl_plan_estudio: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_plan_estudio` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_plan_estudio` ENABLE KEYS */;

-- Dumping data for table bd_autoscraping.tbl_requisito_x_asignatura: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_requisito_x_asignatura` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_requisito_x_asignatura` ENABLE KEYS */;

-- Dumping data for table bd_autoscraping.tbl_seccion: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_seccion` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_seccion` ENABLE KEYS */;

-- Dumping data for table bd_autoscraping.tbl_tipo_usuario: ~2 rows (approximately)
/*!40000 ALTER TABLE `tbl_tipo_usuario` DISABLE KEYS */;
INSERT INTO `tbl_tipo_usuario` (`cod_tipo_usuario_pk`, `txt_tipo_usuario`, `cod_interno`) VALUES
	(1, 'Administrador', 'ADMINISTRADOR'),
	(2, 'Coordinador', 'COORDINADOR');
/*!40000 ALTER TABLE `tbl_tipo_usuario` ENABLE KEYS */;

-- Dumping data for table bd_autoscraping.tbl_usuario: ~1 rows (approximately)
/*!40000 ALTER TABLE `tbl_usuario` DISABLE KEYS */;
INSERT INTO `tbl_usuario` (`cod_usuario_pk`, `cod_tipo_usuario_fk`, `txt_nombre`, `num_empleado`, `txt_contrasenia`) VALUES
	(5, 1, 'jefe', '5492', 'bcdcb29ed2aab16d48c11485264df665e906bdd9');
/*!40000 ALTER TABLE `tbl_usuario` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
