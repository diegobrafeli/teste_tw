//imports
importScripts('./js/sw-utils.js');

const STATIC_CACHE = 'static_v2';
const DYNAMIC_CACHE = 'dynamic_v1';
const IMUTAVEL_CACHE = 'imutavel_v1';

const APP_SHELL = 
[
	'./',
	'./index.html',
	'./css/style.css',
	'./img/favicon.ico',
	'./img/avatars/wolverine.jpg',
    './img/avatars/thor.jpg',
    './img/avatars/spiderman.jpg',
    './img/avatars/ironman.jpg',
    './img/avatars/hulk.jpg',
    './js/app.js',
    './js/sw-utils.js'
];


const APP_SHELL_IMUTAVEL =
[
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    './css/animate.css',
    './js/libs/jquery.js'
];

self.addEventListener('install', e => 
{

	const cacheStatic = caches.open( STATIC_CACHE ).then( cache => cache.addAll(APP_SHELL) );

	const cacheImutavel = caches.open( IMUTAVEL_CACHE ).then( cache => cache.addAll(APP_SHELL_IMUTAVEL) );


	e.waitUntil( Promise.all([ cacheStatic , cacheImutavel ]) );

});

self.addEventListener('activate', e => 
{
	const resposta = caches.keys().then( keys => 
	{
		keys.forEach( key => 
		{
			if(key !== STATIC_CACHE && key.includes('static'))
			{
				return cache.delete(key);
			}
		});
	});

	e.waitUntil(resposta);
});



self.addEventListener('fetch', e => 
{

	const resposta = caches.match(e.request).then( res => 
	{
		if(res)
		{
			return res;
		}
		else
		{
			return fetch(e.request).then( newRes =>
			{
				return atualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
			});
		}
	});

	e.respondWith(resposta);
});


