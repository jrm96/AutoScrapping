var periodos = [];

$(document).ready(function () {
    $("#tabla-obs").hide();
    $("#estadistica").hide();
    $.ajax({
        url: "/periodo",
        dataType: "json",
        success: function (respuesta) {
            periodos = respuesta;
            slider();
            cargarAsignaturas(periodos[0].anio + "" + periodos[0].periodo, periodos[periodos.length - 1].anio + "" + periodos[periodos.length - 1].periodo);
            cargarDocentes(periodos[0].anio + "" + periodos[0].periodo, periodos[periodos.length - 1].anio + "" + periodos[periodos.length - 1].periodo);
            cargarAreas(periodos[0].anio + "" + periodos[0].periodo, periodos[periodos.length - 1].anio + "" + periodos[periodos.length - 1].periodo);

        }
    });
});

var checkBox = document.getElementById("check_periodo4");

var selectDocentes = $('#docentes').magicSuggest({
    allowFreeEntries: false,
    expandOnFocus: false,
    placeholder: 'Docentes',
    selectFirst: true,
    valueField: "num_docente_pk",
    displayField: "txt_nombre",
    //mode: "remote"		
});

$(selectDocentes).on('selectionchange', function () {
    var filtros = comprobacionFiltros();

    actualizarAsignaturas(filtros.docentes, filtros.areas);
    actualizarAreas(filtros.docentes, filtros.asignaturas);
});

var selectAsignaturas = $('#asignaturas').magicSuggest({
    allowFreeEntries: false,
    expandOnFocus: false,
    placeholder: 'Asignaturas',
    selectFirst: true,
    valueField: "cod_asignatura_pk",
    displayField: "txt_nombre_asignatura",
    //mode: "remote"		
});

$(selectAsignaturas).on('selectionchange', function () {
    var filtros = comprobacionFiltros();
    actualizarDocentes(filtros.asignaturas, filtros.areas);
    actualizarAreas(filtros.docentes, filtros.asignaturas);
});

var selectAreas = $('#areas').magicSuggest({
    allowFreeEntries: false,
    expandOnFocus: false,
    //toggleOnClick: true,
    placeholder: 'Areas',
    selectFirst: true,
    valueField: "cod_area_pk",
    displayField: "txt_nombre_area",
    //mode: "remote"		
});

$(selectAreas).on('selectionchange', function () {
    var filtros = comprobacionFiltros();

    actualizarAsignaturas(filtros.docentes, filtros.areas);
    actualizarDocentes(filtros.asignaturas, filtros.areas);

});

var selectObservaciones = $('#observaciones').magicSuggest({
    allowFreeEntries: false,
    selectFirst: true,
    data: ["APR", "RPB", "ABD", "NSP", "RVS"],
    placeholder: 'Observaciones',
});


///funciones

function slider() {
    $(function () {
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: periodos.length - 1,
            change: function () {
                var filtros = comprobacionFiltros();

                actualizarAsignaturas(filtros.docentes, filtros.areas);
                actualizarAreas(filtros.docentes, filtros.asignaturas);
                actualizarDocentes(filtros.asignaturas, filtros.areas);
            },
            values: [0, periodos.length],
            slide: function (event, ui) {
                $("#amount").val("Desde " + periodos[ui.values[0]].anio + " - " + periodos[ui.values[0]].periodo
                    + "  Hasta " + periodos[ui.values[1]].anio + " - " + periodos[ui.values[1]].periodo
                );
            }
        });
        $("#amount").val(
            "Desde " + periodos[0].anio + " - " + periodos[0].periodo
            + "  Hasta " + periodos[periodos.length - 1].anio + " - " + periodos[periodos.length - 1].periodo);
    });
}

