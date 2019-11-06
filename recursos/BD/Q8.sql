 delimiter //
CREATE PROCEDURE calcular_asignaturas_predecidas()
BEGIN 
	DECLARE anio INT;
	DECLARE periodo INT;
	
	SELECT v.num_anio_pk, v.num_periodo_pk INTO anio, periodo FROM vw_ultimo_periodo v;
	
	DELETE FROM tbl_asignatura_predecida WHERE num_anio_ck = anio AND num_periodo_ck = periodo; 
	
	SELECT asignaturas_predecidas(num_cuenta_pk, anio, periodo) 
	FROM vw_estudiantes_prediccion;

END//

delimiter ;


SELECT num_periodos_inactivo(num_cuenta_pk)  
	FROM vw_estudiantes_prediccion;
	
call calcular_asignaturas_predecidas();

 
delimiter //

CREATE FUNCTION asignaturas_predecidas(_num_cuenta VARCHAR(20), _anio INT, _periodo INT) RETURNS BOOLEAN
BEGIN 

	#Hacer un insert para que inserte en la tabla de asignaturas predecidas
	INSERT INTO tbl_asignatura_predecida  (num_cuenta_ck, cod_asignatura_x_plan_estudio_ck,
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

delimiter ;
 
 	SELECT m.num_cuenta_ck, n.cod_asignatura_fk, m.num_anio_ck, m.num_periodo_ck
	FROM tbl_asignatura_predecida m INNER JOIN tbl_asignatura_x_plan_estudio n
	ON m.cod_asignatura_x_plan_estudio_ck = n.cod_asignatura_x_plan_estudio_pk
 	WHERE (m.num_cuenta_ck, n.cod_asignatura_fk, m.num_anio_ck, m.num_periodo_ck) NOT IN
	  (
	 	
		SELECT c.num_cuenta_ck, c.cod_asignatura_ck, c.num_anio_pk, c.num_periodo_pk FROM tbl_historial c 
		WHERE (c.txt_obs = "APR") 
		 		
	 ) AND m.num_anio_ck = 2019 AND m.num_periodo_ck = 3;
 	
 
 	
 	SELECT COUNT(*) FROM tbl_asignatura_predecida a WHERE a.num_anio_ck = 2019 AND a.num_periodo_ck = 3;
 	
	SELECT a.num_cuenta_ck, a.cod_asignatura_x_plan_estudio_ck, a.num_anio_ck, a.num_periodo_ck
	FROM tbl_forma_03 a
	WHERE a.num_anio_ck = 2019 AND a.num_periodo_ck = 3 AND a.bol_prediccion_aprueba = 1;
 	

delimter //
CREATE FUNCTION update_asignaturas_predecidas(_anio INT , _periodo INT) RETURNS BOOLEAN
BEGIN



END//

delimiter ; 





select count(*) as numEstudiantes, b.cod_asignatura_fk as asignatura 
                from bd_autoscraping.tbl_asignatura_predecida a
                inner join bd_autoscraping.tbl_asignatura_x_plan_estudio b
                on(a.cod_asignatura_x_plan_estudio_ck = b.cod_asignatura_x_plan_estudio_pk)
                group by a.cod_asignatura_x_plan_estudio_ck;