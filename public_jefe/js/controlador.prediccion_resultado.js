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
var ultimoPeriodoPredecidoG;

$(document).ready(function() {
    $("#btn-buscar").on("click", function() {
        reloadTablePrediccion();
    })
    obtenerUltimoPeriodoPredecido().done(function() {
        getPeriodosPredecidos().done(function() {
            getCarrerasPredecidas().done(function() {
                loadTablePrediccion();
            })
        });
    });


});

function getFilters() {
    return {
        periodos_inactivos: $("#periodos_inactivos").val()
    }
}

function reloadTablePrediccion() {
    periodos_inactivos = $("#periodos_inactivos").val();
    periodo = $("#periodo").val();
    predecida = $("#predecida").val();
    carrera = $("#carrera").val();


    if (periodo == null) {
        periodo = ultimoPeriodoPredecidoG;
    }

    if (predecida == null)
        predecida = 1;

    url = "/prediccion_resultados?num_periodos_inactivo=" + periodos_inactivos + '&periodo=' + periodo + '&predecida=' + predecida + '&carrera=' + carrera;
    tablePrediccion.clear().draw();
    tablePrediccion.ajax.url(url).load();
}

function loadTablePrediccion() {
    periodos_inactivos = $("#periodos_inactivos").val();
    periodo = $("#periodo").val();
    predecida = $("#predecida").val();
    carrera = $("#carrera").val();

    if (periodo == null) {
        periodo = ultimoPeriodoPredecidoG;
    }

    if (predecida == null)
        predecida = 1;

    tablePrediccion = $("#tablePrediccion").DataTable({
            ajax: {
                scriptCharset: 'utf-8',
                url: "/prediccion_resultados?num_periodos_inactivo=" + periodos_inactivos + '&periodo=' + periodo + '&predecida=' + predecida + '&carrera=' + carrera,
                dataSrc: 'data',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8'
            },
            columns: [
                { data: "cod_asignatura" },
                { data: "asignatura" },
                { data: "num_estudiantes" }
            ],
            pageLength: 50,
            responsive: true,
            autoWidth: false
        })
        // reloadTablePrediccion();

}

function getPeriodosPredecidos() {
    return $.ajax({
        url: "/obtenerPeriodosPredecidos",
        method: "GET",
        dataType: "json",
        success: function(res) {
            console.log(res);
            for (var i = 0; i < res.periodosPredecidos.length; i++) {
                $("#periodo").append(`<option value="${res.periodosPredecidos[i].periodo}">${res.periodosPredecidos[i].periodo}</option>`);
            }
        },
        error: function(error) {
            console.error(error);
        }
    });
}


function obtenerUltimoPeriodoPredecido() {
    return $.ajax({
        url: "/obtenerUltimoPeriodoPredecido",
        method: "GET",
        dataType: "json",
        success: function(res) {
            console.log(res);
            ultimoPeriodoPredecidoG = res.ultimoPeriodoPredecido[0].periodo;
        },
        error: function(error) {
            console.error(error);
        }
    });
}

function getCarrerasPredecidas() {
    return $.ajax({
        url: "/obtenerCarrerasPredecidas",
        method: "GET",
        dataType: "json",
        success: function(resp) {

            for (var i = 0; i < resp.carreras.length; i++) {
                $("#carrera").append(`<option value="${resp.carreras[i].cod_carrera}">${resp.carreras[i].nombre_carrera}</option>`);
            }
        },
        error: function(error) {
            console.error(error);
        }
    });
}