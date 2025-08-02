//Variables
var urlDatos = 'https://datos.emtusahuelva.es/'
var urlMapas = 'https://osm.tecnosis.net/'
var urlRutas = 'https://osrm.tecnosis.net/'
var urlNomin = 'https://nominatim.tecnosis.net/'
var urlSrch = 'https://katon.tecnosis.net/api?'
var version = parseFloat(0.35).toFixed(2);
var tiempoRecargaMilis = 15000;
var servidor = 's=0';
var storage;
var online = true;
var plataforma = "web";
var lineaSelecionada;
var codParadaMasCercana = null; var codParadaMasCercana2 = null;
String.prototype.toHHorMMorSS = function () {
    var time;
    var sec_num = parseInt(this, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    hours = hours
    minutes = ("0" + minutes).slice(-2);
    seconds = ("0" + seconds).slice(-2);

    if (hours > 00) {
        if (hours == 1) {
            time = '1 hora '
        } else {
            time = hours + ' horas '
        }
        time += minutes + ' min.';
    } else if (minutes != "00") {
        time = minutes + ' min.';
    } else if (parseInt(seconds) > 0) {
        //time = 'Llegando&hellip;';
        time = "Próxima Llegada"
    } else {
        time = 'En Parada';// + '(' + seconds + 'seg)'
    }
    return time;
}
String.prototype.toHHMMorMMSS = function () {
    var time;
    var sec_num = parseInt(this, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    hours = ("0" + hours).slice(-2);
    minutes = ("0" + minutes).slice(-2);
    seconds = ("0" + seconds).slice(-2);

    if (hours == "00") {
        time = minutes + 'm ' + seconds + "s";
    } else {
        time = hours + 'h ' + minutes + 'm ';
    }
    return time;
}
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
}
Array.prototype.unique = function (a) {//array sin repetidos
    return function () { return this.filter(a) }
}(function (a, b, c) { return c.indexOf(a, b + 1) < 0 });
(function ($) {
    $.each(['show', 'hide'], function (i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function () {
            this.trigger(ev);
            return el.apply(this, arguments);
        };
    });
})(jQuery);
function toRadians(a) {
    return (a * Math.PI / 180.0)
}
function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}
function getSeconds(horaA, horaB) {
    var arrA = replaceAll(replaceAll(horaA, "/", " "), ":", " ").split(" ")
    var arrB = replaceAll(replaceAll(horaB, "/", " "), ":", " ").split(" ")
    var fechaA = new Date(arrA[2], parseInt(arrA[1]) - 1, arrA[0], arrA[3], arrA[4], arrA[5], 0)
    var fechaB = new Date(arrB[2], parseInt(arrB[1]) - 1, arrB[0], arrB[3], arrB[4], arrB[5], 0)
    var cambio = false;
    if (fechaA.getTime() > fechaB.getTime()) {
        var fechacop = fechaA
        fechaA = fechaB
        fechaB = fechacop
        cambio = true;
    }
    calculo = (fechaB.getTime() - fechaA.getTime()) / 1000

    return calculo
}
function replaceAll(text, busca, reemplaza) {
    while (text.toString().indexOf(busca) != -1) {
        text = text.toString().replace(busca, reemplaza);
    }
    return text;
}
function distanciaMetros(lat1, lon1, lat2, lon2) {
    var R = 6371e3; // metres
    var φ1 = toRadians(lat1);
    var φ2 = toRadians(lat2);
    var Δφ = toRadians((lat2 - lat1));
    var Δλ = toRadians((lon2 - lon1));

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    return d
}
function CalculartiempoNormal(distancia, velocidad) {
    var distmetros = 1;
    var velocidadKilometros = 0.277777777777777777777777777777777777;
    //  calculamos tiempo en segundos  
    segundos = (distancia * distmetros) / (velocidad * velocidadKilometros);
    //  convert to hours, minutes, seconds    
    return segundos;
}
//////////////////////////////////////////////////////////////////////////FUNCIONES GENERALES////////////////////////////////////////////////////
//#region general
function CheckPlataforma() {
    if (typeof cordova != 'undefined') {
        plataforma="cordova"
    }
}
function SinConexion(restrictivo) {
    //TODO:
    if (restrictivo) {
        LanzarSwalBasico("Sin Conexion", "Esta aplicación requiere conexión a internet para obtener datos importantes. Por favor active Wi-Fi o datos móviles e inténtelo de nuevo.")
        $("#loadText").text("Esperando acceso a Internet")
        $(".spinner")
    } else {
        $("#sinInternet").removeClass("conectado")
    }
}
function ProblemaConexion(tipo, visible, texto) {
    //TODO:Mejorar esta zona, porfa no uses if, pon un switch
    if (tipo == 'CRASH') {
        LanzarSwalBasico("Poblema al Conectar", "Ha ocurrido un problema al recibir datos del servidor, es posible que se encuentre en mantenimiento, vuelva a intentarlo más tarde y perdone las molestias ocasionadas")
        $("#loadText").text("Por favor intentelo más tarde")
    } else if (tipo == 'TIMEOUT') {
        LanzarSwalBasico("Servidor Ocupado", "El servidor esta tardando demasiado en responder, puede encontrarse saturado debido a gran demanda por los usuarios, vuelva a intentarlo más tarde")
        $("#loadText").text("Servidor ocupado, reintenteló más tarde")
    } else if (tipo == 'DATOSCORRUPTOS') {
        LanzarSwalBasico("Problema de compilación", texto)
    } else {
        LanzarSwalBasico("Error Inesperado", "Ha ocurrido un error, disculpe las molestias")
    }
}
function AbrirMenu() {
    $('#panelMenu').trigger('create');
    $('#' + $.mobile.activePage.attr('data-url')).append($('#panelMenu'));
    $('#panelMenu').panel().panel("open");
}
function AbrirPanel(idPanel) {
    $('#' + idPanel).panel().panel('open');
}
function CerrarPanel(idPanel) {
    $('#' + idPanel).panel().panel('close');
}
function ColorLuminance(hex, lum) {
    if (hex.indexOf("rgb") > -1) {
        var hex_rgb = hex.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        function hexa(x) { return ("0" + parseInt(x).toString(16)).slice(-2); }
        if (hex_rgb) {
            hex = "#" + hexa(hex_rgb[1]) + hexa(hex_rgb[2]) + hexa(hex_rgb[3]);
        }
    }
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}
function ObtenerAbreviaturaMargen(codigo, backColor, foreColor) {
    return '<span class="linea perfectCube" style="background-color:#' + backColor + ';color:#' + foreColor + '">' + codigo + '</span>'
}
function GetSeconds(horaA, horaB) {
    var arrA = ReplaceAll(ReplaceAll(horaA, "/", " "), ":", " ").split(" ")
    var arrB = ReplaceAll(ReplaceAll(horaB, "/", " "), ":", " ").split(" ")
    var fechaA = new Date(arrA[2], parseInt(arrA[1]) - 1, arrA[0], arrA[3], arrA[4], arrA[5], 0)
    var fechaB = new Date(arrB[2], parseInt(arrB[1]) - 1, arrB[0], arrB[3], arrB[4], arrB[5], 0)
    var cambio = false;
    if (fechaA.getTime() > fechaB.getTime()) {
        var fechacop = fechaA
        fechaA = fechaB
        fechaB = fechacop
        cambio = true;
    }
    calculo = (fechaB.getTime() - fechaA.getTime()) / 1000

    return calculo
}
function tiempoNormal(seconds, permitir) {
    var returnTiempo = ""
    seconds = seconds.toString()
    if (verHoraLlegada || permitir) {
        returnTiempo = seconds.toHHMMorMMSS()
        var tiempo = seconds.toHHMMSS().split(":")
        var horaActual = new Date()
        horaActual.setSeconds(horaActual.getSeconds() + parseInt(tiempo[2]));
        horaActual.setMinutes(horaActual.getMinutes() + parseInt(tiempo[1]));
        horaActual.setHours(horaActual.getHours() + parseInt(tiempo[0]));

        returnTiempo = " (" + pad(horaActual.getHours(), 2) + ":" + pad(horaActual.getMinutes(), 2) + ")"
    }
    return returnTiempo
}
function ReplaceAll(text, busca, reemplaza) {
    text = text.toString()
    while (text.indexOf(busca) != -1) {
        text = text.replace(busca, reemplaza);
    }
    return text;
}
function BlinkElement() {
    return window.setInterval(function () {
        $('.blink').fadeTo('slow', 0.1).fadeTo('slow', 1.0);
    }, 1000);
}
function LanzarSwalBasico(titulo, texto) {
    Swal.fire({
        title: titulo,
        text: texto,
        allowOutsideClick: false,
    });
}
//#endregion general
///////////////////////////////////////////////////////////////////FUNCIONES DE CARGA E INICIALIZACION DE WEB///////////////////////////////////
function WebCargada() {
    //setTimeout(function () {
    console.log("cargada")
    $('body').toggleClass('loaded');
    //}, 3000);
    //pruebas
    //SinConexion(true)
}
CheckPlataforma()
if (plataforma == "web") {
    $(document).ready(function () {
        CargarApp()
    });
} else {
    (function () {
        "use strict";

        document.addEventListener('deviceready', onDeviceReady.bind(this), false);

        function onDeviceReady() {
            // Controlar la pausa de Cordova y reanudar eventos
            document.addEventListener('pause', onPause.bind(this), false);
            document.addEventListener('resume', onResume.bind(this), false);
            //document.addEventListener('chcp_updateIsReadyToInstall', onUpdateReady(this), false);
            //document.addEventListener('chcp_nothingToUpdate', nothingToUpdate(this), false);
            // TODO: Cordova se ha cargado. Haga aquí las inicializaciones que necesiten Cordova.
            var parentElement = document.getElementById('deviceready');
            codePush.sync();
            CargarApp()
            
        };

        function onPause() {
            // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
        };

        function onResume() {
            // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
            codePush.sync();
        };

        function finalizarApp() {

        }

        //function  onUpdateReady(){
        //    console.log("La actualización está lista para instalar")
        //}
        //function nothingToUpdate() {
        //    console.log("Nada que actualizar, la aplicacion está actualizada")
        //}

    })();
}

