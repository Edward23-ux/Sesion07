// Nueva URL con los campos específicos que usamos en el proyecto
const API_URL = 'https://restcountries.com/v3.1/all?fields=name,flags,capital,population,languages,currencies,region';
let allCountries = []; 

// Referencias del DOM
const grid = document.getElementById('countriesGrid');
const searchInput = document.getElementById('searchInput');
const regionFilter = document.getElementById('regionFilter');
const langFilter = document.getElementById('langFilter');
const loading = document.getElementById('loading');

// Función principal para obtener los datos
async function fetchCountries() {
    try {
        const response = await fetch(API_URL);
        allCountries = await response.json();
        
        // Ocultar spinner de carga
        loading.style.display = 'none';
        
        // Renderizar todos los países al inicio
        renderCountries(allCountries);
    } catch (error) {
        console.error('Error al obtener datos:', error);
        grid.innerHTML = '<div class="col-12 text-center text-danger mt-4">Hubo un error al cargar los datos. Por favor, recarga la página.</div>';
    }
}

// Función para renderizar las tarjetas en el HTML
function renderCountries(countries) {
    grid.innerHTML = ''; // Limpiar el grid actual
    
    if (countries.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center text-muted mt-4">No se encontraron países con estos filtros.</div>';
        return;
    }

    countries.forEach(country => {
        // Extracción segura de datos (algunos países no tienen capital o moneda)
        const name = country.name.common;
        const flag = country.flags.svg;
        const capital = country.capital ? country.capital[0] : 'N/A';
        // Formatear la población con separadores de miles
        const population = country.population.toLocaleString('es-PE');
        
        // Extraer la primera moneda disponible
        const currenciesObj = country.currencies;
        const currency = currenciesObj ? Object.values(currenciesObj)[0].name : 'N/A';

        // Extraer todos los idiomas y unirlos con comas
        const languagesObj = country.languages;
        const languages = languagesObj ? Object.values(languagesObj).join(', ') : 'N/A';

        // Crear la estructura de la tarjeta
        const cardHTML = `
            <div class="col">
                <div class="card h-100 shadow-sm country-card">
                    <img src="${flag}" class="card-img-top flag-img" alt="Bandera de ${name}">
                    <div class="card-body">
                        <h5 class="card-title fw-bold text-dark mb-3">${name}</h5>
                        <p class="card-text mb-2"><span class="info-label">📍 Capital:</span><br> ${capital}</p>
                        <p class="card-text mb-2"><span class="info-label">👥 Población:</span><br> ${population}</p>
                        <p class="card-text mb-2"><span class="info-label">🗣️ Idiomas:</span><br> ${languages}</p>
                        <p class="card-text mb-0"><span class="info-label">💰 Moneda:</span><br> ${currency}</p>
                    </div>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// Función para aplicar los tres filtros simultáneamente
function filterCountries() {
    const searchTerm = searchInput.value.toLowerCase();
    const region = regionFilter.value;
    const lang = langFilter.value;

    const filtered = allCountries.filter(country => {
        // 1. Coincidencia por texto (Nombre del país)
        const matchesName = country.name.common.toLowerCase().includes(searchTerm);
        
        // 2. Coincidencia por continente
        const matchesRegion = region === 'all' || country.region === region;
        
        // 3. Coincidencia por idioma (revisando las claves del objeto languages)
        let matchesLang = true;
        if (lang !== 'all') {
            const languagesObj = country.languages;
            matchesLang = languagesObj && Object.keys(languagesObj).includes(lang);
        }

        // Retorna true solo si el país cumple los 3 filtros
        return matchesName && matchesRegion && matchesLang;
    });

    renderCountries(filtered);
}

// Listeners: Ejecutar el filtro cada vez que el usuario teclea o cambia un select
searchInput.addEventListener('input', filterCountries);
regionFilter.addEventListener('change', filterCountries);
langFilter.addEventListener('change', filterCountries);

// Iniciar la aplicación
fetchCountries();