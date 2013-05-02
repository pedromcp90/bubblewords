/*--- PROPIEDADES ---*/
var listaTarjetas = [];
var tarjetaActual = null;
var existeFoto = false;
var existeSonido = false;
var fondoActual = 1;		// Esta variable contiene el id del fondo que está actualmente mostrándose en el formulario de nueva tarjeta
var mostrarFavoritas = false; 	// Indica si se deben mostrar solamente las tarjetas favoritas o no
var traduccionSugerida = "";	// Guarda la traducción que se ha encontrado para la palabra actual
var tarjetaEnEdicion = false;   // Indica si se ha pulsado sobre el botón de edición de la tarjeta
var valorAnteriorTitulo="";
var anchoiPhone3 = 80;
var anchoiPhone4 = 160;
var anchoTablet = 230;


var fondosTarjeta = [{'id':1, 'nombre':'fondo 1', 'imagen': 'img/texturas/textura1.jpg', 'iPhone3': 'img/texturas/muestras/textura1_320.jpg', 'iPhone4': 'img/texturas/muestras/textura1_640.jpg', 'tablet': 'img/texturas/muestras/textura1.jpg'},
{'id':2, 'nombre':'fondo 2', 'imagen': 'img/texturas/textura2.jpg', 'iPhone3': 'img/texturas/muestras/textura2_320.jpg', 'iPhone4': 'img/texturas/muestras/textura2_640.jpg', 'tablet': 'img/texturas/muestras/textura2.jpg'},
{'id':3, 'nombre':'fondo 3', 'imagen': 'img/texturas/textura3.jpg', 'iPhone3': 'img/texturas/muestras/textura3_320.jpg', 'iPhone4': 'img/texturas/muestras/textura3_640.jpg', 'tablet': 'img/texturas/muestras/textura3.jpg'},
{'id':4, 'nombre':'fondo 4', 'imagen': 'img/texturas/textura4.jpg', 'iPhone3': 'img/texturas/muestras/textura4_320.jpg', 'iPhone4': 'img/texturas/muestras/textura4_640.jpg', 'tablet': 'img/texturas/muestras/textura4.jpg'},
{'id':5, 'nombre':'fondo 5', 'imagen': 'img/texturas/textura5.jpg', 'iPhone3': 'img/texturas/muestras/textura5_320.jpg', 'iPhone4': 'img/texturas/muestras/textura5_640.jpg', 'tablet': 'img/texturas/muestras/textura5.jpg'},
{'id':6, 'nombre':'fondo 6', 'imagen': 'img/texturas/textura6.jpg', 'iPhone3': 'img/texturas/muestras/textura6_320.jpg', 'iPhone4': 'img/texturas/muestras/textura6_640.jpg', 'tablet': 'img/texturas/muestras/textura6.jpg'},
{'id':7, 'nombre':'fondo 7', 'imagen': 'img/texturas/textura7.jpg', 'iPhone3': 'img/texturas/muestras/textura7_320.jpg', 'iPhone4': 'img/texturas/muestras/textura7_640.jpg', 'tablet': 'img/texturas/muestras/textura7.jpg'},
{'id':8, 'nombre':'fondo 8', 'imagen': 'img/texturas/textura8.jpg', 'iPhone3': 'img/texturas/muestras/textura8_320.jpg', 'iPhone4': 'img/texturas/muestras/textura8_640.jpg', 'tablet': 'img/texturas/muestras/textura8.jpg'},
{'id':9, 'nombre':'fondo 9', 'imagen': 'img/texturas/textura9.jpg', 'iPhone3': 'img/texturas/muestras/textura9_320.jpg', 'iPhone4': 'img/texturas/muestras/textura9_640.jpg', 'tablet': 'img/texturas/muestras/textura9.jpg'},
{'id':10, 'nombre':'fondo 10', 'imagen': 'img/texturas/textura10.jpg', 'iPhone3': 'img/texturas/muestras/textura10_320.jpg', 'iPhone4': 'img/texturas/muestras/textura10_640.jpg', 'tablet': 'img/texturas/muestras/textura10.jpg'},
{'id':11, 'nombre':'fondo 11', 'imagen': 'img/texturas/textura11.jpg', 'iPhone3': 'img/texturas/muestras/textura11_320.jpg', 'iPhone4': 'img/texturas/muestras/textura11_640.jpg', 'tablet': 'img/texturas/muestras/textura11.jpg'},
{'id':12, 'nombre':'fondo 12', 'imagen': 'img/texturas/textura12.jpg', 'iPhone3': 'img/texturas/muestras/textura12_320.jpg', 'iPhone4': 'img/texturas/muestras/textura12_640.jpg', 'tablet': 'img/texturas/muestras/textura12.jpg'},
{'id':13, 'nombre':'fondo 13', 'imagen': 'img/texturas/textura13.jpg', 'iPhone3': 'img/texturas/muestras/textura13_320.jpg', 'iPhone4': 'img/texturas/muestras/textura13_640.jpg', 'tablet': 'img/texturas/muestras/textura13.jpg'},
{'id':14, 'nombre':'fondo 14', 'imagen': 'img/texturas/textura14.jpg', 'iPhone3': 'img/texturas/muestras/textura14_320.jpg', 'iPhone4': 'img/texturas/muestras/textura14_640.jpg', 'tablet': 'img/texturas/muestras/textura14.jpg'},
{'id':15, 'nombre':'fondo 15', 'imagen': 'img/texturas/textura15.jpg', 'iPhone3': 'img/texturas/muestras/textura15_320.jpg', 'iPhone4': 'img/texturas/muestras/textura15_640.jpg', 'tablet': 'img/texturas/muestras/textura15.jpg'}];

