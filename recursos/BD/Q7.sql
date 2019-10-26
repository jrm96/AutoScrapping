
(SELECT a.num_cuenta_ck, b.cod_asignatura_fk, a.num_anio_ck, a.num_periodo_ck, 1 as bol_predecida FROM tbl_forma_03 a
INNER JOIN tbl_asignatura_x_plan_estudio b ON a.cod_asignatura_x_plan_estudio_ck = b.cod_asignatura_x_plan_estudio_pk
 WHERE a.bol_prediccion_aprueba = 1 AND (a.num_anio_ck, a.num_periodo_ck) IN (select * from vw_ultimo_periodo)
 AND a.num_cuenta_ck = "20121014277")
UNION (
SELECT c.num_cuenta_ck, c.cod_asignatura_ck, c.num_anio_pk, c.num_periodo_pk, 0 as bol_predecida FROM tbl_historial c 
WHERE (c.txt_obs = "APR") AND c.num_cuenta_ck = "20121014277")
 ORDER BY num_anio_ck ASC, num_periodo_ck asc;

 
 SELECT a.*,a.cod_asignatura_fk ASIGNATURA, c.cod_asignatura_fk REQUISITO, COUNT(c.cod_asignatura_fk) NREQ FROM tbl_asignatura_x_plan_estudio a INNER JOIN tbl_requisito_x_asignatura b
 ON a.cod_asignatura_x_plan_estudio_pk = b.cod_asignatura_x_plan_estudio_ck
 INNER JOIN tbl_asignatura_x_plan_estudio c ON b.cod_asignatura_x_plan_estudio_requisito_ck = c.cod_asignatura_x_plan_estudio_pk
 WHERE a.cod_plan_estudio_fk = 1 AND a.bol_pertenece_carrera = 1 
 AND c.cod_asignatura_fk IN (S
 
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
 	
 )
 GROUP BY ASIGNATURA
 HAVING COUNT(DISTINCT REQUISITO = NREQ) ;
 
 
 (SELECT b.cod_asignatura_fk ASIGNATURA, T.ASIGNATURA  ASG FROM tbl_forma_03 a
		INNER JOIN tbl_asignatura_x_plan_estudio b ON a.cod_asignatura_x_plan_estudio_ck = b.cod_asignatura_x_plan_estudio_pk
		FULL JOIN (SELECT c.cod_asignatura_ck ASIGNATURA FROM tbl_historial c WHERE (c.txt_obs = "APR") AND c.num_cuenta_ck = "20121014277") t
		ON (ASIGNATURA=ASG) 
		 WHERE a.bol_prediccion_aprueba = 1 AND (a.num_anio_ck, a.num_periodo_ck) IN (select * from vw_ultimo_periodo)
		 AND a.num_cuenta_ck = "20121014277")
		
		
 
 AND REQUISITOS IN HISTORIAL+FORM AND CODASIG NOT IN HITORIAL+FO
