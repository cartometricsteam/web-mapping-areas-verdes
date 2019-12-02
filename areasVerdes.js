/****************************************************/
/******************* DEFINICIONES *******************/
/****************************************************/

// Añadir la clave de acceso para conectarte a la API de Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiY2FydG9tZXRyaWNzbGFiIiwiYSI6ImNrM2JnanIzMjBsZHQzbW1yM2h2OWxieHMifQ.MCULumHFKyTPrBNEETSBww';

// Definición de variables
var mapasBase = [
	'mapbox://styles/cartometricslab/ck3gxkdjc0fly1cljd1s04f1k',
	'mapbox://styles/cartometricslab/ck3ifqapy1whh1dpg2goqdyll'
];
var idMapaBaseActual = 0;
var nombresCapas = ['Áreas verdes', 'Contenedores de plástico', 'Contenedores de papel'];
var colores = ['#207f06', '#ffe20a', '#0a6cff'];


/****************************************************/
/*********************** MAIN ***********************/
/****************************************************/

// Crear el mapa
var mapa = new mapboxgl.Map({
  container: 'mapa', // el elemento HTML con id='mapa' es el contenedor del mapa
  style: mapasBase[idMapaBaseActual], // estilo del mapa base inicial
  center: [-4.429971, 36.716775], // coordenadas [lng, lat] del centro inicial
	zoom: 13.2, // nivel de zoom inicial
});

// Añadir controles de zoom y rotación
mapa.addControl(new mapboxgl.NavigationControl());

// Añadir buscador geográfico
mapa.addControl(new MapboxGeocoder({
	accessToken: mapboxgl.accessToken,
	mapboxgl: mapboxgl,
	collapsed: true,
	language: 'es',
	placeholder: 'Buscar'
}), 'top-right');

// Añadir event listener a botón de cambio de mapa base
var btnMapaBase = document.getElementById('btnMapaBase');
btnMapaBase.addEventListener('click', cambiarMapaBase);

// Añadir leyenda
var leyenda = document.getElementById('leyenda');
for (i = 0; i < nombresCapas.length; i++) {
  var elemento = document.createElement('div');
  var cuadrado = document.createElement('span');
  cuadrado.className = 'cuadrado';
  cuadrado.style.backgroundColor = colores[i];
  var etiqueta = document.createElement('span');
  etiqueta.className = 'etiqueta';
  etiqueta.innerHTML = nombresCapas[i];
  elemento.appendChild(cuadrado);
  elemento.appendChild(etiqueta);
  leyenda.appendChild(elemento);
}


// Añadir menú selector de capas
var menu = document.getElementById('menu');
var inputs = menu.getElementsByTagName('input');
for (var i = 0; i < inputs.length; i++) {
	inputs[i].addEventListener('click', seleccionarCapa);
}

// Cargar popups una vez cargue el mapa
mapa.on('load', function () {
	cargarPopups();
});

/****************************************************/
/******************** FUNCIONES *********************/
/****************************************************/
function cambiarMapaBase() {
	idMapaBaseActual = (idMapaBaseActual + 1) % mapasBase.length;
	mapa.setStyle(mapasBase[idMapaBaseActual]);
}

function seleccionarCapa(event) {
	var layerId = event.target.name;
	if(event.target.checked) {
		mapa.setLayoutProperty(layerId, 'visibility', 'visible');
	} else {
		mapa.setLayoutProperty(layerId, 'visibility', 'none');
	}
}

function cargarPopups() {
	/* ÁREAS VERDES */
	// Añadir Popup al hacer click sobre Área Verde
	mapa.on('click', 'areasverdes-du9lmn', function (e) {
		var coordinates = e.lngLat;
		var idAreaVerde = e.features[0].properties.ID_AREAVERDE;
		var ubicacion = e.features[0].properties.UBICACION;
		var popupContent = '<h1>ÁREA VERDE</h1><div><strong>Id: </strong>'+ idAreaVerde +'</div><div><strong>Ubicación: </strong>'+ ubicacion +'</div>'
		 
		new mapboxgl.Popup()
			.setLngLat(coordinates)
			.setHTML(popupContent)
			.addTo(mapa);
	});

	// Cambiar el cursor del ratón al pasar por encima / salir de área verde
	mapa.on('mouseenter', 'areasverdes-du9lmn', function () {
		mapa.getCanvas().style.cursor = 'pointer';
	});

	mapa.on('mouseleave', 'areasverdes-du9lmn', function () {
		mapa.getCanvas().style.cursor = '';
	});

	/* CONTENEDORES DE PLÁSTICO */
	// Añadir Popup al hacer click sobre un contenedor de plástico
	mapa.on('click', 'contenedores-4gwn1r', function (e) {
		var coordinates = e.lngLat;
		var details = e.features[0].properties.tooltip;
		var popupContent = '<h1>CONTENEDOR PLÁSTICO</h1><div>'+ details +'</div>'
		 
		new mapboxgl.Popup()
			.setLngLat(coordinates)
			.setHTML(popupContent)
			.addTo(mapa);
	});

	// Cambiar el cursor del ratón al pasar por encima / salir de un contenedor de plástico
	mapa.on('mouseenter', 'contenedores-4gwn1r', function () {
		mapa.getCanvas().style.cursor = 'pointer';
	});

	mapa.on('mouseleave', 'contenedores-4gwn1r', function () {
		mapa.getCanvas().style.cursor = '';
	});

	/* CONTENEDORES DE PAPEL */
	// Añadir Popup al hacer click sobre un contenedor de papel
	mapa.on('click', 'papelcarton-8fck6u', function (e) {
		var coordinates = e.lngLat;
		var details = e.features[0].properties.tooltip;
		var popupContent = '<h1>CONTENEDOR PAPEL</h1><div>'+ details +'</div>'
		 
		new mapboxgl.Popup()
			.setLngLat(coordinates)
			.setHTML(popupContent)
			.addTo(mapa);
	});

	// Cambiar el cursor del ratón al pasar por encima / salir de un contenedor de papel
	mapa.on('mouseenter', 'papelcarton-8fck6u', function () {
		mapa.getCanvas().style.cursor = 'pointer';
	});

	mapa.on('mouseleave', 'papelcarton-8fck6u', function () {
		mapa.getCanvas().style.cursor = '';
	});
}
/****************************************************/