function CargarApp() {
    //$("#popup").popup();//instanciamos el popup

    InicializarLocalStorage()
    LimpiarLocalStorage()
    LSMenuLineas = storage.get('MEN')
    LSLineas = storage.get('ITI')
    LSParadas = storage.get('PAR')
    LSTrayectos = (storage.isSet('TRY')) ? storage.get('TRY').Tray : null
    LSVerTodasLineas = storage.get('verTodasLineas')
    LSReferenciadas = storage.get("Referenciadas")
    LSUltLocalizacion = storage.get("lstLoc")
    LSVerCercanas = (storage.isSet('LSVC')) ? storage.get('LSVC') : true
    LSFecNot = storage.get("ultFN")
    LSFavoritos = storage.get("FV")
    if (storage.isSet("AB")) {
        AlarmaBajadaActiva = true
        AlarmaBajada = storage.get("AB")
    }
    layersSeleccionados = (storage.isSet('LS')) ? storage.get('LS') : [];
    mostrarBus = (storage.isSet('MB')) ? storage.get('MB') : true;
    verCorrespondencia = (storage.isSet('VC')) ? storage.get('VC') : true;
    verHoraLlegada = (storage.isSet('VHL')) ? storage.get('VHL') : true;
    favoritosInicio = (storage.isSet('FI')) ? storage.get('FI') : false;
    vibracion = (storage.isSet('VB')) ? storage.get('VB') : true;
    sonido = (storage.isSet('SN')) ? storage.get('SN') : true;
    ComprobarVersion()

    //Para saber que version y plataforma estamos usando
    if (storage.isSet("server")) {
        servidor = storage.get("server")
    }
    if (storage.isSet("url")) {
        urlDatos = storage.get("url")
    }
    InicializarListenersEventos()
    ComprobarHashApp()
    ObtenerNumeroNoticiasNuevas()
}
function InicializarListenersEventos() {
    //TODO: Restricciones
    //#region PAGESHOW
    $(document).on("pageshow", "#pageInicio", function () {
        //if (storage.isSet("PreguntarNoticias")) {
        //    if ((Date.parse(new Date()) - Date.parse(storage.get("PreguntarNoticias"))) >= 300000) {
        //        storage.set("PreguntarNoticias", new Date())
        //        ObtenerNumeroNoticiasNuevas()
        //        console.log('Vuelta cuenta noticia')
        //    }
        //} else {
        //    console.log('Primer cuenta noticia')
        //    storage.set("PreguntarNoticias", new Date())
        //    ObtenerNumeroNoticiasNuevas()
        //}
    });
    $(document).on("pageshow", "#pageLinea", function () {
        //if (!EstaRestringido(2)) {
        if (storage.isSet('ITI')) {
            MostrarLineasDisponibles()
        } else {
            LineasInexistententes()
        }
        //} else {
        //    AccesoRestringido(2)
        //}
    });
    $(document).on("pageshow", "#pageLineaVer", function () {
        //if (!EstaRestringido(2)) {
        if (storage.isSet('LineaVer')) {
            DibujarLineaEsquema();
        } else {
            $.mobile.changePage("#pageInicio");
        }
        //} else {
        //    AccesoRestringido(2)
        //}
    });
    $(document).on("pageshow", "#pageMapa", function () {
        //if (!EstaRestringido(3)) {
        if (online) {
            //TODO: mostrar mensajes?
            //if (!storage.isSet('popMap') && !iraloc && !storage.isSet('LineaPpal')) {
            //    swal({
            //        title: "Modo Mapa",
            //        text: 'Consulte lineas seleccionandolas a través del menu "Líneas" o marque su ubicación mediante el botón "Gestión"'
            //    });
            //    storage.set('popMap', true)
            //}
            //TODO: haremos que el botón de localizarte parpadee cuando se sigue en tiempo real
            //if (storage.isSet('popPanLoc')) {
            //    $("#headMapa span").removeClass('blink')
            //}
            try {
                setTimeout(function () {
                    InicializarMapa();
                    DibujarLineasSeleccionadas()
                    PedirAutobusesMapa()
                }, 10);//200
                MostrarLineasMapaDisponibles()
            } catch (err) { alert(err.message) };
            //setTimeout(function () { CargarSelectRutas(); }, 0);
            //setTimeout(function () { CargarListaPuntosInteres() }, 10);
            //setTimeout(function () { CargarListaPuntosInteresUsuario() }, 10);
            //if (navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Windows Phone/i) || navigator.userAgent.match(/edge/i) || indexModo == "cordova") {
            //    $('#footerMapa').addClass("footerFix");
            //}
        } else {
            mapaCargado = false;
            $("#mapCanvas").empty()
            $("#mapCanvas").html('<center><br><b style="margin-left:5px;margin-right:5px">El uso de los mapas requiere conexión de red.</b><br><b> Conecte el dispositivo a una red móvil o Wifi para utilizar los mapas</b></center>')
            //$("#gestionMapa").hide();
        }
        //} else {
        //    AccesoRestringido(3)
        //}
    });
    $(document).on("pageshow", "#pageComoLLegar", function () {
        //if (!EstaRestringido(3)) {
        if (online) {
            //TODO: mostrar mensajes?
            //if (!storage.isSet('popMap') && !iraloc && !storage.isSet('LineaPpal')) {
            //    swal({
            //        title: "Modo Mapa",
            //        text: 'Consulte lineas seleccionandolas a través del menu "Líneas" o marque su ubicación mediante el botón "Gestión"'
            //    });
            //    storage.set('popMap', true)
            //}
            //TODO: haremos que el botón de localizarte parpadee cuando se sigue en tiempo real
            //if (storage.isSet('popPanLoc')) {
            //    $("#headMapa span").removeClass('blink')
            //}
            try {
                setTimeout(function () {
                    InicializarMapaComoLlegar();
                }, 10);//200
            } catch (err) { alert(err.message) };
            //setTimeout(function () { CargarSelectRutas(); }, 0);
            //setTimeout(function () { CargarListaPuntosInteres() }, 10);
            //setTimeout(function () { CargarListaPuntosInteresUsuario() }, 10);
            //if (navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Windows Phone/i) || navigator.userAgent.match(/edge/i) || indexModo == "cordova") {
            //    $('#footerMapa').addClass("footerFix");
            //}
        } else {
            mapaCargado = false;
            $("#mapCanvas").empty()
            $("#mapCanvas").html('<center><br><b style="margin-left:5px;margin-right:5px">El uso de los mapas requiere conexión de red.</b><br><b> Conecte el dispositivo a una red móvil o Wifi para utilizar los mapas</b></center>')
            //$("#gestionMapa").hide();
        }
        //} else {
        //    AccesoRestringido(3)
        //}
    });
    $(document).on("pageshow", "#pageInfo", function () {
        //if (!EstaRestringido(7)) {
        ObtenerNoticias()
        if (LSFecNot) {
            un = new Date(LSFecNot);
            if (un.getFullYear() != 1990) {
                $("#ultPuls").text("" + un.getDate() + "/" + (un.getMonth() + 1) + "/" + un.getFullYear() + " " + pad(un.getHours(), 2) + ":" + pad(un.getMinutes(), 2));
            } else {
                $("#ultPuls").text("Ninguno Mostrado")
            }
        }
        //} else {
        //    AccesoRestringido(7)
        //}
    });
    $(document).on("pageshow", "#pageFavoritos", function () {
        //if (!EstaRestringido(6)) {
        DibujarFavoritos()
        //} else {
        //    AccesoRestringido(6)
        //}
    });
    $(document).on("pageshow", "#pageAlarmaLlegada", function () {
        //if (!EstaRestringido(6)) {
        if (AlarmaBajadaActiva == false) {
            AlarmaModoFormulario()
        } else {
            AlarmaModoMapa()
        }
        //} else {
        //    AccesoRestringido(6)
        //}
    });
    //#endregion PAGESHOW

    //#region PAGEBEFOREHIDE
    $(document).on("pagebeforehide", "#pageLineaVer", function () {
        window.clearInterval(idLineas);
        window.clearInterval(idParadas);

        $('#ListLineasPageLineas').empty()
        $('#ListLineasPageLineas').append("<b>Cargando, por favor espere...</b>")

        $('#headLineasVer').text('');
        $('#headLineasVer').css('text-shadow', "2px 2px white");
        $('#subHeadLineasVer').text('');
        $('#subHeadLineasVer').css('text-shadow', "1px 2px white");
        $('#verLineasContNombre').css('background-color', 'white');
    });
    $(document).on("pagebeforehide", "#pageFavoritos", function () {
        window.clearInterval(idFavoritos);
    });
    $(document).on("pagebeforehide", "#pageMapa", function () {
        window.clearInterval(idMapa);
        window.clearInterval(idMapaParada);
    });
    $(document).on("pagebeforehide", "#pageBuscarParada", function () {
        window.clearInterval(idBusqueda);
    });
    //#endregion PAGEBEFOREHIDE
    $(document).on("pagecontainerbeforechange", function (e, data) {
        if ($("#ventanaAyuda").css('display') == "block") {
            $("#ventanaAyuda").hide();
        }
    });
    //#region CLICK
    $(".menuButtonGest").click(function () {
        AbrirPanel($(this).attr('panel'));
    });
    $(".btnCerrarPanel").click(function () {
        CerrarPanel($(this).attr('panel'));
    });
    $(".slide").click(function () {
        $("#" + $(this).getAttribute('toogle')).slideToggle();
    });
    $(".menuButtonMenu").click(function () {
        //AbrirMenu()
        $.mobile.changePage('#pageInicio');
    })
    $(".menuAyuda").click(function () {
        MostrarAyuda($(this).getAttribute('ayuda'))
    })
    var oldVal;
    $("#txtBuscar").on("change paste keyup", function () {
        var val = this.value;
        continuar = false;
        if (val !== oldVal) {
            oldVal = val;
            continuar = true;
        }
        if (continuar) {
            //TODO: terminar la parte de paradas cercanas en busqueda
            //if (this.value.length > 0) {
            //    $("#contParCercanasBusqueda").hide()
            //} else {
            //    $("#contParCercanasBusqueda").show()
            //}
            if (this.value.length == 2 && (this.value.toLowerCase() == "*a" || this.value.toLowerCase() == "*n")) {
                var aaa = this.value
                setTimeout(function () { RealizarBusqueda(aaa) }, 100);
                //TODO: Implementar Konami Code
                //} else if (this.value.toLowerCase() == "*inspector") {
                //    if (!storage.isSet("mdInspector")) {
                //        storage.get("mdInspector", false)
                //    }
                //    if (storage.get("mdInspector") == true) {
                //        storage.set("mdInspector", false)
                //        sweetAlert("Inspector", "Se ha desactivado el modo Inspector");
                //        $("#menuIns").hide()
                //        $("#ins").hide()
                //        //$("#errorApp").show()
                //    } else if (storage.get("mdInspector") == false) {
                //        storage.set("mdInspector", true)
                //        swal({
                //            title: "Inspector",
                //            text: "Se ha activado el modo Inspector",
                //            confirmButtonText: "Continuar"
                //        }, function () { $.mobile.changePage("#pageIns"); });
                //        $("#menuIns").show()
                //        $("#ins").show()
                //        PedirConductores()
                //        //$("#errorApp").show()
                //    }
                //} else if (this.value.toLowerCase() == "*verlogsi") {
                //    storage.set("log", true)
                //    sweetAlert("Log", "Se ha activado el mantenimiento de el historial de errores");
                //    $("#menuError").show()
                //    $("#errorApp").show()
                //} else if (this.value.toLowerCase() == "*verlogno") {
                //    storage.remove("log")
                //    sweetAlert("Log", "Se ha desactivado el mantenimiento de el historial de errores");
                //    $("#menuError").hide()
                //    $("#errorApp").hide()
                //} else if (this.value.toLowerCase() == "modopruebasi") {
                //    storage.set('modoPrueba', true)
                //    modoPrueba = true
                //    $("a[onclick='AbrirMenu()']").css('background-color', '#fff1a8')
                //    $("#mpVersion").show();
                //    $("#recEsquema").show();
                //    $("#cambiarTimeout").show();
                //    if (indexModo == "cordova") {
                //        $("#pruebaNotificacion").show()
                //        $("#pruebaLuminosidad").show()
                //    }
                //    sweetAlert("Modo Prueba Sí", "Modo prueba activo");
                //} else if (this.value.toLowerCase() == "modopruebano") {
                //    storage.set('modoPrueba', false)
                //    modoPrueba = false
                //    $("a[onclick='AbrirMenu()']").css('background-color', '#dfefff')
                //    $("#mpVersion").hide();
                //    $("#recEsquema").hide();
                //    $("#cambiarTimeout").hide();
                //    if (indexModo == "cordova") {
                //        $("#pruebaNotificacion").hide()
                //        $("#pruebaLuminosidad").hide()
                //    }
                //    sweetAlert("Modo Prueba No", "Modo prueba desactivado");
                //} else if (this.value.length >= 3 && this.value.indexOf('s=') == 0 && this.value.indexOf('.') == this.value.length - 1 && storage.get('modoPrueba')) {
                //    var numServidor = this.value.split('=')[1]
                //    if (Number.isInteger(parseInt(numServidor))) {
                //        servidor = "s=" + numServidor
                //        storage.set("server", servidor.slice(0, -1))
                //        swal({
                //            title: "Servidor cambiado",
                //            text: "La aplicación redirige al servidor " + numServidor + " (si borras los datos o la caché volvera a usar el servidor por defecto)",
                //            confirmButtonText: "Aceptar"
                //        }, function () {
                //            $.mobile.changePage('#pageInicio');
                //            storage.remove('lineas');
                //            window.location.reload();
                //        });
                //    }
                //} else if (this.value.length >= 3 && this.value.indexOf('u=') == 0 && this.value.indexOf('..') == this.value.length - 2 && storage.get('modoPrueba')) {
                //    urlDatos = this.value.slice(2, -2)
                //    storage.set("url", urlDatos)
                //    swal({
                //        title: "Servidor cambiado",
                //        text: "La aplicación usa la url de datos " + urlDatos + " (si borras los datos o la caché volvera a usar la url por defecto)",
                //        confirmButtonText: "Aceptar"
                //    }, function () {
                //        $.mobile.changePage('#pageInicio');
                //        storage.remove('lineas');
                //        window.location.reload();
                //    });
                //}
            } else if (this.value.length >= 3) {
                RealizarBusqueda(this.value.toLowerCase().trimEnd())
            } else {
                $('#resultadoBusqueda').empty()
            }
        }
    });
    $("#marcarNot").click(function () {
        $(".circuloNuevo").hide();
        $.each($(".blueDome span.fechaDeNoticia"), function (f, fecha) {
            $(fecha).parent().removeClass("blueDome");
        });
        $("#iniInfo").attr("data-badge", 0)
        $("#iniInfo").removeClass("badge1")
        LSFecNot = storage.get("NoticiaModerna")
        storage.set("ultFN", LSFecNot)

        un = new Date(LSFecNot);
        $("#ultPuls").text("" + un.getDate() + "/" + (un.getMonth() + 1) + "/" + un.getFullYear() + " " + pad(un.getHours(), 2) + ":" + pad(un.getMinutes(), 2))
        $(".numAvisos").text(0)
        CambiarNumeroMenu(0)
    })
    $("#desmarcarNot").click(function () {
        LSFecNot = new Date(1990, 1, 1, 0, 0, 0)
        storage.set("ultFN", LSFecNot)
        $("#ultPuls").text("")
        storage.remove("PreguntarNoticias")
        ObtenerNumeroNoticiasNuevas()
    })
    $("#btnAlarmaBajada").click(function () { CrearAlarmaBajada() });
    //#endregion CLICK
    //#region checkear
    if (mostrarBus == true) {
        $("#switch-MostrarBus").click()
    }
    if (verCorrespondencia == true) {
        $("#switch-VerCorrespondencias").click()
    }
    if (verHoraLlegada == true) {
        $("#switch-VerHoraLlegada").click()
    }
    if (favoritosInicio == true) {
        $("#switch-FavoritosIniciar").click()
        $.mobile.changePage("#pageFavoritos");
    }
    if (vibracion == true) {
        $("#switch-Vibracion").click()
    }
    if (sonido == true) {
        $("#switch-Sonido").click()
    }
    //#endregion checkear
    //#region Close
    $("#panelGeoloc").panel({
        open: function (event, ui) {
            window.clearInterval(idMapa)
            OcultarAutobuses()
        },
        close: function (event, ui) {
            console.log('cerrando Panel')
            PedirAutobusesMapa()
            DibujarCuadrosLineasSeleccionadas()
        }
    });
    $('#containerLineasMapa').on('show', function () {
        console.log('abriendo Panel')
        window.clearInterval(idMapa)
        OcultarAutobuses()
    });
    $('#containerLineasMapa').on('hide', function () {
        console.log('cerrando Panel')
        PedirAutobusesMapa()
        DibujarCuadrosLineasSeleccionadas()
    });

    //#region Close
    $(window).resize(function () {
        if ($.mobile.activePage.attr('data-url') == 'pageInfo') {
            resizeNavBar()
        }
    });

    //Opciones
    $("#recargar").click(function () {
        Swal.fire({
            title: "Reiniciar",
            text: "Reiniciar la aplicación puede ayudar a solucionar errores. ¿Desea continuar?",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Sí",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.value == true) {
                $.mobile.changePage('#pageInicio');
                window.location.reload();
            }
        })
    });
    $("#borrar").click(function () {
        Swal.fire({
            type: "warning",
            title: "Reestablecer APP",
            text: "La aplicación volverá a su estado inicial, borrando datos de localización, configuración de opciones, favoritos, rutas... ¿Está de acuerdo?",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.value == true) {
                localStorage.clear()
                window.location.reload();
            }
        })
    });

    //Micrófono
    $("#btnMic").mousedown(function () {
        $("#radar").show()
    });
    $("#btnMic").mouseup(function () {
        $("#radar").hide()
    });
}
function trigerChange() {

}
/////////////////////////////////////////////////////////////////////ALMACENAMIENTO DE DATOS////////////////////////////////////////////////////
var LSMenuLineas = null;
var LSLineas = null;
var LSParadas = null;
var LSTrayectos = null;
var LSReferenciadas = null
function InicializarLocalStorage() {
    storage = $.localStorage;
}
function LimpiarLocalStorage() {
    var aBorrar = []
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.indexOf("EBL") > -1 || key.indexOf("EPR") > -1 || key.indexOf("UTH") > -1 || key.indexOf("IBM") > -1) {
            aBorrar.push(key)
        }
    }
    for (var i = 0; i < aBorrar.length; i++) storage.remove(aBorrar[i])
}
function ComprobarVersion() {
    //Si la versión cambia o no estan los datos inicializados
    if (!storage.isSet('Version') || parseFloat(storage.get('Version')) != parseFloat(version)) {
        $("#loadText").text("Preparando Actualización")
        $.mobile.changePage("#pageInicio");
        //Se almacenan las variables que merecen ser guardadas
        //TODO
        //Se limpia el storage
        storage.removeAll()
        //Se vuelve a inicializar
        storage.set('Version', version);
    }
}
function ComprobarHashApp() {
    console.log("ComprobarHashApp()")
    if (online) {
        $("#loadText").text("Comprobando Información")
        JSZipUtils.getBinaryContent(urlDatos + 'api/JQ/JSONQRYZIP/HASHLTP?i=' + Math.random() + '&' + servidor + '&p=' + plataforma + '&v=' + version, function (err, data) {
            var elt = document.getElementById('jszip_utils');
            if (!err) {
                try {
                    JSZip.loadAsync(data).then(function (zip) { return zip.file("datos.json").async("string") })
                        .then(function success(text) {
                            try {
                                data = JSON.parse(text.substring(1))
                                if (!storage.isSet('hshs') || data.HG != storage.get('hshs').HG) {
                                    storage.set('hshs', data)
                                    SolicitarDatosLineasParadasTrayecto(data)
                                } else if (!storage.isSet("ITI") || !storage.isSet("PAR") || !storage.isSet("TRY") || !storage.isSet("MEN") || !storage.isSet("Referenciadas")) { //por si hubiese pasado algo y no se hubiesen inicializado
                                    storage.set('hshs', data)
                                    SolicitarDatosLineasParadasTrayecto(data)
                                } else {
                                    $("#loadText").text("Listo")
                                    WebCargada()
                                }
                            } catch (ex) {
                                if (!saltaLineasStorage) {
                                    //SolicitarLineasStorage(saltar)
                                    saltaLineasStorage = true;
                                }
                                console.log(ex + "" + text.toString())
                                ProblemaConexion("CRASH")
                            }
                        }, function error(e) { ErrorServidor('errorZip', 'CHSH01', 'ocurrencia baja') });
                } catch (e) { ErrorServidor('errorDesconocido', 'CHSH01', e) }
            } else { ErrorServidor('noRespuesta', 'CHSH01', ''); return; }
        });
    } else {
        SinConexion(true);
    }
}
var saltaLineasStorage = false;
function SolicitarDatosLineasParadasTrayecto(hashData) {
    console.log("SolicitarDatosLineasParadasTrayecto()")
    if (online) {
        $("#loadText").text("Obteniendo Datos")
        var arrayDatos = [null, null, null, null]
        var arrayDatosDescargados = [false, false, false, false];
        if (storage.isSet("hshs") && hashData.HL != storage.get("hshs").HL) {
            arrayDatos[0] = storage.get("ITI")
            arrayDatosDescargados[0] = true;
        } else {
            console.log("obteniendo Lineas")
            JSZipUtils.getBinaryContent(urlDatos + 'api/JQ/JSONQRYZIP/DEFLIN?i=' + Math.random() + '&' + servidor + '&p=' + plataforma + '&v=' + version, function (err, data) {
                var elt = document.getElementById('jszip_utils');
                if (!err) {
                    try {
                        JSZip.loadAsync(data).then(function (zip) { return zip.file("datos.json").async("string") })
                            .then(function success(text) {
                                try {
                                    data = JSON.parse(text.substring(1))

                                    arrayDatos[0] = data
                                    arrayDatosDescargados[0] = true;
                                    terminadoLin = true;
                                    $.each(arrayDatosDescargados, function (el, estadoLin) {
                                        if (estadoLin == false) {
                                            terminadoLin = false;
                                        }
                                    })
                                    if (terminadoLin) {
                                        GuardarDatosLineasParadasTrayecto(arrayDatos)
                                    }
                                    saltaLineasStorage = false;
                                } catch (ex) {
                                    if (!saltaLineasStorage) {
                                        //SolicitarLineasStorage(saltar)
                                        saltaLineasStorage = true
                                        ProblemaConexion("CRASH");
                                    }
                                    console.log(ex + "" + text.toString())
                                }
                            }, function error(e) { ErrorServidor('errorZip', 'PULL01', 'ocurrencia baja') });
                    } catch (e) { ErrorServidor('errorDesconocido', 'PULL01', e) }
                } else { ErrorServidor('noRespuesta', 'PULL01', ''); return; }
            });
        }
        if (storage.isSet("hshs") && hashData.HP != storage.get("hshs").HP) {
            arrayDatos[1] = storage.get("PAR")
            arrayDatosDescargados[1] = true;
        } else {
            console.log("obteniendo Paradas")
            JSZipUtils.getBinaryContent(urlDatos + 'api/JQ/JSONQRYZIP/DEFPAR?i=' + Math.random() + '&' + servidor + '&p=' + plataforma + '&v=' + version, function (err, data) {
                var elt = document.getElementById('jszip_utils');
                if (!err) {
                    try {
                        JSZip.loadAsync(data).then(function (zip) { return zip.file("datos.json").async("string") })
                            .then(function success(text) {
                                try {
                                    data = JSON.parse(text.substring(1))
                                    arrayDatos[1] = data;
                                    arrayDatosDescargados[1] = true;
                                    //////////////////
                                    terminadoPar = true;
                                    $.each(arrayDatosDescargados, function (ep, estadoPar) {
                                        if (estadoPar == false) {
                                            terminadoPar = false;
                                        }
                                    })
                                    if (terminadoPar) {
                                        GuardarDatosLineasParadasTrayecto(arrayDatos)
                                    }
                                    saltaLineasStorage = false;
                                } catch (ex) {
                                    if (!saltaLineasStorage) {
                                        //SolicitarLineasStorage(saltar)
                                        saltaLineasStorage = true;
                                        ProblemaConexion("CRASH")
                                    }
                                    console.log(ex + "" + text.toString())
                                }
                            }, function error(e) { ErrorServidor('errorZip', 'PULP01', 'ocurrencia baja') });
                    } catch (e) { ErrorServidor('errorDesconocido', 'PULP01', e) }
                } else { ErrorServidor('noRespuesta', 'PULP01', ''); return; }
            });
        }
        if (storage.isSet("hshs") && hashData.HT != storage.get("hshs").HT) {
            arrayDatos[2] = storage.get("TRY")
            arrayDatosDescargados[2] = true;
        } else {
            console.log("obteniendo Trayectos")
            JSZipUtils.getBinaryContent(urlDatos + 'api/JQ/JSONQRYZIP/DEFTRY?i=' + Math.random() + '&' + servidor + '&p=' + plataforma + '&v=' + version, function (err, data) {
                var elt = document.getElementById('jszip_utils');
                if (!err) {
                    try {
                        JSZip.loadAsync(data).then(function (zip) { return zip.file("datos.json").async("string") })
                            .then(function success(text) {
                                try {
                                    data = JSON.parse(text.substring(1))
                                    arrayDatos[2] = data;
                                    arrayDatosDescargados[2] = true;
                                    //////////////////
                                    terminadoTray = true;
                                    $.each(arrayDatosDescargados, function (et, estadoTra) {
                                        if (estadoTra == false) {
                                            terminadoTray = false;
                                        }
                                    })
                                    if (terminadoTray) {
                                        GuardarDatosLineasParadasTrayecto(arrayDatos)
                                    }
                                    saltaLineasStorage = false
                                } catch (ex) {
                                    if (!saltaLineasStorage) {
                                        //SolicitarLineasStorage(saltar)
                                        saltaLineasStorage = true;
                                        ProblemaConexion("CRASH")
                                    }
                                    console.log(ex + "" + text.toString())
                                }
                            }, function error(e) { ErrorServidor('errorZip', 'PULT01', 'ocurrencia baja') });
                    } catch (e) { ErrorServidor('errorDesconocido', 'PULT01', e) }
                } else { ErrorServidor('noRespuesta', 'PULT01', ''); return; }
            });
        }
        if (storage.isSet("hshs") && hashData.HM != storage.get("hshs").HM) {
            arrayDatos[3] = storage.get("MEN")
            arrayDatosDescargados[3] = true;
        } else {
            console.log("obteniendo Menú")
            JSZipUtils.getBinaryContent(urlDatos + 'api/JQ/JSONQRYZIP/DEFMENU?i=' + Math.random() + '&' + servidor + '&p=' + plataforma + '&v=' + version, function (err, data) {
                var elt = document.getElementById('jszip_utils');
                if (!err) {
                    try {
                        JSZip.loadAsync(data).then(function (zip) { return zip.file("datos.json").async("string") })
                        .then(function success(text) {
                            try {
                                data = JSON.parse(text.substring(1))
                                arrayDatos[3] = data;
                                arrayDatosDescargados[3] = true;
                                //////////////////
                                terminadoHSH = true;
                                $.each(arrayDatosDescargados, function (et, estadoHSH) {
                                    if (estadoHSH == false) {
                                        terminadoHSH = false;
                                    }
                                })
                                if (terminadoHSH) {
                                    GuardarDatosLineasParadasTrayecto(arrayDatos)
                                }
                                saltaLineasStorage = false
                            } catch (ex) {
                                if (!saltaLineasStorage) {
                                    //SolicitarLineasStorage(saltar)
                                    saltaLineasStorage = true;
                                    ProblemaConexion("CRASH")
                                }
                                console.log(ex + "" + text.toString())
                            }
                        }, function error(e) { ErrorServidor('errorZip', 'PULT01', 'ocurrencia baja') });
                    } catch (e) { ErrorServidor('errorDesconocido', 'PULT01', e) }
                } else { ErrorServidor('noRespuesta', 'PULT01', ''); return; }
            });
        }
    } else {
        SinConexion(true);
    }
}
function GuardarDatosLineasParadasTrayecto(dataArray) {
    console.log("GuardarDatosLineasParadasTrayecto")
    //Guardamos los HASH para futuro uso
    $("#loadText").text("Preparando Datos")

    var linData = dataArray[0]
    var parData = dataArray[1]
    var tryData = dataArray[2]
    var menData = dataArray[3]
    storage.set('MEN', menData.Lin)
    LSMenuLineas = menData.Lin
    //Transformamos los datos recibidos y guardamos
    if (linData.Err == null && tryData.Err == null && parData.Err == null && menData.Err == null) {
        var itinerarios = []
        var listaLineasParadas
        var paradas = []
        //Primero montamos el array de paradas
        $.each(parData.Paradas, function (p, par) {
            par.EB = []
            par.Iti = []
            paradas.push(par)
        });
        storage.set("PAR", paradas)
        LSParadas = paradas
        var paradasDeLinea = []
        $.each(linData.Lin, function (li, linea) {
            $.each(linea.Iti, function (it, itinerario) {
                //TODO:Parche porque ahora viene CI y CL identico, lo ideal es que CL venga bien en el futuro
                itinerario.CL = linea.Cod
                //Añadimos el itinerario
                //Si no tiene color especifico se coge el del padre
                if (itinerario.BC == null) {
                    itinerario.BC = linea.BC.substring(2)
                } else {
                    itinerario.BC = itinerario.BC.substring(2)
                }
                if (itinerario.FC == null) {
                    itinerario.FC = linea.FC.substring(2)
                } else {
                    itinerario.FC = itinerario.FC.substring(2)
                }
                //Si en menu NPS viniese modificado hay que aplicarselo al itinerario, recuerda que cada vez que un hash cambie, esto se limpia
                var linMenu = ObtenerMenuLinea(itinerario.Cla)
                if (linMenu != null && linMenu.NPS != null) {
                    itinerario.NPS = linMenu.NPS
                }
                //lo mismo con el comentario
                if (linMenu != null && linMenu.CMT != null) {
                    itinerario.CMT = linMenu.CMT
                }
                itinerarios.push(itinerario)
                $.each(itinerario.Sen, function (tS, sentido) {
                    sentido.XY = []
                    $.each(sentido.Tray, function (iit, itiTray) {//cogemos sus codigos de trayecto
                        $.each(tryData.Tray, function (t, tray) {//lo buscamos en la parte de trayectos
                            if (tray.ID == itiTray) {
                                AnadirCodLineaParada(tray.CP1, itinerario.Cla)
                                AnadirCodLineaParada(tray.CP2, itinerario.Cla)
                                var X = []
                                var Y = []
                                for (var w = 0; w < tray.XY.length; w++) {
                                    (w % 2 == 0) ? X.push(tray.XY[w]) : Y.push(tray.XY[w]);
                                }
                                for (var w2 = 0; w2 < X.length; w2++) {
                                    sentido.XY.push([Y[w2], X[w2]])
                                }
                            }
                        });
                    });
                });
            });
        });
        //Como ya tenemos las Paradas, separamos las de referencias para futuras busquedas
        EncontrarParadasReferencia()
        //Añadimos las paradas a la linea, para futuras busquedas.
        $.each(itinerarios, function (it, itinerario) {
            var pos = 0
            $.each(itinerario.Sen, function (tS, sentido) {
                sentido.Par = []
                $.each(sentido.Tray, function (iit, itiTray) {//cogemos sus codigos de trayecto

                    $.each(tryData.Tray, function (t, tray) {//lo buscamos en la parte de trayectos
                        if (tray.ID == itiTray) {
                            var copyPar = { Nivel: 0 }

                            sentido.Par.push(ObtenerParada(tray.CP1))
                            pos++
                            if (iit == 0) {
                                sentido.Par[sentido.Par.length - 1].Nivel = 1
                            } else if (pos % 5 == 0) {
                                sentido.Par[sentido.Par.length - 1].Nivel = 2
                            } else {
                                sentido.Par[sentido.Par.length - 1].Nivel = 3
                            }
                        }
                    });
                });
                if (itinerario.Sen.length == 1) {
                    sentido.Par.push(ObtenerParada(sentido.Tray[sentido.Tray - 1].CP2))
                    sentido.Par[sentido.Par.length - 1].Nivel = 3
                } else if (itinerario.Sen.length == 2 && sentido.CS == 2) {
                    LSTrayectos = tryData.Tray
                    trInicio = ObtenerTrayecto(itinerario.Sen[0].Tray[0])
                    trFinal = ObtenerTrayecto(itinerario.Sen[1].Tray[itinerario.Sen[1].Tray.length - 1])
                    if (trInicio.CP1 != trFinal.CP2) {
                        sentido.Par.push(ObtenerParada(trFinal.CP2))
                        sentido.Par[sentido.Par.length - 1].Nivel = 3
                    }
                } else if (itinerario.Sen.length == 2 && sentido.CS == 1) {
                    LSTrayectos = tryData.Tray
                    trFinInicio = ObtenerTrayecto(itinerario.Sen[0].Tray[itinerario.Sen[0].Tray.length - 1])
                    trInicioVuelta = ObtenerTrayecto(itinerario.Sen[1].Tray[0])
                    if (trFinInicio.CP2 != trInicioVuelta.CP1) {
                        sentido.Par.push(ObtenerParada(trFinInicio.CP2))
                        sentido.Par[sentido.Par.length - 1].Nivel = 3
                    }
                }
            });
            if (itinerario.Sen.length == 1) {
                itinerario.NumP = itinerario.Sen[0].Par.length
            } else if (itinerario.Sen.length == 2) {
                itinerario.NumP = itinerario.Sen[0].Par.length + itinerario.Sen[1].Par.length
            }
        });

        storage.set('TRY', tryData)
        storage.set('ITI', itinerarios)
        LSLineas = itinerarios
        LSTrayectos = tryData.Tray
        //rellenamos los menulineas con los datos que faltan, así si tengo que pintar es más comodo
        var menlin = LSMenuLineas
        $.each(menlin, function (l, ml) {
            iti = ObtenerItinerario(ml.CL + '.' + ml.CI)
            ml.FC = iti.FC
            ml.BC = iti.BC
            ml.Nom = iti.Nom
            ml.Abr = iti.Abr
            ml.Cla = iti.Cla
            if (ml.CMT == null && iti.CMT != null) {
                ml.CMT = iti.CMT
            }
            ml.NumP = iti.NumP
        })
        storage.set('MEN', menlin)
        LSMenuLineas = menlin
        $("#loadText").text("Listo")
        WebCargada()
        //ComprobarFechaXml(false, false)
    } else {
        ErrorServidor('jsonError', 'PUSC01', 'l->' + linData.err + ", t->" + tryData.err + ', p->' + parData.err)
        return null
    }

    if (itinerarios != null) {
        //TODO: Revisar
        //ObtenerPosicionParadasEnRecorrido();
        //RellenarSelectLineaPage(data, "#selectLineaPageRutas");
        //RellenarSelectLineaPage(data, "#selectLineaAvisos");
        //RellenarSelectLineaPage(data, "#selectLineaAvisosEditar");
        //InicializarMapa();
        //if ($.mobile.activePage.attr('data-url') == 'pageLinea') {
        //    MostrarLineasDisponibles()
        //}
    }
}
function AnadirCodLineaParada(codParada, clave) {
    var listaPar = LSParadas
    $.each(listaPar, function (cp, parada) {
        if (parada.CP == codParada && $.inArray(clave, parada.Iti) == -1) {
            parada.Iti.push(clave)
        }
    });
    storage.set("PAR", listaPar)
    LSParadas = listaPar
}
function ObtenerMenuLinea(clave) {
    var lineaBuscada;
    lineaBuscada = $.grep(LSMenuLineas, function (l) {
        return l.CL + "." + l.CI == clave;
    })[0];
    return lineaBuscada;
}
function ObtenerParada(codParada) {
    var paradaBuscada;
    paradaBuscada = $.grep(LSParadas, function (n) {
        return n.CP == codParada;
    })[0];

    return JSON.parse(JSON.stringify(paradaBuscada));
}
function ObtenerSentidoParada(lineaC, codParada) {
    sentido = null;
    codParadaIndex = 0;
    parRegulacionIndex = 0;
    for (var osp = 0; osp < lineaC.Sen.length; osp++) {
        sen = lineaC.Sen[osp]
        for (var osp2 = 0; osp2 < sen.Par.length; osp2++) {
            if (sen.Par[osp2].CP == codParada) {
                sentido = osp;
                break;
            }
        }
        if (sentido != null) {
            break;
        }
    }

    return sentido + 1;
}
function ObtenerPosicionParada(lineaC, codParada) {
    pos = null;
    codParadaIndex = 0;
    parRegulacionIndex = 0;
    contador = -1
    for (var osp = 0; osp < lineaC.Sen.length; osp++) {
        sen = lineaC.Sen[osp]
        for (var osp2 = 0; osp2 < sen.Par.length; osp2++) {
            contador++
            if (sen.Par[osp2].CP == codParada) {
                pos = contador;
                break;
            }
        }
        if (pos != null) {
            break;
        }
    }

    return pos;
}
function CrearCoche(bus, hora) {
    var splitTra = bus.Tra.split('-')
    return ({
        codigo: bus.CB,
        codigoLinea: bus.Lin,
        conductor: bus.CE,
        distancia: bus.DP,
        latitud: bus.XY[1],
        longitud: bus.XY[0],
        tiempo: GetSeconds(hora, bus.TP).toString(),
        terminal: bus.CT,
        clase: bus.CLA,
        estado: bus.Est,
        fiabilidad: bus.Fia,
        itinerario: bus.Iti,
        orden: bus.Ord,
        sentido: bus.Sen,
        TRL: bus.TRL,
        aviso: bus.Avi,
        orientacion: bus.OB,
        trayecto: Math.abs(splitTra[0]),
        posEnTrayecto: Math.abs(splitTra[1])
    })
}
function ObtenerItinerario(n) {
    var lineaBuscada;
    n = n.toString();//parseamos por si fuera int
    if (n && n.length > 0) { //TODO:whaat? Esto evita que intentemos dibujar una parada cuando no hay ninguna seleccionada.
        if (LSLineas == null) {
            localStorage.removeItem('hshs');
            LineasInexistententes()
        } else {
            lineaBuscada = $.grep(LSLineas, function (l) {
                return l.Cla == n;
            })[0];
        }
    }
    return lineaBuscada;
}
function ObtenerTrayecto(n) {
    var trayectoBuscado;
    trayectoBuscado = $.grep(LSTrayectos, function (l) {
        return l.ID == n;
    })[0];
    return trayectoBuscado;
}
function EncontrarParadasReferencia() {
    paradasReferencias = []
    listaReferenciadas = []
    $.each(LSParadas, function (p, parada) {
        if (parada.CP != parada.CPRef && $.inArray(parada.CPRef, listaReferenciadas) == -1) {
            paradasReferencias.push({ Codigo: parada.CPRef, Paradas: [], Cadena: "" })
            listaReferenciadas.push(parada.CPRef)
            cadena = ""
            $.each(LSParadas, function (sp, subparada) {
                if (subparada.CPRef == parada.CPRef) {
                    paradasReferencias[paradasReferencias.length - 1].Paradas.push(subparada)
                    cadena += subparada.CP + "|"
                }
            })
            paradasReferencias[paradasReferencias.length - 1].Cadena = cadena.substring(0, cadena.length - 1)
        }
    })

    storage.set("Referenciadas", paradasReferencias)
    LSReferenciadas = paradasReferencias
}
function EsReferenciada(idParadaRef) {
    var referenciada = null
    for (cont = 0; cont < LSReferenciadas.length; cont++) {
        if (LSReferenciadas[cont].Codigo == idParadaRef) {
            referenciada = LSReferenciadas[cont]
            break;
        } else {
            for (cont2 = 0; cont2 < LSReferenciadas[cont].Paradas.length; cont2++) {
                if (LSReferenciadas[cont].Paradas[cont2].CP == idParadaRef) {
                    referenciada = LSReferenciadas[cont]
                    break;
                }
            }
        }
    }
    return referenciada
}
//Controles de errores
function LineasInexistententes() {
    $('body').toggleClass('loaded');
    $.mobile.changePage("#pageInicio");
    ComprobarHashApp();
}
//////////////////////////////////////////////////////////////GESTIONLINEAS/////////////////////////////////////////////////////////////////////
function ComprobarCambiosInformacion(h, mensaje) {
    var continuar = false;
    if (storage.get("hshs").HG != h && h != null) {
        $.mobile.changePage("#pageInicio");
        if (mensaje) {
            Swal.fire({
                title: "Advertencia",
                text: "Se ha detectado una actualización de las líneas, la aplicación se va a reiniciar para aplicar los cambios",
                allowOutsideClick: false
            }).then((value) => {
                window.location.reload();
            });
        } else {
            window.location.reload(true);
        }
    } else {
        continuar = true;
    }
    return continuar
}
function BuscarParadaInyeccion(EP, codigo) {
    var parada = null;
    parada = $.grep(EP, function (p) {
        return p.Cla == codigo;
    })[0]
    return parada
}
function ZipToBlob(data) {
    newContent = "";
    for (var i = 0; i < data.length; i++) {
        newContent += String.fromCharCode(data.charCodeAt(i) & 0xFF);
    }
    var bytes = new Uint8Array(newContent.length);
    for (var i = 0; i < newContent.length; i++) {
        bytes[i] = newContent.charCodeAt(i);
    }
    blob = new Blob([bytes], { type: "application/zip" })
    return blob
}
function ObtenerLineaConParada(claveLI, comando, extra) {
    //Esta función sirve para obtener la linea con paradas.
    //Para ello comprueba si las lineas son anteriores al tiempo de recarga.
    //el comando es que debe hacer después de obtener la linea
    var EsParadaReferenciada;
    if (extra != null) {
        if (extra.paradaReferencia != null)
            ParadaReferenciada = EsReferenciada(extra.paradaReferencia)
    }
    var idReferencia;
    //TODO:Es posible que las referenciadas nunca se usen aquí
    //if ((comando == 'mostrar informacion' ||
    //    comando == 'mostrar informacion popup light' ||
    //    comando == 'recargar informacion') && ParadaReferenciada != null) {
    //    //Esta es la parte que se encarga de redirigir las referenciadas, como son de varias lineas, lo optimo era pedir solo las paradas, excluyendo la linea
    //    //TODO: MIRAR COMO ACTUAN LAS REFERENCIADAS RESPECTO LINEA A LA QUE PERTENECEN Y TAL
    //    ObtenerParadasReferenciadas(storage.get('CodUltParadaPulsada') + ParadaReferenciada.Cadena, codLineas, claveLI, comando, extra)
    //} else
    if (storage.isSet('EBL' + claveLI) && storage.get('EBL' + claveLI) != '') {
        //Esta parte se encarga de redireccionar las lineas que se piden, si la linea se obtuvo en un pequeño plazo se coge la almacenada, si no se vuelve a pedir
        tiempo = Date.now() - storage.get('UTH' + claveLI);
        if (tiempo >= (tiempoRecargaMilis - 500)) {
            console.log("Debug: se pide linea " + claveLI)
            //Si se pasan de tiempo las borramos del array y volvemos a pedir.
            localStorage.removeItem('EBL' + claveLI)
            SolicitarLineasConParadasStorage(claveLI, comando, extra);
        } else {
            console.log("Debug:ya existe la linea" + claveLI)
            //Si no la obtenemos del array
            LlamarFuncion(storage.get('EBL' + claveLI), comando, extra);
        }
    } else {
        SolicitarLineasConParadasStorage(claveLI, comando, extra);
    }
}
var saltaSolicitarLineasParStorage = false;
function SolicitarLineasConParadasStorage(claveLI, comando, extra) {
    console.log('Debug: SolicitarLineasConParadas(' + claveLI + ',' + comando + ',' + extra + ')')
    if (online) {
        $.ajax({
            type: 'GET',
            url: urlDatos + 'api/JQ/JSONQRYZIP/ESTLIN2|' + claveLI + '?i=' + Math.random() + '&' + servidor + '&p=' + plataforma + '&v=' + version,
            dataType: 'text',
            mimeType: 'text/plain; charset=x-user-defined',
            retryCount: 0,
            retryLimit: 5,
            timeout: tiempoRecargaMilis,
            success: function (data) {
                JSZip.loadAsync(ZipToBlob(data))
                        .then(function (zip) {
                            return zip.file("datos.json").async("string")
                        })
                        .then(function success(text) {
                            try {
                                if (text.indexOf('ESTLIN') > -1) {
                                    console.log(text)
                                }
                                data = JSON.parse(text.substring(1))
                                if (ComprobarCambiosInformacion(data.HG, true)) {
                                    storage.set('UTH' + claveLI, Date.now())
                                    //EMPIEZA AQUI
                                    linea = ObtenerItinerario(claveLI)
                                    for (var a1 = 0; a1 < linea.Sen.length; a1++) {
                                        sentido = linea.Sen[a1]
                                        for (var a2 = 0; a2 < sentido.Par.length; a2++) {
                                            parada = sentido.Par[a2]
                                            par = BuscarParadaInyeccion(data.EP, parada.CP)
                                            EBTotal = []

                                            for (var a3 = 0; a3 < par.EB.length; a3++) {
                                                coche = par.EB[a3]
                                                EBTotal.push(CrearCoche(coche, data.FH))
                                            }
                                            parada.EB = EBTotal
                                        }
                                    }
                                    linea.PC=data.PC
                                    storage.set('EBL' + claveLI, linea);
                                    LlamarFuncion(linea, comando, extra)
                                }
                                saltaSolicitarLineasParStorage = false;
                            } catch (ex) {
                                //TODO:que cuando de error vuelva a intentar ¿?
                                if (!saltaSolicitarLineasParStorage) {
                                    if (storage.isSet('EBL' + claveLI)) {
                                        ProblemaConexion("DATOSCORRUPTOS", false, 'El servidor ha devuelto información, pero falla algo en código:' + ex.stack)
                                        saltaSolicitarLineasParStorage = true;
                                    } else {
                                        SolicitarLineasConParadasStorage(claveLI, comando, extra)
                                        saltaSolicitarLineasParStorage = true;
                                    }
                                } else {
                                    ProblemaConexion("DATOSCORRUPTOS", false, ex.message)
                                }
                            }
                        }, function error(e) {
                            ErrorServidor('errorZip', 'LINP01', 'ocurrencia baja')
                        });
            },
            error: function (xmlhttprequest, textstatus, message) {
                ProblemaConexion("TIMEOUT", false, message)
            },
            async: true
        });
    } else {
        SinConexion(true);
    }
}
function SolicitarParadas(cadenaParadas, funcionParada, extra) {
    if (online) {
        $.ajax({
            type: 'GET',
            url: urlDatos + 'api/JQ/JSONQRYZIP/ESTPAR|' + cadenaParadas + '?i=' + Math.random() + '&' + servidor + '&p=' + plataforma + '&v=' + version,
            dataType: 'text',
            mimeType: 'text/plain; charset=x-user-defined',
            retryCount: 0,
            retryLimit: 5,
            timeout: tiempoRecargaMilis,
            success: function (data) {
                JSZip.loadAsync(ZipToBlob(data))
                    .then(function (zip) {
                        return zip.file("datos.json").async("string")
                    })
                    .then(function success(text) {
                        try {
                            //TODO: comprobar hash
                            data = JSON.parse(text.substring(1))
                            console.log(data)
                            var EPCompleto = []

                            for (var a = 0; a < data.EP.length; a++) {
                                var nuePar = ObtenerParada(data.EP[a].CP)
                                nuePar.EB = data.EP[a].EB
                                $.each(nuePar.EB, function (c, coche) {
                                    coche.TP = GetSeconds(data.FH, coche.TP).toString()//.push(CrearCoche(coche, data.FH))
                                })
                                EPCompleto.push(nuePar)
                            }

                            data.EP = EPCompleto
                            storage.set('EPR' + cadenaParadas, data)
                            storage.set('UTHP' + cadenaParadas, Date.now())
                            LlamarFuncionParada(data, funcionParada, extra)
                        } catch (ex) {
                            //TODO: CapturarExcepciones
                            //if (!saltaSolicitarLineasParStorage) {
                            //    if (storage.isSet('EPR'+cadenaParadas)) {
                            ProblemaConexion("DATOSCORRUPTOS", false, 'El servidor ha devuelto información, pero falla algo en código:' + ex.stack)
                            //    // saltaSolicitarLineasParStorage = true;
                            //    }
                            //    //else {
                            //    //    SolicitarLineasConParadasStorage(claveLI, comando, extra)
                            //    //    saltaSolicitarLineasParStorage = true;
                            //    //}
                            //} else {
                            //    ProblemaConexion("DATOSCORRUPTOS", false, ex.message)
                            //}
                        }
                    }, function error(e) {
                        ErrorServidor('errorZip', 'LINP01', 'ocurrencia baja')
                    });
            },
            error: function (xmlhttprequest, textstatus, message) {
                ProblemaConexion("TIMEOUT", false, message)
            },
            async: false
        });
    } else {
        SinConexion(true);
    }
}
function LlamarFuncion(linea, comando, extra) {
    console.log(linea + "," + comando + "," + extra)
    //Funciones que deberia hacer al obtener la línea.
    switch (comando) {
        case 'recargar lineaVer':
            if (extra == null) {
                DibujarLineaVer(linea);
            } else {
                DibujarLineaVer(linea, extra.Timeout)
            }
            break
    }
}
function LlamarFuncionParada(parada, comando, extra) {
    switch (comando) {
        case 'ObtenerParadaEsquema':
            //Obtenemos la parada principal y le añadimos los autobuses de las otras
            var par = null

            if (parada.EP.length == 1) {//solo una parada llego, no se modifica y se envia
                par = parada.EP[0]
            } else {
                //referenciada, se crea un objeto para la ocasion uniendo todas en la principal, se le añade todas las lineas para que pueda leerse, y un array de solo a las que referencia para su tratamiento
                par = ObtenerParada(extra.CodParada)
                p = CrearUnionReferencia(parada, extra)
                par.Ref = p.Ref
                par.Iti = p.Iti
                par.EB = p.EB
            }
            htmltexto = SolicitarHTMLInformacionParadaLight(par, extra.CodParada, extra.Linea, extra.Posicion, extra.Sentido);
            Swal.fire({
                html: htmltexto,
                showConfirmButton: false,
                customClass: 'SwalInformacionParada',
                animation: !Swal.isVisible()
                //showCloseButton:true
            }).then((result) => {
                console.log("Me han cerrado :(")
                CerrarInfoDot()
                window.clearInterval(idParadas)
                window.clearInterval(idLineas)
                if (storage.isSet('UTH' + storage.get('LineaVer'))) {
                    tiempo = tiempoRecargaMilis - (Date.now() - storage.get('UTH' + storage.get('LineaVer')));
                    console.log("tiempo para refresco:" + tiempo)
                    if (tiempo > 0) {
                        idLineas = TimeoutRecargarLineaAutomaticamente(tiempo);
                    } else {
                        idLineas = TimeoutRecargarLineaAutomaticamente(0);
                    }
                } else {
                    idLineas = TimeoutRecargarLineaAutomaticamente(0);
                }
            })
            idParadas = TimeoutRecargarParadaAutomaticamente(par.CP, extra.Linea, extra.Posicion, extra.Sentido)
            break;
        case 'ObtenerParadaMapa':
            ObtenerParadaMapa(parada, comando, extra, false)
            break;
        case 'ObtenerParadaMapaCombi':
            ObtenerParadaMapa(parada, comando, extra, true)
            break;
        case 'ObtenerParadaBusqueda':
            ObtenerParadaBusqueda(parada, comando, extra)
            break;
        case 'ObtenerParadaFavoritos':
            ObtenerParadaFavoritos(parada, comando, extra)

    }
}
function ObtenerParadaMapa(parada, comando, extra, combi) {
    //Obtenemos la parada principal y le añadimos los autobuses de las otras
    var par = null

    if (parada.EP.length == 1) {//solo una parada llego, no se modifica y se envia
        par = parada.EP[0]
    } else if (!combi) {
        //referenciada, se crea un objeto para la ocasion uniendo todas en la principal, se le añade todas las lineas para que pueda leerse, y un array de solo a las que referencia para su tratamiento
        par = ObtenerParada(extra.CodParada)
        p = CrearUnionReferencia(parada, extra)
        par.Ref = p.Ref
        par.Iti = p.Iti
        par.EB = p.EB
    }
    if (!combi) {
        htmltexto = SolicitarHTMLInformacionParadaLight(par, extra.CodParada, extra.Linea, extra.Posicion, extra.Sentido);
    } else {
        htmltexto = SolicitarHTMLInformacionParadaCombi(par);
    }
    var m = extra.marker
    var popup = m.getPopup()
    if (popup == null) {
        m.bindPopup(htmltexto).on('popupclose', function (e) { window.clearInterval(idMapaParada) }).openPopup();
    } else {
        popup.setContent(htmltexto).openPopup();
    }
    idMapaParada = TimeoutRecargarParadaMapaAutomaticamente(par.CP, extra.Linea, extra.Posicion, extra.Sentido, extra.marker)

}
function ObtenerParadaBusqueda(parada, comando, extra, combi) {
    //Obtenemos la parada principal y le añadimos los autobuses de las otras
    var par = parada.EP[0]

    htmltexto = SolicitarHTMLInformacionParadaCombi(par);
    idBusqueda = TimeoutRecargarParadaBusquedaAutomaticamente(par.CP);
    Swal.fire({
        html: htmltexto,
        showConfirmButton: false,
        customClass: 'SwalInformacionParada',
        animation: !Swal.isVisible()
        //showCloseButton:true
    }).then((result) => {
        window.clearInterval(idBusqueda)
    })
}
function ObtenerParadaFavoritos(parada, comando, extra) {
    //Obtenemos la parada principal y le añadimos los autobuses de las otras
    var par = parada.EP[0]

    htmltexto = SolicitarHTMLInformacionParadaLight(par, extra.CodParada, extra.Linea, extra.Posicion, extra.Sentido);
    window.clearInterval(idFavoritos)
    idFavoritos = TimeoutRecargarParadaPulsadaFavoritosAutomaticamente(extra.index);
    Swal.fire({
        html: htmltexto,
        showConfirmButton: false,
        customClass: 'SwalInformacionParada',
        animation: !Swal.isVisible()
        //showCloseButton:true
    }).then((result) => {
        DibujarFavoritos()
    })
}
function ObtenerAutobusesMapa(idLineas) {
    tiempo = Date.now() - ultFechaBusMapa;
    if (tiempo >= (tiempoRecargaMilis - 500) && storage.isSet("BMI" + idLineas)) {
        DibujarAutobusesMapa(storage.get("BMI" + idLineas))

    } else {
        JSZipUtils.getBinaryContent(urlDatos + 'api/JQ/JSONQRYZIP/ESTGRAL' + idLineas + '?i=' + Math.random() + '&' + servidor + '&p=' + plataforma + '&v=' + version, function (err, data) {
            var elt = document.getElementById('jszip_utils');
            if (err) {
                ErrorServidor('noRespuesta', 'PUGR01', '')
                return;
            } else {
                try {
                    JSZip.loadAsync(data)
                        .then(function (zip) {
                            return zip.file("datos.json").async("string")
                        })
                        .then(function success(text) {
                            try {
                                data = JSON.parse(text.substring(1))
                                coches = []
                                $.each(data.EL, function (e, li) {
                                    $.each(li.EC, function (ec, bus) {
                                        bus.TPS = getSeconds(data.FH, bus.TPS).toString()
                                        bus.TPF = getSeconds(data.FH, bus.TPF).toString()
                                    });

                                    var aBorrar = []
                                    for (var i = 0; i < localStorage.length; i++) {
                                        var key = localStorage.key(i);
                                        if (key.indexOf("IBM") > -1) {
                                            aBorrar.push(key)
                                        }
                                    }
                                    for (var i = 0; i < aBorrar.length; i++) storage.remove(aBorrar[i])

                                    storage.set("IBM" + idLineas, data.EL)
                                    autobusesActuales = data.EL
                                    DibujarAutobusesMapa(data.EL)
                                })
                            } catch (ex) {
                                console.log(ex + "" + text.toString())
                            }
                        }, function error(e) {
                            ErrorServidor('errorZip', 'PUGR01', 'ocurrencia baja')
                        });
                } catch (e) {
                    ErrorServidor('errorDesconocido', 'PUGR01', e)
                }
            }
        });
    }
}
function CrearUnionReferencia(parada, extra) {
    var clonParada = JSON.parse(JSON.stringify(parada))
    var parBus = []
    var parIti = []
    for (var cnt = 0; cnt < clonParada.EP.length; cnt++) {
        if (clonParada.EP[cnt].CP == extra.CodParada) {
            par = clonParada.EP[cnt]
        }
        parBus = parBus.concat(clonParada.EP[cnt].EB)
        parIti = parIti.concat(clonParada.EP[cnt].Iti)
    }
    parIti = parIti.unique().sort(function (a, b) { return parseFloat(a) - parseFloat(b) })
    ref = parIti
    for (cnt2 = 0; cnt2 < par.Iti.length; cnt2++) {
        ref = ref.filter(function (e) { return e !== par.Iti[cnt2] })
    }
    return { Ref: ref, Iti: parIti, EB: parBus }
}
function InyectarDatosLinea(data, idLinea) {
    linea = ObtenerLinea(idLinea)
    $.each(linea.Paradas, function (p, parada) {
        par = BuscarParadaInyeccion(data.EP, parada.CP)
        $.each(par.EB, function (p, bus) {
            parada.Coches.push(CrearCoche(bus, data.FH))
        })
    })
    return linea
}
function BuscarParadaInyeccion(EP, codigo) {
    var parada = null;
    parada = $.grep(EP, function (p) {
        return p.CP == codigo;
    })[0]
    return parada
}
///////////////////////////////////////////////////////////////////////LINEAS///////////////////////////////////////////////////////////////////
var LSVerTodasLineas = false
function CambiarVistaLineas(nombre) {
    //TODO: debe de rellenar tambien la lista de lineas del mapa
    var estado = !document.getElementById(nombre).checked

    document.getElementById('checkboxTodasLineas').checked = estado
    document.getElementById('checkboxTodasLineasB').checked = estado
    storage.set('verTodasLineas', estado)
    LSVerTodasLineas = estado

    if ($.mobile.activePage.attr('data-url') == 'pageLinea') {
        MostrarLineasDisponibles()
    } else if ($.mobile.activePage.attr('data-url') == 'pageMapa') {
        MostrarLineasMapaDisponibles()
    }
}
function MostrarLineasDisponibles() {
    document.getElementById('checkboxTodasLineas').checked = LSVerTodasLineas
    html = "<ul class=collection>"
    lineasPintar = LSMenuLineas
    if (LSVerTodasLineas == true) {
        lineasPintar = LSLineas
    }
//    html += '<li class="collection-item avatar">' +
//'<i class="square" style="text-shadow:none;background-color:blue; color:#blue">ZE</i>' +
//'<span class="title"><b>aaaaaaa</b></span>' +
//'<p style="color: #7e7e7e;">aaaaaaa</p>' +
//'</li>'
    $.each(lineasPintar, function (l, linea) {
        color = "#" + linea.BC;
        nombre = linea.Nom;
        comentario = ""
        if (linea.CMT != "") {
            comentario = '<strong style="color:#169ff1">' + linea.CMT + '</strong>'
        }
        html += '<li class="collection-item avatar"  onclick="VerLinea(' + linea.Cla + ')">' +
            '<i class="square" style="text-shadow:none;background-color:' + color + '; color:#' + linea.FC + '">' + linea.Abr + '</i>' +
            '<span class="title"><b>' + linea.Nom + '</b></span>' +
            '<p style="color: #7e7e7e;">' + linea.NumP + ' Paradas. ' + comentario + '</p>' +
            '</li>'
    })
    html += "</ul>"

    $('#ListaLineas').html(html)
}
function MostrarLineasMapaDisponibles() {
    document.getElementById('checkboxTodasLineasB').checked = LSVerTodasLineas
    html = '<p class="center subColor" style="font-size:10px">Pulse sobre las líneas para visualizarlas en el mapa</p>'
    html += "<ul class=collection>"
    lineasPintar = LSMenuLineas
    if (LSVerTodasLineas == true) {
        lineasPintar = LSLineas
    }
    $.each(lineasPintar, function (l, linea) {
        color = "#" + linea.BC;
        nombre = linea.Nom;
        comentario = ""
        if (linea.CMT != "") {
            comentario = '<strong style="color:#169ff1">' + linea.CMT + '</strong>'
        }
        var layerExistente = ObtenerLayer(linea.Cla)
        var marcado = ""
        if (layerExistente != null && mapa.hasLayer(layerExistente)) {
            marcado = "LinSelected"
        }

        html += '<li class=" collection-item collection-item-mini avatar mdl-js-button"  onclick="LineaMapaPulsada(' + linea.Cla + ')">' +
            '<i class="square square-mini" style="text-shadow:none;background-color:' + color + '; color:#' + linea.FC + '">' + linea.Abr + '</i>' +
            '<span class="title ' + marcado + '" id="linMapa-' + linea.CL + '-' + linea.CI + '" >' +
            '<i class="material-icons mdl-list__item-avatar checkIcon">check</i>' +
            '<b>' + linea.Nom + '</b>' +
            '</span>' +
            '<p style="color: #7e7e7e;">' + linea.NumP + ' Paradas.</p>' +
            '<p>' + comentario + '</p>' +
            '</li>'
    });
    html += "</ul>"

    //$('#lineasMapa').html(html)
    $('#listaLineasMapa').html(html)
    //componentHandler.upgradeDom();
}
////////////////////////////////////////////////////////////////LINEAVER////////////////////////////////////////////////////////////////////////
var horaActual; var idBlink = null; var Scroll = ''; var ultimaSeleccionada = ""; var idLineas = null; var idParadas = null; var busPintados = []; var ultFechaBusMapa = null;
function VerLinea(idLinea, idParada) {
    storage.set('LineaVer', idLinea)
    //storage.set('LineaPpal', idLinea);
    if ($.mobile.activePage.attr('data-url') == 'pageLineaVer') {
        DibujarLineaEsquema()
    } else {
        $.mobile.changePage("#pageLineaVer");
    }
    if (idParada != null) {
        //TODO:Añadir posición y sentido
        LineaParadaPulsada(idParada, idLinea)
        Scroll = idParada
    }
}
function DibujarLineaEsquema() {
    infolinea = ObtenerItinerario(storage.get('LineaVer'));
    color = "#" + infolinea.BC;
    nombre = infolinea.Nom
    //if (infolinea.Definicion.Codigo == 3) { nombre = 'Zafra – Higueral – Universidad – C.C. Holea' }
    $('#toptitleLineasVerText').html("L-" + infolinea.Abr)
    $('#headLineasVer').text(infolinea.Abr + ': ' + nombre);
    $('#headLineasVer').css('text-shadow', "none");

    $('#verLineasContNombre').css('background-color', color);
    $('#verLineasContNombre').css('color', '#' + infolinea.FC);
    //$('#verLineasContNombre').css('border', '1px solid ' + ColorLuminance(infolinea.Apariencia.BackColor.substring(2), -0.5));
    if (online) {
        if (storage.isSet('UTH' + storage.get('LineaVer'))) {
            tiempo = tiempoRecargaMilis - (Date.now() - storage.get('UTH' + storage.get('LineaVer')));
            console.log(tiempo)//Debug
            ObtenerLineaConParada(storage.get('LineaVer'), 'recargar lineaVer', { Timeout: tiempo });
        } else {
            ObtenerLineaConParada(storage.get('LineaVer'), 'recargar lineaVer');
        }
    } else {
        verLineaOffline()
    }

}
function DibujarLineaVer(data, timeout) {
    console.log("DibujarLineaVer " + timeout)
    var $select = $("#ListLineasPageLineas");
    if ($select.text().trim() != "Cargando, por favor espere...") {
        RefrescarLineaVer(data, timeout)
    } else {
        $select.empty();
        busPintados = [];
        lineaActual = data.Cla;
        var contadorParada = 0;
        var tipo = "2"
        if (data.Sen.length == 1) {
            tipo = '1'
        }
        var paradaInicioVuelta = ""
        for (i = 0; i < data.Sen.length; i++) {
            for (posParada = 0; posParada < data.Sen[i].Par.length; posParada++) {
                parada = data.Sen[i].Par[posParada]
                contadorParada += 1;
                var codTrayecto = 0;
                if (posParada > 0) { codTrayecto = data.Sen[i].Tray[posParada - 1] } //la primera coje el final del trayecto de vuelta
                parada = ObtenerBotonEsquema(parada, tipo, lineaActual, contadorParada, codTrayecto, posParada, data, i)
                if (posParada == 0 && tipo == "2" && i == 0) {
                    codTrayecto = ""
                    paradaInicioVuelta = parada
                }
                $select.append(parada);
            }
            ActivarAutobuses(data.Cla,data.PC)
        }
        //seteamos la hora para luego actualizar o no
        horaActual = Date.now();
        //si hemos venido seleccionando una parada la seteamos
        //TODO: deberia borrar el codUltParadaPulsada
        if (storage.isSet('CodUltParadaPulsada')) {
            SeleccionarParada('btnMapa' + storage.get('CodUltParadaPulsada'));
        }
        if (tipo == 2) {
            $select.append(paradaInicioVuelta)
        } else {
            $("#ListLineasPageLineas button").last().addClass("paradaRegulacion")
        }

        $('style').remove();
        $('head').append('<style>.paradasList div h1::before {border-color: #' + data.BC + ';}</style>');
        $('head').append('<style>.paradasList div.ppal h1::before {border-color: #' + data.BC + '; height:' + ($("#ListLineasPageLineas div").first().height() - 14) + 'px !important}</style>');
        $('.textoLineaHellip').width($('.parada h1').width() - 20 + 'px');
        window.clearInterval(idBlink)
        $('.blink').fadeTo('slow', 0.1).fadeTo('slow', 1.0);
        idBlink = BlinkElement();
        if (Scroll != '' && Scroll != null) {
            document.getElementById("btnMapa" + scroll).scrollIntoView();
            scroll = ''
        }
        if ($("#cambiarTimeout").text() == "Iniciar" && storage.get('modoPrueba')) {

        } else {
            window.clearInterval(idLineas);

            if (timeout == null) {
                //console.log('timeout normal')
                idLineas = TimeoutRecargarLineaAutomaticamente();
            } else {
                //console.log("mini timeout"+ timeout)
                idLineas = TimeoutRecargarLineaAutomaticamente(timeout);
            }
        }
    }
}
function ActivarAutobuses(clave, CochesActivos) {
    $(".clickBusM").remove()
    $(".clickBusL").remove()
    for (var cBus = 0; cBus < CochesActivos.length; cBus++) {
        var bus = CochesActivos[cBus]
        if (bus != null) {
            console.log(bus.Tra + ": " + bus.Coc + "->" + bus.Pos)
            trayecto = ObtenerTrayecto(bus.Tra)
            parada1 = ObtenerParada(trayecto.CP1)
            parada2 = ObtenerParada(trayecto.CP2)

            if (bus.Pos > 0) {//movimiento
                $("#" + parada2.CP + " h1").addClass("llegadaM").prepend('<div class="clickBusM" onclick="ObtenerBusEsquema(bus.codigo, clave)"></div>')
            } else if (bus.Pos == 100) {//en parada 2
                $("#" + parada2.CP + " h1").addClass("llegadaL").prepend('<div class="clickBusL" onclick="ObtenerBusEsquema(bus.codigo, clave)"></div>')
            } else {//en parada 1
                $("#" + parada1.CP + " h1").addClass("llegadaL").prepend('<div class="clickBusL" onclick="ObtenerBusEsquema(bus.codigo, clave)"></div>')
            }
        }
    }
}
function RefrescarLineaVer(data, timeout) {
    $(".parada h1").removeClass("llegadaL");
    $(".clickBusL").remove()
    busPintados = []
    $(".parada h1").removeClass("llegadaM");
    $(".clickBusM").remove()
    var tipo = "2"
    if (data.Sen.length == 1) {
        tipo = '1'
    }
    var contadorParada = 0;
    for (i = 0; i < data.Sen.length; i++) {
        for (posParada = 0; posParada < data.Sen[i].Par.length; posParada++) {
            parada = data.Sen[i].Par[posParada]

            contadorParada += 1;
            p = posParada
            trayecto = 0
            if (posParada > 0) {
                trayecto = data.Sen[i].Tray[posParada - 1]
            } else {
                if (data.Sen.length == 1) {//unilinea
                    trayecto = data.Sen[i].Tray[data.Sen[i].Tray.length - 1]
                } else if (i == 0) {//ida
                    trayecto = data.Sen[1].Tray[data.Sen[1].Tray.length - 1]
                } else {//vuelta
                    trayecto = data.Sen[0].Tray[data.Sen[0].Tray.length - 1]
                }
            }
            var autobus = null;
            for (var b = 0; b < parada.EB.length; b++) {
                coche = parada.EB[b]
                //NOTAS:En teoria tratamos esto como ida/vuelta/ida+vuelta ya veremos que pasa despues
                if (coche.itinerario == data.CI && coche.codigoLinea == data.CL) {//&& EstaEnTrayecto(coche.trayecto, trayecto, p)
                    //console.log('El primer bus de ' + parada.Nombre + ' tiene el codigo ' + coche.codigo);
                    autobus = coche;
                    break;
                }
            }
            if (parada.CP == codParadaMasCercana || parada.CP == codParadaMasCercana2) {
                htmlGeo = '<img src="img/geo3.png" alt="+cerca" class="icon"> '
            } else {
                htmlGeo = '';
            }
            //comprobamos si hay bus o no, si no hay monstramos "sin información"
            if (!autobus) {
                htmlbus = '<label class="tiempos">Sin información</label>';
            } else {
                busPintados.push(autobus)
                if (autobus.tiempo < 179) {
                    classBlink = 'blink ';
                    blink = true
                } else {
                    classBlink = '';
                }

                var partHora = [autobus.tiempo.toHHorMMorSS()]
                if (autobus.tiempo.toHHorMMorSS() != 'En Parada' && autobus.tiempo.toHHorMMorSS() != 'Próxima Llegada') {
                    partHora = autobus.tiempo.toHHorMMorSS().split(' ');//autobus.tiempo
                }
                if (partHora.length >= 4) {
                    time = '<b id="tiempo-' + parada.CP + '">' + partHora[0] + '</b> ' + partHora[1] + '<b> ' + partHora[2] + '</b> ' + partHora[3]
                } else if (partHora.length == 1) {
                    time = '<b id="tiempo-' + parada.CP + '">' + partHora[0] + '</b>'
                } else {
                    time = '<b id="tiempo-' + parada.CP + '">' + partHora[0] + '</b> ' + partHora[1]
                }
                htmlbus = '<span class="' + classBlink + '">'
                    + htmlGeo
                    + '<img src="img/reloj.png" alt="Hora" class=" icon"> '
                    + '<span class="linea perfectCube" style="background-color:#' + data.BC + ';color:#' + data.FC + ';">' + data.Abr + '</span>'
                    + time
                    + tiempoNormal(autobus.tiempo) + '</span>';//<span style="margin-left:10px;" class="ab">' + htmlOtrasLineas + '</span>

                $(".btnMapa" + parada.CP + " label").html(htmlbus)
            }
            var itiyuse = AdquirirtiempoProximoItinerarios(parada, data.CL, data.CI)
            var itinerariosHermanos = itiyuse.hermanas
            $(".btnMapa" + parada.CP + " label.hermana").remove()
            if (document.getElementById("corresp" + parada.CP) != null) {
                $(itinerariosHermanos).insertBefore("#corresp" + parada.CP)
            } else {
                $(".btnMapa" + parada.CP).append(itinerariosHermanos)
            }
        }
    }
    horaActual = Date.now();
    window.clearInterval(idBlink)
    $('.blink').fadeTo('slow', 0.1).fadeTo('slow', 1.0);
    idBlink = BlinkElement();
    ActivarAutobuses(data.Cla,data.PC)
    if ($("#cambiarTimeout").text() == "Iniciar" && storage.get('modoPrueba')) {

    } else {
        window.clearInterval(idLineas);

        if (timeout == null) {
            //console.log('timeout normal')
            idLineas = TimeoutRecargarLineaAutomaticamente();
        } else {
            //console.log("mini timeout"+ timeout)
            idLineas = TimeoutRecargarLineaAutomaticamente(timeout);
        }
    }
}
function ObtenerAutobusTrayecto(bus, busesActivos) {
    var buses =null
    for (var d = 0; d < busesActivos.length; d++) {
        if(busesActivos[d].Coc == bus.codigo) {
            buses = busesActivos[d]
            break;
        }
    }
    return buses
}
function ObtenerBotonEsquema(parada, tipo, linea, contadorParada, trayecto, p, data, i) {
    var busRaro = false;//para controlar si el bus tiene algo inusual
    var primera = true;
    var classLlegada = "";
    var htmlTotal = "";
    var htmlOtrasLineas = "", htmlGeo = "", htmlbus = ""
    //Obtenemos el sentido, en caso de ser la primera parada de idavuelta, obtiene el sentido contrario, porque "llegan a su posición"

    //Para pintar de verde si es primera o regulación
    var cssClass = '';
    var classAlubia = ''
    if (p == 0) {
        cssClass = ' paradaRegulacion';
        classAlubia = 'ppal'
    }
    //buscamos el mismo coche para la parada anterior (aunque sea la última del otro sentido) y la siguiente (aunque sea la primera del otro sentido) para luego dibujar el coche a la derecha
    var autobus = null, autobusAnt = null, autobusSig = null;
    $.each(parada.EB, function (b, coche) {
        //NOTAS:En teoria tratamos esto como ida/vuelta/ida+vuelta ya veremos que pasa despues
        if (coche.itinerario == data.CI && coche.codigoLinea == data.CL) {
            //console.log('El primer bus de ' + parada.Nombre + ' tiene el codigo ' + coche.codigo);
            autobus = coche;
            return false;
        }
    });
    //Ponemos el icono del muñeco corriendo si es parada + cercana
    if (parada.CP == codParadaMasCercana || parada.CP == codParadaMasCercana2) {
        htmlGeo = '<img src="img/geo3.png" alt="+cerca" class="icon"> '
    } else {
        htmlGeo = '';
    }
    //comprobamos si hay bus o no, si no hay monstramos "sin información"
    if (!autobus) {
        htmlbus = '<label class="tiempos" style="margin-bottom:0px;text-shadow:none"><img src= "img/reloj.png" alt= "Hora" class=" icon" > <span class="linea perfectCube" style="background-color:#' + data.BC + ';color:#' + data.FC + ';">' + data.Abr + '</span>Sin información</label>';
    } else {
        //console.log(i+". cod:" + autobus.codigo + "-> " + autobusSig.tiempo + ' > ' + autobus.tiempo + ' && ' + autobusAnt.tiempo + ' > ' + autobus.tiempo)
        if (autobus.trayecto == trayecto) {
            console.log(contadorParada + ")" + autobus.trayecto + "-" + autobus.posEnTrayecto + " tp:" + autobus.tiempo.toHHorMMorSS())
            busPintados.push(autobus)
        } else {
            classLlegada = '';
            classBlink = '';
        }
        if (autobus.tiempo < 179) {
            classBlink = 'blink ';
            blink = true
        } else {
            classBlink = '';
        }

        var partHora = [autobus.tiempo.toHHorMMorSS()]
        if (autobus.tiempo.toHHorMMorSS() != 'En Parada' && autobus.tiempo.toHHorMMorSS() != 'Próxima Llegada') {
            partHora = autobus.tiempo.toHHorMMorSS().split(' ');//autobus.tiempo
        }
        if (partHora.length >= 4) {
            time = '<b id="tiempo-' + parada.CP + '">' + partHora[0] + '</b> ' + partHora[1] + '<b> ' + partHora[2] + '</b> ' + partHora[3]
        } else if (partHora.length == 1) {
            time = '<b id="tiempo-' + parada.CP + '">' + partHora[0] + '</b>'
        } else {
            time = '<b id="tiempo-' + parada.CP + '">' + partHora[0] + '</b> ' + partHora[1]
        }
        htmlbus = '<label class="tiempos" style="margin-bottom: 0px;"><span class="' + classBlink + '">'
            + htmlGeo
            + '<img src="img/reloj.png" alt="Hora" class=" icon"> '
            + '<span class="linea perfectCube" style="background-color:#' + data.BC + ';color:#' + data.FC + ';">' + data.Abr + '</span>'
            + time
            + tiempoNormal(autobus.tiempo) + '</span>'
            + '</label>';
    }
    var itiyuse = AdquirirtiempoProximoItinerarios(parada, data.CL, data.CI)
    var itinerariosHermanos = itiyuse.hermanas

    if (verCorrespondencia == true) {
        if (parada.Iti.length > 1) {//TODO: && storage.get("verTransbordos") == true
            htmlOtrasLineas = '<span id="corresp' + parada.CP + '" class="miniText">Corresp. : '
            //recorremos las lineas 
            var limite = 8
            var sobremas = false;
            for (index = 0; index < parada.Iti.length; index++) {
                if (itiyuse.usadas.indexOf(parada.Iti[index]) == -1) {
                    if (limite > 0) {
                        if (parada.Iti[index] != lineaActual) {
                            limite = limite - 1;
                            lineaInfo = ObtenerItinerario(parada.Iti[index]);
                            idLineaSize = parada.Iti[index]
                            padding = ''
                            htmlOtrasLineas += '<span class="linea perfectCube" style="' + padding + 'padding-top: 3px;background-color:#' + lineaInfo.BC + ';color:#' + lineaInfo.FC + ';">' + lineaInfo.Abr + '</span>';
                        }
                    } else {
                        sobremas = true
                    }
                }
            }
            if (sobremas) {
                htmlOtrasLineas += '<span class="linea perfectCube" style="background-color:lightgray;color:black;">...</span>';
            }
            htmlOtrasLineas += "</span>"
            if (htmlOtrasLineas == '<span id="corresp' + parada.CP + '" class="miniText">Corresp. : </span>') {
                htmlOtrasLineas = ""
            }
        }
    }

    htmlTotal = '<div id="' + parada.CP + '" class="parada ' + classAlubia + '">'
        + '<h1 ' + classLlegada + '>' +
        '<span class="parada-id' + parada.CP + '">'
        + '<button id="btnMapa' + parada.CP + '" class="btnMapa' + parada.CP + ' ui-btn termo-btn btnShadow' + cssClass + '" onclick="LineaParadaPulsada(' + parada.CP + ',' + storage.get('LineaVer') + ',' + (contadorParada - 1) + ',' + data.Sen[i].CS + ');">'
        + '<span class="ellipsible textoLineaHellip">' + contadorParada + ' ' + parada.Nom + '</span>' + htmlbus + itinerariosHermanos + htmlOtrasLineas
        + '</button>'
        + '</span>'
        + '</h1>'
        + '</div>';
    if (classLlegada != '') {
        htmlTotal = '<div id="' + parada.CP + '" class="parada ' + classAlubia + '">'
            + '<h1 ' + classLlegada + '>' +
            '<div id="proof" style="width: 35px;height: 25px;position: absolute;top: 20px;left: -20px;cursor:pointer"></div>' +
            '<span class="parada-id' + parada.CP + '">'
            + '<button id="btnMapa' + parada.CP + '" class="btnMapa' + parada.CP + ' ui-btn termo-btn btnShadow' + cssClass + '" onclick="LineaParadaPulsada(' + parada.CP + ',' + storage.get('LineaVer') + ',' + (contadorParada - 1) + ',' + data.Sen[i].CS + ');">'
            + '<span class="ellipsible textoLineaHellip">' + contadorParada + ' ' + parada.Nom + '</span>' + htmlbus + itinerariosHermanos + htmlOtrasLineas
            + '</button>'
            + '</span>'
            + '</h1>'
            + '</div>';
    }
    if (p == 0) {
        if (classLlegada == 'class="llegadaL"' || classLlegada == 'class="llegadaL raro"') {
            var clas = "llegadaInicio"
            if (classLlegada.indexOf("raro") > -1) {
                clas = "llegadaInicio raro"
            }
            htmlTotal = '<div id="' + parada.CP + '" class="parada ' + classAlubia + '">'
                + '<h1 class="' + clas + '">' +
                '<div id="proofInicio" style="z-index:9999;width: 35px;height: 25px;position: absolute;top: 20px;left: -20px;cursor:pointer"></div>' +
                '<span class="parada-id' + parada.CP + '">'
                + '<button id="btnMapa' + parada.CP + '" class="btnMapa' + parada.CP + ' ui-btn termo-btn btnShadow' + cssClass + '" onclick="LineaParadaPulsada(' + parada.CP + ',' + storage.get('LineaVer') + ',' + (contadorParada - 1) + ');">'
                + '<span class="ellipsible textoLineaHellip">' + contadorParada + ' ' + parada.Nom + '</span>' + htmlbus + itinerariosHermanos + htmlOtrasLineas
                + '</button>'
                + '</span>'
                + '</h1>'
                + '</div>';
        }
    }
    return htmlTotal
}
function AdquirirtiempoProximoItinerarios(parada, padre, lineaActual) {
    var hermanas = ""
    var codigosUsados = []
    //Comprobamos si por aqui pasa un itinerario de la misma linea9292

    lineasHermanas = $.grep(LSLineas, function (l) {
        return l.CL == padre;
    })

    for (var cpcl = 0; cpcl < lineasHermanas.length; cpcl++) {
        var lin = lineasHermanas[cpcl]
        var codigo = lin.CI
        if (lineaActual != codigo) {
            if (lin.CL == padre) {
                //si es de la misma hermana se busca el primer coche de esta y se muestra
                for (var aaa = 0; aaa < parada.EB.length; aaa++) {
                    var bus = parada.EB[aaa]
                    if (bus.itinerario == codigo) {
                        codigosUsados.push(codigo)
                        var aaBlinka = ""
                        var partHora = [bus.tiempo.toHHorMMorSS()]
                        if (bus.tiempo.toHHorMMorSS() != 'En Parada' && bus.tiempo.toHHorMMorSS() != 'Próxima Llegada') {
                            partHora = bus.tiempo.toHHorMMorSS().split(' ');//autobus.tiempo
                        }
                        if (partHora.length >= 4) {
                            time = '<b>' + partHora[0] + '</b> ' + partHora[1] + '<b> ' + partHora[2] + '</b> ' + partHora[3]
                        } else if (partHora.length == 1) {
                            time = '<b>' + partHora[0] + '</b>'
                        } else {
                            time = '<b>' + partHora[0] + '</b> ' + partHora[1]
                        }
                        hermanas += '<label class="tiempos hermana" style="margin-bottom: 0px;"><span class="' + aaBlinka + '">'
                            + '<img src="img/reloj.png" alt="Hora" class=" icon"> '
                            + '<span class="linea perfectCube" style="background-color:#' + lin.BC + ';color:#' + lin.FC + ';">' + lin.Abr + '</span>'
                            + time
                            + tiempoNormal(bus.tiempo) + '</span>'
                            + '</label>';

                        //hermanas += "<label>" + bus.itinerario + "</label>"
                        break;
                    }
                }
            }
        }
    }
    return { hermanas: hermanas, usadas: codigosUsados }
}
function getBus(codigo, orden, parada, itinerario) {
    var b = [];
    b = $.grep(parada.EB, function (co) {
        return (co.codigo == codigo && co.orden == orden && co.itinerario == itinerario);
    })[0];
    if (b == null) {
        b = [];
    }
    return b;
}
function LineaParadaPulsada(codigo, idLinea, posicion, sentido, funcionRealizar, extra) {
    var funcion = ''
    switch (funcionRealizar) {
        case 1:
            funcion = 'ObtenerParadaMapa'
            break;
        case 2:
            funcion = 'ObtenerParadaBusqueda'
            break;
        case 3:
            funcion = 'ObtenerParadaFavoritos'
            break;
        default:
            funcion = 'ObtenerParadaEsquema'
            break;
    }
    var extras = { Linea: idLinea, Posicion: posicion, CodParada: codigo, Sentido: sentido }
    var extras = $.extend({}, extras, extra);
    try {
        window.clearInterval(idLineas)
        if (online) {
            var par = ObtenerParada(codigo)
            var ref = EsReferenciada(par.CPRef)
            var codigos = codigo
            if (funcionRealizar == 2) {
                ref = null
            }
            if (ref != null) {
                codigos = ref.Cadena
            }
            if (funcionRealizar == 1 && par.Iti.length > 1 && layersSeleccionados.length > 1) {
                for (var cD = 0; cD < par.Iti.length; cD++) {
                    cod = par.Iti[cD]
                    for (var cP = 0; cP < layersSeleccionados.length; cP++) {
                        layer = layersSeleccionados[cP]
                        if (cod == layer && layer != idLinea) {
                            console.log("si tio, aqui debes cambiar la funcion a la doble")
                            funcion = 'ObtenerParadaMapaCombi'
                            ref = null
                        }
                    }
                }
            }
            // te quedaste arreglando eso para que no vaya lento por culpa del estorage
            if (localStorage['EPR' + codigos] != null) {
                tiempo = Date.now() - localStorage['UTHP' + codigos];
                if (tiempo >= (tiempoRecargaMilis - 500)) {
                    console.log("Debug: se pide parada " + codigos)
                    if (ref != null) {
                        SolicitarParadas(ref.Cadena, funcion, extras)
                    } else {
                        SolicitarParadas(codigo, funcion, extras)
                    }
                } else {
                    console.log("Debug:ya existe la parada" + codigos)
                    if (ref != null) {
                        LlamarFuncionParada(storage.get('EPR' + codigos), funcion, extras)
                    } else {
                        LlamarFuncionParada(storage.get('EPR' + codigos), funcion, extras)
                    }
                }
            } else {
                if (ref != null) {
                    SolicitarParadas(ref.Cadena, funcion, extras)
                } else {
                    SolicitarParadas(codigo, funcion, extras)
                }
            }

        } else {
            //TODO: Cambiar a swal
            AbrirParadaOffline(codigo, idLinea, posicion);
        }
    } catch (ex) {
        swal.close()
        console.log(ex.stack)
        //si fallase abriendo la parada por lo que sea, recargamos el esquema
        if ($.mobile.activePage.attr('data-url') == 'pageLineaVer') {
            idLineas = TimeoutRecargarLineaAutomaticamente();
            RecargarModoLineasAutomaticamente()
        }
    }
    if (funcion == "ObtenerParadaEsquema") {
        SeleccionarParada('btnMapa' + codigo);
    }
}

