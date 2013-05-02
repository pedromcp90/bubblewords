var activarPhoneGap = true;
var tipoDispositivo = "";
var existeFoto = false;
var anchoFoto = 0;
var altoFoto = 0;
var tutorialTerminado=true;//poner a false cunado se termine la app
var accessToken;
var idiomaPrincipal;
var idiomaSecundario;
var idiomaSistema;
function inicializar(){
	
	//console.log("Phonegap inicializado");	
	// Abre la base de datos
	
	if (navigator.userAgent.indexOf("Android") != -1){
		$.mobile.defaultPageTransition = 'none';
		$.mobile.defaultDialogTransition = 'none';                                       
	}else{
		$.mobile.touchOverflowEnabled = true;		
	}
	
	ObtenerIdiomaSistema();
	AbrirBDD();
	ObtenerIdiomas();	
	//cargarIdiomas();
	InicializarIdiomas();
	comprobarTablas();	
	
	// Initialize the Facebook SDK	  
	FB.init({
		appId: '471428772926328',
		nativeInterface: CDV.FB,
		useCachedDialogs: false
	});
	FB.getLoginStatus(handleStatusChange);
	authUser();
	updateAuthElements();


	// Detección del dispositivo
	document.addEventListener("backbutton",onBackButton,false);
	DetectarDimensiones();
	
	getAccesToken();
  	// Get a new one every 9 minutes.
  	setInterval(getAccesToken, 9 * 60 * 1000);
  	
  		//Aplicamos estilos mediante jquery
	$('div.ContenidoTutorial > p').addClass("letraMediana");
	//ocultamos los divs de imagenes del formulario de nuevo bubble
	$('div.imagenFormulario').hide();
	
	$('#PaginaCategorias').on('pageshow',function(){  	
		//update($(this).find('.jtextfill span'));
		 if (listaCategorias.length == 0 && !tutorialTerminado){
			navigator.notification.alert(
		    'Para comenzar crea una categoría',  // message
		    '',         // callback
		    'Añadiendo Categorias',            // title
		    'Ok!'                  // buttonName
			);
		}
			  
	});
	
	$('#PaginaNuevaCategoria').on('pageshow',function(){  	
		//update($(this).find('.jtextfill span'));
		 if (listaCategorias.length == 0 && !tutorialTerminado){
			navigator.notification.alert(
		    'Introduce un nombre para la categoría y una descripción(opcional)',  // message
		    '',         // callback
		    'Creando Categorias',            // title
		    'Ok!'                  // buttonName
			);
		}
			  
	});
	$('#PaginaDetalleCategoria').on('pageshow',function(){  	
		//update($(this).find('.jtextfill span'));
		 if (listaCategorias.length == 1 && listaTarjetas.length==0 && !tutorialTerminado){
			navigator.notification.alert(
		    'Ahora creamos un nuevo bubble',  // message
		    '',         // callback
		    'Creando Bubbles',            // title
		    'Ok!'                  // buttonName
			);
			tutorialTerminado=true;
		}			  
	});
		
	$('#PaginaDetalleTarjeta').on('pageshow',function(){  	
		//update($(this).find('.jtextfill span'));
		$('.jtextfill').textfill({maxFontPixels: 200});
		if (tarjetaActual.sonido ==""){
			$('#btnTarjetaSonido i').addClass('desactivado');
			$('#btnTarjetaSonido').addClass('btn-desactivado');
		}else{
			$('#btnTarjetaSonido i').removeClass('desactivado');
			$('#btnTarjetaSonido').removeClass('btn-desactivado');
		}
	});
	$('#PaginaReversoTarjeta').on('pageshow',function(){  	
		//update($(this).find('.jtextfill span'));
		$('.jtextfillReverso').textfill({maxFontPixels: 200});		  
	});	
  	
  	navigator.splashscreen.hide();
}
/*
 * Este método controla la pulsación del botón atrás en los dispositivos que lo tengan disponible
 * y en caso de pulsarse estando en la pagina inicial termina la aplicación
 */

function onBackButton(event){
	if ( $('.ui-page-active').attr('id')=="PaginaInicial"){
		navigator.app.exitApp();
	}else{
		Volver(event);
	}
	
}

/**
 * DetectarDimensiones. Detecta cuales son las dimensiones de la pantalla, para saber qué tamaños de imágenes tiene 
 * que aplicar a las tarjetas.
 */
