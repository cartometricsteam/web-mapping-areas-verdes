// Añadir la clave de acceso para conectarte a la API de Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoicnVpemd1aWxsZSIsImEiOiJjanp1ZTc1ZWkwMmh3M2JtcjBianl6enljIn0.iCxrQZrJESdTCUt_czePPg';

// Definición de variables
var mapasBase = [
	'mapbox://styles/mapbox/streets-v11',
	'mapbox://styles/mapbox/satellite-v9',
	'mapbox://styles/mapbox/navigation-guidance-night-v4'
];
var idMapaBaseActual = 0;

/* MAIN */
// Crear un mapa en el div con id='mapa', definiendo el estilo, centro y nivel de zoom
var mapa = new mapboxgl.Map({
  container: 'mapa',
  style: mapasBase[idMapaBaseActual],
  center: [-4.429971, 36.716775],
	zoom: 13.2,
});

// Añadir controles de zoom y rotación
mapa.addControl(new mapboxgl.NavigationControl());

// Añadir event listener a botón de cambio de estilo de mapa
var btnMapaBase = document.getElementById('btnMapaBase');
btnMapaBase.addEventListener('click', cambiarMapaBase);

// Cargar las capas y popups una vez cargue el mapa
mapa.on('load', function () {
	cargarCapas();
	cargarPopups();
});

var menu = document.getElementById('menu');
var inputs = menu.getElementsByTagName('input');
for (var i = 0; i < inputs.length; i++) {
	inputs[i].addEventListener('click', toggleLayer);
}


/* FUNCIONES */
function cambiarMapaBase() {
	idMapaBaseActual = (idMapaBaseActual + 1) % mapasBase.length;
	mapa.setStyle(mapasBase[idMapaBaseActual]);
	mapa.once('styledata', function() {
		cargarCapas();
	});
}

function cargarCapas() {	
	mapa.addLayer({
		"id": 'areasVerdes',
		"type": 'fill',
		"source": {
			type: 'vector',
			url: 'mapbox://ruizguille.1g1k4d7d'
		},
		"source-layer": 'areas-verdes-23y8qh',
		'paint': {
			'fill-color': '#15664B',
			'fill-opacity': 0.7
		}
	});

	mapa.addLayer({
		"id": 'contenedoresPlasticos',
		"type": 'circle',
		"source": {
			type: 'vector',
			url: 'mapbox://ruizguille.cu9rv89s'
		},
		"source-layer": 'contenedores-plasticos-2hm48v',
    'paint': {
      'circle-radius': 5,
      'circle-color': '#FDFF31',
      'circle-opacity': 0.85
    }
	});

	mapa.addLayer({
		"id": 'contenedoresPapel',
		"type": 'circle',
		"source": {
			type: 'vector',
			url: 'mapbox://ruizguille.bqo5yv5j'
		},
		"source-layer": 'contenedores-papel-7er4oe',
    'paint': {
      'circle-radius': 5,
      'circle-color': '#397DED',
      'circle-opacity': 0.9
    }
	});
}

function toggleLayer(event) {
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
	mapa.on('click', 'areasVerdes', function (e) {
		var coordinates = e.lngLat;
		var idAreaVerde = e.features[0].properties.ID_AREAVERDE;
		var ubicacion = e.features[0].properties.UBICACION;
		var popupContent = '<h1>ÁREA VERDE</h1><div><strong>Id: </strong>'+ idAreaVerde +'</div><div><strong>Ubicación: </strong>'+ ubicacion +'</div>'
		 
		new mapboxgl.Popup()
			.setLngLat(coordinates)
			.setHTML(popupContent)
			.addTo(mapa);
	});

	// Cambiar el cursor del ratón al pasar por encima / salir de un área verde
	mapa.on('mouseenter', 'areasVerdes', function () {
		mapa.getCanvas().style.cursor = 'pointer';
	});

	mapa.on('mouseleave', 'areasVerdes', function () {
		mapa.getCanvas().style.cursor = '';
	});

	/* CONTENEDORES DE PLÁSTICO */
	// Añadir Popup al hacer click sobre un contenedor de plástico
	mapa.on('click', 'contenedoresPlasticos', function (e) {
		var coordinates = e.lngLat;
		var details = e.features[0].properties.tooltip;
		var popupContent = '<h1>CONTENEDOR PLÁSTICO</h1><div>'+ details +'</div>'
		 
		new mapboxgl.Popup()
			.setLngLat(coordinates)
			.setHTML(popupContent)
			.addTo(mapa);
	});

	// Cambiar el cursor del ratón al pasar por encima / salir de un contenedor de plástico
	mapa.on('mouseenter', 'contenedoresPlasticos', function () {
		mapa.getCanvas().style.cursor = 'pointer';
	});

	mapa.on('mouseleave', 'contenedoresPlasticos', function () {
		mapa.getCanvas().style.cursor = '';
	});

	/* CONTENEDORES DE PAPEL */
	// Añadir Popup al hacer click sobre un contenedor de papel
	mapa.on('click', 'contenedoresPapel', function (e) {
		var coordinates = e.lngLat;
		var details = e.features[0].properties.tooltip;
		var popupContent = '<h1>CONTENEDOR PAPEL</h1><div>'+ details +'</div>'
		 
		new mapboxgl.Popup()
			.setLngLat(coordinates)
			.setHTML(popupContent)
			.addTo(mapa);
	});

	// Cambiar el cursor del ratón al pasar por encima / salir de un contenedor de papel
	mapa.on('mouseenter', 'contenedoresPapel', function () {
		mapa.getCanvas().style.cursor = 'pointer';
	});

	mapa.on('mouseleave', 'contenedoresPapel', function () {
		mapa.getCanvas().style.cursor = '';
	});
}