function verLineaOffline() {
    var $select = $("#ListLineasPageLineas");
    $select.empty();
    busPintados = [];
    data = ObtenerItinerario(storage.get('LineaVer'));
    var contadorParada = 0;
    var tipo = "2"
    if (data.Sen.length == 1) {
        tipo = '1'
    }
    var paradaInicioVuelta = ""
    for (i = 0; i < data.Sen.length; i++) {
        $.each(data.Sen[i].Par, function (posParada, parada) {
            contadorParada += 1;
            var codTrayecto = 0;
            if (posParada > 0) { codTrayecto = data.Sen[i].Tray[posParada - 1] } //la primera coje el final del trayecto de vuelta
            parada = ObtenerBotonEsquema(parada, tipo, lineaActual, contadorParada, codTrayecto, posParada, data, i)
            if (posParada == 0 && tipo == "2" && i == 0) {
                codTrayecto = ""
                paradaInicioVuelta = parada
            }
            $select.append(parada);
        });
    }
    if (tipo == 2) {
        $select.append(paradaInicioVuelta)
    } else {
        $("#ListLineasPageLineas button").last().addClass("paradaRegulacion")
    }
    $('style').remove();
    $('head').append('<style>.paradasList div h1::before {border-color: #' + data.BC + ';}</style>');
    $('head').append('<style>.paradasList div.ppal h1::before {border-color: #' + data.BC + '; height:' + ($("#ListLineasPageLineas div").first().height() - 14) + 'px !important}</style>');
    $('.textoLineaHellip').width($('.parada h1').width() - 20 + 'px');
}