var tarjetasModificadas = new Array();
tarjetasModificadas[1]  = new Array();
tarjetasModificadas[2]  = new Array();

/*--- MÉTODOS ---*/

/**
 * RepresentarListaTarjetas. Realiza la maquetación de la lista de tarjetas que corresponden con la categoría actual.
 *
 * @param		categoria		categoría actual 
 * @param		favoritas		indica si solamente se deben mostrar las favoritas o no
 */
function RepresentarListaTarjetas(categoria, favoritas){
	$('#lblListaTarjetas').html("");
	var texto = "";
	var letra = "";
	var contador = 0;
	var listaImagenesACargar = [];
	if (favoritas)
		$('#h1NombreCategoria').html(res_Favoritos)
	
	mostrarFavoritas = favoritas;
	
	if (activarPhoneGap){
		switch(tipoDispositivo){
			case "iPhone3":
				ancho = anchoiPhone3;
				break;	
			case "iPhone4":
				ancho = anchoiPhone4;
				break;
			case "tablet":
				ancho = anchoTablet;
				break;
		}			
	}
	else {
		ancho = anchoTablet;
	}
	
	// Inclusión de las tarjetas, en la lista correspondiente
	$.each(listaTarjetas, function(i, item) {
		if (  ( (favoritas) && (item.favorita == 1) ) || ( (!favoritas) && (item.categoria == categoria.id) ) ) {
			
			// Maquetación de la tabla que llevará cada una de las imágenes relacionadas con la tarjeta
			texto += "<div class=\'ui-block-" + letra + "\'><a href=\'javascript:;\' onClick=\'CargarTarjeta(event," + 
                item.id + ", true)\' onTouchStart=\'(event," + item.id + ")\'><div style=\'overflow:hidden;width:" + ancho + "px;height:" + 
                ancho + "px;border:1px solid;background-color:#ffffff\'><img id=\'img" + item.id + 
                "\' src=\'img/imagen_no_disponible_" + ancho + ".jpg\' width=\'" + ancho + "\' />" + "</div></a></div>";
			
			listaImagenesACargar.push(item);
			contador += 1;
			
		}
	});
	
	// Se añaden los bloques vacíos que faltan en la última línea
	switch(contador % 3){
		case 0:
			break;
		case 1:
			texto += "<div class=\'ui-block-b\'></div><div class=\'ui-block-c\'></div>";
			break;
		case 2:
			texto += "<div class=\'ui-block-c\'></div>";
			break;
	}
	
	// Actualización del grid de imágenes
	//console.log("Este es el texto: " + texto);
	$('#lblListaTarjetas').html(texto).grid();
	
	// Una vez que se haya cargado la lista de imágenes, hay que cargar sus rutas
	$.each(listaImagenesACargar, function(i, item){
		CargarFoto("img" + item.id, item.foto, item.anchoFoto, item.altoFoto);
	});
}

