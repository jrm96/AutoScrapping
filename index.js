/*
CONTENIDO 

1-CONFIGURACIÓN DE CREDENCIALES DE BASE DE DATOS  
2-COMPONENTES DE NODE.JS
3-MODULO DE SELENIUM WEBDRIVER
4-VARIABLES GLOBALES
5-FUNCIONES DE VERIFICACIÓN DE ACCESO
6-PETICIONES HTTP
    6.1-PETICIONES SOBRE SESIONES DEL SISTEMA
    6.2-PETICIONES SOBRE LA EXTRACCIÓN DE DATOS
    6.3-PETICIONES SOBRE LA CARGA ACADÉMICA
    6.4-PETICIONES SOBRE ESTADÍSTICAS
        6.4.1-FILTROS
7-FUNCIONES
    7.1-FUNCIONES GENERALES
    7.2-FUNCIONES SOBRE LA CARGA ACADÉMICA
    7.3-FUNCIONES SOBRE LA EXTRACCIÓN DE DATOS
*/



//////////////////////////////////////////////////////////////////////////////////////////////////////
///////1-CONFIGURACIÓN DE CREDENCIALES DE BASE DE DATOS//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
var mysql = require("mysql");
var credenciales = {
    user: "root",
    password: "",
    port: "3306",
    host: "localhost",
    database: "bd_autoscraping"
};

var conexion = mysql.createConnection(credenciales);

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////
///////2-COMPONENTES DE NODE.JS ////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var busboy = require('connect-busboy'); //middleware for form/file upload
var app = express();
var fs = require("fs");
var XLSX = require("xlsx");


//////////////////////////////////////////////////////////////////////////////////////////////////////
///////3- MODULO DE SELENIUM-WEBDRIVER///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

// MODULOS PROPIOS
var consultas = require("./consultas.js");

//USE 
app.use(busboy());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));//Para poder obtener archivos enviados via post.
app.use(session({ secret: "ASDFE$%#%", resave: true, saveUninitialized: true }));

app.use(
    function (peticion, respuesta, next) {

        // respuesta.header("Access-Control-Allow-Origin", "*") // update to match the domain you will make the request from
        // respuesta.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        
        if (peticion.session.nombre) {
            //Significa que el usuario si esta logueado
            publicCompartido(peticion, respuesta, next);
        }
        else
            return next();
    }
);

app.use(
    function (peticion, respuesta, next) {
        if (peticion.session.nombre) {
            //Significa que el usuario si esta logueado
            if (peticion.session.codigoTipoUsuario == 2)
                publicCoordinador(peticion, respuesta, next);
            else if (peticion.session.codigoTipoUsuario == 1)
                publicJefe(peticion, respuesta, next);
        }
        else
            return next();
    }
);




//CARPETAS DE TIPOS DE ACCESO
var publicCompartido = express.static("public_compartido");
var publicJefe = express.static("public_jefe");
var publicCoordinador = express.static("public_coordinador");



//////////////////////////////////////////////////////////////////////////////////////////////////////
///////4-VARIABLES GLOBALES ////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

var driver;
var historial = [];
var estudiante = [];
var cuentas = [];
var cuentaActual = {};
var cuentasInvalidas = "";
var cargaAcademica = [];
var progreso = 0;
var error = "";
var sesionRegistro = {};
var estadoProgreso = "detenido";
var planEstudio = [];




//////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////5-FUNCIONES DE VERIFICACIÓN DE ACCESO//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

///PARA AGREGAR SEGURIDAD A UNA RUTA ESPECÍFICA:
function verificarAutenticacion(peticion, respuesta, next) {
    if (peticion.session.nombre) {
        return next();
    } else {
        //respuesta.redirect('/error_acceso.html');    
        respuesta.send(`<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Error de acceso</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="css/bootstrap.min.css">
        </head>
        <body>
            <form class="form-control">
                <div class="form-control text-center">
                    <h1>Error de acceso!!</h1>
                    <h1>No tiene autorización para acceder a esta página.</h1>
                </div><br>
                <div class="form-control text-center">
                    <a href="/index.html" class="btn btn-dark">Volver</a>
                </div>
            </form>
        </body>
        </html>`);
    }
}

//
function verificarAccesoPeticion(peticion, respuesta, next) {
    if (peticion.session.nombre) {
        return next();
    } else {
        respuesta.send(`<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Error de acceso a petición</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="css/bootstrap.min.css">
        </head>
        <body>
            <form class="form-control">
                <div class="form-control text-center">
                    <h1>Error de acceso a petición!!</h1>
                    <h1>No tiene autoridad para acceder a esta petición.</h1>
                </div><br>
                <div class="form-control text-center">
                    <a href="/index.html" class="btn btn-dark">Volver</a>
                </div>
            </form>
        </body>
        </html>`);
    }
}

//
function verificarAccesoPeticionJefe(peticion, respuesta, next) {
    if ((peticion.session.nombre) && (peticion.session.codigoTipoUsuario == 1)) {
        return next();
    } else {
        var retorno = '/index.html';
        if (peticion.session.nombre) {
            retorno = '/home.html';
        }
        respuesta.send(`<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Error de acceso a petición</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="css/bootstrap.min.css">
        </head>
        <body>
            <form class="form-control">
                <div class="form-control text-center">
                    <h1>Error de acceso a petición!!</h1>
                    <h1>No tiene autoridad para acceder a esta petición.</h1>
                </div><br>
                <div class="form-control text-center">
                    <a href="`+ retorno + `" class="btn btn-dark">Volver</a>
                </div>
            </form>
        </body>
        </html>`);
    }
}


///////////////////////////////////////////////////////////////////////////////
///////////////////6-PETICIONES HTTP///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////



//////////6.1-PETICIONES SOBRE SESIONES DEL SISTEMA////////////////////////////////

//PETICIÓN PARA INICIAR SESIÓN EN EL SISTEMA
app.post("/login", function (peticion, respuesta) {
    conexion.query(consultas.login(),
        [peticion.body.nombre, peticion.body.contrasena],
        function (err, data, fields) {
            try {
                peticion.session.nombre = null;
                peticion.session.codigoTipoUsuario = null;
                if (err) {
                    respuesta.send({ estatus: 1, mensaje: "Error desconocido al inciar sesión" });
                    console.log(err);

                } else if (data) {
                    peticion.session.nombre = data[0].txt_nombre;
                    peticion.session.codigoTipoUsuario = data[0].cod_tipo_usuario_fk;
                    data[0].estatus = 0;
                    respuesta.send(data[0]);
                } else {
                    respuesta.send({ estatus: 1, mensaje: "Las credenciales son incorrectas" });
                }
            } catch (e) {
                respuesta.send({ estatus: 1, mensaje: "Las credenciales son incorrectas" });
                console.log(e);
            }
        }
    );
});

//PETICIÓN PARA CERRAR SESIÓN EN EL SISTEMA
app.get("/logout", function (peticion, respuesta) {
    peticion.session.destroy();
    respuesta.redirect("index.html");
});



//////////6.2-PETICIONES SOBRE LA EXTRACCIÓN DE DATOS//////////////////////////////

//PETICIÓN PARA INICIAR LA EXTRACCIÓN DE DATOS DE REGISTRO
app.route("/extraccion", verificarAccesoPeticionJefe).post(async function (request, response, next) {
    try {
        //ELIMINA EL ARCHIVO DE CUENTAS INVALIDAS
        if (existeArchivo("./archivos/cuentas_invalidas.txt")) {
            fs.unlinkSync('./archivos/cuentas_invalidas.txt', (err) => {
                if (err) console.log(err);
            });
            cuentasInvalidas = await "";
        };
        //CREA UNA COPIA DEL ARCHIVO SUBIDO EN LA CARPETA /ARCHIVOS 
        request.pipe(request.busboy);
        request.busboy.on('file', async function (fieldname, file, filename) {
            var fstream = fs.createWriteStream('./archivos/' + filename);
            file.pipe(fstream);
            fstream.on('close', async function (err) {
                if (err) {
                    response.send({ estatus: 1, mensaje: "Errr al subir el archivo" });
                } else {
                    //INICICIALIZA LOS ESTADOS DEL PROCESO
                    progreso = 0;
                    estadoProgreso = "extrayendo";
                    //GUARDA EL ESTADO ACTUAL EN UN ARCHIVO .TXT
                    await guardarEstado();

                    //GUARDA COMO ARRAY DE JSON LAS CUENTAS EN LA VARIABLE GLOBAL "cuentas"
                    var workbook = XLSX.readFile('./archivos/' + filename);
                    var sheet_name_list = workbook.SheetNames;
                    cuentas = await XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]).slice();

                    //VALIDACIÓN DE DATOS DEL ARCHIVO DE CUENTAS
                    cuentas = await validacionCuentas(cuentas);

                    response.send(`Archivo "` + filename + `" subido con éxito`);
                    //PREPARA LAS EL ESTADO DE LAS CUENTAS {CUENTA} 
                    await inicializarEstadoCuentas();
                    //CREA UN ARCHIVO DE RESPALDO DE LAS CUENTAS EN CASO DE QUE SE PRODUZCA UN ERROR
                    await escribirRespaldo(cuentas);
                    //ABRE EL NAVEGADOR CON SELENIUM-WEBDRIVER
                    await abrirNavegador();
                    //LOGIN DE LA PÁGINA DE REGISTRO 
                    await login();
                    //INICIA LA EXTRACCIÓN DE DATOS
                    await escarbar();

                }
            });
        });
    } catch (e) {
        cerrarNavegador();
        console.log(e);
    }
});

//PETICIÓN PARA OBTENER EL PROGRESO DE LA EXTRACCIÓN DE DATOS
app.post("/progreso", verificarAccesoPeticionJefe, async function (request, response) {
    response.send({ porcentaje: progreso, estado: estadoProgreso, err: error });

});

