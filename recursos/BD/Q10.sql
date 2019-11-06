

SELECT num_periodos_inactivo("20121014277");

delimiter //
CREATE PROCEDURE reset_prediccion()
BEGIN
	UPDATE tbl_forma_03 a INNER JOIN tbl_estudiante b 
	ON a.num_cuenta_ck = b.num_cuenta_pk INNER JOIN tbl_carrera c ON b.cod_carrera_fk=c.cod_carrera_pk
	SET a.bol_prediccion_aprueba = 2
	WHERE c.txt_nombre_carrera=(SELECT d.txt_valor FROM tbl_parametro d WHERE d.cod_parametro_pk = "cod_carrera_prediccion")
	AND (a.num_anio_ck, a.num_periodo_ck) IN (SELECT * FROM vw_ultimo_periodo);
	
END//
delimiter ; 




SELECT * FROM tbl_forma_03 WHERE num_anio_ck=2019 AND num_periodo_ck=2