function DetectarDimensiones (){
	if (window.innerWidth >= 768) {
		tipoDispositivo = "tablet";
	}
	else {
		if (window.innerWidth >= 640) {
			tipoDispositivo = "iPhone4";
		}
		else {
			tipoDispositivo = "iPhone3";
		}
	}	
}

/**
 * Volver. Retrocede una posición en la historia (para el botón 'Atrás')
 */
function Volver(e){
	e.stopPropagation();
	e.preventDefault();
	history.back();
	if (categoriasEnEdicion == true){
		reiniciaCategorias();
	}
}

function Volver2Veces(e){
	e.stopPropagation();
	e.preventDefault();
	history.go(-2);
}

/**
 * PararEvento. Para la propagación del evento pasado como parámetro.
 * @param	event		evento que se desea parar
 */
function PararEvento(event){
	
	event.stopPropagation();
	event.preventDefault();
}

/**
 * TieneCaracteres. Comprueba si el campo cuyo identificador es pasado como parámetro, tiene algún carácter.
 *
 * @param	campo	identificador del campo
 * @return	booleano que indica si el campo tiene caracteres
 */
function TieneCaracteres(campo){
	var resultado = false;
	
	if ($(campo).attr('value').toString().length > 0) {
		resultado = true;	
	}
	return resultado;
}

/**
 * ComprobarEliminarTodo. Se comprueba si el usuario ha seleccionado la eliminación de todo el contenido guardado.
 *
 * @param	evento		datos del botón pulsado
 */
function ComprobarEliminarTodo(evento){
	if (parseInt(evento) == 1){
		EliminarTodo();
		EliminarListaTarjetas();
		EliminarListaCategorias();
	}
}

/**
 * LimpiadoFormularioNuevaTarjeta. Elimina los valores previamente introducidos del formulario de Nueva tarjeta
 */
function LimpiadoFormularioNuevaTarjeta(event){
    $('#lblTituloNuevaTarjeta').html(res_TituloNuevaTarjeta);
    $('#btnCrearBubble').html(res_InsertarNuevaTarjeta);
    
    $('#inputTituloTarjeta').val('');
    $('#inputTitulo2Tarjeta').val('');
    
    // Panel con la foto de la galería
    $('#pnlMostrarTextoFotoGaleria').addClass('in').show();
	$('#pnlMostrarImagenGaleria').removeClass('in').hide();
    
    // Panel con la foto de la cámara
    $('#pnlMostrarTextoFotoCamara').addClass('in').show();
    $('#pnlMostrarImagenCamara').removeClass('in').hide();

    
    // Panel para el fondo de la tarjeta
    $('#pnlMostrarTextoFondo').addClass('in').show();
    $('#pnlMostrarImagenFondo').removeClass('in').hide();

    
    // Panel para el sonido de la tarjeta
    $('#lblMostrarTextoSonido').html(res_ExplicacionSonido1);
    $('#pnlGrabacionSonido').removeClass('in').hide();
    $('#imgGrabacionSonido').attr('src', 'img/sound_add.png');
    
    $('#pnlMostrarTextoFondo').addClass('in').show();
    
    LimpiarTraduccion(event);
    $('#inputCategoriaRelacionada').selectmenu( "refresh", true );
    
    
    // Quitar cualquier foto anterior

	$('#imgPrincipalTarjetaGaleria').attr('src','');
	$('#imgPrincipalTarjetaCamara').attr('src','');
    existeFoto = false;
    anchoFoto = 0;
    altoFoto = 0;
    nombreArchivoAudio = "";
    traduccionSugerida = "";       
}

touchMove = function(event) {
      // Prevent scrolling on this element
      event.preventDefault();
 }
/*--- CONTROLADORES DE LOS COMPONENTES DE LA PÁGINA ---*/

/*--- PÁGINA: Inicial ---*/
$('#lnkNuevaTarjetaPrincipal').on('touchStart click', function(event){
	// Se comprueba si hay alguna categoria
	LimpiadoFormularioNuevaTarjeta(event);
    //console.log("Nº de categorías: " + listaCategorias.length);
    if ((listaCategorias.length == 0) && (activarPhoneGap)) {
        navigator.notification.alert(res_SinCategoria);
    }
    else {
        // Activa la selección de categoría    
        ActivarSeleccionCategorias();
        $.mobile.changePage($('#PaginaNuevaTarjeta'));
    }
});

