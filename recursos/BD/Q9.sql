 
 SELECT a.*,a.cod_asignatura_fk ASIGNATURA, c.cod_asignatura_fk REQUISITO
 FROM tbl_asignatura_x_plan_estudio a INNER JOIN tbl_requisito_x_asignatura b
 ON a.cod_asignatura_x_plan_estudio_pk = b.cod_asignatura_x_plan_estudio_ck
 INNER JOIN tbl_asignatura_x_plan_estudio c ON b.cod_asignatura_x_plan_estudio_requisito_ck = c.cod_asignatura_x_plan_estudio_pk
 WHERE a.cod_plan_estudio_fk = 1 AND a.bol_pertenece_carrera = 1 
 AND c.cod_asignatura_fk IN (
 
		 (SELECT b.cod_asignatura_fk REQUISITO FROM tbl_forma_03 a
		INNER JOIN tbl_asignatura_x_plan_estudio b ON a.cod_asignatura_x_plan_estudio_ck = b.cod_asignatura_x_plan_estudio_pk
		 WHERE a.bol_prediccion_aprueba = 1 AND (a.num_anio_ck, a.num_periodo_ck) IN (select * from vw_ultimo_periodo)
		 AND a.num_cuenta_ck = "20141005213"
		UNION 
		SELECT c.cod_asignatura_ck REQUISITO FROM tbl_historial c 
		WHERE (c.txt_obs = "APR") AND c.num_cuenta_ck = "20141005213")
 
 )
 AND a.cod_asignatura_fk NOT IN (
 	
 	(SELECT b.cod_asignatura_fk ASIGNATURA FROM tbl_forma_03 a
	INNER JOIN tbl_asignatura_x_plan_estudio b ON a.cod_asignatura_x_plan_estudio_ck = b.cod_asignatura_x_plan_estudio_pk
	 WHERE a.bol_prediccion_aprueba = 1 AND (a.num_anio_ck, a.num_periodo_ck) IN (select * from vw_ultimo_periodo)
	 AND a.num_cuenta_ck = "20141005213"
	UNION 
	SELECT c.cod_asignatura_ck ASIGNATURA FROM tbl_historial c 
	WHERE (c.txt_obs = "APR") AND c.num_cuenta_ck = "20141005213")
 	
 );