/**
 * CargarFoto. Intenta cargar la foto pasada como parámetro. Si lo consigue, la redimensiona para que se muestre 
 * correctamente en la lista de tarjetas. Si no consigue cargarla, deja la imagen que esta en el identificador correspondiente.
 *
 * @param	identificador		id de la imagen donde cargará la foto
 * @param	rutaFoto			ruta en el dispositivo donde se encuentra la foto
 * @param	anchoFoto			ancho en pixels de la foto original
 * @param	altoFoto			alto en pixels de la foto original
 */
function CargarFoto(identificador, rutaFoto, anchoFoto, altoFoto){	
	if (activarPhoneGap) {
		// Solamente se comprueba si exista la fotografía en el caso de que está activado el PhoneGap.
		
		if ($.trim(rutaFoto).length > 0) {
			// Se comprueba que no es la imagen por defecto
			if (rutaFoto.indexOf('img/imagen_no_disponible') >= 0) {
			     //console.log("La foto a cargar es la de por defecto");
			}
			else {
                window.resolveLocalFileSystemURI(rutaFoto, function(fileEntry){
                    $("#" + identificador).attr("src", rutaFoto).on('load', function(){
                        if (anchoFoto < altoFoto){
                            switch(tipoDispositivo){
                                case "iPhone3":
                                    alto = ((altoFoto * anchoiPhone3) / anchoFoto).toFixed(0);
                                    ancho = anchoiPhone3;
                                    break;	
                                case "iPhone4":
                                    alto = ((altoFoto * anchoiPhone4) / anchoFoto).toFixed(0);
                                    ancho = anchoiPhone4;
                                    break;
                                case "tablet":
                                    alto = ((altoFoto * anchoTablet) / anchoFoto).toFixed(0);
                                    ancho = anchoTablet;
                                    break;
                            }
                            // En el caso de que la altura sea mayor que el ancho, hay que desplazar la imagen para que quede centrada
                            // en altura
                            $("#" + identificador).css("position", "relative").css("top", "-" + ((alto - ancho) / 2).toFixed(0).toString() + "px");
                        }
                        else {
                            switch(tipoDispositivo){
                                case "iPhone3":
                                    ancho = ((anchoFoto * anchoiPhone3) / altoFoto).toFixed(0);
                                    alto = anchoiPhone3;
                                    break;
                                case "iPhone4":
                                    ancho = ((anchoFoto * anchoiPhone4) / altoFoto).toFixed(0);
                                    alto = anchoiPhone4;
                                    break;
                                case "tablet":
                                    ancho = ((anchoFoto * anchoTablet) / altoFoto).toFixed(0);
                                    alto = anchoTablet;
                                    break;
                            }
                            // En el caso de que la anchura sea mayor que la altura, hay que desplazar la imagen para que quede
                            // centrada en anchura
                            $('#' + identificador).css("position", "relative").css("left", "-" + ((ancho - alto)/2).toFixed(0).toString() + "px");
                        }
                        $('#' + identificador).attr("width", ancho);
                        $('#' + identificador).attr("height", alto);
                        //console.log("Ancho: " + anchoFoto + ", alto: " + altoFoto);
                    });
                }, function(error){
                    console.log("Ha fallado la carga del archivo " + rutaFoto);
                });
			}
		}		
	}
}


/**
 * NuevaTarjeta. Inserta una nueva tarjeta con los datos pasados como parámetros.
 *
 * @param	categoria		identificador de la categoría a la que pertenece la tarjeta
 * @param	titulo1			título 1 de la tarjeta
 * @param	titulo2			título 2 de la tarjeta
 * @param	fondo			nombre de la imagen del fondo de la tarjeta
 * @param	foto			nombre de la imagen principal de la tarjeta
 * @param	sonido			nombre del sonido de la tarjeta
 * @param	ancho			ancho en pixels de la foto
 * @param	alto			alto en pixels de la imagen
 * @param	fuente			tipografía asociada a la tarjeta
 * @param	tamanioFuente	tamaño en pixels de la fuente utilizada
 */
