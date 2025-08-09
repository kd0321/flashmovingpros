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