function comprobacionFiltros() {
    var docentes = [];
    var areas = [];
    var asignaturas = [];
    if (selectDocentes.getValue() == 0) {
        if (selectAreas.getValue() == 0) {
            if (selectAsignaturas.getValue() == 0)
                cargarDocentes(periodos[$("#slider-range").slider("values", 0)].anio + "" + periodos[$("#slider-range").slider("values", 0)].periodo, periodos[$("#slider-range").slider("values", 1)].anio + "" + periodos[$("#slider-range").slider("values", 1)].periodo);
            cargarAsignaturas(periodos[$("#slider-range").slider("values", 0)].anio + "" + periodos[$("#slider-range").slider("values", 0)].periodo, periodos[$("#slider-range").slider("values", 1)].anio + "" + periodos[$("#slider-range").slider("values", 1)].periodo);
        }
        if (selectAsignaturas.getValue() == 0)
            cargarAreas(periodos[$("#slider-range").slider("values", 0)].anio + "" + periodos[$("#slider-range").slider("values", 0)].periodo, periodos[$("#slider-range").slider("values", 1)].anio + "" + periodos[$("#slider-range").slider("values", 1)].periodo);
        docentes = "todos";
    }
    else
        docentes = selectDocentes.getValue();
    if (selectAreas.getValue() == 0) {
        if (selectAsignaturas.getValue() == 0)
            cargarDocentes(periodos[$("#slider-range").slider("values", 0)].anio + "" + periodos[$("#slider-range").slider("values", 0)].periodo, periodos[$("#slider-range").slider("values", 1)].anio + "" + periodos[$("#slider-range").slider("values", 1)].periodo);
        areas = "todos";
    }
    else
        areas = selectAreas.getValue();
    if (selectAsignaturas.getValue() == 0) {
        asignaturas = "todos";
    }
    else
        asignaturas = selectAsignaturas.getValue();

    return { asignaturas: asignaturas, docentes: docentes, areas: areas }
}

function cargarDocentes(desde, hasta) {
    $.ajax({
        data: "desde=" + desde + "&hasta=" + hasta,
        url: "/docentes",
        dataType: "json",
        success: function (respuesta) {
            $(function () {
                selectDocentes.setData(respuesta);
            });
        }
    });
}

function actualizarDocentes(asignaturas, areas) {
    $.ajax({
        url: "/actualizar-docentes",
        dataType: "json",
        data: "cod_area=" + areas + "&asignaturas=" + asignaturas + "&desde=" + periodos[$("#slider-range").slider("values", 0)].anio + "" + periodos[$("#slider-range").slider("values", 0)].periodo + "&hasta=" + periodos[$("#slider-range").slider("values", 1)].anio + "" + periodos[$("#slider-range").slider("values", 1)].periodo,
        success: function (respuesta) {
            selectDocentes.setData(respuesta);
        }
    });
}

function cargarAsignaturas(desde, hasta) {
    $.ajax({
        data: "desde=" + desde + "&hasta=" + hasta,
        url: "/asignaturas",
        dataType: "json",
        success: function (respuesta) {
            $(function () {
                selectAsignaturas.setData(respuesta);
            });
        }
    });
}

function actualizarAsignaturas(docentes, areas) {
    $.ajax({
        url: "/actualizar-asignaturas",
        dataType: "json",
        data: "num_docente=" + docentes + "&areas=" + areas + "&desde=" + periodos[$("#slider-range").slider("values", 0)].anio + "" + periodos[$("#slider-range").slider("values", 0)].periodo + "&hasta=" + periodos[$("#slider-range").slider("values", 1)].anio + "" + periodos[$("#slider-range").slider("values", 1)].periodo,
        success: function (respuesta) {
            selectAsignaturas.setData(respuesta);
        }
    });
}

function cargarAreas(desde, hasta) {
    $.ajax({
        data: "desde=" + desde + "&hasta=" + hasta,
        url: "/areas",
        dataType: "json",
        success: function (respuesta) {
            $(function () {
                selectAreas.setData(respuesta);
            });
        }
    });
}

function actualizarAreas(docente, asignatura) {
    $.ajax({
        url: "/actualizar-areas",
        dataType: "json",
        data: "num_docente=" + docente + "&asignaturas=" + asignatura + "&desde=" + periodos[$("#slider-range").slider("values", 0)].anio + "" + periodos[$("#slider-range").slider("values", 0)].periodo + "&hasta=" + periodos[$("#slider-range").slider("values", 1)].anio + "" + periodos[$("#slider-range").slider("values", 1)].periodo,
        success: function (respuesta) {
            selectAreas.setData(respuesta);
        }
    });
}