var infodotAbierto = false;
function SolicitarHTMLInformacionParadaLight(data, paradaPpal, idLinea, posicion, sentido) {
    var iwContenidoTotal = '';
    if (data != null) {
        //obtenemos el itinerario en lugar de infolinea para el tratamiento de paradas
        miLinea = ObtenerItinerario(idLinea)

        var paradaPrimera = miLinea.Sen[0].Par[0].CP
        var paradaRegulacion = null
        if (miLinea.Sen.length > 1) {
            paradaRegulacion = miLinea.Sen[1].Par[0].CP
        }

        var par = data
        var iwCoches = []
        //var pos = (ObtenerPosicionParada(ObtenerLinea(idLinea).Paradas, data)) + 1
        var pos = posicion;
        abierto = "display:none;"
        //TODO: InfodotAbierto (al pulsar en 3 puntos), se debe cerrar cuando cierre el popup (que no cuando salga otro encima de este)
        if (infodotAbierto) {
            abierto = "display:block;"
        }
        var iwContenido1 = '<div class="iw">' +
            '<div class="h4Blue" style="text-align:center">' +
            '<span class="icon-c closePopup" onclick="Swal.clickConfirm()"></span>' +
            '<h6 class="headPopup">' + (pos + 1) + ': ' + par.Nom + ' (' + par.CP + ')</h6>' +
            '<span class="icon-3dots dotsPopup" onclick="AbrirInfoDot()"></span>' +
            '<span class="icon-star favoritoPopup"></span>' +
            '<div class="dotClosePopup" onclick="CerrarInfoDot()"></div>' +
            '<div class="popupDotMenu" style="' + abierto + '">' +
            '<p onclick="ComoLlegarParada(' + par.CP + ')">Cómo Llegar a Píe</p>' +
            '<p>Ver en Mapa</p>' +
            '<p onclick="VerStreetView(' + par.XY[0] + ',' + par.XY[1] + ')">Street View</p>' +
            '<p onclick="AbrirNuevoAviso(' + idLinea + ',' + par.CP + ')">Crear Alerta</p>' +
            '</div>' +
            '</div>'
        var iwLinea = '<p class="nombreLinea nombreLineaPopup" style="background-color:#' + miLinea.BC + ';color:#' + miLinea.FC + ';text-shadow:1px 0px ' + ColorLuminance('#' + miLinea.BC, -0.2) + '">L-' + miLinea.Abr + ': ' + miLinea.Nom + '</p>';
        var iwContenido2 = '</div>';
        var iwContenidoRegulacion = '<p class="regulacion">regulación</p>';
        var iwDireccion = "";
        var iwDistancia = "";
        var iwMenu = '<div class="MenuParada"><center>';
        bOtrasLineas = false;
        favoritos = storage.get('Favoritos');
        var esfavorito = false;
        if (favoritos != null) {
            if (favoritos.length > 0) {
                $.each(favoritos, function (i, favorito) {
                    if (favorito.IdParada == par.CP) {
                        esfavorito = true;
                    }
                });
            }
        }
        //por si necesita ocultar o no la cruz, puntos, favoritos etc
        if ($.mobile.activePage.attr('data-url') != 'pageLineaVer' && $.mobile.activePage.attr('data-url') != 'pageComoLlegarEsquema') {
            iwContenido1 = iwContenido1.replace('closePopup"', 'closePopup" style="display:none"')
            if ($.mobile.activePage.attr('data-url') == 'pageMapa') {
                //iwContenido1 = iwContenido1.replace('favoritoPopup"', 'favoritoPopup" style="right: 40px;"');
                //iwContenido1 = iwContenido1.replace('dotsPopup"', 'dotsPopup" style="right: 17px;"');
                //iwContenido1 = iwContenido1.replace('popupDotMenu', 'popupDotMenu" style="right: 28px;display:none"');
            } else
                if ($.mobile.activePage.attr('data-url') != 'pageFavoritos') {
                    iwContenido1 = iwContenido1.replace('favoritoPopup"', 'favoritoPopup" style="right: 45px;"');
                    iwContenido1 = iwContenido1.replace('dotsPopup"', 'dotsPopup" style="right: 17px;"');
                    iwContenido1 = iwContenido1.replace('popupDotMenu', 'popupDotMenu" style="right: 28px;"');
                } else {
                    iwContenido1 = iwContenido1.replace('dotClosePopup"', 'dotClosePopup" style="display:none"')
                    iwContenido1 = iwContenido1.replace('favoritoPopup"', 'favoritoPopup" style="display:none"')
                    iwContenido1 = iwContenido1.replace('dotsPopup', 'dotsPopup" style="display:none"')
                }
        }
        //marcamos si es favorito o no
        if (!esfavorito) {
            iwContenido1 = iwContenido1.replace("icon-star", "icon-empty-star").replace('favoritoPopup"', 'favoritoPopup" onclick="CrearFavorito(null,' + idLinea + ',' + par.CP + ')"');
        } else {
            iwContenido1 = iwContenido1.replace('favoritoPopup"', 'favoritoPopup" onclick="IrAFavorito(' + par.CP + ')"');
        }
        if ($.mobile.activePage.attr('data-url') != 'pageMapa') {//ver en mapa
            iwContenido1 = iwContenido1.replace('>Ver en Mapa', ' onclick="VerEnMapa(' + par.XY[0] + ',' + par.XY[1] + ',' + miLinea.CI + ')">Ver en mapa')
        } else if ($.mobile.activePage.attr('data-url') != 'pageRutas') {//ver en esquema
            iwContenido1 = iwContenido1.replace('>Ver en Mapa', ' onclick="VerEnEsquema(' + idLinea + ',' + par.CP + ')">Ver en Esquema')
        }
        iwContenidoTotal += iwContenido1;
        //TODO:poner la distancia de la parada
        ////ubicacion
        //if (storage.isSet('geoLat')) {
        //    geo = new google.maps.LatLng(storage.get('geoLat'), storage.get('geoLng'));
        //    //Aqui buscamos la lat y long parada.
        //    distancia = 0;
        //    coordABuscar = ObtenerLatLngParada(par.CP, idLinea);
        //    distancia = google.maps.geometry.spherical.computeDistanceBetween(geo, coordABuscar);
        //    iwDistancia += '<p style="margin-left:5px"><img src="img/gpsloc_azul.png" height="15" width="15" style="" /><img src="img/geo3.png" height="15" width="15" style="" />Distancia: ' + parseInt(distancia).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' metros.</p>';
        //}

        iwContenidoTotal += iwLinea;
        ////si es regulacion la cambiamos a verde
        //if (primeraParada == par.CP || ultimaParada == par.CP) { // La primera parada y la definida como regulación.
        //    iwContenidoTotal = iwContenidoTotal.replace("h4Blue", "h4Green");
        //}// else {
        ////    iwContenidoTotal += '<br>'
        ////} 
        if (sentido == 2 && pos != 0) {
            var nomParPrimera = miLinea.Sen[0].Par[0].Nom
            iwDireccion = '<p class="sentidoPopup">Sentido<span class="icon-arrow-right2" style="font-size: 13px;margin-right: 5px;margin-left: 5px;"></span>VTA - ' + nomParPrimera + '</p>'
        } else {
            var nombreRegulacion = miLinea.Sen[0].Par[miLinea.Sen[0].Par.length - 1].Nom
            if (miLinea.Sen.length > 1) {
                nombreRegulacion = miLinea.Sen[1].Par[0].Nom
            }
            iwDireccion = '<p class="sentidoPopup">Sentido<span class="icon-arrow-right2" style="font-size: 13px;margin-right: 5px;margin-left: 5px;"></span>IDA - ' + nombreRegulacion + '</p>'
        }
        primerBus = null
        iwContenidoTotal += iwDireccion;
        iwContenidoTotal += iwDistancia;
        iwContenidoTotal += '<div class="divProxAutobusesPopup"><p><img src="img/bus3_64.png" height="16px" width="32px" style="margin-right:5px"><strong>Próximos Autobuses</strong></p>'
        if (par.EB.length <= 0) {//Si viene sin ningún autobus tengo que pintar todo 'Sin información'
            iwContenidoTotal += '<p style="margin-left:40px">Sin información</p>';
            var otroiti = ""
            var otraslin = ""
            if (par.Iti.length > 1) {
                otroiti += '<br><p><img src="img/bus3_64.png" height="16px" width="32px"><strong>Otros itinerarios:</strong></p>';
                otraslin += '<hr/><p><img src="img/bus3_64.png" height="16px" width="32px"><strong>Otras líneas:</strong></p>';
            }
            $.each(par.Iti, function (c, idlin) {
                if (idlin != idLinea) {
                    var miLineaB = ObtenerItinerario(idlin)
                    var abrMargen = '<p class="ellipsible" style="margin-right:10px;margin-left:16px">' + ObtenerAbreviaturaMargen(miLineaB.Abr, miLineaB.BC, miLineaB.FC) + 'Sin información.</p><br>'
                    if (miLineaB.CL == miLinea.CL) {
                        otroiti += abrMargen;
                    } else {
                        otraslin += abrMargen;
                    }
                }
            });
            if (otroiti != '<br><p><img src="img/bus3_64.png" height="16px" width="32px"><strong>Otros itinerarios:</strong></p>') {
                iwContenidoTotal += otroiti;
            }
            if (otraslin != '<hr/><p><img src="img/bus3_64.png" height="16px" width="32px"><strong>Otras líneas:</strong></p>') {
                iwContenidoTotal += otraslin;
            }
        } else {//Tiene autobuses
            var maxMostrar = 2;
            var pos = 1;
            $.each(par.EB, function (i, coche) {
                var clavecoche = coche.Lin + "." + coche.Iti
                //if ((clavecoche == idLinea || (coche.Lin == miLinea.CL && !existeLinea(clavecoche))) && (coche.sentido == sentido || primeraParada == data.Codigo || miLinea.Definicion.Regulacion == data.Codigo)) {
                if (clavecoche == idLinea && (coche.Sen == sentido || paradaPrimera == par.CP || (paradaRegulacion != null && paradaRegulacion == par.CP))) {//porque si los coches van en otro sentido pero son para la de regulacion se tienen que poner
                    if (maxMostrar > 0) {
                        if (maxMostrar == 2) {
                            primerBus = coche
                        }
                        iwCoches.push(coche);
                        classBlink = '';
                        var tiempo = coche.TP.toHHorMMorSS() + tiempoNormal(coche.TP)
                        if (coche.TP < 179) {
                            classBlink = 'blink ';
                        }
                        //if (maxMostrar == 2) {
                        //    tiempo = '<b style="font-size: 20px;">' + coche.tiempo.toHHorMMorSS() + tiempoNormal(coche.tiempo) + '</b>';
                        //}
                        iwContenidoTotal += '<p class="marginPopup"><span class="' + classBlink + '"><b>' + pos + '. </b><img src="img/reloj.png" alt="Hora" class="icon"> ' + tiempo + '</span></p>';
                        $.each(coche.Avi, function (f, avi) {
                            if (avi.indexOf("#") != 0) {
                                iwContenidoTotal += '<p class="avisoPop"><span>•</span>' + avi + '</p>'
                            }
                        })
                        maxMostrar = maxMostrar - 1;
                        pos += 1;
                    }
                } else {
                    bOtrasLineas = true;
                }
            });
            if (maxMostrar == 2) {
                iwContenidoTotal += '<p style="margin-left:40px">Sin información</p>'
            }
            if (bOtrasLineas) {
                var listaPrimeraLinea = []
                $.each(data.EB, function (i, coche) {
                    $.each(LSLineas, function (i, x) {
                        var claCo = coche.Lin + "." + coche.Iti
                        if (x.Cla == claCo) {
                            if (listaPrimeraLinea[x.Cla] == null) {
                                listaPrimeraLinea[x.Cla] = coche
                            }
                        }
                    });
                });

                var otroiti = ""
                var otraslin = ""
                if (data.Iti.length > 1) {
                    otroiti += '<br><p><img src="img/bus3_64.png" height="16px" width="32px"><strong>Otros itinerarios:</strong></p>';
                    otraslin += '<hr/><p><img src="img/bus3_64.png" height="16px" width="32px"><strong>Otras líneas:</strong></p>';
                }

                $.each(data.Iti, function (c, idlin) {
                    if (idlin != idLinea) {
                        coche = listaPrimeraLinea[idlin]
                        miLineaB = ObtenerItinerario(idlin)
                        //console.log(miLineaB)
                        var itinerarioyhorario = ""
                        idLineaSize = miLineaB.Abr
                        padding = ''
                        //itinerarioyhorario += '<p class="ellipsible" style="margin-right:10px;">' + ObtenerAbreviaturaMargen(miLineaB.Abr, miLineaB.BC, miLineaB.FC);//<img src="img/bus3_64.png" height="16px" width="32px" />
                        itinerarioyhorario += '<tr class="ellipsible"><td style="Text-align:right;">' + ObtenerAbreviaturaMargen(miLineaB.Abr, miLineaB.BC, miLineaB.FC) + '</td>';//<img src="img/bus3_64.png" height="16px" width="32px" />
                        if (coche != null) {
                            classBlink = '';
                            if (coche.TP < 179) {
                                classBlink = 'blink ';
                            }
                            iwCoches.push(coche);
                            reloj = "img/reloj.png"
                            if (data.Ref != null) {
                                if (data.Ref.indexOf(idlin) > -1) {
                                    reloj = "img/relojRojo.png"
                                }
                            }
                            itinerarioyhorario += '<td><p><span class="' + classBlink + '"><img src="' + reloj + '" alt="Hora" class="icon"> ' + coche.TP.toHHorMMorSS() + tiempoNormal(coche.TP);//+ ' ('+ coche.distancia + ' metros)';
                            var lineaclavecoche = coche.Lin + "." + coche.Iti
                            if (coche.sen == 0) {
                                ultParada = miLinea.Sen[0].Par[miLinea.Sen[0].Par.length - 1].Nom
                                if (miLinea.Sen.length > 1) {
                                    miLinea.Sen[1].Par[0].Nom
                                }
                                itinerarioyhorario += ' <span class="icon-arrow-right2" style="font-size: 13px;margin-right: 5px;margin-left: 5px;"></span><span>' + ultParada + '</span></p></td>';
                            } else {
                                itinerarioyhorario += ' <span class="icon-arrow-right2" style="font-size: 13px;margin-right: 5px;margin-left: 5px;"></span><span>' + miLinea.Sen[0].Par[0].Nom + '</span></p></td>';
                            }

                            if (miLineaB.CL == miLinea.CL) {
                                otroiti += itinerarioyhorario
                            } else {
                                otraslin += itinerarioyhorario
                            }

                        } else {
                            reloj = "img/reloj.png"
                            if (data.Ref != null) {
                                if (data.Ref.indexOf(idlin) > -1) {
                                    reloj = "img/relojRojo.png"
                                }
                            }
                            var info = itinerarioyhorario + '<td class="noInfo"><p><span><img src="' + reloj + '" alt="Hora" class="icon" style="padding:"> ' + 'Sin información.</span></p></td>'
                            if (miLineaB.CL == miLinea.CL) {
                                otroiti += info
                            } else {
                                otraslin += info
                            }
                        }
                    }
                });
                if (otroiti != '<br><p><img src="img/bus3_64.png" height="16px" width="32px"><strong>Otros itinerarios:</strong></p>') {
                    iwContenidoTotal += "<table>" + otroiti + "</table>";
                }
                if (otraslin != '<hr/><p><img src="img/bus3_64.png" height="16px" width="32px"><strong>Otras líneas:</strong></p>') {
                    iwContenidoTotal += "<table>" + otraslin + "</table>";
                }
            }
            //else if (data.codLineas.length > 0) {//si solo hay una linea debe pintarse esa
            //    var htmlOtras = ""
            //    $.each(data.codLineas, function (c, idlin) {
            //        if (idlin != idLinea) {
            //            miLineaB = ObtenerInfoLinea(idlin)
            //            idVer = miLineaB.Definicion.Codigo
            //            padding = ''
            //            //if (idVer > 9) {
            //            //    padding = 'padding-right: 4px;'
            //            //}
            //            htmlOtras += '<p class="ellipsible" style="margin-right:10px;margin-left:16px">' + ObtenerAbreviaturaMargen(miLineaB.Definicion.Abreviatura, miLineaB.Apariencia.BackColor.substring(2), miLineaB.Apariencia.ForeColor.substring(2));
            //            htmlOtras += 'Sin información.</p><br>'
            //        }
            //    });
            //    if (htmlOtras != "") {
            //        iwContenidoTotal += '<hr/><p><img src="img/bus3_64.png" height="16px" width="32px"><strong>Otras líneas:</strong></p>' + htmlOtras
            //    }
            //}
        }
        iwContenidoTotal += iwContenido2 + "</div>";
        if (EsReferenciada(paradaPpal) != null) {
            iwContenidoTotal += '<span class="mensajeReferenciadas">Líneas con <img src="img/relojRojo.png" alt="Hora" class="icon"> indican que su poste no es el mismo que el de la parada consultada.</span>'
        }
        iwContenidoTotal = iwContenidoTotal + '<p class="ultimaHoraPopup">Última actualización: ' + new Date().getHours() + ":" + pad(new Date().getMinutes(), 2) + ":" + pad(new Date().getSeconds(), 2) + "</span>";
        if ($.mobile.activePage.attr('data-url') == 'pageLineaVer' && storage.isSet("log")) {
            if (storage.get("log")) {
                iwContenidoTotal += dudea + '<strong id="dudeCa">' + primerBus.codigo + '</strong> - <span id="dudetma">' + primerBus.tiempo.toMMSS() + '</span>' + dudeb
            }
        }
        //TODO: btn Reproducir audio
        //iwContenidoTotal += '<div id="textoReproducir" style="display:none">' + SolicitarTextoInformacionParadaLight(data, idLinea, posicion) + '</div>'
    }
    return iwContenidoTotal
}
function SolicitarHTMLInformacionParadaCombi(data) {
    var iwContenidoTotal = '';

    if (data != null) {
        var par = data
        //obtenemos el itinerario en lugar de infolinea para el tratamiento de paradas
        //miLinea = ObtenerItinerario(idLinea)

        //var paradaPrimera = miLinea.Sen[0].Par[0].CP
        //var paradaRegulacion = null
        //if (miLinea.Sen.length > 1) {
        //    paradaRegulacion = miLinea.Sen[1].Par[0].CP
        //}


        var iwCoches = []

        abierto = "display:none;"
        //TODO: InfodotAbierto (al pulsar en 3 puntos), se debe cerrar cuando cierre el popup (que no cuando salga otro encima de este)
        if (infodotAbierto) {
            abierto = "display:block;"
        }
        var iwContenido1 = '<div class="iw">' +
            '<div class="h4Blue" style="text-align:center">' +
            '<span class="icon-c closePopup" onclick="Swal.clickConfirm()"></span>' +
            '<h6 class="headPopup">' + par.Nom + ' (' + par.CP + ')</h6>' +
            '<span class="icon-3dots dotsPopup" onclick="AbrirInfoDot()"></span>' +
            '<span class="icon-star favoritoPopup"></span>' +
            '<div class="dotClosePopup" onclick="CerrarInfoDot()"></div>' +
            //'<div class="popupDotMenu" style="' + abierto + '">' +
            //'<p onclick="ComoLlegarParada(' + par.CP + ')">Cómo Llegar a Píe</p>' +
            //'<p>Ver en Mapa</p>' +
            //'<p onclick="VerStreetView(' + par.XY[0] + ',' + par.XY[1] + ')">Street View</p>' +
            //'<p onclick="AbrirNuevoAviso(' + idLinea + ',' + par.CP + ')">Crear Alerta</p>' +
            //'</div>' +
            '</div>'

        var iwContenido2 = '</div>';
        var iwContenidoRegulacion = '<p class="regulacion">regulación</p>';
        var iwDireccion = "";
        var iwDistancia = "";
        var iwMenu = '<div class="MenuParada"><center>';
        bOtrasLineas = false;
        favoritos = storage.get('Favoritos');
        var esfavorito = false;
        if (favoritos != null) {
            if (favoritos.length > 0) {
                $.each(favoritos, function (i, favorito) {
                    if (favorito.IdParada == par.CP) {
                        esfavorito = true;
                    }
                });
            }
        }
        //por si necesita ocultar o no la cruz, puntos, favoritos etc
        if ($.mobile.activePage.attr('data-url') != 'pageLineaVer' && $.mobile.activePage.attr('data-url') != 'pageComoLlegarEsquema' && $.mobile.activePage.attr('data-url') != 'pageBuscarParada') {
            iwContenido1 = iwContenido1.replace('closePopup"', 'closePopup" style="display:none"')
            if ($.mobile.activePage.attr('data-url') == 'pageMapa') {
                //iwContenido1 = iwContenido1.replace('favoritoPopup"', 'favoritoPopup" style="right: 40px;"');
                //iwContenido1 = iwContenido1.replace('dotsPopup"', 'dotsPopup" style="right: 17px;"');
                //iwContenido1 = iwContenido1.replace('popupDotMenu', 'popupDotMenu" style="right: 28px;display:none"');
            } else
                if ($.mobile.activePage.attr('data-url') != 'pageFavoritos') {
                    iwContenido1 = iwContenido1.replace('favoritoPopup"', 'favoritoPopup" style="right: 45px;"');
                    iwContenido1 = iwContenido1.replace('dotsPopup"', 'dotsPopup" style="right: 17px;"');
                    iwContenido1 = iwContenido1.replace('popupDotMenu', 'popupDotMenu" style="right: 28px;"');
                } else {
                    iwContenido1 = iwContenido1.replace('dotClosePopup"', 'dotClosePopup" style="display:none"')
                    iwContenido1 = iwContenido1.replace('favoritoPopup"', 'favoritoPopup" style="display:none"')
                    iwContenido1 = iwContenido1.replace('dotsPopup', 'dotsPopup" style="display:none"')
                }
        }
        //marcamos si es favorito o no
        if (!esfavorito) {
            iwContenido1 = iwContenido1.replace("icon-star", "icon-empty-star").replace('favoritoPopup"', 'favoritoPopup" onclick="CrearFavorito(null,' + par.CP + ')"');
        } else {
            iwContenido1 = iwContenido1.replace('favoritoPopup"', 'favoritoPopup" onclick="IrAFavorito(' + par.CP + ')"');
        }
        if ($.mobile.activePage.attr('data-url') != 'pageMapa') {//ver en mapa
            iwContenido1 = iwContenido1.replace('>Ver en Mapa', ' onclick="VerEnMapa(' + par.XY[0] + ',' + par.XY[1] + ',' + data.Iti[0] + ')">Ver en mapa')
        } else if ($.mobile.activePage.attr('data-url') != 'pageRutas') {//ver en esquema
            iwContenido1 = iwContenido1.replace('>Ver en Mapa', ' onclick="VerEnEsquema(' + data.Iti[0] + ',' + par.CP + ')">Ver en Esquema')
        }
        iwContenidoTotal += iwContenido1;
        //TODO:poner la distancia de la parada
        ////ubicacion
        //if (storage.isSet('geoLat')) {
        //    geo = new google.maps.LatLng(storage.get('geoLat'), storage.get('geoLng'));
        //    //Aqui buscamos la lat y long parada.
        //    distancia = 0;
        //    coordABuscar = ObtenerLatLngParada(par.CP, idLinea);
        //    distancia = google.maps.geometry.spherical.computeDistanceBetween(geo, coordABuscar);
        //    iwDistancia += '<p style="margin-left:5px"><img src="img/gpsloc_azul.png" height="15" width="15" style="" /><img src="img/geo3.png" height="15" width="15" style="" />Distancia: ' + parseInt(distancia).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' metros.</p>';
        //}
        for (var iC = 0; iC < data.Iti.length; iC++) {
            idLinea = data.Iti[iC]
            miLinea = ObtenerItinerario(idLinea)
            var iwLinea = '<p class="nombreLinea nombreLineaPopup" style="background-color:#' + miLinea.BC + ';color:#' + miLinea.FC + ';text-shadow:1px 0px ' + ColorLuminance('#' + miLinea.BC, -0.2) + '">L-' + miLinea.Abr + ': ' + miLinea.Nom + '</p>';
            iwContenidoTotal += iwLinea;
            ////si es regulacion la cambiamos a verde
            //if (primeraParada == par.CP || ultimaParada == par.CP) { // La primera parada y la definida como regulación.
            //    iwContenidoTotal = iwContenidoTotal.replace("h4Blue", "h4Green");
            //}// else {
            ////    iwContenidoTotal += '<br>'
            ////} 
            sentido = ObtenerSentidoParada(miLinea, par.CP)
            if (sentido == 2 && pos != 0) {
                var nomParPrimera = miLinea.Sen[0].Par[0].Nom
                iwDireccion = '<p class="sentidoPopup">Sentido<span class="icon-arrow-right2" style="font-size: 13px;margin-right: 5px;margin-left: 5px;"></span>VTA - ' + nomParPrimera + '</p>'
            } else {
                var nombreRegulacion = miLinea.Sen[0].Par[miLinea.Sen[0].Par.length - 1].Nom
                if (miLinea.Sen.length > 1) {
                    nombreRegulacion = miLinea.Sen[1].Par[0].Nom
                }
                iwDireccion = '<p class="sentidoPopup">Sentido<span class="icon-arrow-right2" style="font-size: 13px;margin-right: 5px;margin-left: 5px;"></span>IDA - ' + nombreRegulacion + '</p>'
            }
            primerBus = null
            iwContenidoTotal += iwDireccion;
            iwContenidoTotal += iwDistancia;
            iwContenidoTotal += '<div class="divProxAutobusesPopup"><p><img src="img/bus3_64.png" height="16px" width="32px" style="margin-right:5px"><strong>Próximos Autobuses</strong></p>'
            if (par.EB.length <= 0) {//Si viene sin ningún autobus tengo que pintar todo 'Sin información'
                iwContenidoTotal += '<p style="margin-left:40px">Sin información</p>';
                var otroiti = ""
                var otraslin = ""
                if (par.Iti.length > 1) {
                    otroiti += '<br><p><img src="img/bus3_64.png" height="16px" width="32px"><strong>Otros itinerarios:</strong></p>';
                    otraslin += '<hr/><p><img src="img/bus3_64.png" height="16px" width="32px"><strong>Otras líneas:</strong></p>';
                }
                $.each(par.Iti, function (c, idlin) {
                    if (idlin != idLinea) {
                        var miLineaB = ObtenerItinerario(idlin)
                        var abrMargen = '<p class="ellipsible" style="margin-right:10px;margin-left:16px">' + ObtenerAbreviaturaMargen(miLineaB.Abr, miLineaB.BC, miLineaB.FC) + 'Sin información.</p><br>'
                        if (miLineaB.CL == miLinea.CL) {
                            otroiti += abrMargen;
                        } else {
                            otraslin += abrMargen;
                        }
                    }
                });
                if (otroiti != '<br><p><img src="img/bus3_64.png" height="16px" width="32px"><strong>Otros itinerarios:</strong></p>') {
                    iwContenidoTotal += otroiti;
                }
                if (otraslin != '<hr/><p><img src="img/bus3_64.png" height="16px" width="32px"><strong>Otras líneas:</strong></p>') {
                    iwContenidoTotal += otraslin;
                }
            } else {//Tiene autobuses
                var maxMostrar = 2;
                var pos = 1;
                $.each(par.EB, function (i, coche) {
                    var clavecoche = coche.Lin + "." + coche.Iti
                    //if ((clavecoche == idLinea || (coche.Lin == miLinea.CL && !existeLinea(clavecoche))) && (coche.sentido == sentido || primeraParada == data.Codigo || miLinea.Definicion.Regulacion == data.Codigo)) {
                    if (clavecoche == idLinea
                        //&&(coche.Sen == sentido || paradaPrimera == par.CP || (paradaRegulacion != null && paradaRegulacion == par.CP))
                        ) {//porque si los coches van en otro sentido pero son para la de regulacion se tienen que poner
                        if (maxMostrar > 0) {
                            if (maxMostrar == 2) {
                                primerBus = coche
                            }
                            iwCoches.push(coche);
                            classBlink = '';
                            var tiempo = coche.TP.toHHorMMorSS() + tiempoNormal(coche.TP)
                            if (coche.TP < 179) {
                                classBlink = 'blink ';
                            }
                            //if (maxMostrar == 2) {
                            //    tiempo = '<b style="font-size: 20px;">' + coche.tiempo.toHHorMMorSS() + tiempoNormal(coche.tiempo) + '</b>';
                            //}
                            iwContenidoTotal += '<p class="marginPopup"><span class="' + classBlink + '"><b>' + pos + '. </b><img src="img/reloj.png" alt="Hora" class="icon"> ' + tiempo + '</span></p>';
                            $.each(coche.Avi, function (f, avi) {
                                if (avi.indexOf("#") != 0) {
                                    iwContenidoTotal += '<p class="avisoPop"><span>•</span>' + avi + '</p>'
                                }
                            })
                            maxMostrar = maxMostrar - 1;
                            pos += 1;
                        }
                    } else {
                        bOtrasLineas = true;
                    }
                });
                if (maxMostrar == 2) {
                    iwContenidoTotal += '<p style="margin-left:40px">Sin información</p>'
                }

            }
            iwContenidoTotal += "</div>";
        }
        iwContenidoTotal += iwContenido2 + "</div>";
        iwContenidoTotal = iwContenidoTotal + '<p class="ultimaHoraPopup">Última actualización: ' + new Date().getHours() + ":" + pad(new Date().getMinutes(), 2) + ":" + pad(new Date().getSeconds(), 2) + "</span>";
        if ($.mobile.activePage.attr('data-url') == 'pageLineaVer' && storage.isSet("log")) {
            if (storage.get("log")) {
                iwContenidoTotal += dudea + '<strong id="dudeCa">' + primerBus.codigo + '</strong> - <span id="dudetma">' + primerBus.tiempo.toMMSS() + '</span>' + dudeb
            }
        }
        //TODO: btn Reproducir audio
        //iwContenidoTotal += '<div id="textoReproducir" style="display:none">' + SolicitarTextoInformacionParadaLight(data, idLinea, posicion) + '</div>'
    }
    return iwContenidoTotal
}
function AbrirInfoDot() {
    $(".popupDotMenu").show()
    infodotAbierto = true;
}
function CerrarInfoDot() {
    $(".popupDotMenu").hide()
    infodotAbierto = false;
}
function ObtenerHtmlInformacionBus(coche, codLinea) {
    //infoCoche = ObtenerInfoCoche(codBus)
    var rampa = 'Sí'
    if (coche.CB < 130) {
        rampa = 'No disponible'
    }
    html = '<div class="h4Blue" style = "text - align: center">'
            + '<span class="icon-c closePopup" style="display: none" ></span >'
            + '<p class="headPopup" style="padding-right: 30px; text-align: center; width: 100%; padding-left: 0px !important">Información del Autobús</p>'
            //+'<span class="icon-3dots dotsPopup" style="right: 17px; " onclick="AbrirInfoDot()"></span>'
            //+'<div class="dotClosePopup" onclick="CerrarInfoDot()"></div>'
            //+'<div class="popupDotMenu" style="right: 28px; ">'
            //+ '<p onclick="VerStreetView('+coche.XY[1] + ',' + coche.XY[0] + ',' + { cod: 146, ori: 196 } + ')">Street View</p>'
            //+'</div>'
        + '</div>'
    linea = ObtenerItinerario(codLinea)
    parada = ObtenerParada(coche.CPS)
    html += '<p class="nombreLinea nombreLineaPopup" style="background-color:#' + linea.BC + ';color:#' + linea.FC + ';text-shadow:1px 0px ' + ColorLuminance('#' + linea.BC, -0.2) + '">L-' + linea.Abr + ': ' + linea.Nom + '</p>'
        + '<div class="infoBus">'
                + '<p class="pbPopBus"><b>Código del autobús: </b>' + coche.CB + '</p>'
                + '<p class="pbPopBus"><b>Próxima parada: </b></p><p class="pPopBus">' + parada.Nom + '</p>'
                + '<p class="pbPopBus"><b><b>Tiempo: </b></b></p><p class="pPopBus">' + coche.TPS.toHHorMMorSS() + '</p>'
                + '<p class="pbPopBus"><b><b>Rampa de Accesibilidad: </b></b></p><p class="pPopBus">' + rampa + '</p></div>'
                + '<p class="ultimaHoraPopup">Última actualización: ' + new Date().getHours() + ":" + pad(new Date().getMinutes(), 2) + ":" + pad(new Date().getSeconds(), 2) + '</p>'
        + '</div>'

    return html
}
function ObtenerBusEsquema(codigo, clave) {
    window.clearInterval(idLineas)
    tiempo = Date.now() - ultFechaBusMapa;
    if (tiempo <= (tiempoRecargaMilis - 500) && storage.isSet("BSE" + codigo)) {
        MostrarAutobusEsquema(storage.get("BSE" + codigo), clave)

    } else {
        JSZipUtils.getBinaryContent(urlDatos + 'api/JQ/JSONQRYZIP/ESTGRAL|' + clave + '?i=' + Math.random() + '&' + servidor + '&p=' + plataforma + '&v=' + version, function (err, data) {
            var elt = document.getElementById('jszip_utils');
            if (err) {
                ErrorServidor('noRespuesta', 'PUGR01', '')
                return;
            } else {
                try {
                    JSZip.loadAsync(data)
                        .then(function (zip) {
                            return zip.file("datos.json").async("string")
                        })
                        .then(function success(text) {
                            try {
                                data = JSON.parse(text.substring(1))
                                ultFechaBusMapa = Date.now()
                                $.each(data.EL[0].EC, function (ec, bus) {
                                    bus.TPS = getSeconds(data.FH, bus.TPS).toString()
                                    bus.TPF = getSeconds(data.FH, bus.TPF).toString()
                                    if (bus.CB == codigo) {
                                        storage.set("BSE" + bus.CB, bus)
                                        MostrarAutobusEsquema(bus, clave)
                                        return false
                                    }
                                })
                            } catch (ex) {
                                console.log(ex + "" + text.toString())
                            }
                        }, function error(e) {
                            ErrorServidor('errorZip', 'PUGR01', 'ocurrencia baja')
                        });
                } catch (e) {
                    ErrorServidor('errorDesconocido', 'PUGR01', e)
                }
            }
        });
    }
}
function MostrarAutobusEsquema(data, clave) {
    htmlTexto = ObtenerHtmlInformacionBus(data, clave)
    Swal.fire({
        html: htmlTexto,
        showConfirmButton: false,
        customClass: 'SwalInformacionAutobus',
        animation: !Swal.isVisible()
        //showCloseButton:true
    }).then((result) => {
        console.log("Me han cerrado :(")
        CerrarInfoDot()
        window.clearInterval(idLineas)
        if (storage.isSet('UTH' + storage.get('LineaVer'))) {
            tiempo = tiempoRecargaMilis - (Date.now() - storage.get('UTH' + storage.get('LineaVer')));
            console.log("tiempo para refresco:" + tiempo)
            if (tiempo > 0) {
                idLineas = TimeoutRecargarLineaAutomaticamente(tiempo);
            } else {
                idLineas = TimeoutRecargarLineaAutomaticamente(0);
            }
        } else {
            idLineas = TimeoutRecargarLineaAutomaticamente(0);
        }
    })
    idLineas = TimeoutRecargarBusEsquemaAutomaticamente(data.CB, clave)
}
function TimeoutRecargarBusEsquemaAutomaticamente(codigo, clave) {
    tiempo = tiempoRecargaMilis
    return window.setInterval(function () {
        ObtenerBusEsquema(codigo, clave);
    }, tiempo);
}
//TODO: popup offline
function AbrirParadaOffline(codParada, codLinea, posicion) {
    paradaActual = codParada;
    listaLineasFavoritos = null
    storage.set('CodUltParadaPulsada', codParada);
    lineaActual = codLinea;
    paradaABuscar = ObtenerParada(codParada);
    Swal.fire({
        html: SolicitarHTMLInformacionOffline(paradaABuscar, lineaActual),
        showConfirmButton: false,
        customClass: 'SwalInformacionParada'
        //showCloseButton:true
    }).then((result) => {
        console.log("Me han cerrado :(")
        CerrarInfoDot()
        window.clearInterval(idLineas)
    })
}
function SolicitarHTMLInformacionOffline(parada, idLinea) {
    var html = ""
    var data = parada;
    codParada = parada.CP
    miLinea = ObtenerItinerario(idLinea)
    var iwContenido1 = '<div class="iw">' +
        '<div class="h4Blue" style="text-align:center">' +
        '<span class="icon-c closePopup" onclick="Swal.clickConfirm()"></span>' +
        '<h4 class="headPopup">' + data.Nom + ' (' + data.CP + ')</h4>' + "</div></div>"
    var iwLinea = '<p class="nombreLinea nombreLineaPopup" style="background-color:#' + miLinea.BC + ';color:#' + miLinea.FC + ';text-shadow:1px 0px ' + ColorLuminance('#' + miLinea.BC, -0.2) + '">L-' + miLinea.Abr + ': ' + miLinea.Nom + '</p>';
    var iwContenidoRegulacion = '<p class="regulacion">regulación</p>';
    var iwDireccion = "";
    var iwDistancia = "";
    var iwMenu = '<div class="MenuParada"><center>';
    var iwContenidoTotal = ""
    iwContenidoTotal += iwContenido1;

    iwContenidoTotal += iwLinea;
    html += iwContenidoTotal + '<p style="color:red">Sin conexión de red, conecta tu dispositivo a una red para obtener mayor información</p>'
    return html + '<p style="font-size: small;margin-top: 0px;padding-top: 15px;margin-bottom: 5px;">Última actualización: ' + new Date().getHours() + ":" + pad(new Date().getMinutes(), 2) + ":" + pad(new Date().getSeconds(), 2) + "</span>";

}
function SeleccionarParada(idBoton) {
    if (ultimaSeleccionada != "") {
        $("#" + ultimaSeleccionada).removeClass("btnEsquemaPulsado")
    }
    ultimaSeleccionada = idBoton;
    $("#" + ultimaSeleccionada).addClass("btnEsquemaPulsado");
}
function TimeoutRecargarLineaAutomaticamente(timeout) {
    tiempo = tiempoRecargaMilis
    if (timeout != null && timeout >= 0) {
        tiempo = timeout
    }
    return window.setInterval(function () {
        RecargarModoLineasAutomaticamente();
    }, tiempo);
}
function TimeoutRecargarParadaAutomaticamente(codigo, linea, posicion, sentido) {
    tiempo = tiempoRecargaMilis
    return window.setInterval(function () {
        RecargarParadaMostradaAutomaticamente(codigo, linea, posicion, sentido);
    }, tiempo);
}
function RecargarModoLineasAutomaticamente() {
    //SolicitarDatosLineaPageLineas($("#selectLineaPageRutas").children(":selected").val());
    value = storage.get('LineaVer')
    window.clearInterval(idLineas)
    if (online) {
        ObtenerLineaConParada(value, 'recargar lineaVer');
    } else {
        verLineaOffline()
    }
}
function RecargarParadaMostradaAutomaticamente(codigo, linea, posicion, sentido) {
    value = storage.get('LineaVer')
    window.clearInterval(idParadas)
    if (online) {
        LineaParadaPulsada(codigo, linea, posicion, sentido)
    } else {
        AbrirParadaOffline()
    }
}
/////////////////////////////////////////////////////////////////////////////MAPA///////////////////////////////////////////////////////////////
//#region MAPA
var mapa = null, initLat = 37.2667696, initLng = -6.9401195; LSUltLocalizacion = null; LSVerCercanas = true; idMapa = null, idMapaParada = null; ultFechaBusMapa = null; autobusesActuales = null;
var layerGPS = null; var layersItinerarios = []; var layersSeleccionados = []
var ballgeo = L.icon({
    iconUrl: 'img/gpsloc_azul.png',
    iconSize: [20, 20], // size of the icon
    iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
});
var wave = L.icon({
    iconUrl: 'img/wave.gif',
    iconSize: [60, 60], // size of the icon
    iconAnchor: [30, 30], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 30] // point from which the popup should open relative to the iconAnchor
});
var balldestino = L.icon({
    iconUrl: 'img/gpsloc_rojo.png',
    iconSize: [20, 20], // size of the icon
    iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 10] // point from which the popup should open relative to the iconAnchor
});
var simpleMarker = L.icon({
    iconUrl: 'img/bus64.png',
    iconSize: [22, 32], // size of the icon
    iconAnchor: [11, 32], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
});
var refMarker = L.icon({
    iconUrl: 'img/busr64.png',
    iconSize: [22, 32], // size of the icon
    iconAnchor: [11, 32], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
});