/*--- PÁGINA: PaginaCategorias ---*/
$('#btnEditarCategorias').on('touchStart click', function(event){
	CambiarModoEdicionCategorias();
	
	PararEvento(event);
});

/* PÁGINA: PaginaNuevaCategoría */
$('#btnInsertarCategoria').on('touchStart click', function(event){	
	if (TieneCaracteres('#inputNombreCategoria')) {	
		var nombre = $('#inputNombreCategoria').val();
		var descripcion= $('#inputDescripcionCategoria').val()
		$('#PaginaNuevaCategoria').find(':input').val("");
		NuevaCategoria(nombre,descripcion);		
		// Vuelve a la página anterior
		Volver(event);
	}	
	PararEvento(event);
});

/*--- PÁGINA: PaginaDetalleCategoria ---*/
$('#lnkNuevaTarjeta').on('touchStart click', function(event){
	// Ocultar la selección de categoría
	DesactivarSeleccionCategorias();
	
	LimpiadoFormularioNuevaTarjeta(event);
	
	$.mobile.changePage($('#PaginaNuevaTarjeta'));	
});

/*--- PÁGINA: PaginaNuevaTarjeta ---*/
$('#btnAplicarTraduccion').on('touchStart click', function(event){
	//navigator.notification.alert("Hemos obtenido la traduccion: "+traduccionSugerida)
	$('#inputTitulo2Tarjeta').attr('value', traduccionSugerida);
	LimpiarTraduccion();
	PararEvento(event);
});

$('#btnImagenTarjetaGaleria').on('touchStart click', function(event){		// Obtiene la foto de la tarjeta desde el albúm de fotos del dispositivo
	navigator.camera.getPicture(function(imageData){	
		$("<img />").attr("src", imageData).on('load', function(){
			
			MostrarImagenDeGaleria(imageData, tipoDispositivo);
			
			//console.log("Foto seleccionada. Ancho: " + anchoFoto + ", alto: " + altoFoto);
		});

	}, function(message) {
		//navigator.notification.alert("Error al obtener la fotografía: " + message);
		//console.log("No se ha seleccionado ninguna fotografía desde la galería");
		existeFoto = false;
	}, {
		quality:50,
		destinationType: Camera.DestinationType.FILE_URI,
		sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
		targetWidth: 100,
		correctOrientation: true
	});
	PararEvento(event);
});

$('#btnImagenTarjetaCamara').on('touchStart click', function(event){	// Obtiene la foto de la tarjeta desde la cámara directamente
	//console.log("Llego a btnImagenTarjetaCamara");
    if(device.platform.toUpperCase()=="ANDROID"){
        navigator.camera.getPicture(function(imageData){        
            var directorioInicial;
            var directorioBubbleWords;
                        
            // Obtención del directorio principal de la aplicación
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                //console.log(fileSystem.name);
                //console.log(fileSystem.root.name);
                directorioInicial = fileSystem.root;
                
                // Creación (si es necesario) del directorio donde se almacenarán las fotos obtenidas por la cámara
                fileSystem.root.getDirectory("BubbleWords-Fotos", {create:true, exclusive:false}, function(directorio){
                    //console.log("Directorio BubbleWords-Fotos creado");
                    directorioBubbleWords = directorio;
                    
                    // Obtención del archivo recién guardado
                    window.resolveLocalFileSystemURI(imageData, function(fichero){
                        var array = imageData.split("/");
                        var elementosArray = array.length;
                        //console.log("Archivo: " + array[elementosArray-1]);
                        
                        try{
                            // Intento de copiar el archivo al directorio de las fotos de BubbleWords
                            fichero.moveTo(directorioBubbleWords, array[elementosArray-1], function(entry){
                                //console.log(entry.fullPath);	
                                
                                // Representación de la foto en el formulario
                            $("#imgPrincipalTarjetaCamara").attr("src", entry.toURL()).on('load', function(){
                                MostrarImagenDeCamara(entry.toURL(), tipoDispositivo);
                                //console.log("Foto seleccionada. Ancho: " + anchoFoto + ", alto: " + altoFoto);
                            });
                                
                                
                            }, function(error){
                                //console.log("Error: " + error.code);
                            });	
                        }
                        catch(e){
                            //console.log("Error: " + e.message);
                        }
                    }, function(error){
                        //console.log(error.target.error.code);
                    });
                    
                }, function(error2){
                    //console.log("Imposible crear el directorio BubbleWords-Fotos");
                });
                
            }, function(ev){
                //console.log(ev.target.error.code);
            });		
            
            
        }, function(message){
            //navigator.notification.alert("Error al obtener la fotografía: " + message);
            //console.log("No se ha seleccionado ninguna fotografía desde la cámara");
        }, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            targetWidth:2000,
            targetHeight:1000,
            correctOrientation: true
        });
    }else{
        console.log("Sacamos la foto desde IOS");
        navigator.camera.getPicture(function(imageURI) {
            $("#imgPrincipalTarjetaCamara").attr("src", imageURI).on('load', function(){
                MostrarImagenDeCamara(imageURI, tipoDispositivo);
            });
        }, function(error){
            console.log(error.target.error.code);
        }, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            targetWidth:2000,
            targetHeight:1000,
            correctOrientation: true,
            saveToPhotoAlbum: true
        });   
    }
	PararEvento(event);
});