function NuevaTarjeta(categoria, titulo1, titulo2, fondo, foto, sonido, ancho, alto, fuente){
	var maxId = 0;
	
	//console.log("llego a NuevaTarjeta");
	
	try{
		// obtención del último identificador utilizado
		$.each(listaTarjetas, function(i, item){
			if (item.id > maxId) {
				maxId = item.id;
			}
		});
		
		// Inserción de la tarjeta en la lista de tarjetas actuales (para la categoría actual) ...
		listaTarjetas.push({
            'id': (maxId+1), 
            'categoria': categoria, 
            'titulo1': titulo1, 
            'titulo2': titulo2, 
            'fondo': fondo, 
            'foto': foto, 
            'sonido': sonido, 
            'favorita': 0, 
            'anchoFoto': ancho, 
            'altoFoto': alto, 
            'fuente':fuente, 
            'tamanioFuente': 25});
		
		// ... e inserción de la tarjeta en la base de datos
		var sql = "insert into Tarjetas(id, categoria, titulo1, titulo2, fondo, foto, sonido, favorita, anchoFoto, altoFoto, fuente, tamanioFuente) values(" + 
            (maxId+1) + "," + categoria + ",\'" + titulo1 + "\',\'" + titulo2 + "\',\'" + fondo + "\',\'" + foto + "\',\'" + sonido + "\',0," + ancho + 
            "," + alto + ",'" + fuente + "'," + 25 + ")";
		//console.log(sql);
		bwBD.transaction(function(tx){
			tx.executeSql(sql);
		}, errorBD);
		
		// Actualización de la visualización de la lista de tarjetas ...
		RepresentarListaTarjetas(categoriaActual);	
		
		// ... y actualización de la lista de categorías
		RepresentarCategorias();
		
		tarjetaActual = null;
	}
	catch(e){
		console.log(e);	
	}
}

/**
 * SeleccionarTarjetaPorId. Devuelve la tarjeta cuyo identificador es pasado como parámetro.
 *
 * @param		id			identificador de la tarjeta
 * @result		Tarjeta que corresponde con el identificador pasado.
 */
function SeleccionarTarjetaPorId(id){
	var resultado = null;
	$.each(listaTarjetas, function(i, item){
		if (item.id == id) {
			resultado = item;
		}
	});
	return resultado;
}

/**
 * ContarTarjetasPorCategoria. Devuelve el número de tarjetas que están relacionadas con la categoría
 * pasada como parámetro.
 *
 * @param	categoria		identificador de la categoría
 * @result	número de tarjetas relacionadas con la categoría
 */
function ContarTarjetasPorCategoria(categoria){
	var resultado = 0;
	try{
		$.each(listaTarjetas, function(i, item){
			if (item.categoria == categoria){
				resultado += 1;
			}
		});
	}
	catch(e){
		console.log(e.message);
	}
	return resultado;
}

/**
 * CargarTarjeta. Prepara todos los componentes de la página donde se muestra la tarjeta. Carga la tarjeta cuyo identificador 
 * es pasado como parámetro.
 *
 * @param		event			Evento que se dispara al llamar a esta función
 * @param		id				identificador de la tarjeta
 * @param       cambiarPagina   booleano que indica si se debe cambiar a la página de 'PaginaDetalleTarjeta'
 */
function CargarTarjeta(event, id, cambiarPagina){
	tarjetaActual = SeleccionarTarjetaPorId(id);
	
	//console.log("Foto actual: " + tarjetaActual.foto);
	/*
	switch(tipoDispositivo){
		case 'iPhone3':
			$('#imgGrandeTarjeta').attr('src', tarjetaActual.foto).attr("width", "250px");
			break;
		case 'iPhone4':
			$('#imgGrandeTarjeta').attr('src', tarjetaActual.foto).attr('width', '580px');
			break;
		case 'tablet':
			$('#imgGrandeTarjeta').attr('src', tarjetaActual.foto).attr('width', '700px');
			break;
	}
	*/
	//Eliminamos las clases antiguas
		
	$('#lblTituloTarjeta').removeClass();
	
	$('#imgGrandeTarjeta').attr('src', tarjetaActual.foto);
	$('#lblTituloTarjeta').html(tarjetaActual.titulo1).addClass('fuente-' + tarjetaActual.fuente);
	
	// Fondo
	try{	
	    for(i=1;i<=15;i++){
	    	$('#PaginaDetalleTarjeta').removeClass('fondo'+i);
	    }
	
	    //console.log("Clases de detalle tarjeta "+PaginaDetalleTarjeta.className);
		$('#PaginaDetalleTarjeta').addClass('fondo'+tarjetaActual.fondo);		
		
		/*
		console.log("Fondo actual: " + tarjetaActual.fondo);
		console.log("EL alto de la imagen es: "+$('#imgGrandeTarjeta').css("height"));		
		console.log("EL ancho de la imagen es: "+$('#imgGrandeTarjeta').css("width"));
		*/
	}
	catch (e){
		console.log(e.message);	
	}
	
	if (tarjetaActual.favorita == 1) {
		$('#btnCambiarTarjetaFavorita').addClass("ui-btn-favorito");
	}
	else {
		$('#btnCambiarTarjetaFavorita').removeClass("ui-btn-favorito");
	}
	
	
	// Se carga la página con la tarjeta
    if (cambiarPagina){
        $.mobile.changePage($('#PaginaDetalleTarjeta'));
    }
	
	PararEvento(event);
}

