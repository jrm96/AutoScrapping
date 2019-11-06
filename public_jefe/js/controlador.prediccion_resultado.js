// ///Dar click con la tecla enter
// $('#cuenta').keypress(function(e) {
//     var keycode = (e.keyCode ? e.keyCode : e.which);
//     if (keycode == '13') {
//         buscarHistorial();
//         e.preventDefault();
//         return false;
//     }
// });

// function buscarHistorial(){
//     $.ajax({
//         url: "/buscar-estudiante",
//         method: "POST",
//         data: "cuenta=" + $("#cuenta").val(),
//         dataType: "json", //Tipo de dato de la respuesta del servidor
//         success: function (response) {//Funcion que se ejecutara cuando el servidor envie la respuesta
//             console.log(response);
//             generarGrafico(response);
//             tablaHistorial();
//             //$("#respuesta").append(response);
//             //alert(response.usuario);
//         }
//     });
// }

var tablePrediccion;

$(document).ready(function(){
    $("#btn-buscar").on("click", function(){
        reloadTablePrediccion();
    })

    loadTablePrediccion();
});

function getFilters(){
    return {
        periodos_inactivos: $("#periodos_inactivos").val()
    }
}

function reloadTablePrediccion(){
    periodos_inactivos= $("#periodos_inactivos").val();
    url = "/prediccion_resultados?num_periodos_inactivo=" + periodos_inactivos;
    tablePrediccion.clear().draw();
	tablePrediccion.ajax.url( url ).load();
}

function loadTablePrediccion(){

    tablePrediccion = $("#tablePrediccion").DataTable({
        ajax : {
			scriptCharset: 'utf-8',
			url: "/prediccion_resultados?num_periodos_inactivo=3",
			dataSrc: 'data',
			dataType: 'json',
			contentType: 'application/json; charset=utf-8'
		},
        columns: [
            { data: "cod_asignatura" },
            { data: "asignatura" },
            { data: "num_estudiantes" }
        ]
    })

}