//PETICIÓN PARA PAUSAR LA EXTRACCIÓN DE DATOS
app.post("/pausarProgreso", verificarAccesoPeticionJefe, async function (request, response) {
    estadoProgreso = "pausado";
    await guardarEstado();
    response.send(true);
});

//PETICIÓN PARA DETENER LA EXTRACCIÓN DE DATOS
app.post("/detenerProgreso", verificarAccesoPeticionJefe, async function (request, response) {
    estadoProgreso = "detenido";
    await guardarEstado();
    progreso = -1;
    sesionRegistro = {};

});

//PETICIÓN PARA REANUDAR LA EXTRACCIÓN DE DATOS
app.post("/reanudarProgreso", verificarAccesoPeticionJefe, async function (request, response) {

    try {
        estadoProgreso = await "extrayendo";
        await guardarEstado();
        error = await "";
        //OBTIENE LAS CUENTAS DEL ARCHIVO DE RESPALDO
        cuentas = await JSON.parse(fs.readFileSync('./archivos/respaldo.txt', 'utf8'));
        //ABRE EL NAVEGADOR CON SELENIUM-WEBDRIVER
        await abrirNavegador();
        //INICIA SESIÓN EN LA PÁGINA DE REGISTRO CON SELENIUM-WEBDRIVER
        await login();
        await response.send(true);
        //INICIA EL PROCESO DE EXTRACCIÓN DE DATOS CON SELENIUM-WEBDRIVER
        await escarbar();
        //CIERRA EL NAVEGADOR CON SELENIUM-WEBDRIVER
        await cerrarNavegador();

        //Eliminar el archivo de respaldo en este punto
    } catch (e) {
        estadoProgreso = await "pausado";
        await guardarEstado();
        //CIERRA EL NAVEGADOR CON SELENIUM-WEBDRIVER
        await cerrarNavegador();
        error = "Error al extraer datos! reanude el proceso para reintentar";
        response.send(false);
        //retornar el error y habilitar el btn de reintentar y cancelar
    }
});

//PETICIÓN PARA FINALIZAR EL PROGRESO DE LA EXTRACCIÓN DE DATOS
app.get("/finalizado", verificarAccesoPeticionJefe, async function (request, response) {
    estadoProgreso = await "detenido";
    await guardarEstado();
    progreso = await 0;
    response.send(true);
    sesionRegistro = {};


});

//PETICIÓN PARA DESCARGAR EL ARCHIVO DE CUENTAS ERRONEAS
app.get("/cuentas-erroneas", verificarAccesoPeticionJefe, async function (request, response) {
    var path = "./archivos/cuentas_invalidas.txt";
    if (existeArchivo(path)) {
        cuentasInvalidas = "";
        await response.download(path);
    } else {
        response.send("Se produjo un error o no hay cuentas invalidas");
    }
});

//PETICIÓN PARA VERIFICAR SI EXISTE EL ARCHIVO DE CUENTAS INVALIDAS
app.post("/verificacion-cuentas-invalidas", verificarAccesoPeticionJefe, async function (request, response) {
    response.send(existeArchivo("./archivos/cuentas_invalidas.txt"));
});


//PETICIÓN PARA ALMACENAR CREDENCIALES DE LA PÁGINA DE REGISTRO
app.post("/sesion-registro", verificarAccesoPeticionJefe, async function (request, response) {
    var numEmp = await request.body.numEmp;
    var passEmp = await request.body.passEmp;
    sesionRegistro = await { usuario: numEmp, contrasenia: passEmp };
    abrirNavegador();
    var aprobacion = await login();
    console.log(aprobacion);
    cerrarNavegador()

    await response.send({ login: aprobacion, estado: estadoProgreso });

});




//////////6.3-PETICIONES SOBRE LA CARGA ACADÉMICA//////////////////////////////////


