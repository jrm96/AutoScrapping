
CREATE FUNCTION get
(SELECT a.num_cuenta_ck, b.cod_asignatura_fk, a.num_anio_ck, a.num_periodo_ck, 1 as bol_predecida FROM tbl_forma_03 a
INNER JOIN tbl_asignatura_x_plan_estudio b ON a.cod_asignatura_x_plan_estudio_ck = b.cod_asignatura_x_plan_estudio_pk
 WHERE a.bol_prediccion_aprueba = 1 AND (a.num_anio_ck, a.num_periodo_ck) IN (select * from vw_ultimo_periodo)
 AND a.num_cuenta_ck = "20121014277")
UNION (
SELECT c.num_cuenta_ck, c.cod_asignatura_ck, c.num_anio_pk, c.num_periodo_pk, 0 as bol_predecida FROM tbl_historial c 
WHERE (c.txt_obs = "APR" OR c.txt_obs = "RVS") AND c.num_cuenta_ck = "20121014277")
 ORDER BY num_anio_ck ASC, num_periodo_ck asc;
 
 SELECT * FROM tbl_asignatura_x_plan_estudio a LEFT JOIN tbl_requisito_x_asignatura b
 ON a.cod_asignatura_x_plan_estudio_pk = b.cod_asignatura_x_plan_estudio_ck;