function InicializarMapa() {
    if (mapa == null) {
        mapa = L.map('mapCanvas').setView([initLat, initLng], 14);
        layerGPS = L.layerGroup().addTo(mapa);
        //L.tileLayer('https://tile.tecnosis.net/hot/{z}/{x}/{y}.png', {
        //    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        //    id: 'mapa.map'
        //}).addTo(mapa);
        L.tileLayer(urlMapas + 'osm_tiles/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            id: 'mapa.map'
        }).addTo(mapa);
        if (LSUltLocalizacion != null) {
            var latlng = new L.LatLng(LSUltLocalizacion[0], LSUltLocalizacion[1]);
            var marker = L.marker(latlng, { icon: ballgeo, draggable: true }).addTo(layerGPS);
            AñadirEventosGeo(marker)
            ObtenerCercanas()
        }
        mapa.on('zoomend', function () {
            ZoomCambiado(mapa.getZoom());
        });
        mapa.on('contextmenu', function (e) {//longpress
            console.log("trigger")
            layerGPS.clearLayers()
            var latlng = e.latlng
            var marker = L.marker(latlng, { icon: ballgeo, draggable: true }).addTo(layerGPS);
            AñadirEventosGeo(marker)
            LSUltLocalizacion = [latlng.lat, latlng.lng];
            storage.set("lstLoc", [latlng.lat, latlng.lng]);
            ObtenerCercanas()
        });
        $("#txtBuscarParada").on("paste keyup", function () {
            var valor = this.value
            //if (valor.length % 3 == 0) {
            if (valor.length >= 3) {
                BuscarOrigenMapa(valor)
            }
        });
        $("#txtBuscarParada").autocomplete({
            source: arraySugerenciasMapa//.concat(paradasSugeridas)
        });
        DibujarCuadrosLineasSeleccionadas()
    }
}
var arraySugerenciasMapa = []
var arrayUbicacionesMapa = []
function BuscarOrigenMapa(texto) {
    arrayUbicaciones = []
    arraySugerencias = []
    urlGeo = urlSrch + 'q=' + texto + '&lon=-6.941150856&lat=37.2635917&limit=20'
    $.getJSON(urlGeo, function (data) {
        data = data.features
        console.log('------------------------------------')
        for (var bo = 0; bo < data.length; bo++) {
            //console.log(data[bo].display_name)
            var dt = data[bo]
            if (dt.properties.city == "Huelva") {
                arrayUbicaciones.push(dt)
                if (dt.properties.street == null) {
                    arraySugerencias.push(dt.properties.name)
                } else {
                    arraySugerencias.push(dt.properties.name + ", " + dt.properties.street)
                }
            }
        }
        arraySugerencias = arraySugerencias.concat(SugerirParada(texto))
        if (arrayUbicaciones.length != 0) {
            arraySugerenciasMapa = arraySugerencias
            arrayUbicacionesMapa = arrayUbicaciones
            $('#txtBuscarParada').autocomplete("option", {
                source: SearchMatch,
                select: function (event, ui) {
                    console.log(ui.item.label)
                    if (ui.item.label.indexOf(" - ") == -1) {//normal

                        for (var suo = 0; suo < arrayUbicacionesMapa.length; suo++) {
                            if (arrayUbicacionesMapa[suo].properties.name == ui.item.label || arrayUbicacionesMapa[suo].properties.name + ", " + arrayUbicacionesMapa[suo].properties.street) {
                                $('#txtBuscarParada').val(ui.item.label)

                                layerGPS.clearLayers()
                                var latlng = new L.LatLng(arrayUbicacionesMapa[suo].geometry.coordinates[1], arrayUbicacionesMapa[suo].geometry.coordinates[0])
                                var marker = L.marker(latlng, { icon: ballgeo, draggable: true }).addTo(layerGPS);
                                AñadirEventosGeo(marker)
                                LSUltLocalizacion = [latlng.lat, latlng.lng];
                                storage.set("lstLoc", [latlng.lat, latlng.lng]);
                                ObtenerCercanas()
                            }
                        }
                    } else {//Paradas
                        cpar = ui.item.label.split(" - ")[1]
                        par = ObtenerParada(cpar)
                        $('#txtBuscarParada').val(ui.item.label)

                        layerGPS.clearLayers()
                        var latlng = new L.LatLng(par.XY[1], par.XY[0]);
                        var marker = L.marker(latlng, { icon: ballgeo, draggable: true }).addTo(layerGPS.clearLayers());
                        AñadirEventosGeo(marker)
                        LSUltLocalizacion = [latlng.lat, latlng.lng];
                        storage.set("lstLoc", [latlng.lat, latlng.lng]);
                        ObtenerCercanas()
                    }
                    return false;
                }
            });
        }
    });
}

function GetLocation() {
        navigator.geolocation.getCurrentPosition(function (location) {
            var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
            layerGPS.clearLayers()
            var marker = L.marker(latlng, { icon: ballgeo, draggable: true }).addTo(layerGPS);
            AñadirEventosGeo(marker)
            mapa.setView(latlng, mapa.getZoom());
            LSUltLocalizacion = [location.coords.latitude, location.coords.longitude];
            storage.set("lstLoc", [location.coords.latitude, location.coords.longitude]);
            ObtenerCercanas()
        });
}
var layersParadasCercanas = []
function ObtenerCercanas() {
    var arrayCordenadas = [];
    var arrayCodigos = []
    OcultarRutasParadasCercanas()
    layersParadasCercanas = []
    Origen = LSUltLocalizacion[1] + "," + LSUltLocalizacion[0]
    for (var i = 0; i < LSParadas.length; i++) {
        var par = LSParadas[i]
        if (par.Iti.length > 0) {
            arrayCodigos.push(par)
            arrayCordenadas.push(par.XY[0] + "," + par.XY[1])
        }
    }
    arrayCodigos = JSON.parse(JSON.stringify(arrayCodigos))
    var output = arrayCordenadas.join(";");

    urlhtmlOri = urlRutas + 'table/v1/foot/' + Origen + ";" + output + '?destinations=0'
    ObtenerDistanciasAPunto(urlhtmlOri, "origen")

    for (var i = 0; i < arrayCodigos.length; i++) {
        //(arrayCodigos(CoorAOrigen
        arrayCodigos[i].duracionOrigen = CoorAOrigen.durations[i + 1][0]
    }

    parCercOrigen = arrayCodigos.slice(0).sort((a, b) => (a.duracionOrigen > b.duracionOrigen) ? 1 : -1)

    LineasParadasCercanas = []

    for (var i = 0; i < LSLineas.length; i++) {
        iti = LSLineas[i]
        lin = { linea: iti, paradasOrigen: [] }
        for (var t = 0; t < parCercOrigen.length; t++) {
            if (parCercOrigen[t].Iti.includes(lin.linea.Cla)) {
                parCercOrigen[t].PosOrigen = ObtenerPosicionParada(iti, parCercOrigen[t].CP)
                lin.paradasOrigen.push(JSON.parse(JSON.stringify(parCercOrigen[t])))
            }

            if (lin.paradasOrigen.length == 4) { break; }
        }
        LineasParadasCercanas.push(lin)
    }
    //Ahora vamos a crear la información de paradas más cercanas
    for (var i = 0; i < LineasParadasCercanas.length; i++) {
        var iti = LineasParadasCercanas[i].linea
        var paradas = LineasParadasCercanas[i].paradasOrigen
        layer = L.layerGroup()
        var latslngs = []
        for (var t = 0; t < 2; t++) {
            var latlng = new L.LatLng(paradas[t].XY[1], paradas[t].XY[0]);
            latslngs.push(paradas[t].XY[0] + "," + paradas[t].XY[1])
            var marker = L.marker(latlng, { icon: wave, Cla: iti.Cla, Pos: pos, Sen: (i + 1), zIndexOffset: 0 }).addTo(layer)
        }
        layersParadasCercanas.push({ Clave: iti.Cla, Marcadores: layer, Rutas: null, LatLng: latslngs, Color: iti.BC, Paradas: paradas.slice(0, 2) })
    }
    if (LSVerCercanas == true) {
        MostrarRutasParadasCercanas()
    }
}
function MostrarRutasParadasCercanas() {
    for (var i = 0; i < layersSeleccionados.length; i++) {
        for (var i2 = 0; i2 < layersParadasCercanas.length; i2++) {
            if (layersSeleccionados[i] == layersParadasCercanas[i2].Clave) {
                layersParadasCercanas[i2].Marcadores.addTo(mapa)
                if (layersParadasCercanas[i2].Rutas == null) {
                    dat1 = ObtenerRutaCercana(LSUltLocalizacion[1] + "," + LSUltLocalizacion[0], layersParadasCercanas[i2].LatLng[0])
                    dat2 = ObtenerRutaCercana(LSUltLocalizacion[1] + "," + LSUltLocalizacion[0], layersParadasCercanas[i2].LatLng[1])

                    layerRutaParada1 = L.layerGroup().addTo(mapa);
                    layerRutaMarcadores1 = L.layerGroup();
                    layerRutaParada2 = L.layerGroup().addTo(mapa);
                    layerRutaMarcadores2 = L.layerGroup();

                    DibujarRutaPolilinea(dat1, layerRutaParada1, layerRutaMarcadores1, layersParadasCercanas[i2].Color)
                    DibujarRutaPolilinea(dat2, layerRutaParada2, layerRutaMarcadores2, layersParadasCercanas[i2].Color)

                    layersParadasCercanas[i2].Rutas = []
                    layersParadasCercanas[i2].Rutas.push(layerRutaParada1)
                    layersParadasCercanas[i2].Rutas.push(layerRutaParada2)

                    layersParadasCercanas[i2].Duraciones = []
                    layersParadasCercanas[i2].Duraciones.push(dat1.routes[0].duration)
                    layersParadasCercanas[i2].Duraciones.push(dat2.routes[0].duration)

                    layersParadasCercanas[i2].Distancia = []
                    layersParadasCercanas[i2].Distancia.push(dat1.routes[0].distance)
                    layersParadasCercanas[i2].Distancia.push(dat2.routes[0].distance)
                } else {
                    layersParadasCercanas[i2].Rutas[0].addTo(mapa)
                    layersParadasCercanas[i2].Rutas[1].addTo(mapa)
                }
                break;
            }
        }
    }
}
function OcultarRutasParadasCercanas() {
    for (var i2 = 0; i2 < layersParadasCercanas.length; i2++) {
        mapa.removeLayer(layersParadasCercanas[i2].Marcadores)
        if (layersParadasCercanas[i2].Rutas != null) {
            mapa.removeLayer(layersParadasCercanas[i2].Rutas[0])
            mapa.removeLayer(layersParadasCercanas[i2].Rutas[1])
        }
    }
}
function ObtenerRutaCercana(LatLngOr, LatLngDes) {
    var dt = null;
    $.ajax({
        type: 'GET',
        url: urlRutas + 'route/v1/footer/' + LatLngOr + ";" + LatLngDes + '?steps=true&alternatives=true&geometries=geojson',
        dataType: "json",
        timeout: tiempoRecargaMilis,
        success: function (data) {
            dt = data
        },
        error: function (xmlhttprequest, textstatus, message) {
            //TODO: Esto deberia dar un error tipo "toast" en lugar de esto, ya paso que la app daba error de conexión aqui y aprecia que la app estaba rota, pero solo eran las noticias
        },
        async: false
    });
    return dt
}
function LineaMapaPulsada(idLinea) {
    var layerExistente = ObtenerLayer(idLinea)

    if (layerExistente == null) {
        layersItinerarios.push(CrearLayer(idLinea, mapa))
        $('#linMapa-' + idLinea.toString().replace(".", "-")).addClass('LinSelected')
        layersSeleccionados.push(idLinea)
        storage.set('LS', layersSeleccionados)
        ZoomCambiado(mapa.getZoom())
    } else if (!mapa.hasLayer(layerExistente)) {
        MostrarLayer(idLinea)
    } else {
        OcultarAutobuses(idLinea)
        OcultarLayer(idLinea)
        DibujarCuadrosLineasSeleccionadas()
    }
    if (LSVerCercanas) {
        OcultarRutasParadasCercanas()
        MostrarRutasParadasCercanas()
    }
}
function DibujarCuadrosLineasSeleccionadas() {
    var html = ""
    var layersOrdenados = JSON.parse(JSON.stringify(layersSeleccionados)).sort((a, b) => (a > b) ? 1 : -1)
    for (var ls = 0; ls < layersOrdenados.length; ls++) {
        var iti = ObtenerItinerario(layersOrdenados[ls])
        html += ' <i class="square sqrpulsado" onclick="LineaMapaPulsada(' + iti.Cla + ')" style="background-color: #' + iti.BC + '; color: #' + iti.FC + ';">' + iti.Abr + '</i>'
    }
    $('.lineasMostradas').empty()
    $('.lineasMostradas').append(html)
    altura = window.innerHeight - 255
    alturaCuadro = 40 * layersSeleccionados.length
    if (altura < alturaCuadro) {
        $('.lineasMostradas').css('height', window.innerHeight - 255 + "px")
    } else {
        $('.lineasMostradas').css("height", "");
    }
}
function ObtenerLayer(idLinea) {
    for (var r = 0; r < layersItinerarios.length; r++) {
        if (layersItinerarios[r].id == idLinea) {
            return layersItinerarios[r].layer;
        }
    }
    return null
}
function CrearLayer(idLinea, objetoMapa) {
    //Esta función se encarga de crear los layes y almacenarlos, luego podrán quitarse y añadirse a voluntad
    layerCreado = L.layerGroup().addTo(objetoMapa);
    layerZoom1 = L.layerGroup().addTo(objetoMapa);
    layerZoom2 = L.layerGroup().addTo(objetoMapa);
    layerZoom3 = L.layerGroup().addTo(objetoMapa);
    layerMarcadores = L.layerGroup().addTo(objetoMapa);
    latlngs = []
    var it = ObtenerItinerario(idLinea)
    var pos = 0
    for (var i = 0; i < it.Sen.length; i++) {
        for (var i2 = 0; i2 < it.Sen[i].Tray.length; i2++) {
            var icon = simpleMarker
            if (i2 == 0) { icon = refMarker }
            parada = it.Sen[i].Par[i2]
            AñadirMarkerMapa(parada, layerZoom1, layerZoom2, layerZoom3, layerMarcadores, icon, it, i, i2, pos)
            pos = pos + 1
        }
        latlngs = latlngs.concat(it.Sen[i].XY)

        if (it.Sen.length == 1) {
            parada = it.Sen[0].Par[it.Sen[0].Par.length - 1]
            AñadirMarkerMapa(parada, layerZoom1, layerZoom2, layerZoom3, layerMarcadores, refMarker, it, 0, it.Sen[0].Par.length - 1, pos)
        }
        else if (it.Sen.length == 2 && i == 1) {
            paradaInicio = it.Sen[0].Par[0]
            paradaFin = it.Sen[1].Par[it.Sen[1].Par.length - 1]
            if (paradaInicio.CP != paradaFin.CP) {
                AñadirMarkerMapa(paradaFin, layerZoom1, layerZoom2, layerZoom3, layerMarcadores, refMarker, it, 1, it.Sen[1].Par.length - 1, pos)
            }
        }
        else if (it.Sen.length == 2 && i == 0) {
            paradaFinIda = it.Sen[0].Par[it.Sen[0].Par.length - 1]
            paradaInicioVuelta = it.Sen[1].Par[0]
            if (paradaFinIda.CP != paradaInicioVuelta.CP) {
                AñadirMarkerMapa(paradaFinIda, layerZoom1, layerZoom2, layerZoom3, layerMarcadores, refMarker, it, 1, it.Sen[1].Par.length - 1, pos)
            }
        }
    }
    var polyline = L.polyline(latlngs, { stroke: true, color: "#" + it.BC, opacity: 0.7, className: "pruebaclase" }).addTo(layerCreado);
    return { id: idLinea, layer: layerCreado, markers: layerMarcadores, zoom1: layerZoom1, zoom2: layerZoom2, zoom3: layerZoom3, bounds: polyline.getBounds() }
}
function AñadirMarkerMapa(parada, layerZoom1, layerZoom2, layerZoom3, layerMarcadores, icon, it, i, i2, pos) {
    var latlng = new L.LatLng(parada.XY[1], parada.XY[0]);
    var marker = L.marker(latlng, { icon: icon, Cla: it.Cla, CP: it.Sen[i].Par[i2].CP, Pos: pos, Sen: (i + 1), zIndexOffset: 0 }).addTo(layerMarcadores).on('click', function (e) { VerParadaMarker(e.target.options.Cla, e.target.options.CP, e.target.options.Pos, e.target.options.Sen, e) });
    marker.setZIndexOffset(666)
    var testoMarker = L.marker(latlng, {
        icon: new L.DivIcon({
            className: 'my-div-iconj',
            html: '<div class="iw textoMarker"><p>' + (pos + 1) + ' - ' + parada.Nom + '</p></div>',
            iconAnchor: [-10, 35],
            zIndexOffset: 1
        }), Cla: it.Cla, CP: it.Sen[i].Par[i2].CP, Pos: pos, Sen: (i + 1)
    })
    switch (parada.Nivel) {
        case 1:
            testoMarker.addTo(layerZoom1)
            break;
        case 2:
            testoMarker.addTo(layerZoom2)
            break;
        default:
            testoMarker.addTo(layerZoom3)
            break;
    }
}
function MostrarLayer(id) {
    for (var r = 0; r < layersItinerarios.length; r++) {
        if (layersItinerarios[r].id == id) {
            mapa.addLayer(layersItinerarios[r].layer);
            break;
        }
    }

    $('#linMapa-' + id.toString().replace(".", "-")).addClass('LinSelected')
    layersSeleccionados.push(id)
    storage.set('LS', layersSeleccionados)
    MostrarParadasCoches()
    ZoomCambiado(mapa.getZoom())
}
function OcultarLayer(id) {
    var index = null;
    for (var r = 0; r < layersItinerarios.length; r++) {
        if (layersItinerarios[r].id == id) {
            mapa.removeLayer(layersItinerarios[r].layer);
            mapa.removeLayer(layersItinerarios[r].markers);
            mapa.removeLayer(layersItinerarios[r].zoom1);
            mapa.removeLayer(layersItinerarios[r].zoom2);
            mapa.removeLayer(layersItinerarios[r].zoom3);
            break;
        }
    }
    $('#linMapa-' + id.toString().replace(".", "-")).removeClass('LinSelected')
    var index = layersSeleccionados.indexOf(id);
    if (index > -1) {
        layersSeleccionados.splice(index, 1);
    }
    storage.set('LS', layersSeleccionados)
}
function VerParadaMarker(claveLin, codigoPar, posicion, sentido, e) {
    //console.log('entra')
    var m = e.sourceTarget
    var popup = m.getPopup()
    if (popup == null || !popup.isOpen()) {
        LineaParadaPulsada(codigoPar, claveLin, posicion, sentido, 1, { marker: e.sourceTarget })
    }
}
function TimeoutRecargarParadaMapaAutomaticamente(codigo, linea, posicion, sentido, marker) {
    tiempo = tiempoRecargaMilis
    return window.setInterval(function () {
        RecargarParadaMapaMostradaAutomaticamente(codigo, linea, posicion, sentido, marker);
    }, tiempo);
}
function RecargarParadaMapaMostradaAutomaticamente(codigo, linea, posicion, sentido, markerSel) {
    window.clearInterval(idMapaParada)
    if (online) {
        LineaParadaPulsada(codigo, linea, posicion, sentido, 1, { marker: markerSel })
    } else {
        AbrirParadaOffline()
    }
}
function DibujarLineasSeleccionadas() {
    for (var ls = 0; ls < layersSeleccionados.length; ls++) {
        idLinea = layersSeleccionados[ls]
        layersItinerarios.push(CrearLayer(idLinea, mapa))
        $('#linMapa-' + idLinea.toString().replace(".", "-")).addClass('LinSelected')
        ZoomCambiado(mapa.getZoom())
    }
}
function PedirAutobusesMapa() {
    if (mostrarBus) {
        var idLineasDibujar = ""
        for (var ls = 0; ls < layersSeleccionados.length; ls++) {
            idLinea = layersSeleccionados[ls]
            idLineasDibujar += "|" + idLinea
        }
        //idLineasDibujar = idLineasDibujar.substring(0, idLineasDibujar.length - 1)
        if (idLineasDibujar != "") {
            ObtenerAutobusesMapa(idLineasDibujar)
        }
    }
}
function DibujarAutobusesMapa(data) {
    var marker
    var texto
    for (var ls = 0; ls < layersSeleccionados.length; ls++) {
        var layerBus = L.layerGroup().addTo(mapa);
        var linea = layersSeleccionados[ls].toString().split(".")[0]
        for (var li = 0; li < data.length; li++) {
            linData = data[li]
            lindataCL = linData.CL
            if (linea == lindataCL) {
                itinerario = layersSeleccionados[ls].toString().split(".")[1]
                for (var lic = 0; lic < linData.EC.length; lic++) {

                    var coche = {}
                    Object.assign(coche, linData.EC[lic]);
                    if (itinerario = coche.Iti) {
                        angulo = coche.OB + 90;
                        lat = coche.XY[1]
                        lng = coche.XY[0]
                        iti = ObtenerItinerario(layersSeleccionados[ls])
                        var latlng = new L.LatLng(lat, lng);
                        var markerbus = L.marker(latlng, {
                            zIndexOffset: 1000,
                            icon: new L.DivIcon({
                                className: 'my-div-iconj',
                                html: '<div id="container" style="cursor:pointer;transform: rotate(' + angulo + 'deg);-webkit-transform: rotate(' + angulo + 'deg)">' +
                                      '<img src="img/blue-bus-180-hi.png" alt="bus" class="autobusImg">' +
                                      '<span id="" class="lineaBus bolabus" style="background-color:#' + iti.BC + ';color:#' + iti.FC + ';transform: rotate(' + -angulo + 'deg);-webkit-transform: rotate(' + -angulo + 'deg)">' + iti.Abr + '</span>' + '</div>',
                                iconAnchor: [21.5, 11],

                            }),
                            CB: coche.CB,
                            Coche: coche
                        }).addTo(layerBus).on('click', function (e) {
                            MostrarInformacionBusMapa(e.target.options.Coche, linea + "." + itinerario, e)
                        });

                    }
                }
            }
        }
        AgregarLayerBus(layersSeleccionados[ls].toString(), layerBus)
        if (cocheMostrado != null) {
            layers = layerBus.getLayers()
            for (var a = 0; a < layers.length; a++) {
                if (layers[a].options.CB == cocheMostrado) {
                    htmltexto = ObtenerHtmlInformacionBus(layers[a].options.Coche, linea + "." + itinerario)
                    var popup = layers[a].getPopup()
                    layers[a].bindPopup(htmltexto).on('popupclose', function (e) { cocheMostrado = null }).openPopup();
                }
            }
        }
    }

    window.clearInterval(idMapa)
    idMapa = TimeoutRecargarBusMapaAutomaticamente()
}
function TimeoutRecargarBusMapaAutomaticamente() {
    tiempo = tiempoRecargaMilis
    return window.setInterval(function () {
        RecargarBusMapaAutomaticamente();
    }, tiempo);
}
function RecargarBusMapaAutomaticamente(codigo, linea, posicion, sentido, markerSel) {
    window.clearInterval(idMapa)
    if (online) {
        PedirAutobusesMapa()
    } else {
        OcultarAutobuses()
    }
}
function AgregarLayerBus(clave, layerBus) {
    for (var alb = 0; alb < layersItinerarios.length; alb++) {
        layer = layersItinerarios[alb]
        if (layer.id == clave) {
            if (layer.autobuses != null) {
                var cm = cocheMostrado
                mapa.removeLayer(layer.autobuses)
                cocheMostrado = cm
            }

            layer.autobuses = layerBus

        }
    }
}
function ZoomCambiado(zoom) {
    if (zoom <= 12) {
        //Solo muestra la linea (ni marcadores ni nada).
        OcultarParadas();
    } else if (zoom == 13) {
        //    //Aparecen las paradas y los coches
        MostrarParadasCoches();
    }
    else if (zoom >= 14 && zoom <= 17) {
        //    //Cambiar niveles de zoom
        nivel = zoom - 13;
        AbrirInfoBoxesNivel(nivel);//De momento
    } else if (zoom >= 18) {
        //    //todas
        AbrirInfoBoxesNivel(5);
    }
}
function OcultarParadas() {
    for (var oP1 = 0; oP1 < layersSeleccionados.length; oP1++) {
        for (var oP = 0; oP < layersItinerarios.length; oP++) {
            if (layersItinerarios[oP].id == layersSeleccionados[oP1]) {
                mapa.removeLayer(layersItinerarios[oP].markers)
                mapa.removeLayer(layersItinerarios[oP].zoom1)
                mapa.removeLayer(layersItinerarios[oP].zoom2)
                mapa.removeLayer(layersItinerarios[oP].zoom3)
                if (layersItinerarios[oP].autobuses != null) {
                    mapa.removeLayer(layersItinerarios[oP].autobuses)
                }
            }
        }
    }
}
function OcultarAutobuses(clave) {
    for (var oP1 = 0; oP1 < layersSeleccionados.length; oP1++) {
        for (var oP = 0; oP < layersItinerarios.length; oP++) {
            if (layersItinerarios[oP].id == layersSeleccionados[oP1]) {
                if (layersItinerarios[oP].autobuses != null && (clave == null || layersItinerarios[oP].id == clave)) {
                    mapa.removeLayer(layersItinerarios[oP].autobuses)
                }
            }
        }
    }
}
function MostrarParadasCoches() {
    for (var mP1 = 0; mP1 < layersSeleccionados.length; mP1++) {
        for (var mP = 0; mP < layersItinerarios.length; mP++) {
            if (layersItinerarios[mP].id == layersSeleccionados[mP1]) {
                mapa.addLayer(layersItinerarios[mP].markers)
                if (layersItinerarios[mP].autobuses != null) {
                    mapa.addLayer(layersItinerarios[mP].autobuses)
                }
            }
        }
    }
}
function CerrarInfoBoxesMapa() {
    for (var cIBM1 = 0; cIBM1 < layersSeleccionados.length; cIBM1++) {
        for (var cIBM = 0; cIBM < layersItinerarios.length; cIBM++) {
            if (layersItinerarios[cIBM].id == layersSeleccionados[cIBM1]) {
                mapa.removeLayer(layersItinerarios[cIBM].zoom1)
                mapa.removeLayer(layersItinerarios[cIBM].zoom2)
                mapa.removeLayer(layersItinerarios[cIBM].zoom3)
            }
        }
    }
}
function AbrirInfoBoxesNivel(nivel) {
    CerrarInfoBoxesMapa()
    for (var aIBN1 = 0; aIBN1 < layersSeleccionados.length; aIBN1++) {
        for (var aIBN = 0; aIBN < layersItinerarios.length; aIBN++) {
            if (layersItinerarios[aIBN].id == layersSeleccionados[aIBN1]) {
                if (nivel >= 1) {
                    mapa.addLayer(layersItinerarios[aIBN].zoom1)
                }
                if (nivel >= 2) {
                    mapa.addLayer(layersItinerarios[aIBN].zoom2)
                }
                if (nivel >= 3) {
                    mapa.addLayer(layersItinerarios[aIBN].zoom3)
                }
            }
        }
    }
}

