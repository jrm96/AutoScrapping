$(document).ready(function (){
	getCarreras();
	getParametros();
});
	var campoCarrera = [
		{id:'slc-carrera-prediccion', valido:false}
	];

	var campoPeriodo = [
		{id:'slc-num-periodos-prediccion', valido:false}
	];

//CARRERA
//al apretar boton "btn-editar-carrera"
$("#btn-editar-carrera").click(function(){
	$("#div-carrera").show();
	$("#btn-cancelar-carrera").show();
	$("#btn-editar-carrera").hide();
	$("#btn-realizar-cambios-carrera").show();
});
//al apretar boton "btn-cancelar-carrera"
$("#btn-cancelar-carrera").click(function(){
	$("#div-carrera").hide();
	$("#slc-carrera-prediccion").val("");
	$("#btn-editar-carrera").show();
	$("#btn-cancelar-carrera").hide();
	$("#btn-realizar-cambios-carrera").hide();
});

//PERIODO
//al apretar boton "btn-editar-num-periodos"
$("#btn-editar-num-periodos").click(function(){
	$("#div-num-periodos").show();
	$("#btn-cancelar-periodo").show();
	$("#btn-editar-num-periodos").hide();
	$("#btn-realizar-cambios-periodo").show();
});
//al apretar boton "btn-cancelar-periodo"
$("#btn-cancelar-periodo").click(function(){
	$("#div-num-periodos").hide();
	$("#slc-num-periodos-prediccion").val("");
	$("#btn-editar-num-periodos").show();
	$("#btn-cancelar-periodo").hide();
	$("#btn-realizar-cambios-periodo").hide();
});


function getCarreras(){
    $.ajax({
        url:'obtenerCarreras/',
        method:'GET',
        dataType:'json',
        success:(res)=>{
            console.log(res);            
            for (var i = 0; i < res.carreras.length; i++) {
            	var html = `<option value="${res.carreras[i]['codCarrera']}">${res.carreras[i]['nombreCarrera']}</option>`;
            	$("#slc-carrera-prediccion").append(html);
            }
        },
        error:(error)=>{
            console.error(error);
        }
    });
}

function getParametros(){
    $.ajax({
        url:'obtenerParametros/',
        method:'GET',
        dataType:'json',
        success:(res)=>{
            console.log(res);            
            $("#name-carrera-bd").val(res.parametros[0].valor);
            $("#num-periodo-bd").val(res.parametros[1].valor);
        },
        error:(error)=>{
            console.error(error);
        }
    });
}

function validarCampoVacioCarrera(id){
    var resultado = ($(`#${id} option:selected`).val()=="")?false:true;
    marcarInputCarrera(id,resultado);
    return resultado; 
    
}

function marcarInputCarrera(id, valido){
    if (valido){
        $("#mensaje-error-carrera").hide();
        $("#mensaje-exito-carrera").show();
        $("#mensaje-exito-carrera").hide(2500);
    }else{        
        $("#mensaje-error-carrera").show();
        $("#mensaje-error-carrera").hide(2500);
        $("#mensaje-exito-carrera").hide();
    }
}

function validarCampoVacioPeriodo(id){
    var resultado = ($(`#${id} option:selected`).val()=="")?false:true;
    marcarInputPeriodo(id,resultado);
    return resultado; 
    
}

function marcarInputPeriodo(id, valido){
    if (valido){
        $("#mensaje-error-periodo").hide();
        $("#mensaje-exito-periodo").show();
        $("#mensaje-exito-periodo").hide(2500);
    }else{        
        $("#mensaje-error-periodo").show();
        $("#mensaje-error-periodo").hide(2500);
        $("#mensaje-exito-periodo").hide();
    }
}



function updateCarrera(){
	for (var i = 0; i<campoCarrera.length; i++)
		campoCarrera[i].valido = validarCampoVacioCarrera(campoCarrera[i].id);

	for (let i = 0; i<campoCarrera.length; i++)
		if (!campoCarrera[i].valido)
			return
	
	var carrera = $(`#slc-carrera-prediccion option:selected`).text()
	var data = `carrera=${carrera}`;

    $.ajax({
        url:`updateParametroCarrera/`,
        method:'PUT',
        data:data,
        dataType:'json',
        success:(res)=>{
            console.log(res);         
            getParametros();
        },
        error:(error)=>{
            console.error(error);
        }
    });
}

function updatePeriodo(){
	for (var i = 0; i<campoPeriodo.length; i++)
		campoPeriodo[i].valido = validarCampoVacioPeriodo(campoPeriodo[i].id);

	for (let i = 0; i<campoPeriodo.length; i++)
		if (!campoPeriodo[i].valido)
			return
	
	var periodo = $(`#slc-num-periodos-prediccion option:selected`).text()
	var data = `periodo=${periodo}`;
    
    $.ajax({
        url:`updateParametroPeriodo/`,
        method:'PUT',
        data:data,
        dataType:'json',
        success:(res)=>{
            console.log(res);           
            getParametros();
        },
        error:(error)=>{
            console.error(error);
        }
    });
}