function ReversoTarjeta(event){
	//console.log("Entra en ReversoTarjeta");
	
	try{	
		//Eliminamos las clases antiguas
		
		$('#lblTituloTarjetaReverso').removeClass();
		
		for(i=1;i<=15;i++){
	    	$('#PaginaReversoTarjeta').removeClass('fondo'+i);
	    }
	    //Añadimos las clases nuevas
	    
		$('#imgGrandeTarjetaReverso').attr('src', tarjetaActual.foto);
		$('#lblTituloTarjetaReverso').html(tarjetaActual.titulo2).addClass('fuente-' + tarjetaActual.fuente);
		$('#PaginaReversoTarjeta').addClass('fondo'+tarjetaActual.fondo);
	    
	    //console.log("Clases de reverso tarjeta "+PaginaReversoTarjeta.className);	
		
		
		// Se cambia a la página del reverso
		$.mobile.changePage($('#PaginaReversoTarjeta'), {transition: 'flip'});
		ReproducirSonidoEstatico();
		PararEvento(event);
	}
	catch (e){
		console.log(e.message);	
	}
}

/**
 * ActualizarTarjeta. Actualiza los datos de la tarjeta actual, con los datos pasados a la función
 *
 *@param		tarjeta 		Datos de la tarjeta actualizada
 */
function ActualizarTarjeta(event, tarjeta){
	var listaTemp = [];
    var datosAntiguos;
    
	$.each(listaTarjetas, function(i, item) {
		if (tarjeta.id == item.id) {
            datosAntiguos = item;
			listaTemp.push(tarjeta);
		}
		else {
			listaTemp.push(item);	
		}
	});
	listaTarjetas = listaTemp;
	
	// Actualización en la base de datos
	var sql = "UPDATE Tarjetas SET titulo1='" + $.trim(tarjeta.titulo1) + 
        "', titulo2='" + $.trim(tarjeta.titulo2) + 
        "', fondo='" + $.trim(tarjeta.fondo) + 
        "', foto='" + $.trim(tarjeta.foto) + 
        "', sonido='" + $.trim(tarjeta.sonido) + 
        "', favorita=" + tarjeta.favorita + 
        ", anchoFoto=" + tarjeta.anchoFoto + 
        ", altoFoto=" + tarjeta.altoFoto + 
        ", fuente='" + tarjeta.fuente + 
        "' WHERE id=" + tarjeta.id;
	console.log("Actualizamos una tarjeta--> "+sql);
	bwBD.transaction(function(tx){
		tx.executeSql(sql);
	}, errorBD);
      
    // Eliminación de las clases de los elementos antiguos (fondo, fuente, tamaño de la fuente)
    
   	for(i=1;i<=15;i++){
		$('#PaginaDetalleTarjeta').removeClass('fondo'+i);
		$('#PaginaReversoTarjeta').removeClass('fondo'+i);
    }

    //console.log("Clases de detalle tarjeta "+PaginaDetalleTarjeta.className);
    //console.log("Clases de reverso tarjeta "+PaginaReversoTarjeta.className);
        
	$('#lblTituloTarjeta').removeClass();
	$('#lblTituloTarjetaReverso').removeClass();

       
    // Actualizar los datos de la tarjeta actual, con los nuevos datos de la tarjeta actualizada
    CargarTarjeta(event, tarjeta.id, false);
}

