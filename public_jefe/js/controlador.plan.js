var jsons;
var formato = ['AREA','ASIGNATURA','COD_ASIGNATURA','COD_ASIGNATURAS_REQUISITO','PERTENECE', 'OPTATIVA'];
var correcto = [false,false,false,true,false,false];
var camposCompletos = true;
var tamanioCorrecto = true;
var listo = true;
var data = new FormData();
var procesoID;
var progress = 0;
var nuevaCarrera = false;
var tableElements = [];

$("#file").click(function(){
    this.value = null;
    $("#btn-iniciar").attr("disabled", true);  
});

ExcelExport= function (event) {
    /////////////////////////////////////////////////////////////////
    jQuery.each(jQuery('#file')[0].files, function(i, file) {
        data.append('file_'+i, file);
    }); 
    ////////////////////////////////////////////////////////////
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function(){
        var fileData = reader.result;
        var wb = XLSX.read(fileData, {type : 'binary'});
        var int = 0;
        wb.SheetNames.forEach(function(sheetName){
            var rowObj =XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
            var jsonObj = JSON.stringify(rowObj);
            if(int<1){
                jsons = rowObj.slice();
            }
            int++;
        })
        // for(var i=0;i<jsons.length;i++){
        //     console.log(jsons[i]);  
        // }

        ////////////////////////Quitamos espacios y pasamos a miniscula los//////////////////////////////////
        ///////////////////nombres de las propiedades de los jsons en el arreglo////////////////////////////
        jsons = convertirArreglo(jsons).slice();
        let maxKeys = 0;
        let keys = [];
        jsons.forEach((json) => {
            if (Object.keys(json).length > maxKeys) {
                keys = Object.keys(json);
                maxKeys = keys.length;
            }
        })
        jsons.forEach((e) => {
            keys.forEach((key) => {
                const index = formato.indexOf(key.toUpperCase());
                if (index !== -1) {
                    if (correcto[index]) {
                        if (Object.keys(e).indexOf(key) === -1) {
                            e[key] = 'ninguno';
                        }
                    }
                }
            });
        });
        ///////////////////////////////////////////////////////////////////////////////////////////////

        if(validarFormato()) {
            tableElements = JSON.parse(JSON.stringify(jsons));
            asignarCarrera();

            llenarTabla();
            // $("#btn-iniciar").attr("disabled", false);
            $("#ttl-optativas").attr("disabled", false);
            $("#ttl-asignaturas").attr("disabled", false);

            jsons.forEach((e) => {
                var str = e.COD_ASIGNATURAS_REQUISITO;
                if (str && str.trim() !== '') {
                    str = str.replace(/\s/g, '');
                    while (str.includes(";;")) {
                        str = str.replace(/;;/g, ";")
                    }
                    if (str.substr(str.length - 1) === ';') str = str.replace(/.$/,"");
                    if (str.charAt(0) === ';') str = str.substr(1);
                    var sub = str.split(";");
                    e.COD_ASIGNATURAS_REQUISITO = sub;
                }
            });

            jsons.forEach((e) => {
                if (e.PERTENECE.toLowerCase() === 'si') e.PERTENECE = 1; else e.PERTENECE = 0;
                if (e.OPTATIVA.toLowerCase() === 'si') e.OPTATIVA = 1; else e.OPTATIVA = 0;
                if (e.COD_ASIGNATURAS_REQUISITO.length) {
                    var indice = e.COD_ASIGNATURAS_REQUISITO.indexOf('ninguno');
                    while (indice !== -1) {
                        e.COD_ASIGNATURAS_REQUISITO.splice(indice, 1);
                        indice = e.COD_ASIGNATURAS_REQUISITO.indexOf('ninguno');
                    }
                }
            });
        }  
    };

    reader.onerror = function(ex) {
        console.log(ex);
    };
    if(input.files[0]!=null){
        reader.readAsBinaryString(input.files[0]);    
    }
};

function asignarCarrera() {
    jsons.forEach((e) => {
        e.COD_CARRERA = $("#slc-carreras").val();
    });
    tableElements.forEach((e) => {
        e.CARRERA = $("#slc-carreras option:selected").text();
    });
}