///Dar click con la tecla enter
$('body').keypress(function (e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        mostrarGrafico();
        e.preventDefault();
        return false;
    }
});

$('#generar').click(function () {
    mostrarGrafico();
});

function mostrarGrafico() {
    $("#generar").prop('disabled', true);
    $("#tabla-obs").hide();
    $('#chartBarras').remove();
    $('#barras-container').append('<canvas id="chartBarras" max-width="auto" height="auto" style="background:white;"></canvas>');
    $('#myChart').remove();
    $('#canvas-container').append('<canvas id="myChart" max-width="400" max-height="400" style="background:white;"></canvas>');
    $("#detalle").hide();
    var datos = comprobacionFiltros();
    $.ajax({
        url: "/estadisticas-obs",
        method: "GET",
        data: "periodo4=" + checkBox.checked + "&obs=" + selectObservaciones.getValue() + "&cuenta=" + $("#cuenta").val() + "&areas=" + datos.areas + "&num_docente=" + datos.docentes + "&asignaturas=" + datos.asignaturas + "&desde=" + periodos[$("#slider-range").slider("values", 0)].anio + "" + periodos[$("#slider-range").slider("values", 0)].periodo + "&hasta=" + periodos[$("#slider-range").slider("values", 1)].anio + "" + periodos[$("#slider-range").slider("values", 1)].periodo,
        dataType: "json", //Tipo de dato de la respuesta del servidor
        success: function (response) {//Funcion que se ejecutara cuando el servidor envie la respuesta
            generarGraficoPastel(response);

        }
    });

    $.ajax({
        url: "/estadisticas-promedioFinal",
        method: "GET",
        data: "periodo4=" + checkBox.checked + "&obs=" + selectObservaciones.getValue() + "&cuenta=" + $("#cuenta").val() + "&areas=" + datos.areas + "&num_docente=" + datos.docentes + "&asignaturas=" + datos.asignaturas + "&desde=" + periodos[$("#slider-range").slider("values", 0)].anio + "" + periodos[$("#slider-range").slider("values", 0)].periodo + "&hasta=" + periodos[$("#slider-range").slider("values", 1)].anio + "" + periodos[$("#slider-range").slider("values", 1)].periodo,
        dataType: "json", //Tipo de dato de la respuesta del servidor
        success: function (response) {//Funcion que se ejecutara cuando el servidor envie la respuesta
            generarGraficoBarras(response);
            $("#generar").prop('disabled', false);
        }
    })

}

function generarGraficoPastel(datos) {
    if (datos.length == 0) {
        alert("No hay registros");
        return;
    }
    var obs = [];
    var numObs = [];
    var colores = [];
    var tabla = '';
    var total = 0;
    var totalPorcentaje = 0;
    for (i = 0; i < datos.length; i++) {
        total += datos[i].NUM_OBS;
    }
    for (i = 0; i < datos.length; i++) {
        tabla += "<tr><td>" + datos[i].OBS + "</td>";
        tabla += "<td>" + datos[i].NUM_OBS + "</td>";
        tabla += "<td>" + Math.round(((datos[i].NUM_OBS / total) * 100) * 100) / 100 + "%</td></tr>"; //para redondear Math.round()
        totalPorcentaje += (datos[i].NUM_OBS / total) * 100;
        obs.push(datos[i].OBS);
        numObs.push(datos[i].NUM_OBS);
        if (datos[i].OBS == "APR") {
            colores.push("rgb(9, 192, 18)");
        } else if (datos[i].OBS == "RPB") {
            colores.push("rgb(201, 15, 15)");
        } else if (datos[i].OBS == "NSP") {
            colores.push("rgb(109, 109, 109)");
        } else if (datos[i].OBS == "ABD") {
            colores.push("rgb(116, 14, 14)");
        } else if (datos[i].OBS == "RVS") {
            colores.push("blue");
        }
    }
    tabla += "<tr><th>" + "Total" + "</th>";
    tabla += "<th>" + total + "</th>";
    tabla += "<th>" + Math.round(totalPorcentaje) + "%</th></tr>";
    $('#tabla-obs > tbody').html(tabla);
    $("#tabla-obs").show();
    var ctx = document.getElementById('myChart').getContext('2d');
    var myLineChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: obs,
            datasets: [{
                label: "Population (millions)",
                backgroundColor: colores,
                data: numObs
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Numero de Registros'
            }
        }
    });
    $("#estadistica").show();
    $('html, body').animate({
        scrollTop: $("#grafico").offset().top
    }, 1000);
}