$('#btnImagenFondoTarjeta').on('touchStart click', function(event){
	// Construcción de la lista de fondos de tarjetas
	
	for (var i=1;i<=15;i++){
		var imagen = "<img src=\'img/texturas/muestras/textura"+i+".jpg\' />";
		$('#lstFondosParaTarjeta').append("<div><a href='javascript:;' onClick=\"SeleccionarFondoTarjeta(event, '"+i+"','" + tipoDispositivo + "',true)\">"+imagen+"</a></div>");
		
	}
	$.mobile.changePage($('#PaginaElegirFondo'));	
	PararEvento(event);
});

$('#btnObtenerSonido').on('touchStart click', function(event){
	ComprobarEstadoGrabacion(event);
});

$('#btnCrearBubble').on('touchStart click', function(event){
	var fondo = "";
	var foto = "";
	var sonido = "";
	var cat = 0;
	var fuente = "";
	var tamanioFuente = 3;
	var nombreBubble = "";
	var traduccionBubble = "";
	
	//Hacemos visibles todos los textos    	
    	$('#pnlMostrarTextoFotoCamara').addClass("in").show();
    	$('#pnlMostrarTextoFotoGaleria').addClass("in").show();
    	$('#pnlMostrarTextoFondo').addClass("in").show();
	
	//console.log("Entro en btnCrearBubble");
    
    if (tarjetaEnEdicion){      // ACTUALIZACIÓN DE LA TARJETA
        // Se comprueba si los campos obligatorios están correctos
        if ((TieneCaracteres('#inputTituloTarjeta')) && (TieneCaracteres('#inputTitulo2Tarjeta'))) {
            tarjetaActual.categoria = categoriaActual.id;
            
            tarjetaActual.titulo1 = $.trim($('#inputTituloTarjeta').attr('value'));
            tarjetaActual.titulo2 = $.trim($('#inputTitulo2Tarjeta').attr('value'));
            
            // Comprobar si se ha seleccionado una foto de la galería o una foto de la cámara
            if ($('#imgPrincipalTarjetaGaleria').attr('src') != null && $('#imgPrincipalTarjetaGaleria').attr('src').length > 0){
                tarjetaActual.foto = $('#imgPrincipalTarjetaGaleria').attr('src');
                tarjetaActual.anchoFoto = anchoFoto;
                tarjetaActual.altoFoto = altoFoto;
            }if ($('#imgPrincipalTarjetaCamara').attr('src') != null && $('#imgPrincipalTarjetaCamara').attr('src').length > 0){
                tarjetaActual.foto = $('#imgPrincipalTarjetaCamara').attr('src');
                tarjetaActual.anchoFoto = anchoFoto;
                tarjetaActual.altoFoto = altoFoto;
            }
			
			// Se comprueba si no se ha seleccionado una foto válida
            if (tarjetaActual.foto.length == 0){            	
                tarjetaActual.foto = "img/imagen_no_disponible.jpg";
            }
            
             //Refrescamos la imagen si se produjo un cambio
            RepresentarListaTarjetas(categoriaActual);
            
            
            // Fondo
            tarjetaActual.fondo = fondoActual;
            
            // Sonido
            tarjetaActual.sonido = nombreArchivoAudio;
            
            // Fuente
            tarjetaActual.fuente = $('#inputFuente').attr('value');
            
            // Tamaño de la fuente
            //tarjetaActual.tamanioFuente = $('#inputTamanioFuente').attr('value');
            
            // Comprobación definitiva para la actualización
            if ((tarjetaActual.titulo1.length > 0) && (tarjetaActual.titulo2.length > 0)){
            	
                ActualizarTarjeta(event, tarjetaActual);
                tarjetaEnEdicion = false;
                Volver(event);
            }
            else {
                // Se le indica al usuario que no están todos los campos obligatorios
                navigator.notification.alert("Hay campos obligatorios sin completar");	
            }
        }
    }
    else {
        if ((TieneCaracteres('#inputTituloTarjeta')) && (TieneCaracteres('#inputTitulo2Tarjeta'))) {
            fondo = fondoActual;
            
            nombreBubble = $.trim($('#inputTituloTarjeta').attr('value'));
            traduccionBubble = $.trim($('#inputTitulo2Tarjeta').attr('value'));
            
            // Categoría relacionada
            if (seleccionarCategorias) {
                cat = $('#inputCategoriaRelacionada').attr('value');
            }
            else {
                cat = categoriaActual.id;	
            }
            
            // Se comprueba si está activado el PhoneGap para obtener las fotos del dispositivo, o poner la foto por defecto
            if (activarPhoneGap) {
                if ($('#imgPrincipalTarjetaGaleria').attr('src') != null && $('#imgPrincipalTarjetaGaleria').attr('src').length > 0){
                    foto = $('#imgPrincipalTarjetaGaleria').attr('src');
                }
                if ($('#imgPrincipalTarjetaCamara').attr('src') != null && $('#imgPrincipalTarjetaCamara').attr('src').length > 0){
                    foto = $('#imgPrincipalTarjetaCamara').attr('src');
                }
                sonido = nombreArchivoAudio;			
            }else {
                foto = "img/imagen_no_disponible.jpg";	
                anchoFoto = 250;
                altoFoto = 167;
                sonido = '';
            }
            
            // Se comprueba si no se ha seleccionado una foto válida
            if (foto.length == 0){            	
               foto = "img/imagen_no_disponible.jpg";
            }
            //console.log("Foto a insertar: " + foto);
            
            // Fuente de la tarjeta
            fuente = $('#inputFuente').attr('value');
            
            // Tamaño de la fuente
            //tamanioFuente = $('#inputTamanioFuente').attr('value');
            
            NuevaTarjeta(cat, nombreBubble, traduccionBubble, fondo, foto, sonido, anchoFoto, altoFoto, fuente);	
            
           
            Volver(event);
        
            // Se vuelven a establecer los valores por defecto de estos campos
            LimpiadoFormularioNuevaTarjeta(event);
        }
        else {
            // No se han establecido los elementos necesarios para la inserción de un nuevo Bubble
            navigator.notification.alert(res_CamposObligatorios);
        }
    }
	
	PararEvento(event);
});