function validarFormato(){
    jsons.forEach((json) => {
        for (var key in json) {
            for(var i = 0; i < formato.length; i++){
                if (formato[i] === key){
                    correcto[i] = true;
                }
            }
        }
    });
    for(var j = 0; j < correcto.length; j++){
        if(correcto[j] === false){
            listo = false;
        }
    }

    var cant = (Object.keys(jsons[0]).length);
    for(var k=0;k<jsons.length;k++){
        if((Object.keys(jsons[0]).length)!=(Object.keys(jsons[k]).length)){
            listo=false;
            camposCompletos=false;

            if(cant<(Object.keys(jsons[k]).length)){
                cant = (Object.keys(jsons[k]).length);
            }
        }
    }
    
    if(cant!=formato.length){
        listo = false;
        tamanioCorrecto = false;
    }

    // console.log('Correcto: \n'+correcto);
    // console.log('\nCampos completos: '+camposCompletos);
    // console.log('\nListo: '+listo);
    if(!listo){
        var correcciones = "";
        for(var j=0;j<correcto.length;j++){
            if(correcto[j]===false){
                correcciones+='El campo "'+formato[j]+'" requiere corrección o no existe.\n';
            }
        }
        if(!camposCompletos){
            correcciones+='Archivo incompleto, existen campos vacios.\n'
        }
        if(!tamanioCorrecto){
            correcciones+='El número de columnas o campos del archivo no coincide con el formato requerido.\n'
        }
        alert("ERROR DE FORMATO!! \n"+correcciones);
        ///////////////////Reiniciando variables de control/////////////////
        reiniciarVariables();
        ////////////////////////////////////////////////////////////////////

        $("#btn-iniciar").attr("disabled", true);
        return false;
    }

    ///////////////////Reiniciando variables de control/////////////////
    reiniciarVariables();
    ////////////////////////////////////////////////////////////////////

    return true;
}

function reiniciarVariables(){
    for(var j=0;j<correcto.length;j++){
        if (formato[j] === 'COD_ASIGNATURAS_REQUISITO') correcto[j] = true; else correcto[j] = false;
    }
    camposCompletos=true;
    tamanioCorrecto=true;
    listo=true;
}

function convertirArreglo(arreglo){
    var nuevoArreglo = [];
    for (var k=0;k<arreglo.length;k++){
        var first = true;
        var cadena = `{`;
        for (var key in arreglo[k]) {
            var clave = key.replace(/\s/g,'');
            clave = clave.toUpperCase();
            if(first){
                cadena+='"'+clave+'":"'+arreglo[k][key]+'"';
                first=false;
            }else{
                cadena+=',"'+clave+'":"'+arreglo[k][key]+'"';
            }
        }
        cadena+=`}`;
        var elementoJson = JSON.parse(cadena); 
        nuevoArreglo.push(elementoJson);
    }
    return nuevoArreglo;
}


function llenarTabla(){
    $("#tbl").html(`<tr>`);
    var form = JSON.parse(JSON.stringify(formato));
    form.unshift('CARRERA');
    form.forEach((key) => {
        $("#tbl").append(`<th>${key}</th>`);
    });
    $("#tbl").append(`</tr>`);

    tableElements.forEach((json) => {
        $("#tbl").append(`<tr>`);
        form.forEach((key) => {
            $("#tbl").append(`<td>${json[key]}</td>`);
        });
        $("#tbl").append(`</tr>`);
    });
}

$('#btn-iniciar').click(function(){
    $("#btn-iniciar").attr("disabled", true);
    jQuery.ajax({
        url: '/cargaPlanEstudioBD',
        // data: data,
        data: 'planEstudio=' + JSON.stringify(jsons) + '&asignaturasRequeridas=' + $("#ttl-asignaturas").val() + '&optativasRequeridas=' + $("#ttl-optativas").val(),
        cache: false,
        // contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        error: function (xhr, ajaxOptions, thrownError) {
            if (procesoID) detenerProgreso();
            alert(xhr.responseText);
            alert(thrownError);
        },
        success: function(data){
            if (procesoID) detenerProgreso();
            alert(data);
            location.reload();
        }
    });
    $('.progress').css( "display", "block" );
    if (!procesoID) procesoID = setInterval(actualizarProgreso, 100);
;
});

var actualizarProgreso = function() {
    $.ajax({
        url:"/progreso",
        method:"post",
        data:{}, //URLEncoded
        contentType: "application/json",
        dataType:"json", //Tipo de dato de la respuesta del servidor
        success: function(response){//Funcion que se ejecutara cuando el servidor envie la respuesta
            if (progress < response.progresoPlan) progress = Math.floor(response.progresoPlan);
            if (progress >= 100) detenerProgreso();
            $('.progress-bar').css( "width", `${progress}%` );
            $('.progress-bar').html(`${progress}%`);
        }
    });
}

function detenerProgreso() {
    clearInterval(procesoID);
    // $('.progress').css( "display", "none" );
}

$( document ).ready(cargarCarreras());

