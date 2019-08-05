var jsons;
var formato = ['cuenta'];
var correcto = [false];
var camposCompletos = true;
var tamanioCorrecto = true;
var listo = true;
var data = new FormData();
var timer; 

$("#file").click(function(){
    this.value = null;
    $("#inicio").attr("disabled", true);  
});

//var ProgressBar = require('../plugins/progressbar.js/dist/progressbar.js');
var bar = new ProgressBar.Line("#barra", {
  strokeWidth: 4,
  easing: 'easeInOut',
  duration: 1400,
  color: '#1f787c',
  trailColor: '#eee',
  trailWidth: 1,
  svgStyle: {width: '100%', height: '100%'},
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
  from: {color: '#1f787c'},
  to: {color: '#ED6A5A'},
  step: (state, bar) => {
    bar.setText(Math.round(bar.value() * 100) + ' %');
  }
});


var progreso = function(){
    $.ajax({
        url:"/progreso",
        method:"post",
        data:{}, //URLEncoded
        contentType: "application/json",
        dataType:"json", //Tipo de dato de la respuesta del servidor
        success: function(response){//Funcion que se ejecutara cuando el servidor envie la respuesta
            if(response.hasOwnProperty('estado')){
                if(response.estado == "pausado" ){
                    bar.stop();
                    $("#div-escarbado").hide();
                    $("#div-reanudar").show();
                    if(response.err != ""){
                        console.log(response.err);
                        $("#info-progreso").html('<span class="label label-danger">'+response.err+'</span>');
                        $('#modal-login').modal({backdrop: 'static', keyboard: false});
                        $('#modal-login').modal('show');          
                    }else{ 
                        $("#info-progreso").html('<span class="label label-warning">Extracción en pausa</span>');
                    }
                }else if(response.estado == "extrayendo"){
                    $("#div-reanudar").hide();
                    $("#div-escarbado").show();
                    bar.animate(response.porcentaje);
                    $("#info-progreso").html('<span class="label label-success">Extrayendo</span><img width="70px" src="img/loading.gif">');
                }else if(response.estado == "detenido" && response.porcentaje == -1){
                    bar.stop();
                    alert("La extracción ha sido detenida");
                    location.reload();
                }else if(response.estado == "finalizado"){
                    $("#barra").show();
                     bar.animate(response.porcentaje);
                    $("#div-escarbado").hide();
                    $.ajax({
                        url: "/verificacion-cuentas-invalidas",
                        method: "post",
                        success: function(res){
                            if(res == true) $("#btn-descarga").show();
                            else $("#btn-descarga").hide();
                        }
                    });

                    $("#div-finalizado").show();
                    $("#info-progreso").html('<span class="label label-primary">Finalizado</span>');
                }
            }           
            
        }
    });
}

$("#btn-finalizado").click(function(e){
    $.ajax({
        url:"/finalizado",
        method:"get",
        //data:{}, //URLEncoded
        dataType: "text",
        contentType : "application/json", 
        success: function(response){//Funcion que se ejecutara cuando el servidor envie la respuesta
            location.reload();
        }
    });

});



$(".btn-detener").click(function(){
    $("#div-escarbado").hide();  
    $("#div-detener").hide();  
    $.ajax({
        url:"/detenerProgreso",
        method:"post",
        data:{}, //URLEncoded
        contentType: "application/json",
        
        success: function(response){//Funcion que se ejecutara cuando el servidor envie la respuesta
            
        }
    });
});



$("#btn-pausar").click(function(){
    $("#div-escarbado").hide();  
    $.ajax({
        url:"/pausarProgreso",
        method:"post",
        data:{}, //URLEncoded
        contentType: "application/json",
        
        success: function(response){//Funcion que se ejecutara cuando el servidor envie la respuesta
            
        }
    });
});

