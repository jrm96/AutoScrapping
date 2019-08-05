///Dar click con la tecla enter
$('#cuenta').keypress(function(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        buscarHistorial();
        e.preventDefault();
        return false;
    }
});

$('#buscar').click(function () {
    buscarHistorial();
});

function buscarHistorial(){
    $.ajax({
        url: "/buscar-estudiante",
        method: "POST",
        data: "cuenta=" + $("#cuenta").val(),
        dataType: "json", //Tipo de dato de la respuesta del servidor
        success: function (response) {//Funcion que se ejecutara cuando el servidor envie la respuesta
            console.log(response);
            generarGrafico(response);
            tablaHistorial();
            //$("#respuesta").append(response);
            //alert(response.usuario);
        }
    });
}

function generarGrafico(historial) {
    $('#myChart').remove();
    $('#canvas-container').append('<canvas id="myChart" max-width="900" max-height="900" style="background:white;"></canvas>');
    if(historial.length == 0){
        alert("No hay registros para esa cuenta");
        return;
    }
    $('#estudiante').html(historial[0].NOMBRE);
    $('#indice').html(historial[historial.length-1].INDICE_GLOBAL);
    $('#centro_estudio').html(historial[0].CENTRO_ESTUDIO);
    $('#carrera').html(historial[0].CARRERA);
    $('#myChart').remove();
    $('#canvas-container').append('<canvas id="myChart" max-width="700" max-height="700" style="background:white;"></canvas>');
    var periodos = [];
    var notasPeriodo = [];
    var notasGlobal = [];
    for (i = 0; i < historial.length; i++) {
        periodos.push(historial[i].ANIO + "-" + historial[i].PERIODO);
        notasPeriodo.push(historial[i].INDICE_PERIODO);
        notasGlobal.push(historial[i].INDICE_GLOBAL);
    }
    var lineChartData = {
        labels: periodos,
        datasets: [{
            label: 'Índice Global',
            borderColor: "#ED7D31",
            backgroundColor: "#ED7D31",
            fill: false,
            data: notasGlobal,
        }, {
            label: 'Índice Periodo',
            borderColor: "#5B9BD5",
            backgroundColor: "#5B9BD5",
            fill: false,
            data: notasPeriodo,
        }]
    };

    var ctx = document.getElementById('myChart').getContext('2d');
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: lineChartData,
        options: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 80,
                    fontColor: 'black'
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }]
            }
        }
    });
}

function tablaHistorial(){
    $.ajax({
        url: "/historial-estudiante",
        method: "POST",
        data: "cuenta=" + $("#cuenta").val(),
        dataType: "json", //Tipo de dato de la respuesta del servidor
        success: function (response) {//Funcion que se ejecutara cuando el servidor envie la respuesta
            console.log(response);
            $('#historial').DataTable({
                "bDestroy": true,
                data :response,
                responsive: true,
                "order": [],
                "columns": [
                    { "data": "cod_asignatura_ck"},
                    { "data": "txt_nombre_asignatura" },
                    { "data": "num_uv" },
                    { "data": "num_seccion_pk" },
                    { "data": "num_anio_pk" },
                    { "data": "num_periodo_pk"},
                    { "data": "num_calificacion"},
                    { "data": "txt_obs"}        
                ]
            });  
        }
    })
}