//PETICIÓN PARA SUBIR LA CARGA ACADÉMICA EN LA BASE DE DATOS
app.route("/cargaPlanEstudioBD", verificarAccesoPeticionJefe).post(async function (request, response, next) {
    try {
        planEstudio = await JSON.parse(request.body.planEstudio).slice();

        async function registrarAsignarutasEnDB (planEstudio){
            //agregar carrea
            objectResponse.existe_carrera = (await executeQuery(
                `SELECT cod_carrera_pk FROM tbl_carrera WHERE (tbl_carrera.txt_nombre_carrera = ?)`, 
                [planEstudio[0].CARRERA]));

            if (objectResponse.existe_carrera.length) {
                console.log('carrera ' + planEstudio[0].CARRERA + ' ya existe...')

                objectResponse.cod_carrera = objectResponse.existe_carrera[0].cod_carrera_pk;
            } else {

                await executeQuery(`INSERT INTO tbl_carrera(txt_nombre_carrera) VALUES (?);`, [planEstudio[0].CARRERA]);
                objectResponse.resultAfterInsert = (await executeQuery(
                    `SELECT cod_carrera_pk FROM tbl_carrera WHERE (tbl_carrera.txt_nombre_carrera = ?)`, 
                    [planEstudio[0].CARRERA]));
                objectResponse.cod_carrera = objectResponse.resultAfterInsert[0].cod_carrera_pk;
                if (objectResponse.resultAfterInsert.length>1)
                    await eliminarSobranteRegistros(`DELETE FROM tbl_carrera where cod_carrera_pk = ?`,
                    objectResponse.resultAfterInsert, 'cod_carrera_pk');
                console.log('carrera ' + planEstudio[0].CARRERA + ' registrada con exito...')

            }
            
            //agregar plan estudio
            objectResponse.existe_plan_estudio = (await executeQuery(
                `SELECT cod_plan_estudio_pk FROM tbl_plan_estudio WHERE (tbl_plan_estudio.cod_carrera_fk = ?)`, 
                [objectResponse.cod_carrera]
            ));
            if (objectResponse.existe_plan_estudio.length) {
                console.log('PLAN ' + objectResponse.cod_plan_estudio + ' ya existe...')

                objectResponse.cod_plan_estudio = objectResponse.existe_plan_estudio[0].cod_plan_estudio_pk;
            } else {
                await executeQuery(`INSERT INTO tbl_plan_estudio(cod_carrera_fk) VALUES (?);`, [objectResponse.cod_carrera]);
                objectResponse.resultAfterInsert = (await executeQuery(
                    `SELECT cod_plan_estudio_pk FROM tbl_plan_estudio WHERE (tbl_plan_estudio.cod_carrera_fk = ?)`, 
                    [objectResponse.cod_carrera]
                ));
                console.log('Plan de estudio para '+ planEstudio[0].CARRERA +' registrado con exito...')
                objectResponse.cod_plan_estudio = objectResponse.resultAfterInsert[0].cod_plan_estudio_pk;
                if (objectResponse.resultAfterInsert.length>1)
                    await eliminarSobranteRegistros(`DELETE FROM tbl_plan_estudio where cod_plan_estudio_pk = ?`,
                    objectResponse.resultAfterInsert, 'cod_plan_estudio_pk');

            }

            //REGISTRAR AREAS DISTINTAS
            var disctintAreas = [];
            planEstudio.forEach(a => {
                if (!disctintAreas.includes(a.AREA))
                    disctintAreas.push(a.AREA)
            });
            for (da=0; da<disctintAreas.length; da++){
               await controlRegistroAreas(disctintAreas[da]);
            };
            console.log('//////////////////////ENTRANDO A REGISTRAR ASIGNATURAS')
            //REGISTRAR ASIGNATURA EN DB
            for (asignatura_current=0; asignatura_current<planEstudio.length; asignatura_current++){
                console.log();
                await controlRegistroAsignatura(planEstudio[asignatura_current])
            };

            async function controlRegistroAsignatura(asignatura_current){
                await controlRegistroAreas(asignatura_current.AREA);
                 ////////////////////////////////////////////////////////////////////////////////////
                //REGISTRAR ASIGNATURA
                objectResponse.existe_asigatura = (await executeQuery(
                    `SELECT cod_asignatura_pk FROM tbl_asignatura WHERE (tbl_asignatura.cod_asignatura_pk = ?)`, 
                    [asignatura_current.COD_ASIGNATURA]));
                if (objectResponse.existe_asigatura.length) {
                    console.log(asignatura_current.ASIGNATURA + 'ya esta registrada, aqui se actualizaria...');
                    // await executeQuery(`UPDATE tbl_asignatura SET cod_area_pk = ?, txt_nombre_asignatura = ? 
                    //     WHERE (tbl_asignatura.cod_asignatura_pk = ?) VALUES (?,?,?);`, [asignatura_current.COD_ASIGNATURA, objectResponse.cod_area, asignatura_current.ASIGNATURA]);
                } else {
                    try {
                        await executeQuery(`INSERT INTO tbl_asignatura(cod_asignatura_pk, cod_area_pk, txt_nombre_asignatura) VALUES (?,?,?);`, [asignatura_current.COD_ASIGNATURA, objectResponse.cod_area, asignatura_current.ASIGNATURA]);

                    }catch(err){}
                    console.log(asignatura_current.ASIGNATURA + ' registrada exitosamente...');

                    objectResponse.resultAfterInsertArea = (await executeQuery(
                        `SELECT cod_asignatura_pk FROM tbl_asignatura WHERE (tbl_asignatura.cod_asignatura_pk = ?)`, 
                        [asignatura_current.COD_ASIGNATURA]));;
                    objectResponse.cod_asignatura = objectResponse.resultAfterInsertArea[0].cod_area_pk;
                }

                ///////////////////////////////////////////////////////////////////////////////////////////////////
                //REGISTRAR ASIGNATURA POR PLAN ESTUDIO
                objectResponse.existe_asigatura_x_plan_estudio = (await executeQuery(
                    `SELECT cod_asignatura_x_plan_estudio_pk FROM tbl_asignatura_x_plan_estudio 
                    WHERE (tbl_asignatura_x_plan_estudio.cod_asignatura_fk = ?) 
                    and (tbl_asignatura_x_plan_estudio.cod_plan_estudio_fk = ?)`, 
                    [asignatura_current.COD_ASIGNATURA, objectResponse.cod_plan_estudio]));

                if (objectResponse.existe_asigatura_x_plan_estudio.length) {
                    console.log('----Su asignatura por plan estudio, ya existe, aqui se actualizaria.');

                    objectResponse.cod_asignatura_x_plan_estudio = objectResponse.existe_asigatura_x_plan_estudio[0].cod_asignatura_x_plan_estudio_pk;
                    //Si existe la actualiza y guarda el id
                    // await executeQuery(`UPDATE tbl_asignatura_x_plan_estudio SET bol_pertenece = ? 
                    //     WHERE (tbl_asignatura_x_plan_estudio.cod_asignatura_plan_estudio_pk = ?) VALUES (?,?);`, [asignatura_current.PERTENECE, objectResponse.cod_asignatura_x_plan_estudio]);
                } else {
                    try{
                        await executeQuery(`INSERT INTO tbl_asignatura_x_plan_estudio (cod_plan_estudio_fk, cod_asignatura_fk, bol_pertenece_carrera) 
                        VALUES (?, ?, ?);`, [objectResponse.cod_plan_estudio, asignatura_current.COD_ASIGNATURA, asignatura_current.PERTENECE]);

                    }catch(err){};
                    console.log('----Su asignatura por plan estudio, registrada exitosamente.');
                    objectResponse.resultAfterInsert = (await executeQuery(
                        `SELECT cod_asignatura_x_plan_estudio_pk FROM tbl_asignatura_x_plan_estudio 
                            WHERE (tbl_asignatura_x_plan_estudio.cod_asignatura_fk = ?) and (tbl_asignatura_x_plan_estudio.cod_plan_estudio_fk = ?)`, 
                            [asignatura_current.COD_ASIGNATURA, objectResponse.cod_plan_estudio]));
                    objectResponse.cod_asignatura_x_plan_estudio = objectResponse.resultAfterInsert[0].cod_asignatura_x_plan_estudio_pk;
                    if (objectResponse.resultAfterInsert.length)
                        await eliminarSobranteRegistros(`DELETE FROM tbl_asignatura_x_plan_estudio where cod_asignatura_x_plan_estudio_pk = ?`,
                        objectResponse.resultAfterInsert, 'cod_asignatura_x_plan_estudio_pk');
                }

                ///////////////////////////////////////////////////////////////////////////////////////////////////
                //REGISTRAR REQUISITO POR ASIGNATURA
                if (asignatura_current.COD_ASIGNATURAS_REQUISITO.length) {
                    for (requisito=0; requisito < asignatura_current.COD_ASIGNATURAS_REQUISITO.length; requisito++){
                       await controlRegistroRequisitoDeAsignatura(asignatura_current.COD_ASIGNATURA, asignatura_current.COD_ASIGNATURAS_REQUISITO[requisito]);
                    }
                }
            };

            async function controlRegistroRequisitoDeAsignatura(cod_asignatura, cod_asig_req){
        
                    //Extraer "cod_asignatura_por_plan_estudio" de la asignatura requisito
                    objectResponse.existe_cod_asig_x_plan_requisito = (await executeQuery(
                        `SELECT cod_asignatura_x_plan_estudio_pk FROM tbl_asignatura_x_plan_estudio 
                        WHERE (tbl_asignatura_x_plan_estudio.cod_asignatura_fk = ?) and (tbl_asignatura_x_plan_estudio.cod_plan_estudio_fk = ?)`, [cod_asig_req, objectResponse.cod_plan_estudio]))

                    objectResponse.cod_asig_x_plan_requisito =  "";
                    if (objectResponse.existe_cod_asig_x_plan_requisito.length){

                        objectResponse.cod_asig_x_plan_requisito = objectResponse.existe_cod_asig_x_plan_requisito[0].cod_asignatura_x_plan_estudio_pk;

                         //verificar si ya se regisro como requisito de la asignatura
                        objectResponse.existe_dependencia = (await executeQuery(
                            `SELECT cod_asignatura_x_plan_estudio_ck FROM tbl_requisito_x_asignatura 
                            WHERE (tbl_requisito_x_asignatura.cod_asignatura_x_plan_estudio_ck = ?) 
                            and (tbl_requisito_x_asignatura.cod_asignatura_x_plan_estudio_requisito_ck = ?)`, [objectResponse.cod_asignatura_x_plan_estudio,  objectResponse.cod_asig_x_plan_requisito]));
            
                        //Si no existe la dependecia la crea
                        if (!objectResponse.existe_dependencia.length) {
                            try{
                                await executeQuery(`INSERT INTO tbl_requisito_x_asignatura 
                                (cod_asignatura_x_plan_estudio_ck, cod_asignatura_x_plan_estudio_requisito_ck) VALUES (?, ?);`, [objectResponse.cod_asignatura_x_plan_estudio, objectResponse.cod_asig_x_plan_requisito]);
                            }catch(err){}
                            console.log('No existia el requisito '+ cod_asig_req +' para '+cod_asignatura+', se creo con exito.')
                        }else{
                            console.log('--Ya existia el requisito '+ cod_asig_req +' para '+cod_asignatura+'.')
                        }
                    }
        
                    //verificar si ya se regisro como requisito de la asignatura
                    objectResponse.existe_req_asig = (await executeQuery(
                        `SELECT cod_asignatura_x_plan_estudio_ck FROM tbl_requisito_x_asignatura 
                        WHERE (tbl_requisito_x_asignatura.cod_asignatura_x_plan_estudio_ck = ?) 
                        and (tbl_requisito_x_asignatura.cod_asignatura_x_plan_estudio_requisito_ck = ?)`, [objectResponse.cod_asignatura_x_plan_estudio, objectResponse.cod_asig_x_plan_requisito]));
        
                    //Si no existe la dependecia la crea
                    if (!objectResponse.existe_req_asig.length) {
                        await executeQuery(`INSERT INTO tbl_requisito_x_asignatura 
                        (cod_asignatura_x_plan_estudio_ck, cod_asignatura_x_plan_estudio_requisito_ck) VALUES (?, ?);`, [objectResponse.cod_asignatura_x_plan_estudio, objectResponse.cod_asig_x_plan_requisito]);
                    }
            }

            async function controlRegistroAreas(txt_nombre_area){
                objectResponse.existe_area = await executeQuery(
                    `SELECT cod_area_pk FROM tbl_areas WHERE (tbl_areas.txt_nombre_area = ?)`, 
                    [txt_nombre_area]);
                if (objectResponse.existe_area.length) {
                    console.log('AREA '+txt_nombre_area+' ya existe...')
                    objectResponse.cod_area = await objectResponse.existe_area[0].cod_area_pk;
                } else {
                    console.log('  AREA '+txt_nombre_area+' no existe, creando...')
                    await executeQuery(`INSERT INTO tbl_areas(txt_nombre_area) VALUES (?);`, [txt_nombre_area]);
                    objectResponse.resultAfterInsertArea = (await executeQuery(
                        `SELECT cod_area_pk FROM tbl_areas WHERE (tbl_areas.txt_nombre_area = ?)`, 
                        [txt_nombre_area]));
                    objectResponse.cod_area = objectResponse.resultAfterInsertArea[0].cod_area_pk;
                    if (objectResponse.resultAfterInsertArea.length)
                        await eliminarSobranteRegistros(`DELETE FROM tbl_areas where cod_area_pk = ?`,
                        objectResponse.resultAfterInsertArea, 'cod_area_pk');
                } 
            }
            async function eliminarSobranteRegistros(sql, arraySobrantes, keyField){
                for (d=1;d<arraySobrantes.length; d++){
                    await executeQuery(sql, [arraySobrantes[d][keyField]]);
                }
            }
            
            function executeQuery(sql, args) {
                conexion.query(sql, args)
                return new Promise((resolve, reject) => {
                    conexion.query(sql, args, (err, rows) => {
                        if (err) return reject(err);
                        resolve(rows);
                    });
                })
            };

       }


       console.log('/////////////////////COMIENZA LA FUNCION CN////////////////////////')
       var objectResponse = {};
       await registrarAsignarutasEnDB(planEstudio);
       response.send(`Plan de estudio subido a la Base de Datos con exíto!`);   
       console.log('//////////////////////TERMINO LA FUNCION CN////////////////////////')
    } catch (e) {
        response.send("Se produjo un error, intentelo de nuevo: " + e);
    }
});

//PETICIÓN PARA SUBIR LA CARGA ACADÉMICA EN LA BASE DE DATOS
app.route("/cargaAcademicaBD", verificarAccesoPeticionJefe).post(async function (request, response, next) {
    try {
        //CREA UNA COPIA DEL ARCHIVO SUBIDO EN LA CARPETA "/ARCHIVOS"
        var fstream;
        request.pipe(request.busboy);
        request.busboy.on('file', async function (fieldname, file, filename) {
            fstream = fs.createWriteStream('./archivos/' + filename);
            file.pipe(fstream);
            fstream.on('close', async function (err) {
                if (err) {
                    response.send("Se produjo un error, intentelo de nuevo");
                } else {
                    //ALMACENA LOS DATOS DE LA CARGA ACADÉMICA EN LA VARIABLE GLOBAL cargaAcademica
                    var workbook = XLSX.readFile('./archivos/' + filename);
                    var sheet_name_list = workbook.SheetNames;
                    cargaAcademica = await XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]).slice();

                    //VALIDA LOS CAMPOS DE LA CARGA ACADÉMICA
                    cargaAcademica = await validacionCarga(cargaAcademica);
                    cargaAcademica = await cargaAcademica.slice();

                    //INICIA EL PROCESO DE CARGA EN BD
                    await cargarBD();
                    response.send("Carga académica subida a la Base de Datos con exíto!");
                }
            });
        });
    } catch (e) {
        response.send("Se produjo un error, intentelo de nuevo: " + e);
    }

});