function cargarCarreras(value) {
    $.ajax({
        data: {},
        url: "/carreras",
        dataType: "json",
        success: function (respuesta) {
            $(function () {
                $("#slc-carreras").html(`<option value="-">Seleccione una carrera</option>`);
                respuesta.forEach((e) => {
                    $("#slc-carreras").append(`<option value="${e.cod_carrera_pk}">${e.txt_nombre_carrera}</option>`);
                });
                if (value) {
                    $("#slc-carreras").val(value);
                    if ($('#tbl').has('tr').length && jsons.length) {
                        asignarCarrera();
                        llenarTabla();
                    }
                }
                cerrarModal();
                // alert(JSON.stringify(respuesta));
            });
        }
    });
}

$("#slc-carreras").change(function() {
    if ($("#slc-carreras").val() !== '-') {
        $("#btn-editar-carrera").attr("disabled", false);
        $("#file").attr("disabled", false);
        if ($('#tbl').has('tr').length && jsons.length) {
            asignarCarrera();
            llenarTabla();
        }
    } else {
        $("#btn-editar-carrera").attr("disabled", true);
        $("#file").val('');
        $("#tbl").html('');
        $("#file").attr("disabled", true);
        $("#ttl-asignaturas").val('');
        $("#ttl-asignaturas").attr("disabled", true);
        $("#ttl-optativas").val('');
        $("#ttl-optativas").attr("disabled", true);
        $("#btn-iniciar").attr("disabled", true);
        reiniciarVariables();
    }
});

$("#ttl-asignaturas").change(function() {
    var asignaturasRequeridas = $("#ttl-asignaturas").val();
    if (asignaturasRequeridas !== '' && (asignaturasRequeridas < 1 || asignaturasRequeridas > 99)) $("#ttl-asignaturas").val('');
    validarNumeros();
});

$("#ttl-optativas").change(function() {
    var optativasRequeridas = $("#ttl-optativas").val();
    if (optativasRequeridas !== '' && (optativasRequeridas < 1 || optativasRequeridas > 99)) $("#ttl-optativas").val('');
    validarNumeros();
});

function validarNumeros() {
    var bol = ($("#ttl-asignaturas").val() !== '' && $("#ttl-optativas").val() !== '') ? false : true;
    $("#btn-iniciar").attr("disabled", bol);
}

function validarMensaje() {
    if ($('#txt-carrera').val() !== '') {
        $('#carrera-help').css('display', 'none');
    }
};

function cerrarModal() {
    $("#exampleModal").modal('hide');       //ocultamos el modal
    $('body').removeClass('modal-open');    //eliminamos la clase del body para poder hacer scroll
    $('.modal-backdrop').remove();          //eliminamos el backdrop del modal
}

$('#btn-save-carrera').click(function() {
    if (!nuevaCarrera && $('#txt-carrera').val() !== '') {
        // Actualizar carrera
        $.ajax({
            url: "/actualizar-carrera",
            dataType: "json",
            data: "nuevo_nombre_carrera=" + $('#txt-carrera').val() + "&codigo_carrera=" + $("#slc-carreras").val(),
            success: function (respuesta) {
                // alert(JSON.stringify(respuesta));
                if (respuesta[0].affectedRows === 1) {
                    cargarCarreras($("#slc-carreras").val());
                } else {
                    alert('Error en la actualización, intentelo de nuevo.');
                }
            }
        });
    } else if (nuevaCarrera && $('#txt-carrera').val() !== '') {
        // Crear carrera
        $.ajax({
            url:"/agregar-carrera",
            method:"POST",
            data: "txt_nombre_carrera=" + $('#txt-carrera').val(),
            dataType:"json",
            success:function(respuesta){
                // alert(JSON.stringify(respuesta));
                if (respuesta[0].affectedRows === 1) {
                    cargarCarreras(`${respuesta[0].insertId}`);
                } else {
                    alert('Error en la creación de la carrera, intentelo de nuevo.');
                }
            }
        });
    } else {
        $('#carrera-help').css('display', 'block');
    }
});

$('#btn-cancelar').click(function() {
    $('#carrera-help').css('display', 'none');
});

$('#btn-nueva-carrera').click(function() {
    nuevaCarrera = true;
    $('#txt-carrera').val('');
    $('#exampleModalLabel').html('Nueva Carrera');
    $('#btn-save-carrera').html('Agregar');;
});

$('#btn-editar-carrera').click(function() {
    nuevaCarrera = false;
    $('#txt-carrera').val($("#slc-carreras option:selected").text());
    $('#exampleModalLabel').html('Editar Carrera');
    $('#btn-save-carrera').html('Guardar cambios');
});
