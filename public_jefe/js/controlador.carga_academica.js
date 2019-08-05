var jsons;
var formato = ['COD','ASIGNATURA','SEC','PERIODO','ANIO','HI','HF','DIAS','AULA','ED','NE','PROFESOR'];
var correcto = [false,false,false,false,false,false,false,false,false,false,false,false];
var camposCompletos = true;
var tamanioCorrecto = true;
var listo = true;
var data = new FormData();

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
            llenarTabla();
            $("#btn-iniciar").attr("disabled", false);  
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

$('#btn-iniciar').click(function(){
    $("#btn-iniciar").attr("disabled", true);
    jQuery.ajax({
        url: '/cargaAcademicaBD',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        success: function(data){
            alert(data);
            location.reload();
        }
    });
    
});

