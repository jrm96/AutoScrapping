module.exports = {
    ///////////////////////////////////////////////////////////////////////////////
    ///CONSULTAS GENERALES/////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    login: function() {
        return `SELECT cod_usuario_pk, txt_nombre, cod_tipo_usuario_fk FROM tbl_usuario WHERE 
        txt_nombre = ? and txt_contrasenia=sha1(?);`;
    },


    obtenerInfoEstudiante: function() {
        return `SELECT A.num_anio_pk ANIO, A.num_periodo_pk PERIODO, INDICE_GLOBAL, INDICE_PERIODO, A.num_cuenta_ck, C.txt_nombre NOMBRE, C.txt_centro_estudio CENTRO_ESTUDIO, D.txt_nombre_carrera
            FROM 
            (
                SELECT SUM(A.num_calificacion*A.num_uv)/SUM(A.num_uv) INDICE_PERIODO, A.num_anio_pk, A.num_periodo_pk, A.num_cuenta_ck
                FROM tbl_historial A
                LEFT JOIN tbl_seccion B 
                ON ((B.num_seccion_pk = A.num_seccion_pk)
                    AND (B.num_periodo_pk = A.num_periodo_pk)
                    AND (B.num_anio_pk = A.num_anio_pk)
                    AND (B.cod_asignatura_ck = A.cod_asignatura_ck)
                )
                WHERE (A.num_cuenta_ck = ?)
                AND (A.txt_obs != 'NSP')
                AND NOT ((A.txt_obs !='APR') AND ((A.num_anio_pk = 2017) AND (A.num_periodo_pk = 2)))
                GROUP BY A.num_cuenta_ck, A.num_periodo_pk, A.num_anio_pk
            ) A 
            INNER JOIN 
            (
                SELECT SUM(NOTAS)/SUM(UVS) INDICE_GLOBAL, A.num_anio_pk, A.num_periodo_pk, B.CUENTA 
                FROM tbl_historial A 
                INNER JOIN 
                (
                    SELECT A.num_anio_pk, A.num_periodo_pk, A.num_cuenta_ck CUENTA,
                    SUM(A.num_calificacion*A.num_uv) NOTAS, SUM(A.num_uv) UVS, CONCAT(A.num_anio_pk, A.num_periodo_pk) ANIO_PERIODO
                    FROM tbl_historial A
                    LEFT JOIN tbl_seccion B 
                    ON ((B.num_seccion_pk = A.num_seccion_pk)
                        AND (B.num_periodo_pk = A.num_periodo_pk)
                        AND (B.num_anio_pk = A.num_anio_pk)
                        AND (B.cod_asignatura_ck = A.cod_asignatura_ck)
                    )
                    WHERE (A.num_cuenta_ck = ?)
                    AND (A.txt_obs != 'NSP')
                    AND NOT ((A.txt_obs !='APR') AND ((A.num_anio_pk = 2017) AND (A.num_periodo_pk = 2)))
                    GROUP BY A.num_cuenta_ck, A.num_periodo_pk, A.num_anio_pk
                ) B
                ON (B.ANIO_PERIODO <= CONCAT(A.num_anio_pk, A.num_periodo_pk))
                WHERE (A.num_cuenta_ck = ?)
                AND (A.txt_obs != 'NSP')
                AND NOT ((A.txt_obs !='APR') AND ((A.num_anio_pk = 2017) AND (A.num_periodo_pk = 2)))
                GROUP BY A.num_periodo_pk, A.num_anio_pk, CUENTA
            ) B
            ON (A.num_anio_pk = B.num_anio_pk AND A.num_periodo_pk = B.num_periodo_pk)
            INNER JOIN TBL_ESTUDIANTE C
            ON (A.num_cuenta_ck = C.num_cuenta_pk) 
            INNER JOIN TBL_CARRERA D ON (D.cod_carrera_pk = C.cod_carrera_fk)
            ORDER BY A.num_anio_pk ASC, A.num_periodo_pk ASC`;
    },

    obtenerHistorial: function() {
        return `SELECT A.cod_asignatura_ck, B.txt_nombre_asignatura, A.num_uv, A.num_seccion_pk, A.num_anio_pk, A.num_periodo_pk, A.num_calificacion, A.txt_obs 
                FROM tbl_historial A
                INNER JOIN tbl_asignatura B
                ON A.cod_asignatura_ck = B.cod_asignatura_pk
                WHERE num_cuenta_ck = ?  
                ORDER BY A.num_anio_pk, A.num_periodo_pk, A.num_uv ASC`;
    },

    obtenerPeriodos: function() {
        return `SELECT num_anio_pk anio,  num_periodo_pk periodo 
                FROM tbl_historial
                GROUP BY num_periodo_pk, num_anio_pk
                ORDER BY num_anio_pk ASC, num_periodo_pk  ASC`;
    },

    obtenerDocentes: function() {
        return `SELECT num_docente_pk, txt_nombre FROM tbl_docente A
                INNER JOIN tbl_seccion B ON A.num_docente_pk = B.num_docente_ck
                WHERE CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?
                GROUP BY num_docente_pk`;
    },

    obtenerAreas: function() {
        return `SELECT A.cod_area_pk, A.txt_nombre_area FROM tbl_areas A
                INNER JOIN tbl_asignatura B ON A.cod_area_pk = B.cod_area_pk
                INNER JOIN tbl_seccion C ON B.cod_asignatura_pk = C.cod_asignatura_ck
                WHERE CONCAT(C.num_anio_pk,C.num_periodo_pk) BETWEEN ? AND ?
                GROUP BY A.cod_area_pk`;
    },

    obtenerAsignaturas: function() {
        return `SELECT cod_asignatura_pk, CONCAT(txt_nombre_asignatura, " - ", cod_asignatura_pk) txt_nombre_asignatura FROM tbl_asignatura A
                INNER JOIN tbl_seccion B ON A.cod_asignatura_pk = B.cod_asignatura_ck 
                WHERE CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?
                GROUP BY cod_asignatura_pk`;
    },

    obtenerSecciones: function() {
        return `SELECT concat(num_seccion_pk,"-",num_periodo_pk,"-",num_anio_pk) as seccion FROM tbl_seccion`;
    },



    ///////////////////////////////////////////////////////////////////////////////
    ///FILTRO PARA MOSTRAR LAS ASIGNATURAS ////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    asignaturasRango: function() {
        return `SELECT DISTINCT A.cod_asignatura_pk, CONCAT(A.txt_nombre_asignatura, " - ", A.cod_asignatura_pk) txt_nombre_asignatura
            FROM tbl_asignatura A 
            INNER JOIN tbl_seccion B
            ON A.cod_asignatura_pk = B.cod_asignatura_ck 
            WHERE CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?`;
    },

    asignaturasRangoXArea: function() {
        return `SELECT DISTINCT A.cod_asignatura_pk, CONCAT(A.txt_nombre_asignatura, " - ", A.cod_asignatura_pk) txt_nombre_asignatura
            FROM tbl_asignatura A 
            INNER JOIN tbl_seccion B
            ON A.cod_asignatura_pk = B.cod_asignatura_ck
            WHERE A.cod_area_pk IN (?) 
            AND CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?`;
    },

    asignaturasXDocente: function() {
        return `SELECT DISTINCT A.cod_asignatura_pk, CONCAT(A.txt_nombre_asignatura, " - ", A.cod_asignatura_pk) txt_nombre_asignatura
            FROM tbl_asignatura A 
            INNER JOIN tbl_seccion B
            ON A.cod_asignatura_pk = B.cod_asignatura_ck
            WHERE B.num_docente_ck IN (?) 
            AND CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?`;
    },

    asignaturasXDocenteXArea: function() {
        return `SELECT DISTINCT A.cod_asignatura_pk, CONCAT(A.txt_nombre_asignatura, " - ", A.cod_asignatura_pk) txt_nombre_asignatura
            FROM tbl_asignatura A 
            INNER JOIN tbl_seccion B
            ON A.cod_asignatura_pk = B.cod_asignatura_ck
            WHERE B.num_docente_ck IN (?)
            AND A.cod_area_pk IN (?) 
            AND CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?`;
    },

    ///////////////////////////////////////////////////////////////////////////////
    ///FILTRO PARA MOSTRAR LOS DOCENTES////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    docentesRango: function() {
        return `SELECT DISTINCT A.num_docente_pk, A.txt_nombre
            FROM tbl_docente A
            INNER JOIN tbl_seccion B
            ON A.num_docente_pk = B.num_docente_ck
            INNER JOIN tbl_asignatura C
            ON B.cod_asignatura_ck = C.cod_asignatura_pk 
            WHERE CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?`;
    },

    docentesXAsignatura: function() {
        return `SELECT DISTINCT A.num_docente_pk, A.txt_nombre
            FROM tbl_docente A
            INNER JOIN tbl_seccion B
            ON A.num_docente_pk = B.num_docente_ck
            INNER JOIN tbl_asignatura C
            ON B.cod_asignatura_ck = C.cod_asignatura_pk
            WHERE C.cod_asignatura_pk IN (?) 
            AND CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?`;
    },

    docentesXArea: function() {
        return `SELECT DISTINCT A.num_docente_pk, A.txt_nombre
            FROM tbl_docente A
            INNER JOIN tbl_seccion B
            ON A.num_docente_pk = B.num_docente_ck
            INNER JOIN tbl_asignatura C
            ON B.cod_asignatura_ck = C.cod_asignatura_pk
            WHERE C.cod_area_pk IN (?)
            AND CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?`;
    },

    docentesXAreaXAsignatura: function() {
        return `SELECT DISTINCT A.num_docente_pk, A.txt_nombre
            FROM tbl_docente A
            INNER JOIN tbl_seccion B
            ON A.num_docente_pk = B.num_docente_ck
            INNER JOIN tbl_asignatura C
            ON B.cod_asignatura_ck = C.cod_asignatura_pk
            WHERE C.cod_area_pk IN (?)
            AND C.cod_asignatura_pk IN (?)
            AND CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?`;
    },


    ///////////////////////////////////////////////////////////////////////////////
    ///FILTRO PARA MOSTRAR LAS AREAS DE LAS ASIGNATURAS ///////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    areasRango: function() {
        return `SELECT DISTINCT A.cod_area_pk, A.txt_nombre_area 
            FROM tbl_areas A
            INNER JOIN tbl_asignatura B
            ON A.cod_area_pk = B.cod_area_pk
            INNER JOIN tbl_seccion C
            ON B.cod_asignatura_pk = C.cod_asignatura_ck
            WHERE CONCAT(C.num_anio_pk,C.num_periodo_pk) BETWEEN ? AND ?`;
    },

    areasXAsignatura: function() {
        return `SELECT DISTINCT A.cod_area_pk, A.txt_nombre_area 
            FROM tbl_areas A
            INNER JOIN tbl_asignatura B
            ON A.cod_area_pk = B.cod_area_pk
            INNER JOIN tbl_seccion C
            ON B.cod_asignatura_pk = C.cod_asignatura_ck
            WHERE B.cod_asignatura_pk IN (?)
            AND CONCAT(C.num_anio_pk,C.num_periodo_pk) BETWEEN ? AND ?`;
    },

    areasXDocente: function() {
        return `SELECT DISTINCT A.cod_area_pk, A.txt_nombre_area 
            FROM tbl_areas A
            INNER JOIN tbl_asignatura B
            ON A.cod_area_pk = B.cod_area_pk
            INNER JOIN tbl_seccion C
            ON B.cod_asignatura_pk = C.cod_asignatura_ck
            WHERE C.num_docente_Ck IN (?)
            AND CONCAT(C.num_anio_pk,C.num_periodo_pk) BETWEEN ? AND ?`;
    },

    areasXDocenteXAsignatura: function() {
        return `SELECT DISTINCT A.cod_area_pk, A.txt_nombre_area 
            FROM tbl_areas A
            INNER JOIN tbl_asignatura B
            ON A.cod_area_pk = B.cod_area_pk
            INNER JOIN tbl_seccion C
            ON B.cod_asignatura_pk = C.cod_asignatura_ck
            WHERE C.num_docente_Ck IN (?)
            AND B.cod_asignatura_pk IN (?)
            AND CONCAT(C.num_anio_pk,C.num_periodo_pk) BETWEEN ? AND ?`;
    },

    ///////////////////////////////////////////////////////////////////////////////
    ///CONSULTAS PARA FILTRAR REGISTROS SEGÚN OBSERVACIONES////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    obsRango: function() {
        return `SELECT  COUNT(A.txt_obs) NUM_OBS, A.txt_obs OBS
                FROM tbl_historial A
                INNER JOIN tbl_seccion B
                ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                        AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
                INNER JOIN tbl_asignatura C 
                ON B.cod_asignatura_ck = C.cod_asignatura_pk
                WHERE (CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?)`;
    },

    obsXAsignatura: function() {
        return `SELECT  COUNT(A.txt_obs) NUM_OBS, A.txt_obs OBS
                FROM tbl_historial A
                INNER JOIN tbl_seccion B
                ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                        AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
                INNER JOIN tbl_asignatura C 
                ON B.cod_asignatura_ck = C.cod_asignatura_pk
                WHERE C.cod_asignatura_pk IN (?)
                    AND (CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?)`;
    },

    obsXArea: function() {
        return `SELECT  COUNT(A.txt_obs) NUM_OBS, A.txt_obs OBS
            FROM tbl_historial A
            INNER JOIN tbl_seccion B
            ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                    AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
            INNER JOIN tbl_asignatura C 
            ON B.cod_asignatura_ck = C.cod_asignatura_pk
            WHERE C.cod_area_pk IN (?)
                AND (CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?)`;
    },

    obsXAreaXAsignatura: function() {
        return `SELECT  COUNT(A.txt_obs) NUM_OBS, A.txt_obs OBS
            FROM tbl_historial A
            INNER JOIN tbl_seccion B
            ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                    AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
            INNER JOIN tbl_asignatura C 
            ON B.cod_asignatura_ck = C.cod_asignatura_pk
            WHERE C.cod_asignatura_pk IN (?)
                AND C.cod_area_pk IN (?)
                AND (CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?)`;
    },

    obsXDocente: function() {
        return `SELECT  COUNT(A.txt_obs) NUM_OBS, A.txt_obs OBS
            FROM tbl_historial A
            INNER JOIN tbl_seccion B
            ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                    AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
            INNER JOIN tbl_asignatura C 
            ON B.cod_asignatura_ck = C.cod_asignatura_pk
            WHERE B.num_docente_ck IN (?)
                AND (CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?)`;
    },

    obsXDocenteXAsignatura: function() {
        return `SELECT  COUNT(A.txt_obs) NUM_OBS, A.txt_obs OBS
            FROM tbl_historial A
            INNER JOIN tbl_seccion B
            ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                    AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
            INNER JOIN tbl_asignatura C 
            ON B.cod_asignatura_ck = C.cod_asignatura_pk
            WHERE C.cod_asignatura_pk IN (?)
                AND B.num_docente_ck IN (?)
                AND (CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?)`;
    },

    obsXAreaXDocente: function() {
        return `SELECT  COUNT(A.txt_obs) NUM_OBS, A.txt_obs OBS
        FROM tbl_historial A
        INNER JOIN tbl_seccion B
        ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
        INNER JOIN tbl_asignatura C 
        ON B.cod_asignatura_ck = C.cod_asignatura_pk
        WHERE C.cod_area_pk IN (?)
            AND B.num_docente_ck IN (?)
            AND (CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?)`;
    },

    obsXAreaXAsignaturaXDocente: function() {
        return `SELECT  COUNT(A.txt_obs) NUM_OBS, A.txt_obs OBS
        FROM tbl_historial A
        INNER JOIN tbl_seccion B
        ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
        INNER JOIN tbl_asignatura C 
        ON B.cod_asignatura_ck = C.cod_asignatura_pk
        WHERE C.cod_asignatura_pk IN (?)
            AND C.cod_area_pk IN (?)
            AND B.num_docente_ck IN (?)
            AND (CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?)`;
    },

    ///////////////////////////////////////////////////////////////////////////////
    ///CONSULTAS PARA FILTRAR GRÁFICO DE PROMEDIOS/////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    promRango: function() {
        return `SELECT  SUM(A.num_calificacion)/COUNT(A.num_calificacion) PROMEDIO, A.num_anio_pk ANIO, A.num_periodo_pk PERIODO
                FROM tbl_historial A
                INNER JOIN tbl_seccion B
                ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                        AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
                INNER JOIN tbl_asignatura C 
                ON B.cod_asignatura_ck = C.cod_asignatura_pk
                WHERE CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ? `;
    },

    promXAsignatura: function() {
        return `SELECT  SUM(A.num_calificacion)/COUNT(A.num_calificacion) PROMEDIO, A.num_anio_pk ANIO, A.num_periodo_pk PERIODO
                FROM tbl_historial A
                INNER JOIN tbl_seccion B
                ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                        AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
                INNER JOIN tbl_asignatura C 
                ON B.cod_asignatura_ck = C.cod_asignatura_pk
                WHERE C.cod_asignatura_pk IN (?) 
                AND CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?`;
    },

    promXArea: function() {
        return `SELECT  SUM(A.num_calificacion)/COUNT(A.num_calificacion) PROMEDIO, A.num_anio_pk ANIO, A.num_periodo_pk PERIODO
            FROM tbl_historial A
            INNER JOIN tbl_seccion B
            ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                    AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
            INNER JOIN tbl_asignatura C 
            ON B.cod_asignatura_ck = C.cod_asignatura_pk
            WHERE C.cod_area_pk IN (?) 
            AND CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ? `;
    },

    promXAsignaturaXArea: function() {
        return `SELECT  SUM(A.num_calificacion)/COUNT(A.num_calificacion) PROMEDIO, A.num_anio_pk ANIO, A.num_periodo_pk PERIODO
            FROM tbl_historial A
            INNER JOIN tbl_seccion B
            ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                    AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
            INNER JOIN tbl_asignatura C 
            ON B.cod_asignatura_ck = C.cod_asignatura_pk
            WHERE C.cod_asignatura_pk IN (?)
                AND C.cod_area_pk IN (?)
                AND CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ? `;
    },

    promXDocente: function() {
        return `SELECT  SUM(A.num_calificacion)/COUNT(A.num_calificacion) PROMEDIO, A.num_anio_pk ANIO, A.num_periodo_pk PERIODO
            FROM tbl_historial A
            INNER JOIN tbl_seccion B
            ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                    AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
            INNER JOIN tbl_asignatura C 
            ON B.cod_asignatura_ck = C.cod_asignatura_pk
            WHERE B.num_docente_ck IN (?)
            AND CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?`;
    },

    promXDocenteXAsignatura: function() {
        return `SELECT  SUM(A.num_calificacion)/COUNT(A.num_calificacion) PROMEDIO, A.num_anio_pk ANIO, A.num_periodo_pk PERIODO
            FROM tbl_historial A
            INNER JOIN tbl_seccion B
            ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                    AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
            INNER JOIN tbl_asignatura C 
            ON B.cod_asignatura_ck = C.cod_asignatura_pk
            WHERE C.cod_asignatura_pk IN (?)
                AND B.num_docente_ck IN (?)
                AND CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?`;
    },

    promXDocenteXArea: function() {
        return `SELECT  SUM(A.num_calificacion)/COUNT(A.num_calificacion) PROMEDIO, A.num_anio_pk ANIO, A.num_periodo_pk PERIODO
        FROM tbl_historial A
        INNER JOIN tbl_seccion B
        ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
        INNER JOIN tbl_asignatura C 
        ON B.cod_asignatura_ck = C.cod_asignatura_pk
        WHERE C.cod_area_pk IN (?)
            AND B.num_docente_ck IN (?)
            AND CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?`;
    },

    promXDocenteXAsignaturaXArea: function() {
        return `SELECT  SUM(A.num_calificacion)/COUNT(A.num_calificacion) PROMEDIO, A.num_anio_pk ANIO, A.num_periodo_pk PERIODO
        FROM tbl_historial A
        INNER JOIN tbl_seccion B
        ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
        INNER JOIN tbl_asignatura C 
        ON B.cod_asignatura_ck = C.cod_asignatura_pk
        WHERE C.cod_asignatura_pk IN (?) 
            AND C.cod_area_pk IN (?) 
            AND B.num_docente_ck IN (?)  
            AND CONCAT(B.num_anio_pk,B.num_periodo_pk) BETWEEN ? AND ?`;
    },


    ///////////////////////////////////////////////////////////////////////////////
    ///CONSULTAS PARA GENERAR TABLA DE INFORMACIÓN DE SECCIONES////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    seccFiltro: function() {
        return `SELECT B.num_seccion_pk SECCION, B.num_periodo_pk PERIODO, B.num_anio_pk ANIO, B.cod_asignatura_ck CODIGOASIGNATURA, 
                C.txt_nombre_asignatura ASIGNATURA, IFNULL(D.txt_nombre, 'ND') DOCENTE, COUNT(A.num_cuenta_ck) ALUMNOS
                FROM tbl_seccion B
                INNER JOIN tbl_asignatura C 
                ON B.cod_asignatura_ck = C.cod_asignatura_pk
                LEFT JOIN tbl_docente D 
                ON B.num_docente_ck = D.num_docente_pk
                INNER JOIN tbl_historial A
                ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
                WHERE B.num_periodo_pk = ? 
                AND B.num_anio_pk = ? `;
    },

    seccXAsignatura: function() {
        return `SELECT B.num_seccion_pk SECCION, B.num_periodo_pk PERIODO, B.num_anio_pk ANIO, B.cod_asignatura_ck CODIGOASIGNATURA, 
                C.txt_nombre_asignatura ASIGNATURA, IFNULL(D.txt_nombre, 'ND') DOCENTE, COUNT(A.num_cuenta_ck) ALUMNOS
                FROM tbl_seccion B
                INNER JOIN tbl_asignatura C 
                ON B.cod_asignatura_ck = C.cod_asignatura_pk
                LEFT JOIN tbl_docente D 
                ON B.num_docente_ck = D.num_docente_pk
                INNER JOIN tbl_historial A
                ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
                AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
                WHERE B.num_periodo_pk = ? 
                AND B.num_anio_pk = ? 
                AND C.cod_asignatura_pk IN (?) `;
    },

    seccXArea: function() {
        return `SELECT B.num_seccion_pk SECCION, B.num_periodo_pk PERIODO, B.num_anio_pk ANIO, B.cod_asignatura_ck CODIGOASIGNATURA, 
            C.txt_nombre_asignatura ASIGNATURA, IFNULL(D.txt_nombre, 'ND') DOCENTE, COUNT(A.num_cuenta_ck) ALUMNOS
            FROM tbl_seccion B
            INNER JOIN tbl_asignatura C 
            ON B.cod_asignatura_ck = C.cod_asignatura_pk
            LEFT JOIN tbl_docente D 
            ON B.num_docente_ck = D.num_docente_pk
            INNER JOIN tbl_historial A
            ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
            AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
            WHERE B.num_periodo_pk = ? 
            AND B.num_anio_pk = ?  
            AND C.cod_area_pk IN (?)`;
    },

    seccXAsignaturaXArea: function() {
        return `SELECT B.num_seccion_pk SECCION, B.num_periodo_pk PERIODO, B.num_anio_pk ANIO, B.cod_asignatura_ck CODIGOASIGNATURA, 
            C.txt_nombre_asignatura ASIGNATURA, IFNULL(D.txt_nombre, 'ND') DOCENTE, COUNT(A.num_cuenta_ck) ALUMNOS
            FROM tbl_seccion B
            INNER JOIN tbl_asignatura C 
            ON B.cod_asignatura_ck = C.cod_asignatura_pk
            LEFT JOIN tbl_docente D 
            ON B.num_docente_ck = D.num_docente_pk
            INNER JOIN tbl_historial A
            ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
            AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
            WHERE B.num_periodo_pk = ? 
            AND B.num_anio_pk = ? 
            AND C.cod_asignatura_pk IN (?)
                AND C.cod_area_pk IN (?) `;
    },

    seccXDocente: function() {
        return `SELECT B.num_seccion_pk SECCION, B.num_periodo_pk PERIODO, B.num_anio_pk ANIO, B.cod_asignatura_ck CODIGOASIGNATURA, 
            C.txt_nombre_asignatura ASIGNATURA, IFNULL(D.txt_nombre, 'ND') DOCENTE, COUNT(A.num_cuenta_ck) ALUMNOS
            FROM tbl_seccion B
            INNER JOIN tbl_asignatura C 
            ON B.cod_asignatura_ck = C.cod_asignatura_pk
            LEFT JOIN tbl_docente D 
            ON B.num_docente_ck = D.num_docente_pk
            INNER JOIN tbl_historial A
            ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
            AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
            WHERE B.num_periodo_pk = ? 
            AND B.num_anio_pk = ? 
            AND B.num_docente_ck IN (?) `;
    },

    seccXDocenteXAsignatura: function() {
        return `SELECT B.num_seccion_pk SECCION, B.num_periodo_pk PERIODO, B.num_anio_pk ANIO, B.cod_asignatura_ck CODIGOASIGNATURA, 
            C.txt_nombre_asignatura ASIGNATURA, IFNULL(D.txt_nombre, 'ND') DOCENTE, COUNT(A.num_cuenta_ck) ALUMNOS
            FROM tbl_seccion B
            INNER JOIN tbl_asignatura C 
            ON B.cod_asignatura_ck = C.cod_asignatura_pk
            LEFT JOIN tbl_docente D 
            ON B.num_docente_ck = D.num_docente_pk
            INNER JOIN tbl_historial A
            ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
            AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
            WHERE B.num_periodo_pk = ? 
            AND B.num_anio_pk = ? 
            AND C.cod_asignatura_pk IN (?)
                AND B.num_docente_ck IN (?) `;
    },

    seccXDocenteXArea: function() {
        return `SELECT B.num_seccion_pk SECCION, B.num_periodo_pk PERIODO, B.num_anio_pk ANIO, B.cod_asignatura_ck CODIGOASIGNATURA, 
        C.txt_nombre_asignatura ASIGNATURA, IFNULL(D.txt_nombre, 'ND') DOCENTE, COUNT(A.num_cuenta_ck) ALUMNOS
        FROM tbl_seccion B
        INNER JOIN tbl_asignatura C 
        ON B.cod_asignatura_ck = C.cod_asignatura_pk
        LEFT JOIN tbl_docente D 
        ON B.num_docente_ck = D.num_docente_pk
        INNER JOIN tbl_historial A
        ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
        AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
        WHERE B.num_periodo_pk = ? 
        AND B.num_anio_pk = ? 
        AND C.cod_area_pk IN (?)
            AND B.num_docente_ck IN (?) `;
    },

    seccXDocenteXAsignaturaXArea: function() {
        return `SELECT B.num_seccion_pk SECCION, B.num_periodo_pk PERIODO, B.num_anio_pk ANIO, B.cod_asignatura_ck CODIGOASIGNATURA, 
        C.txt_nombre_asignatura ASIGNATURA, IFNULL(D.txt_nombre, 'ND') DOCENTE, COUNT(A.num_cuenta_ck) ALUMNOS
        FROM tbl_seccion B
        INNER JOIN tbl_asignatura C 
        ON B.cod_asignatura_ck = C.cod_asignatura_pk
        LEFT JOIN tbl_docente D 
        ON B.num_docente_ck = D.num_docente_pk
        INNER JOIN tbl_historial A
        ON ((A.cod_asignatura_ck = B.cod_asignatura_ck) AND (A.num_seccion_pk = B.num_seccion_pk) 
        AND (A.num_periodo_pk = B.num_periodo_pk) AND (A.num_anio_pk = B.num_anio_pk ))
        WHERE B.num_periodo_pk = ? 
        AND B.num_anio_pk = ? 
        AND C.cod_asignatura_pk IN (?) 
            AND C.cod_area_pk IN (?) 
            AND B.num_docente_ck IN (?) `;
    },


    ///////////////////////////////////////////////////////////////////////////////
    ///CONSULTAS PARA LA GESTIÓN DE PARÁMETROS//////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////


    obtenerCarreras: function() {
        return `SELECT cod_carrera_pk as codCarrera, txt_nombre_carrera as nombreCarrera FROM bd_autoscraping.tbl_carrera`;
    },

    obtenerParametros: function() {
        return `SELECT cod_parametro_pk as parametro, txt_valor as valor, txt_descripcion as descripcion FROM bd_autoscraping.tbl_parametro;`;
    },




    ///////////////////////////////////////////////////////////////////////////////
    ///CONSULTAS SOBRE EL RESULTADO DE LA PREDICCIÓN///////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////


    obtenerAsigACursarPredecidas: function() {
        return `
        SELECT d.cod_asignatura_pk cod_asignatura, d.txt_nombre_asignatura asignatura, COUNT(a.num_cuenta_ck) num_estudiantes 
         FROM tbl_asignatura_a_cursar a INNER JOIN tbl_asignatura_x_plan_estudio b
            ON a.cod_asignatura_x_plan_estudio_ck = b.cod_asignatura_x_plan_estudio_pk
            INNER JOIN tbl_estudiante c ON a.num_cuenta_ck = c.num_cuenta_pk
            INNER JOIN tbl_asignatura d ON b.cod_asignatura_fk = d.cod_asignatura_pk
            INNER JOIN tbl_plan_estudio e ON b.cod_plan_estudio_fk=e.cod_plan_estudio_pk
            INNER JOIN tbl_carrera f ON e.cod_carrera_fk=f.cod_carrera_pk
            WHERE c.num_periodos_inactivo <= ? AND (a.bol_predecida = ?) 
				AND (SELECT DISTINCT(concat_ws('-',num_anio_ck,num_periodo_ck)) as periodo FROM bd_autoscraping.tbl_asignatura_a_cursar) = ?
            AND f.cod_carrera_pk = ?
				GROUP BY a.cod_asignatura_x_plan_estudio_ck;`;
    },

    obtenerAsigACursar: function() {
        return `
        SELECT d.cod_asignatura_pk cod_asignatura, d.txt_nombre_asignatura asignatura, COUNT(a.num_cuenta_ck) num_estudiantes 
         FROM tbl_asignatura_a_cursar a INNER JOIN tbl_asignatura_x_plan_estudio b
            ON a.cod_asignatura_x_plan_estudio_ck = b.cod_asignatura_x_plan_estudio_pk
            INNER JOIN tbl_estudiante c ON a.num_cuenta_ck = c.num_cuenta_pk
            INNER JOIN tbl_asignatura d ON b.cod_asignatura_fk = d.cod_asignatura_pk
            INNER JOIN tbl_plan_estudio e ON b.cod_plan_estudio_fk=e.cod_plan_estudio_pk
            INNER JOIN tbl_carrera f ON e.cod_carrera_fk=f.cod_carrera_pk
            WHERE c.num_periodos_inactivo <= ?  
				AND (SELECT DISTINCT(concat_ws('-',num_anio_ck,num_periodo_ck)) as periodo FROM bd_autoscraping.tbl_asignatura_a_cursar) = ?
            AND f.cod_carrera_pk = ?
				GROUP BY a.cod_asignatura_x_plan_estudio_ck;`
    },

    obtenerPeriodosPredecidos: function() {
        return `SELECT DISTINCT(concat_ws('-',num_anio_ck,num_periodo_ck)) as periodo FROM bd_autoscraping.tbl_asignatura_a_cursar order by periodo desc;`;
    },
    obtenerUltimoPeriodoPredecido: function() {
        return `SELECT DISTINCT(concat_ws('-',num_anio_ck,num_periodo_ck)) as periodo FROM bd_autoscraping.tbl_asignatura_a_cursar order by periodo desc limit 1;`;
    },

    obtenerCarrerasPredecidas: function() {
        return `
        SELECT DISTINCT a.cod_carrera_pk cod_carrera, a.txt_nombre_carrera nombre_carrera FROM tbl_carrera a INNER JOIN tbl_plan_estudio b ON a.cod_carrera_pk = b.cod_carrera_fk
        INNER JOIN tbl_asignatura_x_plan_estudio c ON b.cod_plan_estudio_pk = c.cod_plan_estudio_fk
        WHERE c.cod_asignatura_x_plan_estudio_pk IN (SELECT DISTINCT d.cod_asignatura_x_plan_estudio_ck FROM tbl_asignatura_a_cursar d);
        `;
    }

}