$("#btn-reanudar").click(function(){

    $("#div-reanudar").hide();    
    $.ajax({
        url:"/reanudarProgreso",
        method:"post",
        data:{}, //URLEncoded
        contentType: "application/json",
        
        success: function(response){//Funcion que se ejecutara cuando el servidor envie la respuesta
            
        }
    });
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
        for(var i=0;i<jsons.length;i++){
            console.log(jsons[i]);  
        }

        ////////////////////////Quitamos espacios y pasamos a miniscula los//////////////////////////////////
        ///////////////////nombres de las propiedades de los jsons en el arreglo////////////////////////////
        jsons = convertirArreglo(jsons).slice();
        for(var i=0;i<jsons.length;i++){
            console.log(jsons[i]);  
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////

        if(validarFormato()){
            $("#inicio").attr("disabled", false);
        }    
    };

    reader.onerror = function(ex) {
        console.log(ex);
    };
    if(input.files[0]!=null){
        reader.readAsBinaryString(input.files[0]);    
    }
};

function validarFormato(){
    for (var key in jsons[0]) {
        for(var i=0;i<formato.length;i++){
            if(formato[i]===key){
                correcto[i]=true;
            }
        }
    }
    for(var j=0;j<correcto.length;j++){
        if(correcto[j]===false){
            listo=false;
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

    console.log('Correcto: \n'+correcto);
    console.log('\nCampos completos: '+camposCompletos);
    console.log('\nListo: '+listo);
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

        $("#inicio").attr("disabled", true);
        //$("#btn-iniciar").attr("disabled", true);
        return false;
    }

    ///////////////////Reiniciando variables de control/////////////////
    reiniciarVariables();
    ////////////////////////////////////////////////////////////////////

    return true;
}

function reiniciarVariables(){
    for(var j=0;j<correcto.length;j++){
        correcto[j]=false;
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
            clave = clave.toLowerCase();
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

$(document).ready(function(){
    $("#loading2").hide();
    $("#barra").hide();
    $("#form-inicio").hide();
    $("#div-reanudar").hide();
    $("#div-escarbado").hide();
    $("#div-finalizado").hide();

    $.ajax({
        url:"/progreso",
        method:"post",
        data:{}, //URLEncoded
        contentType: "application/json",
        dataType:"json", //Tipo de dato de la respuesta del servidor
        success: function(response){//Funcion que se ejecutara cuando el servidor envie la respuesta
            if(response.hasOwnProperty('estado')){
                if(response.estado == "pausado" ){
                    bar.animate(response.porcentaje);
                    $("#barra").show();
                    $("#div-reanudar").show();
                    if(response.err != ""){
                        console.log(response.err);
                        $("#info-progreso").html('<span class="label label-danger">'+response.err+'</span>');
                        $('#modal-login').modal({backdrop: 'static', keyboard: false});
                        $('#modal-login').modal('show');          
                    }else{ 
                        $("#info-progreso").html('<span class="label label-warning">Extracción en pausa</span>');
                    }
                    timer = setInterval(function(){progreso()}, 2000);
                }else if(response.estado == "extrayendo"){
                    $("#barra").show();
                    $("#div-escarbado").show();
                    $('#modal-login').modal('hide');
                    bar.animate(response.porcentaje);
                    timer = setInterval(function(){progreso()}, 2000);
                    $("#info-progreso").html('<span class="label label-success">Extrayendo</span><img width="70px" src="img/loading.gif">');
                }else if(response.estado == "detenido"){
                    $("#form-inicio").show();
                }else if(response.estado == "finalizado"){
                    $("#barra").show();
                     bar.animate(response.porcentaje);
                    $("#div-escarbado").hide();
                    $.ajax({
                        url: "/verificacion-cuentas-invalidas",
                        method: "post",
                        success: function(res){
                            if(res == true) $("#btn-descarga").show();
                            else $("#btn-descarga").hide();
                        }
                    });

                    $("#div-finalizado").show();
                    $("#info-progreso").html('<span class="label label-primary">Finalizado</span>');


                }else if(response.err != ""){
                    $("#barra").show();
                    $("#div-reanudar").show();
                    $("#info-progreso").html('<span class="label label-danger">'+response.err+'</span>');
                    bar.stop();
                    timer = setInterval(function(){progreso()}, 2000);
                }
            }           
            
        }
    });
});

function llenarTabla(){
    $("#tbl").html(`<tr>`);
    for (var key in jsons[0]) {
        $("#tbl").append(`<th>${key}</th>`);
    }
    $("#tbl").append(`</tr>`);

    for(var i=0;i<jsons.length;i++){
        $("#tbl").append(`<tr>`);
        for (var key in jsons[i]) {
            $("#tbl").append(`<td>${jsons[i][key]}</td>`);
        }
        $("#tbl").append(`</tr>`);
    }
}

$('#btn-iniciar').click(async function(){
    var emp = await $("#num-emp").val();
    var contra = await $("#pass-emp").val();
    var log = await {"numEmp": emp, "passEmp": contra};

    var login = false;
    var estado = "detenido";


    await $.ajax({
        url: '/sesion-registro',
        data: JSON.stringify(log),
        contentType: "application/json",
        method: 'POST',
        type: 'POST',
        beforeSend: function(){
            clearInterval(timer);
            $("#loading2").show();
            $("#btn-iniciar").prop("disabled", true);
        },
        success: function(data){
            $("#loading2").hide();
            $("#btn-iniciar").prop("disabled", false);

            if(data.hasOwnProperty("login")){
                login = data.login;
                if(data.login == false){
                    alert("Credenciales Erroneas o sin conexión a registro!");
                }else{
                    $("#modal-login").modal('hide');
                    if(data.hasOwnProperty("estado")){
                        estado = data.estado;
                    }
                }
                $("#num-emp").val("");
                $("#pass-emp").val("");
                
            }else{
                alert("Error con la petición!");
                location.reload();
                login = false;

            }
        }
    });

    if(login == true && estado == "detenido"){
        $("#form-inicio").hide();
        $("#barra").show();
        timer = await setInterval(function(){progreso()}, 2000);

        await $.ajax({
            url: '/extraccion',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            type: 'POST', // For jQuery < 1.9
            success: function(data){
                //alert(data);
            }
        });
        $("#inicio").hide();
        
    }else if(login == true && estado == "pausado"){
        $("#form-inicio").hide();
        $("#barra").show();
        timer = setInterval(function(){progreso()}, 2000);
        

        await $.ajax({
            url: '/reanudarProgreso',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            type: 'POST', // For jQuery < 1.9
            success: function(data){
            }
        });
        $("#inicio").hide();
    }
});

