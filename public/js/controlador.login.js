///Dar click con la tecla enter
$('#inputPassword').keypress(function(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        Login();
        e.preventDefault();
        return false;
    }
});

$('#btn-login').click(function () {
    Login();
});

function Login(){
    $.ajax({
        url:"/login",
        data:"nombre="+$("#inputUsuario").val()+"&numero="+$("#inputUsuario").val()+"&contrasena="+$("#inputPassword").val(),
        method:"POST",
        dataType:"json",
        success:function(respuesta){
            if( respuesta.hasOwnProperty("estatus")){
                if (respuesta.estatus == 0 ){
                    window.location.href ="inicio.html";
                }else if(respuesta.hasOwnProperty("mensaje")){
                    alert(respuesta.mensaje);
                }else{
                    alert("Error al iniciar sesión");
                }
                  
            }else{
                alert("Credenciales incorrectas");
            }
            
            console.log(respuesta);
        }
    });
}