console.log('Script loaded')
document.addEventListener('DOMContentLoaded', () => {
    const serviceRedirects = {
        // Navigation Pages
    'about': 'navigation/about.html',
        
        // Service Pages
    'commercial-moving' : 'service_pages/commercial.html', 
    'loading-unloading' : 'service_pages/loading.html', 
    'packing-unpacking' : 'service_pages/packing.html', 
    'residential-moving' : 'service_pages/residential.html', 
    'appliance-moving' : 'service_pages/appliance.html', 
    'specialty-items' : 'service_pages/speciality.html', 
    'junk-removal' : 'service_pages/junk.html',
    'furniture-delivery' : 'service_pages/furniture_delivery.html',
    'event-equipment-delivery' : 'service_pages/event_equipment.html',
    'furniture-assembly' : 'service_pages/furniture_assembly.html',
    'local-delivery' : 'service_pages/local_delivery.html',
    'hauling' : 'service_pages/hauling.html',
    'attic-cleanout' : 'service_pages/attic_cleanout.html',
    'basement-cleanout' : 'service_pages/basement_cleanout.html',
    'garage-cleanout' : 'service_pages/garage_cleanout.html',
    'storage-unit-cleanout' : 'service_pages/storage_unit_cleanout.html',
    'hoarder-cleanout' : 'service_pages/hoarder_cleanout.html',
    'estate-cleanout' : 'service_pages/estate_cleanout.html',
    'office-cleanout' : 'service_pages/office_cleanout.html',
    'shed-deck-cleanout' : 'service_pages/shed_deck_cleanout.html',
    'renovation-debris' : 'service_pages/renovation_debris.html',
    'post-construction' : 'service_pages/post_construction.html',
    'foreclosure-cleanout' : 'service_pages/foreclosure_cleanout.html',
    'eviction-cleanout' : 'service_pages/eviction_cleanout.html',



    };

    // Add event listeners to elements with IDs  'tile-grout-cleaning': 'tile-grout-cleaning.html',matching the keys in serviceRedirects
    Object.keys(serviceRedirects).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', () => {
                window.location.href = serviceRedirects[id];
            });
        }
    });
});