//Nuevo btnCancelar
//Cancelamos la creacion del Bubble y volvemos hacia atrás
$('#btnCancelarBubble').on('touchStart click',function(event){
	LimpiadoFormularioNuevaTarjeta(event);
	Volver(event);
});

/*--- PÁGINA: PaginaDetalleTarjeta ---*/
$('#btnTarjetaEditar').on('touchStart click', function(event){
    //console.log("Entro en btnTarjetaEditar");
   // Se indica que la tarjeta está en edición
    tarjetaEnEdicion = true;
    
    //Hacemos visibles todos los textos    	
	$('div.imagenFormulario').hide();
	$('#pnlMostrarTextoFondo').addClass('in').show();
	$('#pnlMostrarTextoSonido').addClass('in').show();
	$('#pnlMostrarTextoFotoCamara').addClass('in').show();
	$('#pnlMostrarTextoFotoGaleria').addClass('in').show();
	
	
    try{    	
        // Carga de la información en los campos de página de inserción de la tarjeta
        DesactivarSeleccionCategorias();
        LimpiadoFormularioNuevaTarjeta(event);
        
        // Cambio en el título de la página y del boton insertar(cambia a actualizar)
        $('#lblTituloNuevaTarjeta').html(res_TituloActualizarTarjeta);
        
        $('#inputTituloTarjeta').attr('value', tarjetaActual.titulo1);      // Nombre
        $('#inputTitulo2Tarjeta').attr('value', tarjetaActual.titulo2);     // Traducción
        $('#inputFuente option[value=' + tarjetaActual.fuente + ']').attr("selected", true);  // Fuente de la tarjeta
        //$('#inputTamanioFuente option[value=' + tarjetaActual.tamanioFuente + ']').attr("selected", true);    // Tamaño de la fuente
        
        // Obtención de la foto asociada a la tarjeta
        MostrarImagenDeGaleria(tarjetaActual.foto, tipoDispositivo);
        
        // Obtención del fondo de la tarjeta
        SeleccionarFondoTarjeta(event, tarjetaActual.fondo, tipoDispositivo, false);
        fondoActual = tarjetaActual.fondo;
        
        nombreArchivoAudio = tarjetaActual.sonido;
        
        // Texto del botón de ACTULIZAR
        $('#btnCrearBubble').html(res_TituloActualizarTarjeta);
        
        
        // Ir a la página de inserción de tarjetas
        $.mobile.changePage($('#PaginaNuevaTarjeta'));	
    }
    catch(e){
        //console.log(e.message);
    }
    
    PararEvento(event);
});