var cocheMostrado = null
function MostrarInformacionBusMapa(data, idlinea, e) {
    cocheMostrado = data.CB
    htmltexto = ObtenerHtmlInformacionBus(data, idlinea)
    markerBus = e.target
    var popup = markerBus.getPopup()
    if (popup == null) {
        markerBus.bindPopup(htmltexto).on('popupclose', function (e) { cocheMostrado = null }).openPopup();
    } else {
        popup.setContent(htmltexto).openPopup();
    }
}
function TrigerMostrarCercanas() {
    LSVerCercanas = !LSVerCercanas
    storage.set("LSVC", LSVerCercanas)
    if (LSVerCercanas == false) {
        $("#btnCercanas").addClass("btnOff")
        OcultarRutasParadasCercanas()
    } else {
        $("#btnCercanas").removeClass("btnOff")
        MostrarRutasParadasCercanas()
    }
}
function AñadirEventosGeo(marker) {
    marker.setZIndexOffset(777)
    marker.on('dragstart', function (e) {
        OcultarRutasParadasCercanas()
    });
    marker.on('dragend', function (e) {
        layerGPS.clearLayers()
        var latlng = e.target.getLatLng()
        var marker = L.marker(latlng, { icon: ballgeo, draggable: true }).addTo(layerGPS);
        AñadirEventosGeo(marker)
        LSUltLocalizacion = [latlng.lat, latlng.lng];
        storage.set("lstLoc", [latlng.lat, latlng.lng]);
        ObtenerCercanas()
    });
    marker.on('click', function (e) {
        var m = e.sourceTarget
        var popup = m.getPopup()
        if (popup == null || !popup.isOpen()) {
            var latlng = e.target.getLatLng()
            if (layersSeleccionados.length > 0) {
                htmltexto = ObtenerHtmlInformaciónCercanas();
                if (popup == null) {
                    m.bindPopup(htmltexto).openPopup();
                } else {
                    popup.setContent(htmltexto).openPopup();
                }
            }
        }
    });

}
//    if (ipAddress) {
//        Swal.fire(`Buscando... ${ipAddress}`)
//    }
//}
function ObtenerHtmlInformaciónCercanas() {
    html = '<div class="h4Blue" style="text-align:center"><span class="icon-c closePopup" style="display:none" onclick="Swal.clickConfirm()"></span><h6 class="headPopup">Paradas Cercanas</h6></div>'
    for (var i = 0; i < layersSeleccionados.length; i++) {
        for (var i2 = 0; i2 < layersParadasCercanas.length; i2++) {
            if (layersSeleccionados[i] == layersParadasCercanas[i2].Clave) {
                it = ObtenerItinerario(layersSeleccionados[i])
                html += '<p class="nombreLinea nombreLineaPopup" style="background-color:#' + it.BC + ';color:#' + it.FC + ';text-shadow:1px 0px ' + ColorLuminance('#' + it.BC, -0.2) + '">L-' + it.Abr + ': ' + it.Nom + '</p>'
                html += "<table>"
                for (var i3 = 0; i3 < layersParadasCercanas[i2].Paradas.length; i3++) {
                    par = layersParadasCercanas[i2].Paradas[i3]
                    html += '<tr><td><b>' + Math.floor(par.duracionOrigen / 60) + ' min</b></td><td>(' + par.CP + ')</td><td>' + par.Nom + '</td></tr>'
                }
                html += "</table>"
            }
        }
    }
    return html
}
function CentrarMapa() {
    var bounds = L.latLngBounds()
    for (var i = 0; i < layersItinerarios.length; i++) {
        bounds.extend(layersItinerarios[i].bounds)
    }
    mapa.fitBounds(bounds)

}
function AnimarLista() {
    if ($("#containerLineasMapa").height() != 0) {
        $("#containerLineasMapa").animate({
            height: 0,
        }, 300, "linear", function () {
            $("#containerLineasMapa").hide();
        })
    } else {
        $("#containerLineasMapa").show()
        $("#containerLineasMapa").animate({
            height: window.innerHeight-100,
        }, 300, "linear", function () {
            
        })
    }
}
//#endregion MAPA 
///////////////////////////////////////////////////////COMO LLEGAR///////////////////////////////////////////////////////////////////////////////
var mapaCL = null, idMapaCL = null; var layerCLGPS = null; var layerCLDES = null
var origenElegido = ""
var destinoElegido = ""
var sugerenciasOrigen = []; var ubicacionesOrigen = []; var sugerenciasDestino = []; var ubicacionesDestino = [];
var paradasSugeridas = []
function InicializarMapaComoLlegar() {
    if (mapaCL == null) {
        mapaCL = L.map('mapCanvasCL').setView([initLat, initLng], 14);
        layerCLGPS = L.layerGroup().addTo(mapaCL);
        layerCLDES = L.layerGroup().addTo(mapaCL);
        L.tileLayer(urlMapas + 'osm_tiles/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            id: 'mapa.map'
        }).addTo(mapaCL);
        $(window).on("resize", function () { $("#mapCanvasCL").height($(window).height() - 46); mapaCL.invalidateSize(); }).trigger("resize");
        mapaCL.on('zoomend', function () {
            ZoomCambiadoComoLLegar(mapaCL.getZoom());
        });
        mapaCL.on('contextmenu', function (e) {//longpress
            console.log("trigger")
            layerCLDES.clearLayers()
            var latlng = e.latlng
            var marker = L.marker(latlng, { icon: balldestino, draggable: true }).addTo(layerCLDES);
            AñadirEventoDestino(marker)
            destinoElegido = { lat: latlng.lat, lng: latlng.lng }
            $('#txtDestino').val("Destino: " + latlng.lat + "," + latlng.lng)
            $('#divTxtDestino').addClass("is-dirty");
            storage.set("DestinoElegido", destinoElegido)
            BuscarRutas()
        });
        $("#txtOrigen").on("paste keyup", function () {
            var valor = this.value
            //if (valor.length % 3 == 0) {
            if (valor.length >= 3) {
                BuscarOrigen(valor, 'origen')
            }
        });
        $("#txtDestino").on("paste keyup", function () {
            var valor = this.value
            //if (valor.length % 3 == 0) {
            if (valor.length >= 3) {
                BuscarOrigen(valor, 'destino')
            }
        });
        ObtenerParadasCL()
        $("#txtOrigen").autocomplete({
            source: sugerenciasOrigen//.concat(paradasSugeridas)
        });
        $("#txtDestino").autocomplete({
            source: sugerenciasDestino//.concat(paradasSugeridas)
        });
        MiUbicacion()
    }
}
function ObtenerParadasCL() {
    for (var t = 0; t < LSParadas.length; t++) {
        paradasSugeridas.push(LSParadas[t].Nom + " - " + LSParadas[t].CP)
    }
}
function SugerirParada(texto) {
    if (paradasSugeridas.length == 0) {
        ObtenerParadasCL()
    }
    var arrp = []
    for (var t = 0; t < paradasSugeridas.length; t++) {
        if (paradasSugeridas[t].toLowerCase().indexOf(texto.toLowerCase()) > -1) {
            arrp.push(paradasSugeridas[t])
        }
    }
    return arrp
}
var arraySugerencias = []
var arrayUbicaciones = []
function BuscarOrigen(texto, tipo) {
    arraySugerencias = []
    arrayUbicaciones = []
    urlGeo = urlSrch + 'q=' + texto + '&lon=-6.941150856&lat=37.2635917&limit=20'
    $.getJSON(urlGeo, function (data) {
        data = data.features
        console.log('------------------------------------')
        for (var bo = 0; bo < data.length; bo++) {
            //console.log(data[bo].display_name)
            var dt = data[bo]
            if (dt.properties.city == "Huelva") {
                arrayUbicaciones.push(dt)
                if (dt.properties.street == null) {
                    arraySugerencias.push(dt.properties.name)
                } else {
                    arraySugerencias.push(dt.properties.name + ", " + dt.properties.street)
                }
            }
        }
        arraySugerencias = arraySugerencias.concat(SugerirParada(texto))
        if (arrayUbicaciones.length != 0 && tipo == "origen") {
            sugerenciasOrigen = arraySugerencias
            ubicacionesOrigen = arrayUbicaciones
            $('#txtOrigen').autocomplete("option", {
                source: SearchMatch,
                select: function (event, ui) {
                    console.log(ui.item.label)
                    if (ui.item.label.indexOf(" - ") == -1) {//normal

                        for (var suo = 0; suo < ubicacionesOrigen.length; suo++) {
                            if (ubicacionesOrigen[suo].properties.name == ui.item.label || arrayUbicacionesMapa[suo].properties.name + ", " + arrayUbicacionesMapa[suo].properties.street) {
                                origenElegido = { lat: ubicacionesOrigen[suo].geometry.coordinates[1], lng: ubicacionesOrigen[suo].geometry.coordinates[0] }
                                storage.set("OrigenElegido", origenElegido)
                                layerCLGPS.clearLayers()
                                $('#txtOrigen').val(ui.item.label)
                                var latlng = new L.LatLng(origenElegido.lat, origenElegido.lng);
                                var marker = L.marker(latlng, { icon: ballgeo, draggable: true }).addTo(layerCLGPS);
                                AñadirEventoOrigen(marker)
                                mapaCL.setView(latlng, mapaCL.getZoom());
                            }
                        }
                    } else {//Paradas
                        cpar = ui.item.label.split(" - ")[1]
                        par = ObtenerParada(cpar)
                        origenElegido = { lat: par.XY[1], lng: par.XY[0] }
                        storage.set("OrigenElegido", origenElegido)
                        layerCLGPS.clearLayers()
                        $('#txtOrigen').val(ui.item.label)
                        var latlng = new L.LatLng(par.XY[1], par.XY[0]);
                        var marker = L.marker(latlng, { icon: ballgeo, draggable: true }).addTo(layerCLGPS);
                        AñadirEventoOrigen(marker)
                        mapaCL.setView(latlng, mapaCL.getZoom());

                    }
                    if (destinoElegido != "") {
                        BuscarRutas()
                    }
                    return false;
                }
            });
            console.log(sugerenciasOrigen)
        }
        if (arrayUbicaciones.length != 0 && tipo == "destino") {
            sugerenciasDestino = arraySugerencias
            ubicacionesDestino = arrayUbicaciones
            $('#txtDestino').autocomplete("option", {
                source: function (request, response) {
                    var newmatchArry = new Array();
                    var matchArry = arraySugerencias.slice();
                    var srchTerms = $.trim(request.term).split(/\s+/);

                    //--- For each search term, remove non-matches.
                    $.each(srchTerms, function (J, term) {
                        var regX = new RegExp(term.value, "i");
                        matchArry = $.map(matchArry, function (item) {
                            return regX.test(item) ? item : null;
                        });
                    });
                    response(matchArry);
                },
                select: function (event, ui) {
                    console.log(ui.item.label)
                    if (ui.item.label.indexOf(" - ") == -1) {//normal
                        for (var suo = 0; suo < ubicacionesDestino.length; suo++) {
                            if (ubicacionesDestino[suo].properties.name == ui.item.label || arrayUbicacionesMapa[suo].properties.name + ", " + arrayUbicacionesMapa[suo].properties.street) {
                                destinoElegido = { lat: ubicacionesDestino[suo].geometry.coordinates[1], lng: ubicacionesDestino[suo].geometry.coordinates[0] }
                                storage.set("DestinoElegido", destinoElegido)
                                layerCLDES.clearLayers()
                                $('#txtDestino').val(ubicacionesDestino[suo].properties.name)
                                var latlng = new L.LatLng(destinoElegido.lat, destinoElegido.lng);
                                var marker = L.marker(latlng, { icon: balldestino, draggable: true }).addTo(layerCLDES);
                                AñadirEventoDestino(marker)
                                mapaCL.setView(latlng, mapaCL.getZoom());
                            }
                        }

                    } else {//Paradas
                        cpar = ui.item.label.split(" - ")[1]
                        par = ObtenerParada(cpar)
                        destinoElegido = { lat: par.XY[1], lng: par.XY[0] }
                        storage.set("DestinoElegido", destinoElegido)
                        layerCLDES.clearLayers()
                        $('#txtDestino').val(ui.item.label)
                        var latlng = new L.LatLng(par.XY[1], par.XY[0]);
                        var marker = L.marker(latlng, { icon: balldestino, draggable: true }).addTo(layerCLDES);
                        AñadirEventoDestino(marker)
                        mapaCL.setView(latlng, mapaCL.getZoom());
                    }
                    BuscarRutas()

                    return false;
                }
            });
        }
    });
}
function SearchMatch(request, response) {
    var newmatchArry = new Array();
    var matchArry = arraySugerencias.slice();
    var srchTerms = $.trim(request.term).split(/\s+/);

    //--- For each search term, remove non-matches.
    $.each(srchTerms, function (J, term) {
        var regX = new RegExp(term.value, "i");
        matchArry = $.map(matchArry, function (item) {
            return regX.test(item) ? item : null;
        });
    });
    response(matchArry);
}
function InvertirBusqueda() {
    origenElegido = storage.get("OrigenElegido")
    destinoElegido = storage.get("DestinoElegido")
    origenTxt = $('#txtOrigen').val()
    destinoTxt = $('#txtDestino').val()
    $('#txtDestino').val(origenTxt)
    $('#txtOrigen').val(destinoTxt)
    storage.set("OrigenElegido", destinoElegido)
    storage.set("DestinoElegido", origenElegido)
    layerCLGPS.clearLayers()
    var latlng = new L.LatLng(destino.lat, destino.lng);
    var marker = L.marker(latlng, { icon: ballgeo, draggable: true }).addTo(layerCLGPS);
    AñadirEventoOrigen(marker)
    layerCLDES.clearLayers()
    var latlngDes = new L.LatLng(origen.lat, origen.lng);
    var marker = L.marker(latlngDes, { icon: balldestino, draggable: true }).addTo(layerCLDES);
    AñadirEventoDestino(marker)
    BuscarRutas()
}
function MiUbicacion() {
        navigator.geolocation.getCurrentPosition(function (location) {
            var urlGeo = urlNomin + '/reverse.php?format=json&lat=' + location.coords.latitude + '&lon=' + location.coords.longitude + '&zoom=18'
            $.getJSON(urlGeo, function (data) {
                var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
                centro = new L.LatLng(37.2635917, -6.94115085679792);
                distancia = centro.distanceTo(latlng);
                if (distancia > 20000) {
                    var latlng = new L.LatLng(centro.lat, centro.lng);
                    $('#txtOrigen').val("Huelva: " + centro.lat + "," + centro.lng)
                    origenElegido = { lat: centro.lat, lng: centro.lng }
                } else {
                    $('#txtOrigen').val("Tu Ubicación: " + location.coords.latitude + "," + location.coords.longitude)
                    origenElegido = { lat: location.coords.latitude, lng: location.coords.longitude }
                }
                storage.set("OrigenElegido", origenElegido)
                $('#divTxtOrigen').addClass("is-dirty");
                layerCLGPS.clearLayers()
                var marker = L.marker(latlng, { icon: ballgeo, draggable: true }).addTo(layerCLGPS);
                AñadirEventoOrigen(marker)
                mapaCL.setView(latlng, mapaCL.getZoom());
                BuscarRutas()
            });
        });
}
var rutaPie = null;
var ListaRutas = []
function BuscarRutas() {
    if (rutaObtenida != null) {
        OcultarRuta()
    }

    origen = origenElegido
    destino = destinoElegido
    if (origen != "" && destino != "") {
        //TODO:los comentarios
        //dberiamos controlar si origen y destino están, solo por si acaso
        $("#toastDestino").show();
        //quiza montar un historial de rutas y aqui podriamos cogerlas

        //Comprobamos que entre los dos puntos la distancia no es muy grande
        //de camino almacenamos la ruta a pié
        ObtenerRutaNormal(origen, destino)
        if (rutaPie.routes[0].distance < 15000) {
            ObtenerRutasItinerarios(origen.lng + "," + origen.lat, destino.lng + "," + destino.lat)
        } else {
            $("#toastDestino").hide();
            LanzarSwalBasico("Demasiada Distancia", "Lo sentimos pero la distancia de origen a destino debe ser menor a 15km para calcular una ruta posible, reduzca la distancia entre los puntos y vuelva a intentarlo")
        }
    }
}
function ObtenerRutaNormal(Origen, Destino) {
    urlhtml = urlRutas + 'route/v1/footer/' + Origen.lng + ',' + Origen.lat + ';' + Destino.lng + ',' + Destino.lat + '?steps=true&alternatives=true&geometries=geojson'

    $.ajax({
        type: 'GET',
        url: urlhtml,
        dataType: 'json',
        retryCount: 0,
        retryLimit: 5,
        timeout: tiempoRecargaMilis,
        async: false,
        success: function (data) {
            rutaPie = data
        },
        error: function (xmlhttprequest, textstatus, message) {
            //TODO:controlar errores
        }
    });
}
var CoorAOrigen = []
var CoorADestino = []
var LineasParadasCercanas = []
function ObtenerRutasItinerarios(Origen, Destino) {
    //Origen = -6.9536414 + "," + 37.2586716
    //Destino = -6.9396156040914 + "," + 37.2735541
    var arrayCordenadas = [];
    var arrayCodigos = []
    for (var i = 0; i < LSParadas.length; i++) {
        var par = LSParadas[i]
        if (par.Iti.length > 0) {
            arrayCodigos.push(par)
            arrayCordenadas.push(par.XY[0] + "," + par.XY[1])
        }
    }
    arrayCodigos = JSON.parse(JSON.stringify(arrayCodigos))
    var output = arrayCordenadas.join(";");

    urlhtmlOri = urlRutas + 'table/v1/foot/' + Origen + ";" + output + '?destinations=0'
    urlhtmlDes = urlRutas + 'table/v1/foot/' + Destino + ";" + output + '?destinations=0'

    ObtenerDistanciasAPunto(urlhtmlOri, "origen")
    ObtenerDistanciasAPunto(urlhtmlDes, "destino")

    for (var i = 0; i < arrayCodigos.length; i++) {
        //(arrayCodigos(CoorAOrigen
        arrayCodigos[i].duracionOrigen = CoorAOrigen.durations[i + 1][0]
        arrayCodigos[i].duracionDestino = CoorADestino.durations[i + 1][0]
    }

    parCercOrigen = arrayCodigos.slice(0).sort((a, b) => (a.duracionOrigen > b.duracionOrigen) ? 1 : -1)
    parCercDestino = arrayCodigos.slice(0).sort((a, b) => (a.duracionDestino > b.duracionDestino) ? 1 : -1)

    LineasParadasCercanas = []
    ListaRutas = []
    for (var i = 0; i < LSMenuLineas.length; i++) {
        iti = ObtenerItinerario(LSMenuLineas[i].Cla)
        lin = { linea: iti, paradasOrigen: [], paradasDestino: [] }
        for (var t = 0; t < parCercOrigen.length; t++) {
            if (parCercOrigen[t].Iti.includes(lin.linea.Cla)) {
                parCercOrigen[t].PosOrigen = ObtenerPosicionParada(iti, parCercOrigen[t].CP)
                lin.paradasOrigen.push(JSON.parse(JSON.stringify(parCercOrigen[t])))
            }

            if (lin.paradasOrigen.length == 3) { break; }
        }
        for (var t = 0; t < parCercDestino.length; t++) {
            if (parCercDestino[t].Iti.includes(lin.linea.Cla)) {
                parCercDestino[t].PosDestino = ObtenerPosicionParada(iti, parCercDestino[t].CP)
                lin.paradasDestino.push(JSON.parse(JSON.stringify(parCercDestino[t])))
            }

            if (lin.paradasDestino.length == 3) { break; }
        }
        LineasParadasCercanas.push(lin)
    }
    //Arreglamos las rutas. Si la paradas mas corta anterior esta mas cerca en pos de parada y no es seguida
    for (var i = 0; i < LineasParadasCercanas.length; i++) {
        var posibilidades = []
        origenes = LineasParadasCercanas[i].paradasOrigen
        destinos = LineasParadasCercanas[i].paradasDestino
        //emparejamos posibles resultados de origen y destino
        for (var cont = 0; cont < origenes.length; cont++) {
            for (var cont2 = 0; cont2 < destinos.length; cont2++) {
                if (origenes[cont].PosOrigen < destinos[cont2].PosDestino) {
                    pos = (destinos[cont2].PosDestino - origenes[cont].PosOrigen)
                    posibilidades.push({ modo: "recto", origen: origenes[cont], destino: destinos[cont2], paradas: pos })
                } else {
                    pos = LineasParadasCercanas[i].linea.NumP - (origenes[cont].PosOrigen - destinos[cont2].PosDestino) + 1
                    posibilidades.push({ modo: "vuelta", origen: origenes[cont], destino: destinos[cont2], paradas: pos })
                }
            }
        }

        posibElegida = posibilidades[0]
        do {
            var terminado = true
            for (var ct = 1; ct < posibilidades.length; ct++) {
                posib = posibilidades[ct]
                if ((posib.origen.duracionOrigen - posibElegida.origen.duracionOrigen) < 61 && (posib.destino.duracionDestino - posibElegida.destino.duracionDestino) < 61 && (posib.modo == "recto" && posib.paradas < posibElegida.paradas)) {
                    posibElegida = posib
                    terminado = false;
                    console.log(LineasParadasCercanas[i].linea.Abr + " ->Cambio a posibilidad º" + ct)
                    break;
                }
            }
        } while (!terminado)
        LineasParadasCercanas[i].OrigenElegido = posibElegida.origen
        LineasParadasCercanas[i].DestinoElegido = posibElegida.destino
        LineasParadasCercanas[i].Modo = posibElegida.modo
        LineasParadasCercanas[i].NumParadas = posibElegida.paradas
    }

    //ahora preguntamos por las mas cercanas
    //ordenamos por duracion total a pie
    LineasParadasCercanas.sort(function (a, b) {
        if ((a.OrigenElegido.duracionOrigen + a.DestinoElegido.duracionDestino) > (b.OrigenElegido.duracionOrigen + b.DestinoElegido.duracionDestino)) {
            return 1
        } else {
            return -1
        }
    })


    for (var i = 0; i < LineasParadasCercanas.length; i++) {
        ruta = LineasParadasCercanas[i]
        rutaObtenida = {}
        rutaObtenida.Clave = ruta.linea.Cla
        rutaObtenida.Ruta = ruta
        rutaObtenida.Origen = Origen
        rutaObtenida.Destino = Destino
        rutaObtenida.paradaOrigen = ruta.OrigenElegido.XY[0] + "," + ruta.OrigenElegido.XY[1]
        rutaObtenida.paradaDestino = ruta.DestinoElegido.XY[0] + "," + ruta.DestinoElegido.XY[1]
        rutaObtenida.Layers = CrearSemiLayer(rutaObtenida.Ruta.linea, rutaObtenida.Ruta.OrigenElegido.PosOrigen, rutaObtenida.Ruta.DestinoElegido.PosDestino)
        ruta.Distancia = rutaObtenida.Layers.distancia
        ruta.Duracion = CalculartiempoNormal(rutaObtenida.Layers.distancia, 14)
        ListaRutas.push(rutaObtenida)
    }
    RellenarRutasSugeridas(LineasParadasCercanas)
    ObtenerRutaBus(0, Origen, Destino)

}
function ObtenerDistanciasAPunto(url, tipo) {
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        retryCount: 0,
        retryLimit: 5,
        timeout: tiempoRecargaMilis,
        async: false,
        success: function (data) {
            if (tipo == "origen") {
                CoorAOrigen = data
            } else {
                CoorADestino = data
            }
        },
        error: function (xmlhttprequest, textstatus, message) {
            //TODO:controlar errores
        }
    });
}
function RellenarRutasSugeridas(LineasParadasCercanas) {
    var htmlRutas = ""

    htmlRutas += '<ul id="listRutas" class="collection">'
    for (var i = 0; i < LineasParadasCercanas.length; i++) {
        rut = LineasParadasCercanas[i]
        l = rut.linea
        var numParadas = 0
        if (rut.DestinoElegido.PosDestino > rut.OrigenElegido.PosOrigen) {
            numParadas = rut.DestinoElegido.PosDestino - rut.OrigenElegido.PosOrigen
        } else {
            numParadas = LineasParadasCercanas[i].linea.NumP - (rut.OrigenElegido.PosOrigen - rut.DestinoElegido.PosDestino) + 1
        }

        if (numParadas != 0 && rutaPie.routes[0].duration > (rut.OrigenElegido.duracionOrigen + rut.DestinoElegido.duracionDestino)) {
            //if (numParadas = 0 && rutapie.routes[0].duration > (rut.origenElegido.duracionOrigen + rut.destinoElegido.duracionDestino)) {
            htmlRutas += '<li class="collection-item avatar"  onclick="CambiarRuta(' + i + ')">' +
                '<i class="CLMenTiempo" style="text-shadow:none;">' + (Math.floor(rut.OrigenElegido.duracionOrigen / 60) + Math.floor(rut.DestinoElegido.duracionDestino / 60) + Math.floor(rut.Duracion / 60)) + ' <br>Min</i>' +
                '<p><img src="./img/stck-walk.png" height="12" width="12">' + Math.floor(rut.OrigenElegido.duracionOrigen / 60) + '->' + ObtenerAbreviaturaMargen(l.Abr, l.BC, l.FC) + Math.floor(rut.Duracion / 60) + '-><img src="./img/stck-walk.png" height="12" width="12">' + Math.floor(rut.DestinoElegido.duracionDestino / 60) + '</p>' +
                '<p style="color: #7e7e7e;">' + numParadas + ' Paradas.</p>' +
                '</li>'
        }
    }
    htmlRutas += '<li class="collection-item avatar"  onclick="DibujarRutaPie()">' +
               '<i class="CLMenTiempo" style="text-shadow:none;">' + Math.floor(rutaPie.routes[0].duration / 60) + ' <br>Min</i>' +
               '<p><img src="./img/stck-walk.png" height="12" width="12">Ruta a pie</p>' +
               '<p style="color: #7e7e7e;">' + (rutaPie.routes[0].distance / 1000).toFixed(1) + ' Kilómetros</p>' +
               '</li>'
    htmlRutas += "</ul>"

    $("#containerRutasSugeridas").empty()
    $("#containerRutasSugeridas").append(htmlRutas)
    //$("#containerRutasSugeridas").show()
}
var rutaObtenida = null
var layerOrigen, layerDestino;
var LSRutaSeleccionada
function ObtenerRutaBus(indice, origen, destino) {
    storage.set("RSL", indice)
    LSRutaSeleccionada = indice
    urlOrigen = urlRutas + 'route/v1/footer/' + origen + ";" + ListaRutas[indice].paradaOrigen + '?steps=true&alternatives=true&geometries=geojson'
    urlDestino = urlRutas + 'route/v1/footer/' + ListaRutas[indice].paradaDestino + ";" + destino + '?steps=true&alternatives=true&geometries=geojson'
    $.getJSON(urlOrigen, function (data) {
        ListaRutas[LSRutaSeleccionada].OrigenData = data
        $.getJSON(urlDestino, function (data) {
            ListaRutas[LSRutaSeleccionada].DestinoData = data

            DibujarRuta(indice)
        });
    });
}
function DibujarRuta(indice) {
    rutaObtenida = ListaRutas[indice]
    layerCreadoOrigen = L.layerGroup();
    layerCreadoDestino = L.layerGroup();
    layerOrigen = L.layerGroup();
    layerDestino = L.layerGroup();

    DibujarRutaPolilinea(rutaObtenida.OrigenData, layerCreadoOrigen, layerOrigen)
    DibujarRutaPolilinea(rutaObtenida.DestinoData, layerCreadoDestino, layerDestino)

    //rutaObtenida.Layers = CrearSemiLayer(rutaObtenida.Ruta.linea, rutaObtenida.Ruta.OrigenElegido.PosOrigen, rutaObtenida.Ruta.DestinoElegido.PosDestino)
    rutaObtenida.Layers.Origen = layerCreadoOrigen
    rutaObtenida.Layers.Destino = layerCreadoDestino
    rutaObtenida.Layers.OrigenMarkers = layerOrigen
    rutaObtenida.Layers.DestinoMarkers = layerDestino

    lin = rutaObtenida.Ruta.linea

    $(".sqInfoRuta").removeAttr("style")
    $(".sqInfoRuta").css("background-color", "#" + lin.BC)
    $(".sqInfoRuta").css("color", "#" + lin.FC)
    $(".sqInfoRuta").empty()
    $(".sqInfoRuta").text(lin.Abr)
    $(".sqInfoRuta").show();

    MostrarRuta(indice)
}
function CrearSemiLayer(linea, inicio, fin) {
    var modo = "recto"
    if (inicio > fin) {
        modo = "vuelta"
    }


    layerCreado = L.layerGroup()//.addTo(mapaCL);
    layerZoom1 = L.layerGroup()//.addTo(mapaCL);
    layerZoom2 = L.layerGroup()//.addTo(mapaCL);
    layerZoom3 = L.layerGroup()//.addTo(mapaCL);
    layerMarcadores = L.layerGroup()//.addTo(mapaCL);
    latlngs = []
    latlngsA = []
    latlngsB = []
    distancia = 0;
    var it = linea
    var idLinea = it.Cla
    var pos = 0
    var cuentaParadas = 0
    for (var i = 0; i < it.Sen.length; i++) {
        for (var i2 = 0; i2 < it.Sen[i].Tray.length; i2++) {
            if ((modo == "recto" && cuentaParadas >= inicio && cuentaParadas <= fin) || (modo == "vuelta" && (cuentaParadas <= fin || cuentaParadas >= inicio))) {
                var icon = simpleMarker
                if (i2 == 0) { icon = refMarker }
                parada = it.Sen[i].Par[i2]
                var latlng = new L.LatLng(parada.XY[1], parada.XY[0]);
                var marker = L.marker(latlng, { icon: icon, Cla: it.Cla, CP: it.Sen[i].Par[i2].CP, Pos: pos, Sen: (i + 1), zIndexOffset: 0 }).addTo(layerMarcadores)
                var testoMarker = L.marker(latlng, {
                    icon: new L.DivIcon({
                        className: 'my-div-iconj',
                        html: '<div class="iw textoMarker"><p>' + (pos + 1) + ' - ' + parada.Nom + '</p></div>',
                        iconAnchor: [-10, 35],
                        zIndexOffset: 1
                    }), Cla: it.Cla, CP: it.Sen[i].Par[i2].CP, Pos: pos, Sen: (i + 1)
                })
                switch (parada.Nivel) {
                    case 1:
                        testoMarker.addTo(layerZoom1)
                        break;
                    case 2:
                        testoMarker.addTo(layerZoom2)
                        break;
                    default:
                        testoMarker.addTo(layerZoom3)
                        break;
                }

                if (modo == "recto" && cuentaParadas != fin) {
                    tray = ObtenerTrayecto(it.Sen[i].Tray[i2])
                    var X = []
                    var Y = []
                    for (var w = 0; w < tray.XY.length; w++) {
                        (w % 2 == 0) ? X.push(tray.XY[w]) : Y.push(tray.XY[w]);
                    }
                    for (var w2 = 0; w2 < X.length; w2++) {
                        latlngs.push([Y[w2], X[w2]])
                    }
                }
                if (modo == "vuelta") {
                    tray = ObtenerTrayecto(it.Sen[i].Tray[i2])
                    var X = []
                    var Y = []
                    for (var w = 0; w < tray.XY.length; w++) {
                        (w % 2 == 0) ? X.push(tray.XY[w]) : Y.push(tray.XY[w]);
                    }
                    for (var w2 = 0; w2 < X.length; w2++) {
                        if (cuentaParadas < fin)
                            latlngsB.push([Y[w2], X[w2]])
                        if (cuentaParadas >= inicio)
                            latlngsA.push([Y[w2], X[w2]])

                    }
                    if (cuentaParadas == it.NumP - 1) {
                        latlngs = latlngsA.concat(latlngsB)
                    }
                }
                //latlngs = latlngs.concat(it.Sen[i].XY)
            }
            pos = pos + 1
            cuentaParadas += 1
        }

    }
    for (var i = 1; i < latlngs.length; i++) {
        distancia += distanciaMetros(latlngs[i - 1][0], latlngs[i - 1][1], latlngs[i][0], latlngs[i][1])
    }
    var polyline = L.polyline(latlngs, { stroke: true, color: "#" + it.BC, opacity: 0.7, className: "pruebaclase" }).addTo(layerCreado);
    return { id: idLinea, layer: layerCreado, markers: layerMarcadores, zoom1: layerZoom1, zoom2: layerZoom2, zoom3: layerZoom3, distancia: distancia, bounds: polyline.getBounds() }
}
function DibujarRutaPie() {
    OcultarRuta()

    layerCreado = L.layerGroup().addTo(mapaCL);
    layerMarcadores = L.layerGroup().addTo(mapaCL);
    rutaObtenida = {}
    rutaObtenida.LayerCreado = layerCreado
    rutaObtenida.LayerMarcadores = layerMarcadores
    DibujarRutaPolilinea(rutaPie, layerCreado, layerMarcadores)
    $(".sqInfoRuta").removeAttr("style")
    $(".sqInfoRuta").css("background-color", "white")
    $(".sqInfoRuta").css("color", "black")
    $(".sqInfoRuta").empty()
    $(".sqInfoRuta").append('<img src="./img/stck-walk.png" height="22" width="22">')
    $(".sqInfoRuta").show();
    AnimarListaRutas()
}
function DibujarRutaPolilinea(ruta, layerCreado, layerMarcadores, color) {
    if (color == null) color = '169FF1'
    pasos = ruta.routes[0].legs[0].steps
    rutaGeometrica = []
    for (var drp = 0; drp < pasos.length; drp++) {
        maniobra = pasos[drp].maneuver
        if (maniobra.type != "depart" && maniobra.type != "arrive") {
            var html = ""
            nombre = pasos[drp].name
            if (maniobra.modifier.indexOf("left") > -1) {
                html = '<div class="iw textoMarker"><p><img src="img/arr-left.png" alt="derecha" height="24" width="24">' + nombre + '</p></div>'
            } else if (maniobra.modifier.indexOf("right") > -1) {
                html = '<div class="iw textoMarker"><p><img src="img/arr-rigth.png" alt="izquierda" height="24" width="24">' + nombre + '</p></div>'
            } else if (maniobra.modifier.indexOf("straight") > -1) {
                html = '<div class="iw textoMarker"><p><i class="material-icons">arrow_upward</i>' + nombre + '</p></div>'
            }
            var posLtLg = new L.LatLng(maniobra.location[1], maniobra.location[0]);
            var testoMarker = L.marker(posLtLg, {
                icon: new L.DivIcon({
                    className: 'my-div-iconj',
                    html: html,
                    iconAnchor: [0, 0],
                    zIndexOffset: 1
                })
            })
            testoMarker.addTo(layerMarcadores)
            //añadimos pasos a la ruta
        }
        interesciones = pasos[drp].intersections
        for (var drpi = 0; drpi < interesciones.length; drpi++) {
            var lc = interesciones[drpi].location
            rutaGeometrica.push([lc[1], lc[0]])
        }
    }
    var polyline = L.polyline(rutaGeometrica, { stroke: true, dashArray: '20, 20', color: "#" + color, opacity: 0.7, className: "pruebaclase" }).addTo(layerCreado);
}

function CambiarRuta(index) {
    OcultarRuta()

    Origen = origenElegido.lng + "," + origenElegido.lat
    Destino = destinoElegido.lng + "," + destinoElegido.lat

    ObtenerRutaBus(index, Origen, Destino)

    AnimarListaRutas()
}
function OcultarRuta() {
    if (rutaObtenida != null) {
        if (rutaObtenida.Clave != null) {
            mapaCL.removeLayer(rutaObtenida.Layers.layer);
            mapaCL.removeLayer(rutaObtenida.Layers.markers);
            mapaCL.removeLayer(rutaObtenida.Layers.zoom1);
            mapaCL.removeLayer(rutaObtenida.Layers.zoom2);
            mapaCL.removeLayer(rutaObtenida.Layers.zoom3);
            mapaCL.removeLayer(rutaObtenida.Layers.Origen);
            mapaCL.removeLayer(rutaObtenida.Layers.Destino);
            mapaCL.removeLayer(rutaObtenida.Layers.OrigenMarkers);
            mapaCL.removeLayer(rutaObtenida.Layers.DestinoMarkers);
        } else {//ruta a pie
            mapaCL.removeLayer(rutaObtenida.LayerCreado);
            mapaCL.removeLayer(rutaObtenida.LayerMarcadores);
        }
    }
}
function MostrarRuta(index) {

    var bounds = new L.LatLngBounds([[origenElegido.lat, origenElegido.lng], [destinoElegido.lat, destinoElegido.lng]]);
    mapaCL.fitBounds(bounds, { padding: [20, 20] });
    mapaCL.addLayer(rutaObtenida.Layers.layer);
    mapaCL.addLayer(rutaObtenida.Layers.markers);
    mapaCL.addLayer(rutaObtenida.Layers.zoom1);
    mapaCL.addLayer(rutaObtenida.Layers.zoom2);
    mapaCL.addLayer(rutaObtenida.Layers.zoom3);
    mapaCL.addLayer(rutaObtenida.Layers.Origen);
    mapaCL.addLayer(rutaObtenida.Layers.Destino);
    mapaCL.addLayer(rutaObtenida.Layers.OrigenMarkers);
    mapaCL.addLayer(rutaObtenida.Layers.DestinoMarkers);

    $("#toastDestino").hide();
    ZoomCambiadoComoLLegar(mapaCL.getZoom())
    CentrarRuta()
}
function CambiarLatLng(ArrayRutas) {
    arrayCambio = []
    for (var cll = 0; cll < ArrayRutas.length; cll++) {
        var coo = ArrayRutas[cll]
        arrayCambio.push([coo[1], coo[0]])
    }
    return arrayCambio
}

function ZoomCambiadoComoLLegar(zoom) {
    if (rutaObtenida != null && rutaObtenida.Clave != null) {
        if (zoom <= 12) {
            //Solo muestra la linea (ni marcadores ni nada).
            OcultarParadasComoLlegar();
        } else if (zoom == 13) {
            //    //Aparecen las paradas y los coches
            MostrarParadasComoLlegar();
        }
        else if (zoom >= 14 && zoom <= 17) {
            //    //Cambiar niveles de zoom
            nivel = zoom - 13;
            AbrirInfoBoxesComoLlegarNivel(nivel);//De momento
        } else if (zoom >= 18) {
            //    //todas
            AbrirInfoBoxesComoLlegarNivel(5);
        }
    }
}
function OcultarParadasComoLlegar() {
    mapaCL.removeLayer(rutaObtenida.Layers.markers)
    mapaCL.removeLayer(rutaObtenida.Layers.zoom1)
    mapaCL.removeLayer(rutaObtenida.Layers.zoom2)
    mapaCL.removeLayer(rutaObtenida.Layers.zoom3)
    mapaCL.removeLayer(rutaObtenida.Layers.OrigenMarkers)
    mapaCL.removeLayer(rutaObtenida.Layers.DestinoMarkers)
}
function MostrarParadasComoLlegar() {
    mapaCL.addLayer(rutaObtenida.Layers.markers)
}
function CerrarInfoBoxesComoLlegarMapa() {
    mapaCL.removeLayer(rutaObtenida.Layers.zoom1)
    mapaCL.removeLayer(rutaObtenida.Layers.zoom2)
    mapaCL.removeLayer(rutaObtenida.Layers.zoom3)
    mapaCL.removeLayer(rutaObtenida.Layers.OrigenMarkers)
    mapaCL.removeLayer(rutaObtenida.Layers.DestinoMarkers)
}
function AbrirInfoBoxesComoLlegarNivel(nivel) {
    CerrarInfoBoxesComoLlegarMapa()

    if (nivel >= 1) {
        mapaCL.addLayer(rutaObtenida.Layers.zoom1)
    }
    if (nivel >= 2) {
        mapaCL.addLayer(rutaObtenida.Layers.zoom2)
    }
    if (nivel >= 3) {
        mapaCL.addLayer(rutaObtenida.Layers.zoom3)
        mapaCL.addLayer(rutaObtenida.Layers.OrigenMarkers)
        mapaCL.addLayer(rutaObtenida.Layers.DestinoMarkers)
    }
}
function AñadirEventoDestino(marker) {
    marker.setZIndexOffset(777)
    marker.on('dragstart', function (e) {
        OcultarRuta()
    });
    marker.on('dragend', function (e) {
        destinoElegido = e.target.getLatLng()
        $('#txtDestino').val("Destino: " + destinoElegido.lat + "," + destinoElegido.lng)
        $('#divTxtDestino').addClass("is-dirty");
        storage.set("DestinoElegido", destinoElegido)
        BuscarRutas()
    });
}
function AñadirEventoOrigen(marker) {
    marker.setZIndexOffset(777)
    marker.on('dragstart', function (e) {
        OcultarRuta()
    });
    marker.on('dragend', function (e) {
        origenElegido = e.target.getLatLng()
        $('#txtOrigen').val("Mi ubicación: " + origenElegido.lat + "," + origenElegido.lng)
        $('#divTxtOrigen').addClass("is-dirty");
        storage.set("OrigenElegido", origenElegido)
        BuscarRutas()
    });
}