//////////6.4-PETICIONES SOBRE ESTADÍSTICAS///////////////////////////////////////

//PETICION PARA OBTENER INFORMACIÓN SOBRE EL ESTUDIANTE 
app.post("/buscar-estudiante", verificarAccesoPeticion, function (request, response) {
    var query = consultas.obtenerInfoEstudiante();

    var historial = [];
    conexion.query(query,
        [request.body.cuenta, request.body.cuenta, request.body.cuenta])
        .on("result", function (resultado) {
            historial.push(resultado);
        })
        .on("end", function () {
            response.send(historial);
        });
});

//PETICIÓN PARA OBTENER EL HISTORIAL DEL ESTUDIANTE
app.post("/historial-estudiante", verificarAccesoPeticion, function (request, response) {
    var query = consultas.obtenerHistorial();

    var tblhistorial = [];
    conexion.query(query, [request.body.cuenta])
        .on("result", function (resultado) {
            tblhistorial.push(resultado);
        })
        .on("end", function () {
            response.send(tblhistorial);
        });
});

//PETICIÓN PARA OBTENER LOS PERIODOS
app.get("/periodo", verificarAccesoPeticion, function (request, response) {
    var sql = consultas.obtenerPeriodos();
    var periodos = [];
    conexion.query(sql)
        .on("result", function (resultado) {
            periodos.push(resultado);
        })
        .on("end", function () {
            response.send(periodos);
        });
});

//PETICIÓN PARA OBTENER LOS DOCENTES
app.get("/docentes", verificarAccesoPeticion, function (request, response) {
    var sql = consultas.obtenerDocentes();
    var docentes = [];
    conexion.query(sql, [request.query.desde, request.query.hasta])
        .on("result", function (resultado) {
            docentes.push(resultado);
        })
        .on("end", function () {
            response.send(docentes);
        });
});

//PETICIÓN PARA OBTENER LAS ÁREAS
app.get("/areas", verificarAccesoPeticion, function (request, response) {
    var sql = consultas.obtenerAreas();
    var areas = [];
    conexion.query(sql, [request.query.desde, request.query.hasta])
        .on("result", function (resultado) {
            areas.push(resultado);
        })
        .on("end", function () {
            response.send(areas);
        });
});

//PETICIÓN PARA OBTENER LAS ASIGNATURAS
app.get("/asignaturas", verificarAccesoPeticion, function (request, response) {
    var sql = consultas.obtenerAsignaturas();
    var asignaturas = [];
    conexion.query(sql, [request.query.desde, request.query.hasta])
        .on("result", function (resultado) {
            asignaturas.push(resultado);
        })
        .on("end", function () {
            response.send(asignaturas);
        });
});

//PETICIÓN PARA OBTENER LAS SECCIONES
app.get("/secciones", verificarAccesoPeticion, function (request, response) {
    var sql = consultas.obtenerSecciones();
    var secciones = [];
    conexion.query(sql)
        .on("result", function (resultado) {
            secciones.push(resultado);
        })
        .on("end", function () {
            response.send(secciones);
        });
});



//////////////6.4.1- FILTROS///////////////////////////////////////////////////

///FILTRO PARA MOSTRAR LAS ASIGNATURAS 
app.get("/actualizar-asignaturas", verificarAccesoPeticion, function (request, response) {
    var asignaturaxdocente = [];
    var datos = [];
    var sql = ``;
    if (request.query.num_docente == "todos") {
        if (request.query.areas == "todos") {
            //QUERY QUE OBTIENE ASIGNATURAS FILTRADAS POR PERIODO
            sql = consultas.asignaturasRango();
            datos = [request.query.desde, request.query.hasta];
        }
        else {
            //QUERY QUE OBTIENE ASIGNATURAS SEGÚN EL AREA
            sql = consultas.asignaturasRangoXArea();
            datos = [request.query.areas.split(","), request.query.desde, request.query.hasta];
        }
    } else if (request.query.areas == "todos") {
        //QUERY QUE OBTIENE ASIGNATURAS SEGÚN DOCENTE
        sql = consultas.asignaturasXDocente();
        datos = [request.query.num_docente.split(","), request.query.desde, request.query.hasta];
    } else {
        //QUERY QUE OBTIENE ASIGNATURAS SEGÚN AREA Y DOCENTE
        sql = consultas.asignaturasXDocenteXArea();
        datos = [request.query.num_docente.split(","), request.query.areas.split(","), request.query.desde, request.query.hasta];
    }
    //EJECUCIÓN DE QUERY
    conexion.query(sql, datos)
        .on("result", function (resultado) {
            asignaturaxdocente.push(resultado);
        })
        .on("end", function () {
            response.send(asignaturaxdocente);
        });
});

///FILTRO PARA MOSTRAR LOS DOCENTES
app.get("/actualizar-docentes", verificarAccesoPeticion, function (request, response) {
    var docentexareas = [];
    var datos = [];
    var sql = ``;
    if (request.query.cod_area == "todos") {
        if (request.query.asignaturas == "todos") {
            //QUERY PARA OBTENER LOS DOCENTES SEGÚN RANGO DE PERIODO
            sql = consultas.docentesRango();
            datos = [request.query.desde, request.query.hasta];
        }
        else {
            //QUERY PARA OBTENER DOCENTES SEGÚN ASIGNATURA
            sql = consultas.docentesXAsignatura();
            datos = [request.query.asignaturas.split(","), request.query.desde, request.query.hasta];
        }
    } else if (request.query.asignaturas == "todos") {
        //QUERY PARA OBTENER DOCENTES SEGÚN ÁREA
        sql = consultas.docentesXArea();
        datos = [request.query.cod_area.split(","), request.query.desde, request.query.hasta];
    } else {
        //QUERY PARA OBTENER DOCENTES SEGÚN ÁREA Y ÁSIGNATURA
        sql = consultas.docentesXAreaXAsignatura();
        datos = [request.query.cod_area.split(","), request.query.asignaturas.split(","), request.query.desde, request.query.hasta];
    }
    //EJECUCIÓN DE QUERY
    conexion.query(sql, datos)
        .on("result", function (resultado) {
            docentexareas.push(resultado);
        })
        .on("end", function () {
            response.send(docentexareas);
        });
});

///FILTRO PARA MOSTRAR LAS AREAS DE LAS ASIGNATURAS
app.get("/actualizar-areas", verificarAccesoPeticion, function (request, response) {
    var areasActualizadas = [];
    var datos = [];
    var sql = ``;
    if (request.query.num_docente == "todos") {
        if (request.query.asignaturas == "todos") {
            //QUERY PARA OBTENER ÁREAS SEGÚN RANGO DE PERIODOS
            sql = consultas.areasRango();
            datos = [request.query.desde, request.query.hasta];
        }
        else {
            //QUERY PARA OBTENER ÁREAS SEGÚN ASIGNATURAS
            sql = consultas.areasXAsignatura();
            datos = [request.query.asignaturas.split(","), request.query.desde, request.query.hasta];
        }
    } else if (request.query.asignaturas == "todos") {
        //QUERY PARA OBTENER ÁREAS SEGÚN DOCENTE
        sql = consultas.areasXDocente();
        datos = [request.query.num_docente.split(","), request.query.desde, request.query.hasta];
    } else {
        //QUERY PARA OBTENER ÁREAS SEGÚN DOCENTE Y ASIGNATURA
        sql = consultas.areasXDocenteXAsignatura();
        datos = [request.query.num_docente.split(","), request.query.asignaturas.split(","), request.query.desde, request.query.hasta];
    }
    //EJECUCIÓN DE QUERY
    conexion.query(sql, datos)
        .on("result", function (resultado) {
            areasActualizadas.push(resultado);
        })
        .on("end", function () {
            response.send(areasActualizadas);
        });
});


//FILTRO PARA MOSTRAR LAS OBSERVACIONES DE LA GRÁFICA DE PASTEL
app.get("/estadisticas-obs", verificarAccesoPeticion, function (request, response) {
    var obs = [];
    var sql = ``;
    var datos = [];
    if (request.query.num_docente == "todos") {
        if (request.query.areas == "todos") {
            if (request.query.asignaturas == "todos") {
                //QUERY PARA OBTENER OBSERVACIONES SEGÚN RANGO DE PERIODOS
                sql = consultas.obsRango();
                datos = [request.query.desde, request.query.hasta];
            }
            else {
                //QUERY PARA OBTENER OBSERVACIONES SEGÚN ASIGNATURA
                sql = consultas.obsXAsignatura();
                datos = [request.query.asignaturas.split(","), request.query.desde, request.query.hasta];
            }
        }
        else if (request.query.asignaturas == "todos") {
            //QUERY PARA OBTNER OBSERVACIONES SEGÚN ÁREA
            sql = consultas.obsXArea();
            datos = [request.query.areas.split(","), request.query.desde, request.query.hasta];
        }
        else {
            //QUERY PARA OBTENER OBSERVACIONES SEGÚN ÁREA Y ASIGNATURA
            sql = consultas.obsXAreaXAsignatura();
            datos = [request.query.asignaturas.split(","), request.query.areas.split(","), request.query.desde, request.query.hasta];
        }
    } else if (request.query.areas == "todos") {
        if (request.query.asignaturas == "todos") {
            //QUERY PARA OBTENER OBSERVACIONES SEGÚN DOCENTE
            sql = consultas.obsXDocente();
            datos = [request.query.num_docente.split(","), request.query.desde, request.query.hasta];
        }
        else {
            //QUERY PARA OBTENER OBSERVACIONES SEGÚN DOCENTE Y ASIGNATURA
            sql = consultas.obsXDocenteXAsignatura();
            datos = [request.query.asignaturas.split(","), request.query.num_docente.split(","), request.query.desde, request.query.hasta];
        }
    } else if (request.query.asignaturas == "todos") {
        //QUERY PARA OBTENER OBSERVACIONES SEGÚN ÁREA Y DOCENTE
        sql = consultas.obsXAreaXDocente();
        datos = [request.query.areas.split(","), request.query.num_docente.split(","), request.query.desde, request.query.hasta];
    }
    else {
        //QUERY PARA OBTENER OBSERVACIONES SEGÚN ÁREA, ASIGNATURA Y DOCENTE
        sql = consultas.obsXAreaXAsignaturaXDocente();
        datos = [request.query.asignaturas.split(","), request.query.areas.split(","), request.query.num_docente.split(","), request.query.desde, request.query.hasta];
    }

    //FILTRO PARA NUMERO DE CUENTA
    if (request.query.cuenta != "") {
        sql += ` AND A.num_cuenta_ck = ?`;
        datos.push(request.query.cuenta);
    }
    //FILTRO PARA OBSERVACIONES
    if (request.query.obs != "") {
        sql += ` AND A.txt_obs IN (?) `;
        datos.push(request.query.obs.split(","));
    }
    //FILTRO PARA DESHABILITAR EL PERIODO 4 (CLASES POR SUFICIENCIA)
    if (request.query.periodo4 == "true") {
        sql += ` AND A.num_periodo_pk !=4 `;
    }

    //AGRUPA SEGÚN LAS OBSERVACIONES
    sql += ` GROUP BY A.txt_obs`;

    //EJECUCIÓN DE QUERY
    conexion.query(sql, datos)
        .on("result", function (resultado) {
            obs.push(resultado);
        })
        .on("end", function () {
            response.send(obs);
        });
});


