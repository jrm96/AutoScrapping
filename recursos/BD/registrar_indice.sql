drop procedure if exists registrar_indice;
delimiter $$
create procedure registrar_indice(in _num_periodo int, in _num_year int, in _num_cuenta varchar (20))
BEGIN

declare indice_periodo float;
declare indice_global_x_periodo float;
declare primer_periodo_cursado int;

-- calcula y asigna el índice del periodo.
select (sum(num_calificacion*num_uv))/(sum(num_uv)) into indice_periodo
from tbl_historial where num_cuenta_ck = _num_cuenta and num_periodo_pk = _num_periodo and num_anio_pk = _num_year;

-- obtienemos y asignamos el primer periodo cursado.
select min(concat(num_anio_pk,num_periodo_pk)) into primer_periodo_cursado from tbl_historial where num_cuenta_ck = _num_cuenta;

-- calcula y asigna el índice global por cada periodo de un estudiante.
select (sum(num_calificacion*num_uv))/(sum(num_uv)) into indice_global_x_periodo
from tbl_historial 
where num_cuenta_ck =_num_cuenta 
and concat(num_anio_pk,num_periodo_pk) between primer_periodo_cursado and concat(_num_year,_num_periodo);

if indice_global_x_periodo != null
then
	insert into tbl_indices (num_cuenta_pk,num_periodo_pk,num_anio_pk,num_indice_periodo,num_indice_global) 
	values(_num_cuenta,_num_periodo,_num_year,indice_periodo,indice_global_x_periodo);
end if;
END
delimiter $$;