function generarGraficoBarras(datos) {
    var notas = [];
    var periodos = [];
    for (i = 0; i < datos.length; i++) {
        notas.push(datos[i].PROMEDIO);
        periodos.push(datos[i].ANIO + " - " + datos[i].PERIODO);
    }
    var ctx = document.getElementById('chartBarras').getContext('2d');
    var barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: periodos,
            datasets: [{
                label: "Promedio",
                data: notas,
                backgroundColor: "rgba(49, 171, 241, 0.364)",
                borderColor: "rgb(49, 171, 241)",
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Promedio de notas'
            },
            barThickness: '10',
            scales: {
                xAxes: [{
                    maxBarThickness: 100,
                }],
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }]
            }
        }
    });

    document.getElementById("chartBarras").onclick = function (evt) {
        var activePoints = barChart.getElementsAtEvent(evt);

        if (activePoints.length > 0) {
            //get the internal index of slice in pie chart
            var clickedElementindex = activePoints[0]["_index"];

            //get specific label by index 
            var label = barChart.data.labels[clickedElementindex];

            //get value by index      
            var value = barChart.data.datasets[0].data[clickedElementindex];

            /* other stuff that requires slice's label and value */
            var datos = comprobacionFiltros();
            $.ajax({
                url: "/info-secciones",
                method: "GET",
                data: "cuenta=" + $("#cuenta").val() + "&areas=" + datos.areas + "&num_docente=" + datos.docentes + "&asignaturas=" + datos.asignaturas + "&periodo=" + label.split(" ")[2] + "&anio=" + label.split(" ")[0],
                dataType: "json", //Tipo de dato de la respuesta del servidor
                success: function (response) {//Funcion que se ejecutara cuando el servidor envie la respuesta
                    console.log(response);
                    console.log("completado");
                    var tabla = 0;
                    for (i = 0; i < response.length; i++) {
                        tabla += response[i].ALUMNOS;
                    }
                    console.log(tabla)
                    $('#tabla-detalles').DataTable({
                        "bDestroy": true,
                        data: response,
                        responsive: true,
                        "order": [],
                        "columns": [
                            { "data": "CODIGOASIGNATURA" },
                            { "data": "ASIGNATURA" },
                            { "data": "SECCION" },
                            { "data": "DOCENTE" },
                            { "data": "ALUMNOS" }
                        ],
                        "footerCallback": function (row, data, start, end, display) {
                            var api = this.api(), data;

                            // Remove the formatting to get integer data for summation
                            var intVal = function (i) {
                                return typeof i === 'string' ?
                                    i.replace(/[\$,]/g, '') * 1 :
                                    typeof i === 'number' ?
                                        i : 0;
                            };

                            // Total over all pages
                            total = api
                                .column(4)
                                .data()
                                .reduce(function (a, b) {
                                    return intVal(a) + intVal(b);
                                }, 0);


                            // Update footer
                            $(api.column(4).footer()).html(
                                total
                            );
                        }
                    });
                    //$('#tabla-detalles > tbody').html(tabla);
                    $("#titulo").html('Periodo ' + response[0].PERIODO + ' - ' + response[0].ANIO);
                    $("#detalle").show();

                    $('html, body').animate({
                        scrollTop: $("#detalle").offset().top
                    }, 1000);
                }
            });

        }
    }
}