$('#btnEliminaTarjeta').on('touchStart click', function(event){
    navigator.notification.confirm(
        res_ConfirmarEliminaTarjeta,             // Mensaje
        ComprobarEliminarTarjeta,                   // Función
        res_TituloEliminaTarjeta,              // Título
        'Ok, Cancel'
    );
	PararEvento(event);
});

$('#btnCambiarTarjetaFavorita').on('touchStart click', function(event){
	navigator.notification.vibrate(50);
	if (tarjetaActual.favorita == 0)  {
		tarjetaActual.favorita = 1;
		$('#btnCambiarTarjetaFavorita').addClass("ui-btn-favorito");
		

		//console.log("Tarjeta cambiada a favorita");
	}
	else {
		tarjetaActual.favorita = 0;
		$('#btnCambiarTarjetaFavorita').removeClass("ui-btn-favorito");
		//console.log("Tarjeta cambiada a no favorita");
	}
	ActualizarTarjeta(tarjetaActual);
	PararEvento(event);
});

/*--- PÁGINA: PaginaAjustes ---*/
// Detección del campo de selección en los campos select
$('#lstIdiomaPrincipal').on('change', function(event){	
	$('#lstIdiomaPrincipal').selectmenu('refresh');
	comprobarIdioma();
	CambiarIdiomas($('#lstIdiomaPrincipal').attr('value'),$('#lstIdiomaSecundario').attr('value'));
});
$('#lstIdiomaSecundario').on('change', function(event){	
	$('#lstIdiomaSecundario').selectmenu('refresh');
	CambiarIdiomas($('#lstIdiomaPrincipal').attr('value'),$('#lstIdiomaSecundario').attr('value'));
});
$('#btnEliminarTodo').on('touchEvent click', function(event){
	navigator.notification.confirm(
		res_DescripcionEliminarTodo, 	// Mensaje
		ComprobarEliminarTodo,			// Función	
		res_EliminarInformacion	,		// Título
		'Ok, Cancel');
	
	PararEvento(event);
});

/*--- PÁGINA: PaginaTutorial1 ---*/
$('#PaginaTutorial1').on('swipeleft', function(event){
	$.mobile.changePage($('#PaginaTutorial3'));
	PararEvento(event);
});

/*--- PÁGINA: PaginaTutorial3 ---*/
$('#PaginaTutorial3').on('swipeleft', function(event){
	$.mobile.changePage($('#PaginaTutorial4'));
	PararEvento(event);
}).on('swiperight', function(event){
	Volver(event);
});

/*--- PÁGINA: PaginaTutorial4 ---*/
$('#PaginaTutorial4').on('swipeleft', function(event){
	$.mobile.changePage($('#PaginaTutorial5'));
	PararEvento(event);
}).on('swiperight', function(event){
	Volver(event);
});

/*--- PÁGINA: PaginaTutorial5 ---*/
$('#PaginaTutorial5').on('swipeleft', function(event){
	$.mobile.changePage($('#PaginaTutorial6'));
	PararEvento(event);
}).on('swiperight', function(event){
	Volver(event);
});

/*--- PÁGINA: PaginaTutorial6 ---*/
$('#PaginaTutorial6').on('swiperight', function(event){
	Volver(event);
});