/**
 * ComprobarEliminarTarjeta. Comprueba si el usuario ha seleccionado la eliminación de la tarjeta actual.
 */
function ComprobarEliminarTarjeta(event){
    if (parseInt(event) == 1){
        EliminaTarjetaActual(event)
    }
}

/**
 * EliminaTarjetaActual. Realiza la eliminación de la tarjeta actualmente seleccionada, tanto de la lista de tarjetas como de la base de datos.
 */
function EliminaTarjetaActual(event){
	var listaTemp = [];
	
	try{
		// Eliminación de la tarjeta de la lista actual
		$.each(listaTarjetas, function(i, item){
			if (item.id != tarjetaActual.id) {!
				listaTemp.push(item);
			}
		});
		listaTarjetas = listaTemp;
		
		// Eliminación de la tarjeta de la BD
		var sql = "delete from Tarjetas where id=" + tarjetaActual.id;
		bwBD.transaction(function(tx){
			tx.executeSql(sql);
		}, errorBD);
		
		// ... actualización de la lista de tarjetas ...
		RepresentarListaTarjetas(categoriaActual);
		tarjetaActual = null;
		
		// ... y actualización de la lista de categorías
		RepresentarCategorias();
		
		// Cargar la página de las tarjetas de la categoría actual
		history.back();
	}
	catch (e){
		console.log("Error en EliminarTarjetaActual: "	+ e.message);
	}
}

function EliminarTarjetasPorCategoria(categoria){
	var listaTemp = [];
	
	// Eliminación de la tarjeta de la lista actual
	$.each(listaTarjetas, function(i, item){
		if (item.categoria != categoria) {
			listaTemp.push(item);
		}
	});
	listaTarjetas = listaTemp;
	
	var sql = "delete from Tarjetas where categoria=" + categoria;
	bwBD.transaction(function(tx){
		tx.executeSql(sql);
	}, errorBD);
	
	tarjetaActual = null;		
	// ... y actualización de la lista de categorías
	RepresentarCategorias();		
	// Cargar la página de las tarjetas de la categoría actual
	$.mobile.changePage($('#PaginaCategorias'));
}

/**
 * EliminarListaTarjetas. Vacía completamente la lista de las tarjetas.
 */
function EliminarListaTarjetas(){
	listaTarjetas = [];
}

function LimpiarTraduccion(){
	$('#pnlResultadoTraduccion').removeClass("in");
}
/*
 * Obtiene un Token de acceso al servidor de Microsoft Translate a través del servicio web
 */
function getAccesToken(event){	
	//Editado--> Pedro	
	var urlObtenerAccesToken = 'http://www.bubblewords.info/WSTraducciones/GetAccessToken.asmx/getToken';
	
	$.ajax({
		url: urlObtenerAccesToken + '?callback=?',
		type: "GET",
		dataType: 'jsonp',
		success: function(data){
   			accessToken=data[0];
    		//navigator.notification.alert("Hemos obtenido el token de acceso: "+accessToken)
		},
		timeout:5000,
		error: function(x, t, m) {
	        if(t==="timeout") {
	            navigator.notification.alert(res_servidor_no_disponible);
	        } else {
	            navigator.notification.alert("Error :"+t);
	        }
    	}
	});
/*
	$.getJSON(urlObtenerAccesToken + '?callback=?'
	, function(data){
 	    accessToken=data[0];
 	    //navigator.notification.alert("Hemos obtenido el token de acceso: "+accessToken)
	});
	*/
    PararEvento(event);
    
}
/*
 * Obtiene la traducción de un texto proporcionandole un idioma de origen y destino
 */
function TraduccionSugerida(event){
	if (valorAnteriorTitulo != $('#inputTituloTarjeta').val()){		
		var texto=$('#inputTituloTarjeta').attr('value');
		var origen =$('#lstIdiomaSecundario').attr('value');
		var destino = $('#lstIdiomaPrincipal').attr('value');
		if(origen != destino){
			console.log("traduccion> de: "+origen+" destino "+destino+" palabra "+texto);
			var p = new Object;
			p.text = texto;
			p.from = origen;
			p.to = destino;
			p.oncomplete = 'ajaxTranslateCallback';
			p.appId = "Bearer " + accessToken;
			var requestStr = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate";
			//navigator.notification.alert("Solicitamos la traduccion: texto="+p.text+" origen="+p.from+" destino="+p.to+" token="+p.appId);
			$.ajax({
				url: requestStr,
				type: "GET",
				data: p,
				dataType: 'jsonp',
				cache: true,		
			});	
		}		
		valorAnteriorTitulo=texto;
	}
	PararEvento(event);
}
/*
 * Callback que controla la respuesta del servidor de Microsoft Translator
 */
