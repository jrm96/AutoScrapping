

delimiter //

CREATE PROCEDURE estudiantes_prediccion()
BEGIN 
	SELECT A.num_cuenta_ck, indice_estudiante_prediccion(A.num_cuenta_ck) FROM tbl_forma_03 A WHERE (A.num_anio_ck, A.num_periodo_ck) IN
 	(SELECT * FROM (SELECT num_anio_pk, num_periodo_pk FROM tbl_periodo
	  WHERE num_periodo_pk < 4 AND num_periodo_pk > 0 ORDER BY num_anio_pk DESC, num_periodo_pk DESC, num_periodo_pk DESC LIMIT 1) AS T) 
  GROUP BY A.num_cuenta_ck ORDER BY indice_estudiante_prediccion(A.num_cuenta_ck) DESC;

END //

delimiter ;


CREATE VIEW vw_estudiantes_prediccion AS
  SELECT A.num_cuenta_ck, indice_estudiante_prediccion(A.num_cuenta_ck) FROM tbl_forma_03 A WHERE (A.num_anio_ck, A.num_periodo_ck) IN
 	(SELECT * FROM (SELECT num_anio_pk, num_periodo_pk FROM tbl_periodo
	  WHERE num_periodo_pk < 4 AND num_periodo_pk > 0 ORDER BY num_anio_pk DESC, num_periodo_pk DESC, num_periodo_pk DESC LIMIT 1) AS T) 
  GROUP BY A.num_cuenta_ck ORDER BY indice_estudiante_prediccion(A.num_cuenta_ck) DESC;

SELECT * from vw_estudiantes_prediccion;





delimiter //

CREATE FUNCTION indice_asignatura5(_cod_asignatura VARCHAR(8)) RETURNS DOUBLE 
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

delimiter ;

SELECT * FROM tbl_historial a WHERE a.cod_asignatura_ck = "AN101" ORDER BY num_anio_pk DESC, num_periodo_pk DESC;
SELECT a.* FROM tbl_forma_03 a INNER JOIN tbl_asignatura_x_plan_estudio b 
ON a.cod_asignatura_x_plan_estudio_ck = b.cod_asignatura_x_plan_estudio_pk
WHERE b.cod_asignatura_fk = "AN101"; 


SELECT indice_asignatura('MM110')/100;




delimiter //

CREATE PROCEDURE tbl_forma_03