//FILTRO PARA MOSTRAR PROMEDIOS EN LA GRÁFICA DE BARRAS DE PROMEDIOS 
app.get("/estadisticas-promedioFinal", verificarAccesoPeticion, function (request, response) {
    var obs = [];
    var sql = ``;
    var datos = [];
    if (request.query.num_docente == "todos") {
        if (request.query.areas == "todos") {
            if (request.query.asignaturas == "todos") {
                //QUERY PARA OBTENER PROMEDIO SEGÚN RANGO DE PERIODOS
                sql = consultas.promRango();
                datos = [request.query.desde, request.query.hasta];
            }
            else {
                //QUERY PARA OBTENER PROMEDIO SEGÚN
                sql = consultas.promXAsignatura();
                datos = [request.query.asignaturas.split(","), request.query.desde, request.query.hasta];
            }
        }
        else if (request.query.asignaturas == "todos") {
            //QUERY PARA OBTENER PROMEDIO SEGÚN ÁREA
            sql = consultas.promXArea();
            datos = [request.query.areas.split(","), request.query.desde, request.query.hasta];
        }
        else {
            //QUERY PARA OBTENER PROMEDIO SEGÚN ASIGNATURA Y ÁREA
            sql = consultas.promXAsignaturaXArea();
            datos = [request.query.asignaturas.split(","), request.query.areas.split(","), request.query.desde, request.query.hasta];
        }
    } else if (request.query.areas == "todos") {
        if (request.query.asignaturas == "todos") {
            //QUERY PARA OBTENER PROMEDIO SEGÚN DOCENTE
            sql = consultas.promXDocente();
            datos = [request.query.num_docente.split(","), request.query.desde, request.query.hasta];
        }
        else {
            //QUERY PARA OBTENER PROMEDIO SEGÚN DOCENTE Y ASIGNATURA
            sql = consultas.promXDocenteXAsignatura();
            datos = [request.query.asignaturas.split(","), request.query.num_docente.split(","), request.query.desde, request.query.hasta];
        }
    } else if (request.query.asignaturas == "todos") {
        //QUERY PARA OBTENER PROMEDIO SEGÚN DOCENTE Y ÁREA
        sql = consultas.promXDocenteXArea();
        datos = [request.query.areas.split(","), request.query.num_docente.split(","), request.query.desde, request.query.hasta];
    }
    else {
        //QUERY PARA OBTENER PROMEDIO SEGÚN DOCENTE, ASIGNATURA, Y ÁREA
        sql = consultas.promXDocenteXAsignaturaXArea();
        datos = datos = [request.query.asignaturas.split(","), request.query.areas.split(","), request.query.num_docente.split(","), request.query.desde, request.query.hasta];
    }

    //FILTRO PARA NÚMERO DE CUENTA
    if (request.query.cuenta != "") {
        sql += ` AND A.num_cuenta_ck = ? `;
        datos.push(request.query.cuenta);
    }
    //FILTRO PARA OBSERVACIONES
    if (request.query.obs != "") {
        sql += ` AND A.txt_obs IN (?) `;
        datos.push(request.query.obs.split(","));
    }
    //FILTRO PARA DEHABILITAR CUARTO PERIODO (CLASES POR SUFICIENCIA)
    if (request.query.periodo4 == "true") {
        sql += ` AND A.num_periodo_pk !=4 `;
    }

    //AGRUPACIONES DE QUERY (PERIODO, AÑO)
    sql += ` GROUP BY A.num_periodo_pk , A.num_anio_pk 
    ORDER BY ANIO ASC, PERIODO ASC `;

    //EJECUCIÓN DE QUERY
    conexion.query(sql, datos)
        .on("result", function (resultado) {
            obs.push(resultado);
        })
        .on("end", function () {
            response.send(obs);
        });
});

//FILTRO PARA MOSTRAR INFORMACIÓN EN LA TABLA DE DETALLES 
app.get("/info-secciones", verificarAccesoPeticion, function (request, response) {
    var obs = [];
    var sql = ``;
    var datos = [];
    if (request.query.num_docente == "todos") {
        if (request.query.areas == "todos") {
            if (request.query.asignaturas == "todos") {
                //QUERY PARA OBTENER SECCIONES SEGÚN RANGO DE PERIODOS
                sql = consultas.seccFiltro();
                datos = [request.query.periodo, request.query.anio];
            }
            else {
                //QUERY PARA OBTENER SECCIONES SEGÚN ASIGNATURA
                sql = consultas.seccXAsignatura();
                datos = [request.query.periodo, request.query.anio, request.query.asignaturas.split(",")];
            }
        }
        else if (request.query.asignaturas == "todos") {
            //QUERY PARA OBTENER SECCIONES SEGÚN ÁREA
            sql = consultas.seccXArea();
            datos = [request.query.periodo, request.query.anio, request.query.areas.split(",")];
        }
        else {
            //QUERY PARA OBTENER SECCIONES SEGÚN ASIGNATURA Y ÁREA
            sql = consultas.seccXAsignaturaXArea();
            datos = [request.query.periodo, request.query.anio, request.query.asignaturas.split(","), request.query.areas.split(",")];
        }
    } else if (request.query.areas == "todos") {
        if (request.query.asignaturas == "todos") {
            //QUERY PARA OBTENER SECCIONES SEGÚN DOCENTE
            sql = consultas.seccXDocente();
            datos = [request.query.periodo, request.query.anio, request.query.num_docente.split(",")];
        }
        else {
            //QUERY PARA OBTENER SECCIONES SEGÚN DOCENTE Y ASIGNATURA
            sql = consultas.seccXDocenteXAsignatura();
            datos = [request.query.periodo, request.query.anio, request.query.asignaturas.split(","), request.query.num_docente.split(",")];
        }
    } else if (request.query.asignaturas == "todos") {
        //QUERY PARA OBTENER SECCIONES SEGÚN DOCENTE Y ÁREA
        sql = consultas.seccXDocenteXArea();
        datos = [request.query.periodo, request.query.anio, request.query.areas.split(","), request.query.num_docente.split(",")];
    }
    else {
        //QUERY PARA OBTENER SECCIONES SEGÚN DOCENTE, ASIGNATURA, Y ÁREA
        sql = consultas.seccXDocenteXAsignaturaXArea();
        datos = datos = [request.query.periodo, request.query.anio, request.query.asignaturas.split(","), request.query.areas.split(","), request.query.num_docente.split(",")];
    }

    //FILTRO PARA NÚMERO DE CUENTA
    if (request.query.cuenta != "") {
        sql += ` AND A.num_cuenta_ck = ? `;
        datos.push(request.query.cuenta);
    }

    //AÑADE AGRUPACIONES DE QUERY 
    sql += ` GROUP BY SECCION , ASIGNATURA`;

    //EJECUCIÓN DE QUERY
    conexion.query(sql, datos)
        .on("result", function (resultado) {
            obs.push(resultado);
        })
        .on("end", function () {
            response.send(obs);
        });
});



// app.get("/forma", async function (request, response) {
//     await abrirNavegador();
//     await login();

//     response.send({ status: 1 });

//     await obtenerForma03();




// });

async function obtenerForma03() {
    try {
        
        //ABRE EL MODAL PARA INTRODUCIR EL NÚMERO DE CUENTA PARA LA FORMA 03
        await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/table[@class='style1']/tbody/tr[2]/td[1]/a[@id='MainContent_LinkButton2']")).click();
        //INTRODUCE EL NÚMERO DE CUENTA EN EL CAMPO DEL FORMULARIO
        await driver.findElement(By.id("MainContent_TextBox1")).sendKeys(cuentaActual.cuenta);
        //CLICKEA EL BOTÓN DE ENTRADA AL FORMULARIO
        await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/div[@id='MainContent_Panel1']/div[@class='rel']/div[@class='modal-inner-wrapper rounded-corners']/div[@class='content rounded-corners']/div[@class='body']/table[@class='style4']/tbody/tr/td/input[@id='MainContent_Button6']")).click();

        var clasesForma = await extraerforma();
        //EN CASO DE QUE SEA UN NÚMERO DE CUENTA INVÁLIDO, CERRARA EL MODAL QUE CONTIENE EL ALERT DE ERROR
        try {
            await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/div[@id='MainContent_Panel1']/div[@class='rel']/div[@class='modal-inner-wrapper rounded-corners']/div[@class='content rounded-corners']/div[@class='close']/a[@id='MainContent_LinkButton4']")).click(); 
        } catch (error) {}
        //GUARDA LA FORMA 03 EN LA BASE DE DATOS
        if(clasesForma){

            for(i = 0; i < clasesForma.length; i++){
                await guardarForma03(clasesForma[i]);
            }
            
        }

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }


}