function ajaxTranslateCallback(response) {	
	if (response.length > 0) {
		traduccionSugerida = response;
		//navigator.notification.alert("La traduccion se ha recibido con exito: "+traduccionSugerida);
		$('#lblTraduccionObtenida').html(response.toString());
		$('#pnlResultadoTraduccion').addClass("in").css('zIndex', 3).find('.tooltip-inner').textfill({maxFontPixels: 200, minFontPixels:4});                    
	}	
}

/**
 * AplicarTraduccion. Se ha pulsado sobre la opción de aplicar la traducción sugerida.
 */
function AplicarTraduccion(event){
	$('#inputTitulo2Tarjeta').attr('value', traduccionSugerida);	
	PararEvento(event);
}


/**
 * SeleccionarFondoTarjeta. Se ha seleccionado un fondo para la tarjeta que se desea crear. Cambia
 * la imagen del formulario 'Nueva tarjeta' y guarda el fondo actualmente seleccionado.
 *
 * @param	numero		número del fondo elegido
 * @param   tipoDispositivo     indica el tipo de dispositivo
 */
function SeleccionarFondoTarjeta(event, numero, tipoDispositivo, debeVolver){
	//console.log("Fondo seleccionado: " + numero.toString() + ", tipo dispositivo: " + tipoDispositivo);
    
    try{
        fondoActual = numero;
		$('#imgFondoTarjeta').attr('src', 'img/texturas/muestras/textura' + numero + '.jpg')
        // Mostrar y ocultar capas
        $('#pnlMostrarImagenFondo').addClass("in").show();	                
        //console.log("SeleccionarFontoTarjeta. DebeVolver: " + debeVolver);
        
        if (debeVolver){
            Volver(event);
        }   
    }
    catch(e){
        console.log(e.message);
    }
}

/**
 * MostrarImagenDeGaleria. Se quiere mostrar la imagen que ha seleccionado el usuario desde la galería.
 */
function MostrarImagenDeGaleria(imageData, tipoDispositivo){
	var image = new Image();
	image.src = imageData;
	anchoFoto = image.width;
	altoFoto = image.height;
	existeFoto = true;
    
    //console.log("MostrarImagenDeGaleria. Ancho: " + anchoFoto + ", alto: " + altoFoto);
	// Ocultar y mostrar capas
	
	$('#pnlMostrarTextoFotoGaleria').removeClass("in").hide();	
	$("#imgPrincipalTarjetaGaleria").attr("src", imageData);
	$('#pnlMostrarImagenGaleria').addClass("in").show();	
	$('#pnlMostrarImagenCamara').removeClass("in").hide();
	$('#pnlMostrarTextoFotoCamara').addClass("in").show();
		
	// Quitar cualquier foto de la cámara anterior
	$('#imgPrincipalTarjetaCamara').attr('src','');
}

/**
 * MostrarImagenDeCamara. Se quiere mostrar la imagen que se ha tomado desde la cámara.
 */
function MostrarImagenDeCamara(imageData, tipoDispositivo){
    console.log("Establecemos la imagen: "+imageData);
	var image = new Image();
	image.src = imageData;
	anchoFoto = image.width;
	altoFoto = image.height;
	existeFoto = true;
	
	// Ocultar y mostrar capas
	$('#pnlMostrarTextoFotoCamara').removeClass("in").hide();	
	$("#imgPrincipalTarjetaCamara").attr("src", imageData);
	$('#pnlMostrarImagenCamara').addClass("in").show();	
	$('#pnlMostrarImagenGaleria').removeClass("in").hide();
	$('#pnlMostrarTextoFotoGaleria').addClass("in").show();
	
	// Quitar cualquier foto anterior de la galería

	$('#imgPrincipalTarjetaGaleria').attr('src','');
}