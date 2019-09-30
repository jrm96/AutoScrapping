
##Estudiantes ordenados descendentemente por su promedio de índices de periodo
SELECT A.num_cuenta_ck, indice_estudiante_prediccion(A.num_cuenta_ck) FROM tbl_forma_03 A WHERE (A.num_anio_ck, A.num_periodo_ck) IN
 	(SELECT * FROM (SELECT num_anio_pk, num_periodo_pk FROM tbl_periodo
	  WHERE num_periodo_pk < 4 AND num_periodo_pk > 0 ORDER BY num_anio_pk DESC, num_periodo_pk DESC, num_periodo_pk DESC LIMIT 1) AS T) 
  GROUP BY A.num_cuenta_ck ORDER BY indice_estudiante_prediccion(A.num_cuenta_ck) DESC;


select indice_estudiante_prediccion('20121014277');

##Hacer una función que al igual que la que saca el promedio de indices de los estudiantes así también 
##saque el promedio de índices de una asignatura

SELECT B.cod_asignatura_fk, C.txt_nombre_asignatura, A.num_anio_ck, A.num_periodo_ck
FROM tbl_forma_03 A INNER JOIN tbl_asignatura_x_plan_estudio B 
ON A.cod_asignatura_x_plan_estudio_ck = B.cod_asignatura_x_plan_estudio_pk 
INNER JOIN tbl_asignatura C ON C.cod_asignatura_pk = cod_asignatura_fk
WHERE (A.num_anio_ck, A.num_periodo_ck) =
 	(SELECT * FROM (SELECT num_anio_pk, num_periodo_pk FROM tbl_periodo
	  WHERE num_periodo_pk < 4 AND num_periodo_pk > 0 ORDER BY num_anio_pk DESC, num_periodo_pk DESC, num_periodo_pk DESC LIMIT 1) AS T)
AND B.cod_asignatura_fk = "AN101" 
GROUP BY B.cod_asignatura_fk;


SELECT B.cod_asignatura_fk FROM tbl_forma_03 A INNER JOIN tbl_asignatura_x_plan_estudio B
ON A.cod_asignatura_x_plan_estudio_ck = B.cod_asignatura_x_plan_estudio_pk
WHERE (A.num_anio_ck, A.num_periodo_ck) =
 	(SELECT * FROM (SELECT num_anio_pk, num_periodo_pk FROM tbl_periodo
	  WHERE num_periodo_pk < 4 AND num_periodo_pk > 0 ORDER BY num_anio_pk DESC, num_periodo_pk DESC, num_periodo_pk DESC LIMIT 1) AS T)
GROUP BY B.cod_asignatura_fk;

SELECT * FROM tbl_historial a WHERE a.cod_asignatura_ck = "AN101" AND a.num_anio_pk = 2019 AND a.num_periodo_pk = 2







SELECT * FROM tbl_seccion WHERE cod_asignatura_ck = "MM111";


SELECT 0.5*COUNT(*) FROM vw_estudiantes_prediccion;

SELECT num_anio_ck, num_periodo_ck FROM tbl_forma_03 A GROUP BY A.num_cuenta_ck ORDER BY A.num_periodo_ck, A.num_anio_ck DESC LIMIT 1;

SELECT * FROM tbl_periodo WHERE num_periodo_pk < 4 AND num_periodo_pk > 0 ORDER BY num_anio_pk DESC , num_periodo_pk DESC LIMIT 1;


SELECT A.num_cuenta_ck FROM tbl_forma_03 A GROUP BY A.num_cuenta_ck ORDER BY CAST(A.num_cuenta_ck as unsigned) desc LIMIT 10;


limitar a los numeros de cuenta que 