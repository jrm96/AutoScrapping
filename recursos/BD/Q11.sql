
SELECT M.NUM_OBS/N.SUM_NUM_OBS * 100 FROM (
	SELECT  COUNT(A.txt_obs) NUM_OBS, A.txt_obs OBS      
	    FROM tbl_historial A
	    INNER JOIN tbl_seccion B
	    ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
	            AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
	    INNER JOIN tbl_asignatura C 
	    ON B.cod_asignatura_ck = C.cod_asignatura_pk
	    WHERE C.cod_asignatura_pk IN ('IS410')
	   AND (B.num_anio_pk, B.num_periodo_pk) IN (SELECT * FROM (SELECT num_anio_pk, num_periodo_pk FROM tbl_periodo
	  WHERE num_periodo_pk < 4 AND num_periodo_pk > 0 ORDER BY num_anio_pk DESC, num_periodo_pk DESC, num_periodo_pk DESC LIMIT 5) AS T)
	   GROUP BY A.txt_obs
) M INNER JOIN (
		SELECT  COUNT(A.txt_obs) SUM_NUM_OBS, A.txt_obs OBS      
	    FROM tbl_historial A
	    INNER JOIN tbl_seccion B
	    ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
	            AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
	    INNER JOIN tbl_asignatura C 
	    ON B.cod_asignatura_ck = C.cod_asignatura_pk
	    WHERE C.cod_asignatura_pk IN ('IS410')
	   AND (B.num_anio_pk, B.num_periodo_pk) IN (SELECT * FROM (SELECT num_anio_pk, num_periodo_pk FROM tbl_periodo
	  WHERE num_periodo_pk < 4 AND num_periodo_pk > 0 ORDER BY num_anio_pk DESC, num_periodo_pk DESC, num_periodo_pk DESC LIMIT 5) AS T)
) N ON 1=1
WHERE M.OBS = 'APR';


SELECT a