async function extraerforma() {
    var datos = await [];
    await driver.findElements(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/div[4]/table[2]/tbody/tr[1]/td[@class='style10']/div/table[@id='MainContent_GridView1']/tbody/tr"))
        .then(async function (elements) {
            if (elements.length == 0) {
                datos = await false;
            } else {
                for(i = 2; i <= elements.length; i++){
                    var codAsignatura = periodo = anio = await "";

                    //Obtiene el nombre de la carrera
                    

                    //Obtiene el año
                    await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/div[3]/table/tbody/tr/td[1]/table/tbody/tr[2]/td[@class='style12']/span[@id='MainContent_Label6']"))
                        .getText().then(function (promiseResult) {
                            anio = promiseResult
                        });

                    //Obtiene el código de asignatura
                    await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/div[4]/table[2]/tbody/tr[1]/td[@class='style10']/div/table[@id='MainContent_GridView1']/tbody/tr[" + i + "]/td[1]"))  
                    .getText().then(function (promiseResult) {
                            codAsignatura = promiseResult;
                        });

                    //Obtiene el nombre de la asignatura
                    await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/div[4]/table[2]/tbody/tr[1]/td[@class='style10']/div/table[@id='MainContent_GridView1']/tbody/tr[" + i + "]/td[2]"))
                    .getText().then(function (promiseResult) {
                        nombreAsignatura = promiseResult;
                    });

                    //Obtiene el periodo 
                    await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/div[4]/table[2]/tbody/tr[1]/td[@class='style10']/div/table[@id='MainContent_GridView1']/tbody/tr[" + i + "]/td[11]"))
                        .getText().then(function (promiseResult) {
                            periodo = promiseResult;
                        });
                    //Crea el json de datos a retornar
                    await datos.push({
                        anio : anio,
                        codAsignatura : codAsignatura, 
                        nombreAsignatura : nombreAsignatura,
                        periodo : periodo,
                        cuenta: cuentaActual.cuenta
                    })
                    
                }
            }
        });

    return datos;    
}


function guardarForma03(forma){
   
    console.log(forma);
    var sql = `call insertar_forma(?,?,?,?,?)`;
    //VERIFICA SI HAY PERIODO Y AÑO
    var periodo = forma.periodo != "" ? forma.periodo : 0;
    var anio = forma.anio != "" ? forma.anio : 0;
    //EJECUCIÓN DE QUERY
    conexion.query(
        sql,
        [periodo, anio, forma.codAsignatura, forma.nombreAsignatura, forma.cuenta],
        function (err, result) {
            if (err) throw err;
            return result;
        }
    );
    return true;
}

//RUTA QUE SE UTILIZA EN CASO DE PONER UNA DIRECCION INCORRECTA
app.use(verificarAutenticacion, function (req, res) {
    res.send(`<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>404 - Página no encontrada</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="css/bootstrap.min.css">
    </head>
    <body>
        <form class="form-control">
            <div class="form-control text-center">
                <h1>Error de acceso !!</h1>
                <h1>La página no ha sido encontrada.</h1>
            </div><br>
            <div class="form-control text-center">
                <a href="/inicio.html" class="btn btn-dark">Volver</a>
            </div>
        </form>
    </body>
    </html>`);
});






///////////////////////////////////////////////////////////////////////////////
/////////////////////////////7-FUNCIONES/////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////
///////////////////7.1-FUNCIONES GENERALES/////////////////////////////////////////

//ABRE UNA VENTANA DE CHROME CON SELENIUM-WEBDRIVER
async function abrirNavegador() {
    driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();
}

//CIERRA LA VENTANA ABIERTA DE CHROME CON SELENIUM-WEBDRIVER
async function cerrarNavegador() {
    driver.quit();
}

//INICIO DE SESIÓN DENTRO DE LA PÁGINA DE REGISTRO (SELENIUM-WEBDRIVER)
async function login() {
    try {
       
        //SE DIRIGE A LA PÁGINA DE REGISRO EN LA URL CON SELENIUM-WEBDRIVER
        await driver.get('https://registro.unah.edu.hn/je_login.aspx');
        //COLOCA LAS CREEDENCIALES EN EL FORMULARIO
        await driver.findElement(By.id("MainContent_txt_cuenta")).sendKeys(sesionRegistro.usuario);
        await driver.findElement(By.id("MainContent_txt_clave")).sendKeys(sesionRegistro.contrasenia);

        //DA CLICK EN EL BOTÓN DE INICIO
        await driver.findElement(By.id("MainContent_Button1")).click();
        await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/div[3]/div[@id='MainContent_Menu1']/ul[@class='level1 static']/li[@class='static'][2]/a[@class='level1 static']")).click();
        return true;
    } catch (e) {
        
        cerrarNavegador();
        return false;
    }
}


//VALIDA LA INFORMACIÓN DEL ARCHIVO DE LA CARGA ACADÉMICA PARA SU PROCESAMIENTO CORRECTO
async function validacionCarga(arreglo) {
    var nuevoArreglo = [];
    for (var k = 0; k < arreglo.length; k++) {
        var first = true;
        var cadena = `{`;
        for (var key in arreglo[k]) {
            var clave = key.replace(/\s/g, '');
            clave = clave.toUpperCase();
            if (first) {
                cadena += '"' + clave + '":"' + arreglo[k][key] + '"';
                first = false;
            } else {
                cadena += ',"' + clave + '":"' + arreglo[k][key] + '"';
            }
        }
        cadena += `}`;
        var elementoJson = JSON.parse(cadena);
        nuevoArreglo.push(elementoJson);
    }
    return nuevoArreglo;
}

//VALIDA LA INFORMACIÓN DEL ARCHIVO DE CUENTAS PARA SU PROCESAMIENTO CORRECTO 
async function validacionCuentas(arreglo) {
    var nuevoArreglo = [];
    for (var k = 0; k < arreglo.length; k++) {
        var first = true;
        var cadena = `{`;
        for (var key in arreglo[k]) {
            var clave = key.replace(/\s/g, '');
            clave = clave.toLowerCase();
            if (first) {
                cadena += '"' + clave + '":"' + arreglo[k][key] + '"';
                first = false;
            } else {
                cadena += ',"' + clave + '":"' + arreglo[k][key] + '"';
            }
        }
        cadena += `}`;
        var elementoJson = JSON.parse(cadena);
        nuevoArreglo.push(elementoJson);
    }
    return nuevoArreglo;
}

//VERIFICA SI EXISTE UN ARCHIVO
function existeArchivo(path) {
    try {
        fs.statSync(path).isFile();
        return true;
    } catch (e) {
        return false;
    }
}



///////////////////////////////////////////////////////////////////////////////
//////////////7.2-FUNCIONES SOBRE LA CARGA ACADÉMICA///////////////////////////////

//INSERTA TODOS LOS REGISTROS DE LA CARGA ACADÉMICA EN LA BASE DE DATOS
async function cargarBD() {
    for (var i = 0; i < cargaAcademica.length; i++) {
        try {
            await insertarRegistroCargaBD(cargaAcademica[i]);
        } catch (e) {
            await console.log("Error al subir la Carga Academica en la Base de Datos");
        }
    }
    await console.log("Carga academica subida a la base de datos... Finalizado");
}

//INSERTA UN REGISTRO DE LA CARGA ACADÉMICA EN LA BASE DE DATOS
function insertarRegistroCargaBD(registro) {
    if (registro.COD == "" || registro.COD == null || registro.COD == 0) return true;
    //QUERY PARA INSERTAR REGISTRO DE CARGA ACADÉMICA EN BD
    var sql = `call insertar_carga(?,?,?,?,?,?,?,?,?,?,?,?)`;

    //EJECUCIÓN DE QUERY
    conexion.query(
        sql,
        [registro.COD, registro.ASIGNATURA, registro.SEC, registro.PERIODO, registro.ANIO, registro.HI, registro.HF, registro.DIAS, registro.AULA, registro.ED, registro.NE, registro.PROFESOR],
        function (err, result) {
            if (err) throw err;
            return result;
        }
    );
    return true;
}




///////////////////////////////////////////////////////////////////////////////
///////////////7.3-FUNCIONES SOBRE LA EXTRACCIÓN DE DATOS//////////////////////////


//PROCESO PRINCIPAL PARA LA EXTRACCIÓN DE DATOS (CON SELENIUM-WEBDRIVER)
async function escarbar() {
    var tam = cuentas.length;
    for (var j = 0; j < tam; j++) {
        try {
            //VERIFICA EL ESTADO DE EXTRACCIÓN
            if (estadoProgreso != "extrayendo") {
                await cerrarNavegador();
                break;
            }
            //CALCULA EL PROGRESO ACTUAL DE LA EXTRACCIÓN
            progreso = j / (tam - 1);

            //VALIDA SI LA CUENTA NO HA PASADO POR ES PROCESO DE EXTRACCIÓN
            if (cuentas[j].finalizado == false) {
                await console.log(cuentas[j].cuenta);
                //COLOCA EL NÚMERO DE CUENTA EN EL FORMULARIO DE LA PÁGINA E INGRESA AL HISTORIAL CON SELENIUM-WEBDRIVER
                var verificador = await irHistorial(cuentas[j].cuenta);
                //SI EL NÚMERO DE CUENTA FUE VALIDO
                if (verificador == true) {
                    cuentaActual = await cuentas[j];
                    //EXTRAE LA INFORMACIÓN DEL GENERAL(INDICE, CENTRO DE ESTUDIO, ETC) CON SELENIUM-WEBDRIVER
                    estudiante = await extraerInfoEstudiante();
                    //EXTRAE TODAS LAS CLASES CON SU INFORMACIÓN DE LA TABLA HISTORIAL CON SELENIUM-WEBDRIVER
                    await extraerRegistrosHistorial();
                    //INSERTA TODO EL HISTORIAL EN LA BASE DE DATOS
                    await guardarHistorial();

                    //RETROCEDE A LA PANTALLA DONDE SE SELECCIONA ABRIR EL HISTORIAL O LA FORMA03 (CON SELENIUM-WEBDRIVER)
                    await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/table[1]/tbody/tr/td[3]/a[@id='MainContent_LinkButton1']"))
                        .click();
                    
                    //EXTRAE LA FORMA 03 (AÑO, PERIODO, COD_ASIGNATURA) CON SELENIUM-WEBDRIVER
                    await obtenerForma03();

                    //RETROCEDE A LA PANTALLA DONDE SE SELECCIONA ABRIR EL HISTORIAL O LA FORMA03 (CON SELENIUM-WEBDRIVER)
                   
                    try {
                        await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/div[1]/table/tbody/tr/td[3]/a[@id='MainContent_LinkButton11']"))
                        .click();
                    } catch (error) {}

                    //ESTABLECE LA FINALIZACIÓN DEL PROCESO DE EXTRACCIÓN EN LA CUENTA
                    cuentas[j].finalizado = await true;
                    //REESCRIBE EN EL ARCHIVO DE RESPALDO EL ARRAY DE JSON DE CUENTAS ACTUALIZADO
                    await escribirRespaldo(cuentas);


                    


                    //SI ES LA ÚLTIMA CUENTA EL ESTADO PASA A FINALIZADO
                    if (j == tam - 1) {
                        estadoProgreso = await "finalizado";
                        await guardarEstado();
                    }
                }
                //SI EL NÚMERO DE CUENTA FUE INVALIDO
                else {
                    //ACTUALIZA LOS DATOS DEL ARRAY Y LO REESCRIBE EN EL ARCHIVO DE RESPALDO
                    cuentas[j].finalizado = await true;
                    cuentas[j].valido = await false;
                    await escribirRespaldo(cuentas);

                    //ESCRIBE EN UN ARCHIVO LA CUENTA INVALIDA
                    if (cuentasInvalidas == "") {
                        if (existeArchivo("./archivos/cuentas_invalidas.txt")) {
                            cuentasInvalidas = await fs.readFileSync('./archivos/cuentas_invalidas.txt', 'utf8');
                        }
                        cuentasInvalidas += await cuentas[j].cuenta;
                    }
                    else {
                        cuentasInvalidas += await "," + cuentas[j].cuenta;
                    }
                    await fs.writeFileSync('./archivos/cuentas_invalidas.txt', cuentasInvalidas, { mode: 0o755 });
                    //PREPARA LA NAVEGACIÓN PARA LA CONTINUAR CON LA SIGUIENTE CUENTA
                    await driver.findElement(By.id("MainContent_TextBox1")).clear();
                    await driver.findElement(By.id("MainContent_LinkButton4")).click();
                }

            }
        } catch (e) {
            //EN CASO DE ERROR EN EL PROCESO SE PAUSA
            estadoProgreso = await "pausado";
            await guardarEstado();
            error = await "Error al extraer datos, reanude para reintentar";
            await console.error(e);

        }
    }
    //CIERRA EL NAVEGADOR CON SELENIUM-WEBDRIVER
    await cerrarNavegador();
    return cuentas;
}

//ENTRA AL HISTORIAL ESTANDO LOGUEADO CON SELENIUM-WEBDRIVER
async function irHistorial(nrocuenta) {
    try {
        //DIRIGE LA NAVEGACIÓN HACIA EL FORMULARIO DE CUENTAS (SELENIUM-WEBDRIVER)
        await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/table[@class='style1']/tbody/tr[1]/td[1]/a[@id='MainContent_LinkButton1']")).click();
        //INTRODUCE EL NÚMERO DE CUENTA EN EL CAMPO DEL FORMULARIO
        await driver.findElement(By.id("MainContent_TextBox1")).sendKeys(nrocuenta);
        //CLICKEA EL BOTÓN DE ENTRADA AL FORMULARIO
        await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/div[@id='MainContent_Panel1']/div[@class='rel']/div[@class='modal-inner-wrapper rounded-corners']/div[@class='content rounded-corners']/div[@class='body']/table[@class='style4']/tbody/tr/td/input[@id='MainContent_Button6']")).click();

    } catch (e) {
        return false;eeeeee
    }

    //VERIFICA QUE LA CUENTA INGRESADA FUE LA CORRECTA
    try {
        await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/div[@id='MainContent_Panel1']/div[@class='rel']/div[@class='modal-inner-wrapper rounded-corners']/div[@class='content rounded-corners']/div[@class='body']/table[2]/tbody/tr[2]/td[@class='style12']/span[@id='MainContent_Label17']"))
        return false;
    } catch (e) { return true }
}

//EXTRAE LA INFORMACIÓN GENERAL DEL ESTUDIANTE ESTANDO EN SU HISTORIAL (CON SELENIUM-WEBDRIVER)
async function extraerInfoEstudiante() {
    var nrocuenta = nombre = centro = carrera = await "";
    try {
        //OBTIENE LA INFORMACIÓN DEL LABEL QUE CONTIENE EL NÚMERO DE CUENTA
        await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/table[@id='MainContent_ASPxRoundPanel2']/tbody/tr/td/table/tbody/tr[3]/td[@id='MainContent_ASPxRoundPanel2_RPC']/table/tbody/tr[1]/td[@class='style10']/label[@id='MainContent_ASPxRoundPanel2_ASPxLabel7']"))
            .getText().then(function (promiseResult) {
                nrocuenta = promiseResult;
            });
        //OBTIENE LA INFORMACIÓN DEL LABEL QUE CONTIENE EL NOMBRE DEL ESTUDIANTE
        await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/table[@id='MainContent_ASPxRoundPanel2']/tbody/tr/td/table/tbody/tr[3]/td[@id='MainContent_ASPxRoundPanel2_RPC']/table/tbody/tr[2]/td[@class='style53']/label[@id='MainContent_ASPxRoundPanel2_ASPxLabel8']"))
            .getText().then(function (promiseResult) {
                nombre = promiseResult;
            });
        //OBTIENE LA INFORMACIÓN DEL LABEL QUE CONTIENE EL CENTRO DE ESTUDIO
        await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/table[@id='MainContent_ASPxRoundPanel2']/tbody/tr/td/table/tbody/tr[3]/td[@id='MainContent_ASPxRoundPanel2_RPC']/table/tbody/tr[1]/td[@class='style16']/label[@id='MainContent_ASPxRoundPanel2_ASPxLabel10']"))
            .getText().then(function (promiseResult) {
                centro = promiseResult;
            });
        //OBTIENE LA INFORMACIÓN DEL LABEL QUE CONTIENE LA CARRERA QUE ESTUDIA
        await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/table[@id='MainContent_ASPxRoundPanel2']/tbody/tr/td/table/tbody/tr[3]/td[@id='MainContent_ASPxRoundPanel2_RPC']/table/tbody/tr[3]/td[@class='style53']/label[@id='MainContent_ASPxRoundPanel2_ASPxLabel9']"))
            .getText().then(function (promiseResult) {
                carrera = promiseResult;
            });

        //CREA UN JSON CON LA INFORMACIÓN EXTRAIDA Y LO RETORNA
        var estudiante = await {
            nroCuenta: nrocuenta,
            nombre: nombre,
            centroEstudio: centro,
            carrera: carrera
        };
        return estudiante;

    } catch (e) {
        console.log(e);
    }
}

//EXTRAE TODOS LOS REGISTROS DE UN HISTORIAL 
async function extraerRegistrosHistorial() {
    try {
        //OBTIENE EL NÚMERO DE PÁGINAS QUE ESTÁ EN UN LABEL (CON SELENIUM-WEBDRIVER)
        await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/table[3]/tbody/tr[2]/td[@class='style3']/table[@id='MainContent_ASPxPageControl1']/tbody/tr[2]/td[@id='MainContent_ASPxPageControl1_CC']/div[@id='MainContent_ASPxPageControl1_C0']/table[@id='MainContent_ASPxPageControl1_ASPxGridView2']/tbody/tr/td/div[@class='dxgvPagerBottomPanel_Aqua']/table[@id='MainContent_ASPxPageControl1_ASPxGridView2_DXPagerBottom']/tbody/tr/td[@class='dxpCtrl']/table/tbody/tr/td[@class='dxpSummary_Aqua']")).getText().then(async function (promiseResult) {
            var nropaginas = await promiseResult.split(" ");
            //SE MUEVE POR LAS PÁGINAS Y EXTRAE TODO EL HISTORIAL
            await extraerHistorial(nropaginas[3]);
        }).catch(async function () {
            //EN CASO DE QUE EL HISTORIAL SOLO TENGA UNA PÁGINA
            await extraerHistorial(1);
        });

    } catch (e) {
        console.log(e);
    }
}