function AnimarListaRutas() {
    if ($("#containerRutasSugeridas").height() != 0) {
        $("#containerRutasSugeridas").animate({
            height: 0,
        }, 300, "linear", function () {
            $("#containerRutasSugeridas").hide();
        })
    } else {
        $("#containerRutasSugeridas").show()

        $("#containerRutasSugeridas").animate({
            height: window.innerHeight - 100,
        }, 300, "linear", function () {

        })
    }
}
function CentrarRuta() {
    bounds = rutaObtenida.Layers.bounds
    origenlatlng = rutaObtenida.Origen.split(",")
    destinolatlng = rutaObtenida.Destino.split(",")
    var p1 = L.point(origenlatlng[0], origenlatlng[1])
    var p2 = L.point(destinolatlng[0], destinolatlng[1])
    var ordesbounds = L.bounds(p1, p2);
    bounds.extend(ordesbounds)
    mapaCL.fitBounds(bounds)
}
////////////////////////////////////////////////////////NOTICIAS/////////////////////////////////////////////////////////////////////////////////
var LSFecNot = null
function ObtenerNumeroNoticiasNuevas() {
    $("#loadText").text("Obteniendo Noticias Nuevas")
    if (LSFecNot != null) {
        v = new Date(storage.get("ultFN"))
        var num = v.getFullYear() + pad(v.getMonth() + 1, 2) + pad(v.getDate(), 2) + pad(v.getHours(), 2) + pad(v.getMinutes(), 2) + pad(v.getSeconds(), 2)
        $.ajax({
            type: 'GET',
            url: 'https://www.emtusahuelva.es/RSS/noticiasRSS.aspx?fecha=' + num,
            dataType: "text",
            retryCount: 0,
            retryLimit: 5,
            timeout: tiempoRecargaMilis,
            success: function (data) {
                numeroMedallas = data;
                $("#iniInfo").attr("data-badge", data)
                if (data > 0) {
                    $("#iniInfo").addClass("badge1")
                } else {
                    $("#iniInfo").removeClass("badge1")
                }
                if ($.mobile.activePage != null) {
                    if ($.mobile.activePage.attr('data-url') == 'pageInfo') {
                        ObtenerNoticias(1, true)
                    }
                }
                $(".numAvisos").text(numeroMedallas)

                CambiarNumeroMenu(numeroMedallas)
                console.log("Noticias Actualizadas")
            },
            error: function (xmlhttprequest, textstatus, message) {
                if (textstatus === "timeout") {
                    console.log("Tiempo de espera excedido");
                    if (this.retryCount <= this.retryLimit) {
                        this.retryCount++;
                        console.log("Reintento numero: " + this.retryCount);
                        $.ajax(this);
                        return;
                    } else {
                        ErrorServidor('timeout', 'NOTN01')
                    }
                } else {
                    ErrorServidor('noRespuesta', 'NOTN01')
                }
            },
            async: true
        });
    } else {//si no hay tiempo, debo cogerlo para poner el numero de noticias que hay
        $.ajax({
            type: 'GET',
            url: 'https://www.emtusahuelva.es/RSS/noticiasRSS.aspx?fechaPos=' + 1,
            dataType: "text",
            retryCount: 0,
            retryLimit: 5,
            timeout: tiempoRecargaMilis,
            success: function (data) {
                sep = data.split(" ");
                fecha = sep[0].split("/");
                hora = sep[1].split(":");

                LSFecNot = new Date(parseInt(fecha[2]), (parseInt(fecha[1]) - 1), parseInt(fecha[0]), parseInt(hora[0]), parseInt(hora[1]))
                storage.set("ultFN", LSFecNot)
                ObtenerNumeroNoticiasNuevas()
            },
            error: function (xmlhttprequest, textstatus, message) {
                //TODO: Esto deberia dar un error tipo "toast" en lugar de esto, ya paso que la app daba error de conexión aqui y aprecia que la app estaba rota, pero solo eran las noticias
                storage.set("ultFN", new Date());
                if (textstatus === "timeout") {
                    console.log("Tiempo de espera excedido");
                    if (this.retryCount <= this.retryLimit) {
                        this.retryCount++;
                        console.log("Reintento numero: " + this.retryCount);
                        $.ajax(this);
                        return;
                    } else {
                        ErrorServidor('timeout', 'NOTN01')
                    }
                } else {
                    ErrorServidor('noRespuesta', 'NOTN01')
                }
            },
            async: false
        });
    }
    $("#loadText").text("Actualizando Noticias")
}
function CambiarNumeroMenu(num) {//pone el iconito rojo sobre noticias con el numero de disponibles que hay
    if (num == 0) {
        $(".numAvisosMenu").html('');
    } else {
        $(".numAvisosMenu").html('(' + num + ')');
    }
}
function imgConverter(url) {
    trueUrl = ""
    if (url.indexOf('http') == -1) {
        if (url.indexOf('logoEmtusaDefault') != -1) {
            trueUrl = url.substring(2)
        } else {
            url = url.substring(2)
            do {
                url = url.replace('\\', "/")
            } while (url.indexOf('\\') != -1)
            trueUrl = 'https://www.emtusahuelva.com/' + url
        }
    } else {
        if (url.indexOf('http://www.emtusahuelva') == 0) {
            trueUrl = url.replace('http://', 'https://')
        } else {
            trueUrl = url
        }
    }

    return trueUrl
}
function resizeNavBar() {
    width = window.innerWidth;
    //maximo = Math.floor(width / 36) - 2;
    $(".numpagina").show()
    for (index = 1 ; index <= numeroPaginas; index++) {
        $('#paginacion-' + index + ' a').text($('#paginacion-' + index + '').attr('id').split("-")[1])
        $('#paginacion-' + index + '').hide()
    }
    //////////////
    maximo = Math.floor(width / 36) - 4;
    divisor = maximo

    grupo = parseInt(paginaVisibleAhora / divisor)
    if (paginaVisibleAhora % divisor == 0) {
        grupo = grupo - 1
    }
    rango = maximo * (grupo + 1)
    i = (rango - maximo + 1)
    for (index = i; index <= rango; index++) {
        $('#paginacion-' + index + '').show()
    }
    if (i != 1) {
        i = i - 1
    }

    $("#grupoAnterior").attr("onclick", "CambiarPagina(" + i + ")");
    if (paginaVisibleAhora == 1) {
        $("#primeraPagina").attr("onclick", "");
        $("#grupoAnterior").attr("onclick", "")
    } else {
        $("#primeraPagina").attr("onclick", "CambiarPagina(1)");
    }
    ////
    if ($(".numpagina:visible").length < maximo) {
        $("#grupoSiguiente").attr("onclick", "CambiarPagina(" + numeroPaginas + ")");
    } else {
        $("#grupoSiguiente").attr("onclick", "CambiarPagina(" + (rango + 1) + ")");
    }

    if (paginaVisibleAhora == numeroPaginas) {
        $("#ultimaPagina").attr("onclick", "");
        $("#grupoSiguiente").attr("onclick", "");
    } else {
        $("#ultimaPagina").attr("onclick", "CambiarPagina(" + numeroPaginas + ")");
    }
    //centrar los numeros
    maximo = Math.floor(width / 36) - 4;
    total = (((window.innerWidth / 36) - ($(".numpagina:visible").length + 4)) * 36) / 2
    if (total < 0) {
        total = 0
    }
    $("#grupoAnterior").css("margin-right", total + 'px')
}
function CambiarPagina(numero) {
    ObtenerNoticias(numero)
}
function ObtenerNoticias(pagina, saltar) {
    if (pagina == null) {
        pagina = 1;
    }
    if (pagina == 1 && saltar == null) {
        ObtenerNumeroNoticiasNuevas()
        return false;
    }
    $.ajax({
        type: 'GET',
        url: 'https://www.emtusahuelva.es/RSS/noticiasRSS.aspx?tipo=99&pagina=' + pagina,
        dataType: "xml",
        retryCount: 0,
        retryLimit: 5,
        timeout: tiempoRecargaMilis,
        success: function (data) {
            e = data.getElementsByTagName("item")
            html = ''
            $.each(e, function (e, child) {
                des = $('description', child).text()
                date = new Date();
                fecha = $('fecha', child).text().split(":")
                textoNoticia = ReplaceAll($('texto', child).text(), "http://www.emtusahuelva", "https://www.emtusahuelva");
                categoria = $('categoria', child).text();
                cssClass = ""
                //visibility = ""
                if (pagina == 1 && e == 0) {
                    fechastring = fecha[0] + ':' + fecha[1]
                    fechas = fechastring.split(" ")[0].split("/");
                    hora = fechastring.split(" ")[1].split(":");
                    fechaNoticia = new Date(fechas[2], parseInt(fechas[1]) - 1, fechas[0], hora[0], hora[1], 0, 0)
                    storage.set("NoticiaModerna", fechaNoticia)//TODO: No recuerdo para que es esto
                }
                if (storage.isSet('ultFN')) {
                    id = $(this).attr('id')
                    fechastring = fecha[0] + ':' + fecha[1]
                    fechas = fechastring.split(" ")[0].split("/");
                    hora = fechastring.split(" ")[1].split(":");
                    fechaNoticia = new Date(fechas[2], parseInt(fechas[1]) - 1, fechas[0], hora[0], hora[1], 0, 0)
                    fechaUltima = storage.get("ultFN")
                    if (Date.parse(fechaUltima) < Date.parse(fechaNoticia)) {
                        cssClass = 'style="display:block"'
                        //visibility = "iconred"
                    }
                    if (pagina == 1 && e == 0) {
                        fechas = fechastring.split(" ")[0].split("/");
                        hora = fechastring.split(" ")[1].split(":");
                        fechaNoticia = new Date(fechas[2], parseInt(fechas[1]) - 1, fechas[0], hora[0], hora[1], 0, 0)
                        if (Date.parse(storage.get("ultFN")) > Date.parse(fechaNoticia)) {
                            LSFecNot = fechaNoticia
                            storage.set("ultFN", fechaNoticia)
                            ObtenerNumeroNoticiasNuevas()
                        }
                    }
                }
                un = new Date(storage.get("ultFN"));
                if (un.getFullYear() != 1990) {
                    $("#ultPuls").text("" + un.getDate() + "/" + (un.getMonth() + 1) + "/" + un.getFullYear() + " " + pad(un.getHours(), 2) + ":" + pad(un.getMinutes(), 2));
                } else {
                    $("#ultPuls").text("Ninguno Mostrado")
                }
                $("#ultAct").text('' + pad(new Date().getDate(), 2) + "/" + pad(date.getMonth() + 1, 2) + "/" + date.getFullYear() + ' ' + pad(date.getHours(), 2) + ":" + pad(date.getMinutes(), 2) + ":" + pad(date.getSeconds(), 2))

                //Ajustamos html para hacerlo más parecido al de emtusa
                locImg = textoNoticia.indexOf("</p>") + "</p>".length
                var img = textoNoticia.substring(3, locImg - 4)
                textoNoticia = '<div style="padding:5px;">' + textoNoticia.substring(locImg) + "</div>"

                textoNoticia = img + '<h5 class="tituloNoticia">' + $('title', child).text() + '</h5><div class="create"><time itemprop="dateCreated">' + fecha[0] + ':' + fecha[1] + '</time></div><p></p>' + textoNoticia
                html += '<div class="textoNoticia" data-enhance="false" onclick="">' +
                        '<span id="not-' + $('id', child).text() + 'C" class="circuloNuevo" ' + cssClass + '> </span>' +
                        //'<div style="width: 90px;float: left;">' +
                        '<img class="imgInfo" alt="' + $('title', child).text() + '" src="' + imgConverter($('Image', child).text()) + '" width="90">' +
                        //'<p style="text-align: center;color: #aaa;">' + categoria + '</p>' +
                        //'</div>'+
                        '<p id="not-' + $('id', child).text() + '" class="pInfo">' + $('title', child).text() + '<br>' +
                        //'<span class="fechaNoticia posInfo">' + pagina + "." + (e + 1) + '</span>' +
                        '<span id="not-' + $('id', child).text() + 'F" style="font-weight: lighter;" class="fechaNoticia fechaDeNoticia">' + fecha[0] + ':' + fecha[1] + '</span>' +
                        '<span class="fechaNoticia" style="font-weight: lighter;">' + categoria.slice(0, -1) + '</span>' +
                        '</p>' +
                        '<div id="not-' + $('id', child).text() + 'T" class="noticiaTexto">' + textoNoticia + '</div>' +
                        '</div>'


                total = parseInt($('total', child).text());
            })

            numpaginas = Math.ceil(total / 10)
            paginaVisibleAhora = pagina;
            numAnterior = 1
            numSiguiente = numpaginas
            if (paginaVisibleAhora != 1) {
                numAnterior = paginaVisibleAhora - 1
            }
            if (paginaVisibleAhora < numpaginas) {
                numSiguiente = paginaVisibleAhora + 1
            }
            lista = '<ul  class="cambioPagina"><li id="primeraPagina" onclick="CambiarPagina(' + 1 + ')"><a title="Primera" class="paginacionInicio">&laquo;&laquo;</a></li>' +
            '<li id="grupoAnterior" onclick="CambiarPagina(' + numAnterior + ')"><a title="Anterior" class="paginacionInicio">&laquo;</a></li>'

            for (index = 1; index <= numpaginas; index++) {
                if (index != paginaVisibleAhora) {
                    lista += '<li id="paginacion-' + index + '" class="numpagina" onclick="CambiarPagina(' + index + ')"><a>' + index + '</a></li>'
                } else {
                    lista += '<li id="paginacion-' + index + '" class="numpagina selected"><a class="selected">' + index + '</a></li>'
                }
            }
            lista += '<li id="ultimaPagina" onclick="CambiarPagina(' + numpaginas + ')" style="float:right"><a title="Ultima" class="paginacionFin">&raquo;&raquo;</a></li>' +
                '<li id="grupoSiguiente" onclick="CambiarPagina(' + numSiguiente + ')" style="float:right"><a title="Siguiente" class="paginacionFin">&raquo;</a></li>'

            lista += "</ul>"
            $('#divEmtusaNoticias').empty()
            $('#divEmtusaNoticias').append(html + lista)
            //parche de los iframe
            $(".iframeRoto").prepend("<span>No es posible mostrar este contenido aquí. Pulse sobre el enlace siguiente para verlo:</span><br>")
            $(".iframeEnlace").text($(".iframeEnlace").attr("src"))
            $(".iframeEnlace").attr("href", $(".iframeEnlace").attr("src"))
            $(".iframeEnlace").removeAttr("src")
            //
            $.each($(".noticiaTexto img"), function (a, img) {
                if (img.getAttribute("src").indexOf('www') == -1) {
                    img.setAttribute("src", 'https://www.emtusahuelva.es/' + img.getAttribute("src"));
                }
                img.style.maxWidth = "100%"
                img.style.height = "auto"
            })
            $.each($(".noticiaTexto a"), function (a, aTag) {
                if (aTag.getAttribute("href") != null) {
                    if (aTag.getAttribute("href").indexOf('http') == -1) {
                        aTag.setAttribute("href", 'https://www.emtusahuelva.es/' + aTag.getAttribute("href"));
                    }
                    if (aTag.getAttribute("href").indexOf('.pdf') != -1) {
                        if (plataforma != "cordova") {
                            aTag.setAttribute("download", '');
                        } else {
                            aTag.setAttribute("onclick", 'DownloadPDF("' + aTag.getAttribute("href") + '")');
                            aTag.removeAttribute("href");
                        }
                    }
                }
            })
            $.each($(".noticiaTexto table"), function (t, tab) {
                tab.style.width = "100%"
            })
            $("p.pInfo").click(function () {
                id = $(this).attr('id')
                DesmarcarNoticiasAntiguas(id, pagina)
                MostrarNoticia(id + "T")
            });
            $("#divEmtusaNoticias").animate({ scrollTop: $("#divEmtusaNoticias").position().top }, 0);
            numeroPaginas = numpaginas
            resizeNavBar()
            if (numeroPaginas == paginaVisibleAhora) {
                $('.paginacionFin').css('color', 'lightgray')
                $('.paginacionFin').css('text-shadow', ' 1px 1px #808080');
            } else if (1 == paginaVisibleAhora) {
                $('.paginacionInicio').css('color', 'lightgray')
                $('.paginacionInicio').css('text-shadow', ' 1px 1px #808080');
            }
        },
        error: function (xmlhttprequest, textstatus, message) {
            if (textstatus === "timeout") {
                console.log("Tiempo de espera excedido");
                if (this.retryCount <= this.retryLimit) {
                    this.retryCount++;
                    console.log("Reintento numero: " + this.retryCount);
                    $.ajax(this);
                    return;
                } else {
                    ErrorServidor('timeout', 'NOTI01')
                }
            }
        },
        async: false
    });
}
function DesmarcarNoticiasAntiguas(idNoticia, pagina) {
    id = idNoticia
    fechas = $("#" + id + "F").text().split(" ")[0].split("/");
    hora = $("#" + id + "F").text().split(" ")[1].split(":");
    fechaNoticia = new Date(fechas[2], parseInt(fechas[1]) - 1, fechas[0], hora[0], hora[1], 0, 0)
    fechaUltima = LSFecNot
    if (Date.parse(fechaNoticia) > Date.parse(fechaUltima)) {
        console.log("Fecha mas moderna ->" + $("#" + id + "F").text())
        storage.set("ultFN", fechaNoticia)
        LSFecNot = fechaNoticia
        un = new Date(storage.get("ultFN"));
        $("#ultPuls").text("" + un.getDate() + "/" + (un.getMonth() + 1) + "/" + un.getFullYear() + " " + pad(un.getHours(), 2) + ":" + pad(un.getMinutes(), 2));
    }
    var noticiaseliminadas = false;
    $.each($(".textoNoticia span.fechaDeNoticia"), function (f, fecha) {
        fechas = $(fecha).text().split(" ")[0].split("/");
        hora = $(fecha).text().split(" ")[1].split(":");
        fechaNoticia = new Date(fechas[2], parseInt(fechas[1]) - 1, fechas[0], hora[0], hora[1], 0, 0);
        fechaUltima = new Date(LSFecNot);
        if (Date.parse(fechaNoticia) <= Date.parse(fechaUltima)) {
            if ($(".circuloNuevo:visible").length > 0) {
                noticiaseliminadas = true;
                $(fecha).parent().parent().find(".circuloNuevo").hide()
            }
        }
    });
    $("#" + id + "C").hide()
    if (noticiaseliminadas) {
        numeroMedallas = (pagina - 1) * 10 + $(".circuloNuevo:visible").length
        $("#iniInfo").attr("data-badge", numeroMedallas)
        if (numeroMedallas == 0) {
            $("#iniInfo").removeClass("badge1")
        }
        $(".numAvisos").text(numeroMedallas)
        CambiarNumeroMenu(numeroMedallas)
    }
    $("#texto-" + id).toggle("display")
}
function MostrarNoticia(idNoticia) {
    $("#vntAyudaTitulo").text("NOTICIA")
    $("#vAyudaTexto").empty();
    $("#vAyudaTexto").append($("#" + idNoticia).html());
    history.pushState(undefined, undefined, "#ventanaNoticia")
    $("#ventanaAyuda").show();
}
///////////////////////////////////////////////////////FAVORITOS///////////////////////////////////////////////////////////////////////
var LSFavoritos = []
var idFavoritos
function CrearFavorito(posicion, linea, parada) {
    event.stopPropagation();
    $.mobile.changePage('#pageFavoritos');
    modo = "Nuevo"
    value = ""
    if (posicion != null) {
        modo = "Editar"
        value = 'value="' + LSFavoritos[posicion].Nom + '"'
    }
    htmlTexto = '  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" data-role="none" style="width:100%">' +
    '<input class="mdl-textfield__input" type="text" id="txtfavAliasNuevo" ' + value + '>' +
    '<label class="mdl-textfield__label" for="sample3">Nombre</label>' +
  '</div>'
    htmlTexto += '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height" data-role="none" style="width:100%">' +
        '<input type="text" value="" class="mdl-textfield__input" id="selectLineaFavoritosNuevo" readonly>' +
        '<input type="hidden" value="" name="selectLineaFavoritosNuevo">' +
        '<i class="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>' +
        '<label for="selectLineaFavoritosNuevo" class="mdl-textfield__label">Línea</label>' +
        '<ul for="selectLineaFavoritosNuevo" class="mdl-menu mdl-menu--bottom-left mdl-js-menu">'
    $.each(LSLineas, function (i, o) {
        var select = ""
        if ((modo == "Editar" && o.Cla == LSFavoritos[posicion].CI) || o.Cla == linea) {
            select = ' data-selected="true"'
        }
        htmlTexto += ' <li class="mdl-menu__item" data-val="' + o.Cla + '" ' + select + '>Línea ' + o.Abr + ' : ' + o.Nom + '</li>';
    });
    htmlTexto += '</ul>' +
       '</div>'

    htmlTexto += '<div id="getmdl_2" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height" data-role="none" style="width:100%">' +
        '<input type="text" value="" class="mdl-textfield__input" id="selectParadaFavoritosNuevo" readonly>' +
        '<input type="hidden" value="" name="selectParadaFavoritosNuevo">' +
        '<i class="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>' +
        '<label for="selectParadaFavoritosNuevo" class="mdl-textfield__label">Parada</label>' +
        '<ul for="selectParadaFavoritosNuevo" class="mdl-menu mdl-menu--bottom-left mdl-js-menu">'
    lin = null;
    ppar = null
    if (modo == "Editar") {
        lin = ObtenerItinerario(LSFavoritos[posicion].CI)
        ppar = LSFavoritos[posicion].CP
    } else if (linea != null && parada != null) {
        lin = ObtenerItinerario(linea)
        ppar = parada
    }

    if (modo == "Editar" || (linea != null && parada != null)) {
        contador = 1
        for (var s = 0; s < lin.Sen.length; s++) {
            for (var p = 0; p < lin.Sen[s].Par.length; p++) {
                parada = lin.Sen[s].Par[p]
                var select = ""
                if (parada.CP == ppar) {
                    select = ' data-selected="true"'
                }
                htmlTexto += ' <li class="mdl-menu__item" data-val="' + parada.CP + '" ' + select + '>' + contador + ' - ' + parada.Nom + '</li>';
                contador++
            }
        }
    }



    htmlTexto += '</ul>' +
        '</div>'
    htmlTexto += '<b id="mensajeError"></b>'
    htmlTexto += '<p id="modoDeFavorito" style="display:none">' + modo + '</p>'
    htmlTexto += '<p id="posDeFavorito" style="display:none">' + posicion + '</p>'
    Swal.fire({
        title: modo + ' Favorito',
        html: htmlTexto,
        animation: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar',
        showCancelButton: true,
        reverseButtons: true,
        preConfirm: function () {
            var modo = $("#modoDeFavorito").text()
            var id = $("#posDeFavorito").text()
            var nombre = $("#txtfavAliasNuevo").val()
            var clave = document.getElementsByName("selectLineaFavoritosNuevo")[0].value
            var parada = document.getElementsByName("selectParadaFavoritosNuevo")[0].value
            var repetido = false;
            var nombres = []
            //comprobamos si puede estar repetido si existen mas favoritos
            if (LSFavoritos != null) {
                for (var f = 0; f < LSFavoritos.length; f++) {
                    var favorito = LSFavoritos[f]
                    if (favorito.CP == parada && favorito.CI == clave && (modo == "Nuevo" || (modo == "Editar" && f != id))) {
                        repetido = true;
                    }
                    nombres.push(favorito.Nom)
                }
            } else {
                LSFavoritos = []
            }
            if (nombre == "") {
                //mensaje de error de nombre vacio
                Swal.showValidationMessage("El nombre no puede estar vacio")
            } else if (clave == "" || parada == "") {
                //mensaje de error
                Swal.showValidationMessage("Seleccione linea y parada")
            } else if (repetido) {
                Swal.showValidationMessage("Ya existe un favorito con esa linea y parada")
            } else if (nombres.indexOf(nombre) > -1 && (modo == "Nuevo" || (modo == "Editar" && LSFavoritos[nombres.indexOf(nombre)] != nombre))) {
                Swal.showValidationMessage("El nombre ya está siendo utilizado")
            }


        }
    }).then((result) => {
        if (result.value) {
            var modo = $("#modoDeFavorito").text()
            var posicion = $("#posDeFavorito").text()
            var nombre = $("#txtfavAliasNuevo").val()
            var clave = document.getElementsByName("selectLineaFavoritosNuevo")[0].value
            var parada = document.getElementsByName("selectParadaFavoritosNuevo")[0].value

            GestionarFavorito(posicion, nombre, clave, parada, modo)
        }
    })
    componentHandler.upgradeDom();
    getmdlSelect.init(".getmdl-select")
    componentHandler.upgradeDom();
    $("#selectLineaFavoritosNuevo").change(function () {
        lin = ObtenerItinerario(document.getElementsByName("selectLineaFavoritosNuevo")[0].value)
        htmlParadas = ""
        contador = 1
        for (var s = 0; s < lin.Sen.length; s++) {
            for (var p = 0; p < lin.Sen[s].Par.length; p++) {
                parada = lin.Sen[s].Par[p]
                htmlParadas += ' <li class="mdl-menu__item" data-val="' + parada.CP + '">' + contador + ' - ' + parada.Nom + '</li>';
                contador++
            }
        }
        $("ul[for='selectParadaFavoritosNuevo']").empty()
        $("ul[for='selectParadaFavoritosNuevo']").append(htmlParadas)
        getmdlSelect.init("#getmdl_2")
    })

}
function BorrarFavorito(Posicion) {
    event.stopPropagation();
    Swal.fire({
        title: 'Eliminar',
        text: 'Se va a borrar "' + LSFavoritos[Posicion].Nom + '" de la lista de paradas Favoritas, ¿Desea continuar?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar'
    }).then((result) => {
        if (result.value) {
            favoritoaBorrar = LSFavoritos[Posicion]
            LSFavoritos.splice(Posicion, 1);
            storage.set("FV", LSFavoritos)
            if (LSFavoritos.length == 0) {
                LSFavoritos = null
                localStorage.removeItem("FV")
            }
            Swal.fire(
              'Eliminado',
              '"' + favoritoaBorrar.Nom + '" ha sido eliminado con éxito',
              'success'
            )
            DibujarFavoritos()
        }
    })
}
function GestionarFavorito(id, nombre, clave, parada, modo) {
    //Esta función se encarga de comprobar que el favorito esta correcto antes de guardar

    favorito = { Nom: nombre, CI: clave, CP: parada }
    if (modo == "Nuevo") {
        LSFavoritos.push(favorito)
    } else {
        LSFavoritos[id] = favorito
    }
    storage.set("FV", LSFavoritos)

    DibujarFavoritos()
}
function DibujarFavoritos() {
    window.clearInterval(idFavoritos)
    $("#listaFavoritos").empty()
    if (LSFavoritos == null) {
        $("#InfoFavoritos").text("No tienes ninguna parada favorita. Puedes crear una pulsando sobre el botón de la parte inferior derecha de la pantalla")
    } else {
        $("#InfoFavoritos").text("Pulsa sobre un favorito para obtener más información")
    }
    html = ""
    if (LSFavoritos != null) {
        for (var df = 0; df < LSFavoritos.length; df++) {
            favorito = LSFavoritos[df]
            linea = ObtenerItinerario(favorito.CI)
            parada = ObtenerParada(favorito.CP)
            html += '<li class="mdl-list__item mdl-list__item--three-line"  onclick="VerParadaFavorito(' + df + ')">' +
                            '<span class="mdl-list__item-primary-content">' +
                                '<i class="material-icons mdl-list__item-icon icFavorito" style="color:#' + linea.BC + '">star</i>' +
                                '<p class="WrapText"><strong>' + favorito.Nom + '</strong> ' + linea.Abr + ' - ' + parada.Nom + ' </p>' +
                                '<span id="favorito' + df + '" class="mdl-list__item-text-body TextFavorito">' +
                                    'Obteniendo...' +
                                    //'<img src="img/reloj.png" alt="Hora" class="icon"> <strong>1.</strong> 5 min <br />'+
                                    //'<img src="img/reloj.png" alt="Hora" class="icon"> <strong>2.</strong> 12 min'+
                                '</span>' +
                            '</span>' +
                            '<span class="mdl-list__item-secondary-content">' +
                                '<a class="mdl-list__item-secondary-action" onclick="CrearFavorito(' + df + ')"><i class="material-icons">edit</i></a>' +
                                 '<a class="mdl-list__item-secondary-action" onclick="BorrarFavorito(' + df + ')"><i class="material-icons">delete</i></a>' +
                            '</span>' +
                       '</li>'
        }
    }
    $("#listaFavoritos").append(html)
    ObtenerTiempoFavoritos()
}
function VerParadaFavorito(posicion) {
    var f = LSFavoritos[posicion]
    var lin = ObtenerItinerario(f.CI)
    var sent = ObtenerSentidoParada(lin, f.CP)
    var pos = ObtenerPosicionParada(lin, f.CP)
    LineaParadaPulsada(f.CP, f.CI, pos, sent, 3, { index: posicion })
}
function ObtenerTiempoFavoritos() {
    //obtenemos los codigos de las paradas favoritas
    if (LSFavoritos != null) {
        var codigos = ""
        for (var otf = 0; otf < LSFavoritos.length; otf++) {
            codigos += LSFavoritos[otf].CP + "|"
        }
        codigos = codigos.substring(0, codigos.length - 1)
        if (online) {
            $.ajax({
                type: 'GET',
                url: urlDatos + 'api/JQ/JSONQRYZIP/ESTPAR|' + codigos + '?i=' + Math.random() + '&' + servidor + '&p=' + plataforma + '&v=' + version,
                dataType: 'text',
                mimeType: 'text/plain; charset=x-user-defined',
                retryCount: 0,
                retryLimit: 5,
                timeout: tiempoRecargaMilis,
                success: function (data) {
                    JSZip.loadAsync(ZipToBlob(data))
                        .then(function (zip) {
                            return zip.file("datos.json").async("string")
                        })
                        .then(function success(text) {
                            try {
                                //TODO: comprobar hash
                                data = JSON.parse(text.substring(1))
                                console.log(data)
                                var EPCompleto = []

                                for (var a = 0; a < data.EP.length; a++) {
                                    var nuePar = ObtenerParada(data.EP[a].CP)
                                    nuePar.EB = data.EP[a].EB
                                    $.each(nuePar.EB, function (c, coche) {
                                        coche.TP = GetSeconds(data.FH, coche.TP).toString()//.push(CrearCoche(coche, data.FH))
                                    })
                                    EPCompleto.push(nuePar)
                                }

                                data.EP = EPCompleto
                                storage.set('EPR' + codigos, data)
                                storage.set('UTHP' + codigos, Date.now())
                                DibujarTiempoFavoritos(data)
                            } catch (ex) {
                                //TODO: CapturarExcepciones
                                //if (!saltaSolicitarLineasParStorage) {
                                //    if (storage.isSet('EPR'+cadenaParadas)) {
                                ProblemaConexion("DATOSCORRUPTOS", false, 'El servidor ha devuelto información, pero falla algo en código:' + ex.stack)
                                //    // saltaSolicitarLineasParStorage = true;
                                //    }
                                //    //else {
                                //    //    SolicitarLineasConParadasStorage(claveLI, comando, extra)
                                //    //    saltaSolicitarLineasParStorage = true;
                                //    //}
                                //} else {
                                //    ProblemaConexion("DATOSCORRUPTOS", false, ex.message)
                                //}
                            }
                        }, function error(e) {
                            ErrorServidor('errorZip', 'LINP01', 'ocurrencia baja')
                        });
                },
                error: function (xmlhttprequest, textstatus, message) {
                    ProblemaConexion("TIMEOUT", false, message)
                },
                async: false
            });
        } else {
            SinConexion(true);
        }
    }
}
function DibujarTiempoFavoritos(paradas) {
    for (var dtf = 0; dtf < LSFavoritos.length; dtf++) {
        var fav = LSFavoritos[dtf]
        html = ""
        for (dtf2 = 0; dtf2 < paradas.EP.length; dtf2++) {
            var par = paradas.EP[dtf2]
            if (par.CP == fav.CP) {
                var maximo = 2
                var contador = 1;
                for (dtf3 = 0; dtf3 < par.EB.length; dtf3++) {
                    var bus = par.EB[dtf3]
                    var clave = bus.Lin + "." + bus.Iti
                    if (fav.CI == clave) {
                        html += '<img src="img/reloj.png" alt="Hora" class="icon"> <b style="margin-left:5px"> ' + contador + '.</b> ' + bus.TP.toHHorMMorSS() + '<br>'
                        maximo--
                        contador++
                    }
                    if (maximo == 0) {
                        break;
                    }
                }
                break;
            }
        }
        if (html == "") {
            html = "Sin información"
        }
        $("#favorito" + dtf).empty()
        $("#favorito" + dtf).append(html)
    }
    $(".ultActFavoritos").empty()
    $(".ultActFavoritos").append('Última actualización: ' + new Date().getHours() + ':' + pad(new Date().getMinutes(), 2) + ':' + pad(new Date().getSeconds(), 2) + '</span>')
    idFavoritos = TimeoutRecargarParadaFavoritosAutomaticamente()
}
function TimeoutRecargarParadaFavoritosAutomaticamente() {
    console.log("favoritos A")
    tiempo = tiempoRecargaMilis
    return window.setInterval(function () {
        RecargarParadaFavoritosAutomaticamente();
    }, tiempo);
}
function RecargarParadaFavoritosAutomaticamente() {
    window.clearInterval(idFavoritos)
    if (online) {
        ObtenerTiempoFavoritos()
    } else {
        AbrirParadaOffline()
    }
}
function TimeoutRecargarParadaPulsadaFavoritosAutomaticamente(pos) {
    console.log("favoritos B")
    tiempo = tiempoRecargaMilis
    return window.setInterval(function () {
        RecargarParadaPulsadaFavoritosAutomaticamente(pos);
    }, tiempo);
}
function RecargarParadaPulsadaFavoritosAutomaticamente(pos) {
    window.clearInterval(idFavoritos)
    if (online) {
        VerParadaFavorito(pos)
    } else {
        AbrirParadaOffline()
    }
}
////////////////////////////////////////////////////////ALARMA BAJADA PARADA////////////////////////////////////////////////////////////////////
var AlarmaBajada = null;
var AlarmaBajadaActiva = false;
var mapaAlarma = null;
var layerAlarma = null;
var idAlarmaBajada = null;
function AlarmaModoFormulario() {
    AlarmaBajada = null;
    AlarmaBajadaActiva = false;
    storage.set("AB", AlarmaBajada);
    $("#AlarmaBus").hide()
    $("#AlarmaFinalizada").hide()
    $("#formularioAlarma").show()
    if ($("ul[for=ddLinea] li").length == 0) {
        var dataLi = ""
        for (var i = 0; i < LSMenuLineas.length; i++) {
            var lin = LSMenuLineas[i]
            dataLi += '<li class="mdl-menu__item" data-val="' + lin.Cla + '">Línea ' + lin.Abr + ' : ' + lin.Nom + '</li>'
        }
        $("ul[for=ddLinea]").append(dataLi)
        $("#ddLinea").change(function () {
            lin = ObtenerItinerario(document.getElementsByName("ddLinea")[0].value)
            htmlParadas = ""
            contador = 1
            for (var s = 0; s < lin.Sen.length; s++) {
                for (var p = 0; p < lin.Sen[s].Par.length; p++) {
                    parada = lin.Sen[s].Par[p]
                    htmlParadas += ' <li class="mdl-menu__item" data-val="' + parada.CP + '">' + contador + ' - ' + parada.Nom + '</li>';
                    contador++
                }
            }
            $("ul[for='ddParada']").empty()
            $("ul[for='ddParada']").append(htmlParadas)
            getmdlSelect.init("#getmdl_Parada")

            buses = ObtenerAutobusesActivos(lin.Cla)
            htmlBuses=''
            for (var s = 0; s < buses.length; s++) {
                htmlBuses += ' <li class="mdl-menu__item" data-val="' + buses[s].CB + '">' + buses[s].CB + '</li>';
            }
            $("ul[for='ddBus']").empty()
            $("ul[for='ddBus']").append(htmlBuses)
            getmdlSelect.init("#getmdl_Buses")

            componentHandler.upgradeDom();
        })
        getmdlSelect.init(".getmdl-select")
        componentHandler.upgradeDom();
    }
}
function CrearAlarmaBajada() {
    var linea = document.getElementsByName("ddLinea")[0].value
    var lineaDef = $("ul[for='ddLinea'] li.selected").text()
    var parada = document.getElementsByName("ddParada")[0].value
    var paradaDef = $("ul[for='ddParada'] li.selected").text()
    var codBus = $("ul[for='ddBus'] li.selected").text()
    var tiempo = document.getElementsByName("ddAvisame")[0].value
    var tiempoDef = $("ul[for='ddAvisame'] li.selected").text()
    var modo = "parada"
    if (tiempo.indexOf("m") > -1) {
        modo = "tiempo"
        tiempo = tiempo.substring(0, tiempo.length - 1)
    }
    if (linea == "" || parada == "" || codBus == "" || tiempo == "") {
        LanzarSwalBasico("Error", "Por favor rellene todos los campos")
    } else {
        //creamos la alarma
        AlarmaBajada = { CL: linea, CLD: lineaDef, CP: parada, CPD: paradaDef, CB: codBus, TP: tiempo, TPD: tiempoDef, MD: modo }
        AlarmaBajadaActiva = true
        storage.set("AB", AlarmaBajada)
        AlarmaModoMapa()
    }

}
function AlarmaModoMapa() {
    $("#formularioAlarma").hide()
    $("#AlarmaFinalizada").hide()
    $("#AlarmaBus").show()
    $("#btnCancAlarma").show()
    if (mapaAlarma == null) {
        mapaAlarma = L.map('mapCanvasAlarma').setView([initLat, initLng], 14);
        L.tileLayer('https://tile.tecnosis.net/hot/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            id: 'mapa.map'
        }).addTo(mapaAlarma);
        $(window).on("resize", function () { $("#mapCanvasAlarma").height($(window).height() - 40); mapaAlarma.invalidateSize(); }).trigger("resize");
        mapaAlarma.on('zoomend', function () {
            ZoomCambiadoAlarma(mapaAlarma.getZoom());
        });
        layerAlarma = CrearLayer(AlarmaBajada.CL, mapaAlarma)
        ZoomCambiadoAlarma(mapaAlarma.getZoom())
    }
    ObtenerBusAlarmaBajada()
}
function AlarmaFinalizada(resultado) {
    $("#formularioAlarma").hide()
    $("#AlarmaFinalizada").show()
    $("#AlarmaBus").hide()
    $("#btnCancAlarma").hide()
    switch (resultado) {
        case 'ErrorBus':
            html = '<h3 class="blue">Error</h3>' +
                '<p class="pad">No se encuentran datos para un autobús con este código, compruebe que el código está disponible e inténtelo de nuevo</p>' +
                '<button id="btnCerrarAlarma" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect" data-role="none" onclick="AlarmaModoFormulario()">Aceptar</button>'
            $("#AlarmaFinalizada").empty()
            $("#AlarmaFinalizada").append(html)
            break
        case 'Finalizado':
            var audio = new Audio('./sounds/alarmclock.mp3');
            audio.play();
            texto=AlarmaBajada.TP+" "+AlarmaBajada.MD
            if (AlarmaBajada.MD=="tiempo") {
                texto = AlarmaBajada.TP + " minuto"
            }
            if (AlarmaBajada.TP > 1) {
                texto+='s'
            }

            html = '<h3 class="blue">¡Alerta!</h3>' +
                '<p class="pad">El autobús va a llegar a su destino en ' + texto + ' </p>' +
                '<button id="btnCerrarAlarma" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect" data-role="none" onclick="AlarmaModoFormulario()">Aceptar</button>'
            $("#AlarmaFinalizada").empty()
            $("#AlarmaFinalizada").append(html)
            break;
        case 'Cancelar': 
            html = '<h3 class="blue">Cancelada</h3>' +
               '<p class="pad">Se ha Cancelado la alarma por parte del usuario</p>' +
               '<button id="btnCerrarAlarma" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect" data-role="none" onclick="AlarmaModoFormulario()">Aceptar</button>'
            $("#AlarmaFinalizada").empty()
            $("#AlarmaFinalizada").append(html)
    }
}
function ObtenerBusAlarmaBajada() {
    JSZipUtils.getBinaryContent(urlDatos + 'api/JQ/JSONQRYZIP/ESTGRAL|' + AlarmaBajada.CL + '?i=' + Math.random() + '&' + servidor + '&p=' + plataforma + '&v=' + version, function (err, data) {
        var elt = document.getElementById('jszip_utils');
        if (err) {
            ErrorServidor('noRespuesta', 'PUGR01', '')
            return;
        } else {
            try {
                JSZip.loadAsync(data)
                    .then(function (zip) {
                        return zip.file("datos.json").async("string")
                    })
                    .then(function success(text) {
                        try {
                            data = JSON.parse(text.substring(1))
                            var busSeguimiento = null

                            $.each(data.EL[0].EC, function (ec, bus) {
                                if (bus.CB == AlarmaBajada.CB && bus.Iti == AlarmaBajada.CL.split(".")[1]) {
                                    bus.TPS = getSeconds(data.FH, bus.TPS).toString()
                                    bus.TPF = getSeconds(data.FH, bus.TPF).toString()
                                    busSeguimiento = bus
                                }
                            });
                            if (layerAlarma.autobuses != null) {
                                mapaAlarma.removeLayer(layerAlarma.autobuses)
                            }

                            if (busSeguimiento != null) {
                                var paradasEnMedio = CalcularParadasEnMedio(AlarmaBajada.CL, busSeguimiento.CPS, AlarmaBajada.CP)
                                paradasEnMedio = paradasEnMedio - AlarmaBajada.TP
                                if (paradasEnMedio >= AlarmaBajada.TP) {
                                    var layerBus = L.layerGroup().addTo(mapaAlarma);
                                    angulo = busSeguimiento.OB + 90;
                                    lat = busSeguimiento.XY[1]
                                    lng = busSeguimiento.XY[0]
                                    iti = ObtenerItinerario(AlarmaBajada.CL)
                                    var latlng = new L.LatLng(lat, lng);
                                    var markerbus = L.marker(latlng, {
                                        zIndexOffset: 1000,
                                        icon: new L.DivIcon({
                                            className: 'my-div-iconj',
                                            html: '<div id="container" style="cursor:pointer;transform: rotate(' + angulo + 'deg);-webkit-transform: rotate(' + angulo + 'deg)">' +
                                                  '<img src="img/blue-bus-180-hi.png" alt="bus" class="autobusImg">' +
                                                  '<span id="" class="lineaBus bolabus" style="background-color:#' + iti.BC + ';color:#' + iti.FC + ';transform: rotate(' + -angulo + 'deg);-webkit-transform: rotate(' + -angulo + 'deg)">' + iti.Abr + '</span>' + '</div>',
                                            iconAnchor: [21.5, 11],

                                        }),
                                        CB: busSeguimiento.CB,
                                        busSeguimiento: busSeguimiento
                                    }).addTo(layerBus).on('click', function (e) {
                                        MostrarInformacionBusMapa(e.target.options.busSeguimiento, linea + "." + itinerario, e)
                                    });
                                    layerAlarma.autobuses = layerBus
                                    var a = '<strong class="blue" >Linea: </strong><span>' + AlarmaBajada.CLD + '</span><br>' +
                                        '<strong class="blue">Parada Siguiente: </strong><span>' + ObtenerPosicionParada(ObtenerItinerario(AlarmaBajada.CL), busSeguimiento.CPS) + ' - ' + ObtenerParada(busSeguimiento.CPS).Nom + '</span><br>' +
                                        '<strong class="blue">Parada de Bajada: </strong><span>' + AlarmaBajada.CPD + '</span><br>' +
                                        '<strong class="blue">Código de Autobús: </strong><span>' + AlarmaBajada.CB + '</span><br>' +
                                        '<strong class="blue">Paradas para Llegar: </strong><span>' + (paradasEnMedio + parseInt(AlarmaBajada.TP)) + "</span><br>" +
                                        '<strong class="blue">Avisame ' + AlarmaBajada.TPD + '</strong>'

                                    $("#ventanaDatosBajada").empty();
                                    $("#ventanaDatosBajada").append(a);
                                    window.clearInterval(idAlarmaBajada)
                                    idAlarmaBajada = TimeoutAlarmasAutobus()
                                } else {
                                    window.clearInterval(idAlarmaBajada)
                                    AlarmaFinalizada("Finalizado");
                                }
                            } else {
                                window.clearInterval(idAlarmaBajada)
                                AlarmaFinalizada("ErrorBus");
                            }
                        } catch (ex) {
                            console.log(ex + "" + text.toString())
                        }


                    }, function error(e) {
                        ErrorServidor('errorZip', 'PUGR01', 'ocurrencia baja')
                    });
            } catch (e) {
                ErrorServidor('errorDesconocido', 'PUGR01', e)
            }
        }
    });
}
function ObtenerAutobusesActivos(idLinea) {
    var dt=null
    url = urlDatos + 'api/JQ/JSONQRY/ESTGRAL|' + idLinea + '?i=' + Math.random() + '&' + servidor + '&p=' + plataforma + '&v=' + version
    $.ajax({
        type: 'GET',
        url: url,
        dataType: "json",
        timeout: tiempoRecargaMilis,
        success: function (data) {
            dt = data
        },
        error: function (xmlhttprequest, textstatus, message) {
            //TODO: Esto deberia dar un error tipo "toast" en lugar de esto, ya paso que la app daba error de conexión aqui y aprecia que la app estaba rota, pero solo eran las noticias
        },
        async: false
    });
    return dt.EL[0].EC
}

