var jsons;
var formato = ['CARRERA','AREA','ASIGNATURA','COD_ASIGNATURA','COD_ASIGNATURAS_REQUISITO','PERTENECE'];
var correcto = [false,false,false,false,true,false];
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

        if(validarFormato()){
            llenarTabla();
            $("#btn-iniciar").attr("disabled", false);

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
    formato.forEach((key) => {
        $("#tbl").append(`<th>${key}</th>`);
    });
    $("#tbl").append(`</tr>`);

    jsons.forEach((json) => {
        $("#tbl").append(`<tr>`);
        formato.forEach((key) => {
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
        data: 'planEstudio=' + JSON.stringify(jsons),
        cache: false,
        // contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        success: function(data){
            alert(data);
            location.reload();
        }
    });
    
});

