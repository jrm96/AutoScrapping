$(document).ready(function(){
    $("#btn-iniciar").on("click", function(){
        ejecutarPrediccion();
    });


    monitorearProgreso();

});



function ejecutarPrediccion(){
    $.ajax({
        url:"/prediccion_proceso",
        dataType: "text",
        beforeSend: function(){
            $("#btn-iniciar").attr("disabled", true);
        },
        success: function(response){
            console.log(response);

        }
    });
}

function monitorearProgreso(){
    timer = setInterval(function(){
        $.ajax({
            url: "/getEnPrediccion",
            dataType: "text",
            success: function(res){
               console.log(res);
               if(res == "true"){
                   $("#btn-iniciar").attr("disabled", true);
                   $("#loading").show();
               }else{
                   $("#btn-iniciar").attr("disabled", false);
                   $("#loading").hide();
               }
           }
        });
    }, 2000);
}