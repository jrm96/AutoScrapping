$(document).ready(function() {
    $("#btn-iniciar").on("click", function() {
        ejecutarPrediccion();
    });

    $("#barra").hide();
    // monitorearProgreso();
    timer = setInterval(function() { progreso() }, 2000);
});



function ejecutarPrediccion() {
    $.ajax({
        url: "/prediccion_proceso",
        dataType: "text",
        beforeSend: function() {
            $("#btn-iniciar").attr("disabled", true);
        },
        success: function(response) {
            console.log(response);

        }
    });
}

function monitorearProgreso() {
    timer = setInterval(function() {
        $.ajax({
            url: "/getEnPrediccion",
            dataType: "text",
            success: function(res) {
                console.log(res);
                if (res == "true") {
                    $("#btn-iniciar").attr("disabled", true);
                    $("#loading").show();
                } else {
                    $("#btn-iniciar").attr("disabled", false);
                    $("#loading").hide();
                }
            }
        });
    }, 2000);
}

var bar = new ProgressBar.Line("#barra", {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 1400,
    color: '#1f787c',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: { width: '100%', height: '100%' },
    text: {
        style: {
            // Text color.
            // Default: same as stroke color (options.color)
            color: '#5b5b5b',
            position: 'absolute',
            right: '0',
            top: '30px',
            padding: 0,
            margin: 0,
            transform: null
        },
        autoStyleContainer: true
    },
    from: { color: '#1f787c' },
    to: { color: '#ED6A5A' },
    step: (state, bar) => {
        bar.setText(bar.value() * 100 + ' %');
    }
});


function progreso() {
    $.ajax({
        url: "/getEnPrediccion",
        method: "get",
        data: {}, //URLEncoded
        contentType: "application/json",
        dataType: "json", //Tipo de dato de la respuesta del servidor
        success: function(response) { //Funcion que se ejecutara cuando el servidor envie la respuesta
            console.log(response.progreso)
            if (response.progreso > 0 && response.progreso < 100) {

                bar.animate(response.progreso / 100);
                $("#barra").show();
                $("#info-progreso").html(response).progreso;
                $("#btn-iniciar").attr("disabled", true);
                $("#loading").show();

            } else if (response.progreso == 0 || response.progreso == 100) {
                $("#barra").hide();
                $("#info-progreso").html('');
                bar.stop();
                $("#btn-iniciar").attr("disabled", false);
                $("#loading").hide();
                // timer = setInterval(function() { progreso() }, 2000);
                if (response.progreso >= 100) {
                    alert("Predicción inalizada");
                    $.ajax({
                        url: "/resetEnPrediccion",
                        method: "get",
                        data: {}, //URLEncoded
                        contentType: "application/json",
                        dataType: "json", //Tipo de dato de la respuesta del servidor
                    });

                }
            }
        }


    });
}