//RECORRE EL ARRAY GLOBAL DEL HISTORIAL Y ALMACENA EN BD
function guardarHistorial() {
    for (var i = 0; i < historial.length; i++) {
        guardarRegistro(historial[i]);
    }
}

//CREA O REESCRIBE EL ARCHIVO DE RESPALDO DE CUENTAS PARA LA EXTRACCIÓN
async function escribirRespaldo(cuentas) {
    try {
        await fs.writeFileSync('./archivos/respaldo.txt', JSON.stringify(cuentas), { mode: 0o755 });
    } catch (err) {
        console.error(err);
    }
    return true;
}

//INICIARLIZA EL ARRAY DE JSON DE CUENTAS PARA LA EXTRACCIÓN DE DATOS DE REGISTRO 
async function inicializarEstadoCuentas() {
    for (var i = 0; i < cuentas.length; i++) {
        //CREA UN CAMPO "FINALIZADO" POR DEFECTO FALSE (REFLEJA SI LA INFORMACIÓN DE LA CUENTA FUE EXTRAÍDA)
        cuentas[i].finalizado = false;
        //CREA UN CAMPO "VALIDO" (REFLEJA SI LA CUENTA FUE VALIDA EN EL PROCESO DE EXTRACCIÓN)
        cuentas[i].valido = true;
    }
    return true;
}

