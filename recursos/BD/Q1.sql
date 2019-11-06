call insertar_historial("20121014277", "Jose", "IS-1","progra", 800, 1, 2019, 80, 5, "APB", "CU", "sistemas" );


SELECT * FROM tbl_carrera;

select cod_carrera_pk from tbl_carrera where txt_nombre_carrera = "INGENIERIA EN SISTEMAS" LIMIT 1;

SET collation_connection = UTF8_SPANISH_CI;

insert into tbl_carrera (txt_nombre_carrera) VALUES ('asdf');


	SELECT cod_plan_estudio_pk FROM tbl_plan_estudio WHERE cod_carrera_fk = 1 LIMIT 1;
	

	SELECT * FROM tbl_asignatura_x_plan_estudio 
	WHERE cod_asignatura_fk = 'IS510' AND cod_plan_estudio_fk = 1
	ORDER BY cod_asignatura_x_plan_estudio_pk DESC LIMIT 1;
	
	ALTER TABLE tbl_asignatura_x_plan_estudio AUTO_INCREMENT = 0;
	
SELECT * FROM tbl_forma_03  WHERE num_cuenta_ck = "20151003441";

DELETE FROM tbl_forma_03 WHERE num_cuenta_ck = "20151003441";

SELECT * FROM tbl_carrera;
SELECT * FROM tbl_plan_estudio;



SELECT * FROM tbl_historial WHERE num_anio_pk = 2020;
            
SELECT * FROM tbl_periodo WHERE num_periodo_pk < 4 AND num_periodo_pk > 0 ORDER BY num_anio_pk DESC , num_periodo_pk DESC LIMIT 5;