function TimeoutAlarmasAutobus(codigo, clave) {
    tiempo = tiempoRecargaMilis
    return window.setInterval(function () {
        window.clearInterval(idAlarmaBajada)
        ObtenerBusAlarmaBajada();
    }, tiempo);
}
function ZoomCambiadoAlarma(zoom) {
    if (zoom <= 12) {
        //Solo muestra la linea (ni marcadores ni nada).
        OcultarParadasAlarma();
    } else if (zoom == 13) {
        //    //Aparecen las paradas y los coches
        MostrarParadasCochesAlarma();
    }
    else if (zoom >= 14 && zoom <= 17) {
        //    //Cambiar niveles de zoom
        nivel = zoom - 13;
        AbrirInfoBoxesAlarmaNivel(nivel);//De momento
    } else if (zoom >= 18) {
        //    //todas
        AbrirInfoBoxesAlarmaNivel(5);
    }
}
function OcultarParadasAlarma() {
    mapaAlarma.removeLayer(layerAlarma.markers)
    mapaAlarma.removeLayer(layerAlarma.zoom1)
    mapaAlarma.removeLayer(layerAlarma.zoom2)
    mapaAlarma.removeLayer(layerAlarma.zoom3)
    if (layerAlarma.autobuses != null) {
        mapaAlarma.removeLayer(layerAlarma.autobuses)
    }

}
function MostrarParadasCochesAlarma() {
    mapaAlarma.addLayer(layerAlarma.markers)
    if (layerAlarma.autobuses != null) {
        mapaAlarma.addLayer(layerAlarma.autobuses)
    }
}
function CerrarInfoBoxesAlarmaMapa() {
    mapaAlarma.removeLayer(layerAlarma.zoom1)
    mapaAlarma.removeLayer(layerAlarma.zoom2)
    mapaAlarma.removeLayer(layerAlarma.zoom3)
}
function AbrirInfoBoxesAlarmaNivel(nivel) {
    CerrarInfoBoxesAlarmaMapa()

    if (nivel >= 1) {
        mapaAlarma.addLayer(layerAlarma.zoom1)
    }
    if (nivel >= 2) {
        mapaAlarma.addLayer(layerAlarma.zoom2)
    }
    if (nivel >= 3) {
        mapaAlarma.addLayer(layerAlarma.zoom3)
    }
}
function CalcularParadasEnMedio(itinerario, codigoA, codigoB) {
    var itinerario = ObtenerItinerario(itinerario)
    var posB = ObtenerPosicionParada(itinerario, codigoB)
    var posA = ObtenerPosicionParada(itinerario, codigoA)
    return posB - posA
}
function AnimarAlarmas() {
    if ($("#ventanaDatosBajada").height() != 0) {
        $("#ventanaDatosBajada").animate({
            height: 0,
        }, 300, "linear", function () {
            $("#ventanaDatosBajada").hide();
        })
    } else {
        $("#ventanaDatosBajada").show()

        $("#ventanaDatosBajada").animate({
            height: 150,
        }, 300, "linear", function () {

        })
    }
}

/////////////////////////////////////////////////////////ALARMAS////////////////////////////////////////////////////////////////////////////////
var LSAlarma = []
var idAlarma
function CrearAlerta(posicion, linea, parada) {
    event.stopPropagation();
    $.mobile.changePage('#pageAlertas');
    modo = "Nuevo"
    value = ""
    if (posicion != null) {
        modo = "Editar"
        value = 'value="' + LSAlarma[posicion].Nom + '"'
    }
    var htmlTexto = ""
    htmlTexto += '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height" data-role="none" style="width:100%">' +
        '<input type="text" value="" class="mdl-textfield__input" id="selectLineaAlarmasNuevo" readonly>' +
        '<input type="hidden" value="" name="selectLineaAlarmasNuevo">' +
        '<i class="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>' +
        '<label for="selectLineaAlarmasNuevo" class="mdl-textfield__label">Línea</label>' +
        '<ul for="selectLineaAlarmasNuevo" class="mdl-menu mdl-menu--bottom-left mdl-js-menu">'
    $.each(LSLineas, function (i, o) {
        var select = ""
        if ((modo == "Editar" && o.Cla == LSLineas[posicion].CI) || o.Cla == linea) {
            select = ' data-selected="true"'
        }
        htmlTexto += ' <li class="mdl-menu__item" data-val="' + o.Cla + '" ' + select + '>Línea ' + o.Abr + ' : ' + o.Nom + '</li>';
    });
    htmlTexto += '</ul>' +
       '</div>'

    htmlTexto += '<div id="getmdl_2" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height" data-role="none" style="width:100%">' +
        '<input type="text" value="" class="mdl-textfield__input" id="selectParadaAlarmasNuevo" readonly>' +
        '<input type="hidden" value="" name="selectParadaAlarmasNuevo">' +
        '<i class="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>' +
        '<label for="selectParadaAlarmasNuevo" class="mdl-textfield__label">Parada</label>' +
        '<ul for="selectParadaAlarmasNuevo" class="mdl-menu mdl-menu--bottom-left mdl-js-menu">'
    lin = null;
    ppar = null
    if (modo == "Editar") {
        lin = ObtenerItinerario(LSAlarma[posicion].CI)
        ppar = LSAlarma[posicion].CP
    } else if (linea != null && parada != null) {
        lin = ObtenerItinerario(linea)
        ppar = parada
    }

    if (modo == "Editar" || (linea != null && parada != null)) {
        contador = 1
        for (var s = 0; s < lin.Sen.length; s++) {
            for (var p = 0; p < lin.Sen[s].Par.length; p++) {
                parada = lin.Sen[s].Par[p]
                var select = ""
                if (parada.CP == ppar) {
                    select = ' data-selected="true"'
                }
                htmlTexto += ' <li class="mdl-menu__item" data-val="' + parada.CP + '" ' + select + '>' + contador + ' - ' + parada.Nom + '</li>';
                contador++
            }
        }
    }

    htmlTexto += '</ul>' +
        '</div>'

    htmlTexto += '<div id="getmdl_3" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height" data-role="none" style="width:100%">' +
        '<input type="text" value="" class="mdl-textfield__input" id="selectTiempoAlarmasNuevo" readonly>' +
        '<input type="hidden" value="" name="selectTiempoAlarmasNuevo">' +
        '<i class="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>' +
        '<label for="selectTiempoAlarmasNuevo" class="mdl-textfield__label">Hora</label>' +
        '<ul for="selectTiempoAlarmasNuevo" class="mdl-menu mdl-menu--bottom-left mdl-js-menu">'
    //lin = null;
    //ppar = null
    //if (modo == "Editar") {
    //    lin = ObtenerItinerario(LSAlarma[posicion].CI)
    //    ppar = LSAlarma[posicion].CP
    //} else if (linea != null && parada != null) {
    //    lin = ObtenerItinerario(linea)
    //    ppar = parada
    //}

    //if (modo == "Editar" || (linea != null && parada != null)) {
    //    contador = 1
    //    for (var s = 0; s < lin.Sen.length; s++) {
    //        for (var p = 0; p < lin.Sen[s].Par.length; p++) {
    //            parada = lin.Sen[s].Par[p]
    //            var select = ""
    //            if (parada.CP == ppar) {
    //                select = ' data-selected="true"'
    //            }
    //            htmlTexto += ' <li class="mdl-menu__item" data-val="' + parada.CP + '" ' + select + '>' + contador + ' - ' + parada.Nom + '</li>';
    //            contador++
    //        }
    //    }
    //}

    htmlTexto += '</ul>' +
        '</div>'
    htmlTexto += '<b id="mensajeError"></b>'
    htmlTexto += '<p id="modoDeAlarmas" style="display:none">' + modo + '</p>'
    htmlTexto += '<p id="posDeAlarmas" style="display:none">' + posicion + '</p>'
    Swal.fire({
        title: modo + ' Aviso',
        html: htmlTexto,
        animation: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar',
        showCancelButton: true,
        reverseButtons: true,
        preConfirm: function () {
            var modo = $("#modoDeAlarmas").text()
            var id = $("#posDeAlarmas").text()
            var clave = document.getElementsByName("selectLineaAlarmasNuevo")[0].value
            var parada = document.getElementsByName("selectParadaAlarmasNuevo")[0].value
            var repetido = false;
            var nombres = []
            //comprobamos si puede estar repetido si existen mas alarmas
            if (LSAlarma != null) {
                for (var f = 0; f < LSAlarma.length; f++) {
                    var alarma = LSAlarma[f]
                    if (alarma.CP == parada && alarma.CI == clave && alarma.TP && (modo == "Nuevo" || (modo == "Editar" && f != id))) {
                        repetido = true;
                    }
                    nombres.push(alarma.Nom)
                }
            } else {
                LSAlarma = []
            }
            if (clave == "" || parada == "") {
                //mensaje de error
                Swal.showValidationMessage("Seleccione linea y parada")
            } else if (repetido) {
                Swal.showValidationMessage("Ya existe un alarma con esa linea y parada para ese horario")
            }
        }
    }).then((result) => {
        if (result.value) {
            var modo = $("#modoDeAlarmas").text()
            var posicion = $("#posDeAlarmas").text()
            var clave = document.getElementsByName("selectLineaAlarmasNuevo")[0].value
            var parada = document.getElementsByName("selectParadaAlarmasNuevo")[0].value

            GestionarFavorito(posicion, nombre, clave, parada, modo)
        }
    })
    componentHandler.upgradeDom();
    getmdlSelect.init(".getmdl-select")
    componentHandler.upgradeDom();
    $("#selectLineaAlarmasNuevo").change(function () {
        lin = ObtenerItinerario(document.getElementsByName("selectLineaAlarmasNuevo")[0].value)
        htmlParadas = ""
        contador = 1
        for (var s = 0; s < lin.Sen.length; s++) {
            for (var p = 0; p < lin.Sen[s].Par.length; p++) {
                parada = lin.Sen[s].Par[p]
                htmlParadas += ' <li class="mdl-menu__item" data-val="' + parada.CP + '">' + contador + ' - ' + parada.Nom + '</li>';
                contador++
            }
        }
        $("ul[for='selectParadaAlarmasNuevo']").empty()
        $("ul[for='selectParadaAlarmasNuevo']").append(htmlParadas)
        getmdlSelect.init("#getmdl_2")
    })
    //$("#selectParadaAlarmasNuevo").change(function () {
    //    lin = ObtenerParada(document.getElementsByName("selectParadaAlarmasNuevo")[0].value)
    //    ///AQUI VA EL SELECT DE LOS TIEMPOS
    //    //htmlParadas = ""
    //    //contador = 1
    //    //for (var s = 0; s < lin.Sen.length; s++) {
    //    //    for (var p = 0; p < lin.Sen[s].Par.length; p++) {
    //    //        parada = lin.Sen[s].Par[p]
    //    //        htmlParadas += ' <li class="mdl-menu__item" data-val="' + parada.CP + '">' + contador + ' - ' + parada.Nom + '</li>';
    //    //        contador++
    //    //    }
    //    //}
    //    $("ul[for='selectTiempoAlarmasNuevo']").empty()
    //    $("ul[for='selectTiempoAlarmasNuevo']").append(htmlParadas)
    //    getmdlSelect.init("#getmdl_2")
    //})

}

///////////////////////////////////////////////////////BUSCAR PARADAS///////////////////////////////////////////////////////////////////////////
var idBusqueda
var normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÇçJjBbCcZz",
        to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuccGgVvZzSs",
        mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
        mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
        var ret = [];
        for (var i = 0, j = str.length; i < j; i++) {
            var c = str.charAt(i);
            if (mapping.hasOwnProperty(str.charAt(i)))
                ret.push(mapping[c]);
            else
                ret.push(c);
        }
        return ret.join('');
    }

})();
function sortResults(array, prop, asc, subProp) {
    array = array.sort(function (a, b) {
        if (asc) {
            if (a[prop] > b[prop]) {
                return 1
            } else if (a[prop] < b[prop]) {
                return -1
            } else if (subProp != null) {
                if ((a[prop] == b[prop]) && (a[subProp] > b[subProp])) {
                    return 1
                } else if ((a[prop] == b[prop]) && (a[subProp] < b[subProp])) {
                    return -1
                }
            } else {
                return 0
            }
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
    return array
}
function RealizarBusqueda(texto) {
    var htmlBusqueda = ""
    var arrayParadasBusqueda = []
    if (texto.toLowerCase() == "*a") {
        arrayParadasBusqueda = sortResults(LSParadas, 'Nom', true, 'CP')
    } else if (texto.toLowerCase() == "*n") {
        arrayParadasBusqueda = sortResults(LSParadas, 'CP', true, 'Nom')
    } else {
        paradas = LSParadas
        for (i = 0; i < paradas.length; i++) {
            var NomPar = normalize(paradas[i].Nom).toLowerCase()
            if (NomPar.indexOf(normalize(texto.toLowerCase())) >= 0 || paradas[i].CP.toString().indexOf(texto) >= 0) {
                arrayParadasBusqueda.push(paradas[i])
            }
        }
        arrayParadasBusqueda = sortResults(arrayParadasBusqueda, 'Nom', true, 'CP')
    }
    htmlBusqueda += '<center><h4 style="margin-top: 5px;"><strong><b id="numParBusq"></b></strong></h4></center>'
    var paradaCounter = 0;
    for (i = 0; i < arrayParadasBusqueda.length; i++) {
        parada = arrayParadasBusqueda[i]
        if (parada.Iti.length > 0) {
            paradaCounter += 1
            //htmlBusqueda += "<p>" + parada.Codigo + ", " + parada.Nombre + "</p>";
            var onclick = 'VerParadaCombi(' + parada.CP + ')'
            var nom = parada.Nom
            var cod = parada.CP
            if (texto != "") {
                var indexBusq = normalize(parada.Nom).toLowerCase().indexOf(normalize(texto))
                if (indexBusq > -1) {
                    split = normalize(nom.toLowerCase()).split(normalize(texto))
                    aLength = split[0].length
                    bLength = aLength + texto.length
                    mitadA = parada.Nom.substring(0, aLength)
                    trozo = parada.Nom.substring(aLength, bLength)
                    mitadB = parada.Nom.substring(bLength)
                    nom = mitadA + '<span style="color:#169ff1">' + trozo + '</span>' + mitadB
                }
                var indexBusq = parada.CP.toString().indexOf(texto)
                if (indexBusq > -1) {
                    split = parada.CP.toString().split(texto)

                    cod = split[0] + '<span style="color:#169ff1">' + texto + '</span>' + split[1]
                }
            }


            htmlBusqueda += '<div class="elementoBusqueda" onclick="' + onclick + '">' +
            '<p class="tituloElementoBusqueda">' + cod + ': ' + nom + '</p>'
            codlineas = parada.Iti;
            htmlBusqueda += '<table class="">'
            //htmlLineas = parada.htmlLineas;
            for (c = 0; c < codlineas.length; c++) {
                htmlBusqueda += "<tr>"
                miLinea = ObtenerItinerario(codlineas[c]);
                sentido = ObtenerSentidoParada(miLinea, parada.CP)
                htmlBusqueda += '<td style="Text-align:right;min-width: 50px;">' + ObtenerAbreviaturaMargen(miLinea.Abr, miLinea.BC, miLinea.FC) + '</td>'
                //htmlBusqueda += htmlLineas[c]
                if (sentido == 1) {//IDA
                    var nombreRegulacion = miLinea.Sen[0].Par[miLinea.Sen[0].Par.length - 1].Nom
                    if (miLinea.Sen.length > 1) {
                        nombreRegulacion = miLinea.Sen[1].Par[0].Nom
                    }
                    htmlBusqueda += '<td><p class="sentidoBusq"><span class="icon-arrow-right2" style="font-size: 13px;margin-right: 5px;margin-left: 5px;"></span>IDA - ' + nombreRegulacion + '</p></td>'
                } else {//VTA
                    var nomParPrimera = miLinea.Sen[0].Par[0].Nom
                    htmlBusqueda += '<td><p class="sentidoBusq"><span class="icon-arrow-right2" style="font-size: 13px;margin-right: 5px;margin-left: 5px;"></span>VTA - ' + nomParPrimera + '</p></td>'
                }
                htmlBusqueda += '</tr>'
            }
            htmlBusqueda += '</table></div>'
        }
    }
    $('#resultadoBusqueda').empty()
    $('#resultadoBusqueda').append(htmlBusqueda)
    $('#numParBusq').append('Número de Paradas: ' + paradaCounter)
    $(window).resize(function () {
        if ($.mobile.activePage.attr('data-url') == 'pageBuscarParada') {
            $('.textoBusquedaHellip').width(($('#resultadoBusqueda button').first().width() - 20) + 'px')
            $('.textosentiHellip').css('max-width', $('.textoBusquedaHellip').width())
        }
    });
}
function VerParadaCombi(codigo) {
    LineaParadaPulsada(codigo, null, null, null, 2)
}
function TimeoutRecargarParadaBusquedaAutomaticamente(codigo) {
    tiempo = tiempoRecargaMilis
    return window.setInterval(function () {
        RecargarParadaBusquedaMostradaAutomaticamente(codigo);
    }, tiempo);
}
function RecargarParadaBusquedaMostradaAutomaticamente(codigo) {
    window.clearInterval(idBusqueda)
    if (online) {
        LineaParadaPulsada(codigo, null, null, null, 2)
    } else {
        AbrirParadaOffline()
    }
}
///////////////////////////////////////Opciones////////////////////////////////////////////////////
var mostrarBus
var verCorrespondencia
var verHoraLlegada
var favoritosInicio
var vibracion
var sonido
function MostrarAutobus() {
    mostrarBus = document.querySelector("#switch-MostrarBus").checked
    storage.set("MB", mostrarBus)
    if (mostrarBus == false) {
        OcultarAutobuses()
    }
}
function VerCorrespondencias() {
    verCorrespondencia = document.querySelector("#switch-VerCorrespondencias").checked
    storage.set("VC", verCorrespondencia)
}
function VerHoraLlegada() {
    verHoraLlegada = document.querySelector("#switch-VerHoraLlegada").checked
    storage.set("VHL", verHoraLlegada)
}
function FavoritosInicio() {
    favoritosInicio = document.querySelector("#switch-FavoritosIniciar").checked
    storage.set("FI", favoritosInicio)
}
function Vibracion() {
    vibracion = document.querySelector("#switch-Vibracion").checked
    storage.set("VB", vibracion)
}
function Sonido() {
    sonido = document.querySelector("#switch-Sonido").checked
    storage.set("SN", sonido)
}
function MostrarVersion(idAyuda) {
    $("#vntAyudaTitulo").text("VERSIÓN")
    $("#vAyudaTexto").empty();
    $("#vAyudaTexto").append($("#" + idAyuda).html());
    history.pushState(undefined, undefined, "#ventanaAyuda")
    $("#ventanaAyuda").show();
}
//////////////////////////////////RECARGAS/////////////////////////////////////////////////////////
function Recargar() {
    Swal.fire({
        title: "Recarga de Tarjetas",
        text: 'Se le va a redireccionar a la página web para la gestión de Recargas de Tarjetas de EMTUSA. ¿Desea continuar?',
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No"
    }).then((result) => {
        if (result.value == true) {
            window.open('http://recargas.emtusahuelva.es/', '_blank');
        }
    })

}
function PagoMovil() {
    Swal.fire({
        title: "Pago con Móvil",
        text: 'Se le va a redireccionar a la página web para Pago con Móvil de billetes de EMTUSA. ¿Desea continuar?',
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No"
    }).then((result) => {
        if (result.value == true) {
            window.open('http://recargas.emtusahuelva.es/', '_blank');
        }
    })

}
////////////////////////////////////QR/////////////////////////////////////////////////////////////
function ValidURL(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s.toLowerCase());
}
function goQR() {
    //if (!EstaRestringido(9)) {
    //Android.showToast("aleluyah!");
    if (plataforma != "web") {
        //if (Android != null) {
        //    Android.goQR()
        //}
        EscanearQR()
    } else {
        Swal.fire('Sólo desde la Aplicación', 'Esta función no está disponible en la Web. Descargue la aplicación desde Google Play o Apple Store para poder utilizarla.')
    }
    //} else {
    //    AccesoRestringido(9)
    //}
}
function EscanearQR() {
    //alert($.mobile.activePage.attr('data-url'))
    if ($.mobile.activePage.attr('data-url') == 'pageLineaVer') {
        $('#ListLineasPageLineas').empty()
        $('#headLineasVer').text('');
        $('#headLineasVer').css('text-shadow', "2px 2px white");
        $('#subHeadLineasVer').text('');
        $('#subHeadLineasVer').css('text-shadow', "1px 2px white");
        $('#verLineasContNombre').css('background-color', 'white');
        storage.set("pagAnterior", "#pageLineaVer");
    }
    $.mobile.changePage('#pageInicio');
    window.clearInterval(idLineas);
    saltarRecarga = true
    cordova.plugins.barcodeScanner.scan(
         function (result) {
             if (result.text != '') {
                 if (result.text.indexOf("http://m.emtusahuelva.es/#QR?parada=") >= 0) {
                     parada = result.text.split('=')[1]
                     IrParada(parada)
                 } else {
                     if (ValidURL(result.text)) {
                         Swal.fire({
                             title: "QR Escaneado",
                             html: 'El QR escaneado no pertenece a la aplicación, si lo desea puede ir al enlace que contiene. \n Nota: No nos hacemos responsables de problemas con enlaces externos al usar la aplicación, actue con precaución. \n Datos del QR: "<a href=' + result.text + '>' + result.text + '</a>"',
                             confirmButtonText: "Salir"
                         });
                     } else {
                         Swal.fire({
                             title: "QR Escaneado",
                             text: 'El QR escaneado no pertenece a la aplicación, tampoco parece contener una url.<br/>"' + result.text + '"',
                             confirmButtonText: "Salir"
                         });
                     }
                 }
             }
         },
       function (error) {
           Swal.fire({
               title: "Error de lectura",
               text: 'Ha ocurrido un error "' + error + '"',
               confirmButtonText: "Aceptar"
           });
       },
         {
             "preferFrontCamera": false, // iOS and Android 
             "showFlipCameraButton": true, // iOS and Android 
             "prompt": "Enfoque el código QR dentro del área de escaneado", // supported on Android only 
             "formats": "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED 
         }
      );
}
//TODO: #CambiarTimeout o boton 'recargar' en modo prueba
//TODO: Function BuscarParadasCercanasCadaSentido (buscar donde se utilizaban antes y porque)
//////////////////////////////////AYUDA////////////////////////////////////////////////////////////
var AyudaElegida
function AbrirAyuda(id) {
    AyudaElegida=id
    $('.slickClass').hide();
    $('#' + id).show()
    $.mobile.changePage('#pageAyuda');
    setTimeout(function () { $('#'+id).slick({ adaptiveHeight: true, arrows: true, dots: true, infinite: false }) }, 300);
}
function CerrarAyuda() {
    history.back()
    $("#" + AyudaElegida).slick('unslick');
}
function SiguienteAyuda() {
    $('#' + AyudaElegida).slick('slickNext');
}
function AnteriorAyuda() {
    $('#' + AyudaElegida).slick('slickPrev');
}