//VERIFICA EL CAMBIO DE PÁGINA DE HISTORIAL CON TIEMPO MÁXIMO DE 20 SEGUNDOS
async function tiempoCarga(pagina) {
    //DIRECCIÓN DE ELEMENTO DE PÁGINA SIGUIENTE
    var xpath = await "/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/table[3]/tbody/tr[2]/td[@class='style3']/table[@id='MainContent_ASPxPageControl1']/tbody/tr[2]/td[@id='MainContent_ASPxPageControl1_CC']/div[@id='MainContent_ASPxPageControl1_C0']/table[@id='MainContent_ASPxPageControl1_ASPxGridView2']/tbody/tr/td/table[@id='MainContent_ASPxPageControl1_ASPxGridView2_DXMainTable']/tbody/tr[@id='MainContent_ASPxPageControl1_ASPxGridView2_DXDataRow" + (pagina + 1).toString() + "0']/td[@class='dxgv'][2]";
    for (var i = 0; i <= 400; i++) {
        //ESPERA DE 50 MILISEGUNDOS (MIENTRAS NO ENCUENTRE EL TÍTULO DE PÁGINA "13261vgadafkjhf", VALOR COLOCADO ALEATORIAMENTE PARA FORZAR LA ESPERA)
        await driver.wait(until.titleIs('13261vgadafkjhf'), 50).catch(function (err) { });
        try {
            //BUSCA EL ELEMENTO (SI NO LO ENCUENTRA ENTRA EN EL BLOQUE catch)
            await driver.findElement(By.xpath(xpath))
            return true;
        } catch (e) { }
    }
    throw "Tiempo de espera agotado!";
}

//EXTRAE TODAS LAS PÁGINAS DEL HISTORIAL (SELENIUM-WEBDRIVER)
async function extraerHistorial(totalPaginas) {
    historial = await [];
    var paginaActual = await 0;
    var centinela = await 0;
    //EXTRAE LOS REGISTROS DE LA PRIMERA PÁGINA DEL HISTORIAL
    await extraerPaginaHistorial();

    //RECORRE LAS PÁGINAS DEL HISTORIAL
    while (paginaActual < totalPaginas - 1) {
        try {
            //SI LA PÁGINA ACTUAL ES LA PRIMERA, LA DIRECCIÓN DEL BOTÓN SIGUIENTE EN LA PÁGINA DE REGISTRO ES DIFERENTE
            if (paginaActual == 0) {
                var btnSiguientePag = await "/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/table[3]/tbody/tr[2]/td[@class='style3']/table[@id='MainContent_ASPxPageControl1']/tbody/tr[2]/td[@id='MainContent_ASPxPageControl1_CC']/div[@id='MainContent_ASPxPageControl1_C0']/table[@id='MainContent_ASPxPageControl1_ASPxGridView2']/tbody/tr/td/div[@class='dxgvPagerBottomPanel_Aqua']/table[@id='MainContent_ASPxPageControl1_ASPxGridView2_DXPagerBottom']/tbody/tr/td[@class='dxpCtrl']/table/tbody/tr/td[@class='dxpButton_Aqua']";
            } else
                var btnSiguientePag = await "/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/table[3]/tbody/tr[2]/td[@class='style3']/table[@id='MainContent_ASPxPageControl1']/tbody/tr[2]/td[@id='MainContent_ASPxPageControl1_CC']/div[@id='MainContent_ASPxPageControl1_C0']/table[@id='MainContent_ASPxPageControl1_ASPxGridView2']/tbody/tr/td/div[@class='dxgvPagerBottomPanel_Aqua']/table[@id='MainContent_ASPxPageControl1_ASPxGridView2_DXPagerBottom']/tbody/tr/td[@class='dxpCtrl']/table/tbody/tr/td[@class='dxpButton_Aqua'][2]";

            //CLICKEA LA DIRECCIÓN ANTERIOR
            await driver.findElement(By.xpath(btnSiguientePag)).click();
            //VERIFICA QUE CARGÓ LA SIGUIENTE PÁGINA
            await tiempoCarga(paginaActual);
            //EXTRAE LOS REGISTRO DE LA PÁGINA ACTUAL DEL HISTORIAL
            await extraerPaginaHistorial();
            //SIGUIENTE PÁGINA
            paginaActual = await paginaActual + 1;
            //REINICIALIZA EL CENTINELA EN 0
            centinela = await 0;

        }
        //EN CASO DE QUE EL TIEMPO DE CARGA SIDO SUPERADO (20 SEG)
        catch (e) {
            //ESPERA 30 SEGUNDOS (EL VALOR "axsjklOssdf" FUE COLOCADO ALEATORIAMENTE PARA FORZAR LA ESPERA)
            await driver.wait(until.titleIs('axsjklOssdf'), 30000).catch(function (err) { });
            //EJECUTA EL LOGIN DE REGISTRO DE NUEVO
            await login();
            //NAVEGA AL FORMULARIO DEL HISTORIAL E INGRESA CON EL NÚMERO DE CUENTA ACTUAL
            await irHistorial(cuentaActual.cuenta);
            //REINICIALIZA LAS VARIABLES DE HISTORIAL
            paginaActual = await 0;
            historial = await [];
            //EXTRAE LA PRIMER PÁGINA DEL HISTORIAL
            await extraerPaginaHistorial();
            //CENTINELA PARA LIMITAR LA EXCEPCIÓN A 10 INTENTOS
            centinela = await centinela + 1;
        }
        if (centinela == 10) {
            console.log("Error con la conexión, vuelva a intentarlo");
            throw "Error con la conexión, vuelva a intentarlo";
        }

    }
    return true;
}

//EXTRAE UNA SOLA PÁGINA DE REGISTROS DEL HISTORIAL (SELENIUM-WEBDRIVER)
async function extraerPaginaHistorial() {
    //OBTIENE LA TABLA COMPLETA COMO TEXTO
    await driver.findElement(By.xpath("/html/body/form[@id='ctl01']/div[@class='page']/div[@class='header']/div[@class='main']/table[3]/tbody/tr[2]/td[@class='style3']/table[@id='MainContent_ASPxPageControl1']/tbody/tr[2]/td[@id='MainContent_ASPxPageControl1_CC']/div[@id='MainContent_ASPxPageControl1_C0']/table[@id='MainContent_ASPxPageControl1_ASPxGridView2']/tbody/tr/td/table[@id='MainContent_ASPxPageControl1_ASPxGridView2_DXMainTable']"))
        .getText().then(function (promiseResult) {
            var res = promiseResult.split("\n");
            //RECORRE CADA FILA DE LA TABLA
            for (i = 8; i < res.length; i++) {
                var fila = res[i];
                fila = fila.replace("   ", "  ");
                var clase = fila.split(" ");
                //CREA UN JSON CON LOS DATOS EXTRAIDOS DE LA FILA
                var reg = {
                    codAsignatura: clase[0],
                    nombreAsignatura: clase.slice(1, clase.length - 6).toString().replace(/,/g, ' '),
                    uv: clase[clase.length - 6],
                    seccion: clase[clase.length - 5],
                    anio: clase[clase.length - 4],
                    periodo: clase[clase.length - 3],
                    calificacion: clase[clase.length - 2],
                    observacion: clase[clase.length - 1]
                };
                //AGREGA LA FILA EN UN ARRAY GLOBAL
                historial.push(reg);
            }
        });
}

//INSERTA EN LA BASE DE DATOS UN REGISTRO DE HISTORIAL
function guardarRegistro(registro) {
    var seccion = uv = 0;
    var sql = `call insertar_historial(?,?,?,?,?,?,?,?,?,?,?,?)`;
    //VERIFICA SI HAY SECCIÓN Y UV
    if (registro.seccion != "")
        seccion = registro.seccion
    if (registro.uv != "")
        uv = registro.uv
    //EJECUCIÓN DE QUERY
    conexion.query(
        sql,
        [estudiante.nroCuenta, estudiante.nombre, registro.codAsignatura, registro.nombreAsignatura,
            seccion, registro.periodo, registro.anio, registro.calificacion, uv,
        registro.observacion, estudiante.centroEstudio, estudiante.carrera],
        function (err, result) {
            if (err) throw err;
            return result;
        }
    );
    return true;

}

//GUARDA EN UN ARCHIVO EL ESTADO ACTUAL DEL PROCESO DE EXTRACCIÓN
async function guardarEstado() {
    fs.writeFileSync('./archivos/estado.txt', estadoProgreso, { mode: 0o755 });
}

//VERIFICA Y ASIGNA EL ESTADO DEL PROCESO DE EXTRACCIÓN DESDE EL ARCHIVO QUE LO ALMACENA
async function inicializarEstado() {
    if (existeArchivo("./archivos/estado.txt")) {
        var temp = await fs.readFileSync('./archivos/estado.txt', 'utf8');
        if (temp == "detenido" || temp == "extrayendo" || temp == "finalizado" || temp == "pausado") {
            estadoProgreso = temp;
            if (temp == "extrayendo") {
                estadoProgreso = "pausado";
            }
        }
    }
}

app.listen(3333);
console.log("Servidor iniciado");
inicializarEstado();