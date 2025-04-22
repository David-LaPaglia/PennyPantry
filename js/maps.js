/**
 * Google Maps Integration for PennyPantry Store Locator
 */

// Initialize Google Maps when API is loaded
function initMap() {
    const mapElement = document.getElementById('store-map');
    if (!mapElement) return;
    
    // Store locations data - replace with real data in production
    const storeLocations = [
        {
            name: 'Safeway',
            position: { lat: 40.7128, lng: -74.006 }, // Example coordinates (NYC)
            address: '123 Market St',
            distance: '0.8 miles',
            hours: 'Open until 10PM',
            inventory: 'All items in stock',
            inventoryStatus: 'in-stock'
        },
        {
            name: 'Trader Joe\'s',
            position: { lat: 40.7138, lng: -74.013 },
            address: '456 Main Ave',
            distance: '2.5 miles',
            hours: 'Open until 9PM',
            inventory: 'Low stock on 2 items',
            inventoryStatus: 'low-stock'
        },
        {
            name: 'Walmart',
            position: { lat: 40.7118, lng: -74.009 },
            address: '789 Broad St',
            distance: '3.2 miles',
            hours: 'Open 24 hours',
            inventory: 'All items in stock',
            inventoryStatus: 'in-stock'
        },
        {
            name: 'Target',
            position: { lat: 40.7148, lng: -74.016 },
            address: '101 Commerce Blvd',
            distance: '4.7 miles',
            hours: 'Open until 11PM',
            inventory: '1 item out of stock',
            inventoryStatus: 'out-stock'
        }
    ];
    
    // Create the map instance
    const map = new google.maps.Map(mapElement, {
        center: storeLocations[0].position,
        zoom: 12,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });
    
    // Keep track of markers and info windows
    const markers = [];
    let activeInfoWindow = null;
    
    // Create markers for each store
    storeLocations.forEach((store, index) => {
        // Create marker
        const marker = new google.maps.Marker({
            position: store.position,
            map: map,
            title: store.name,
            animation: google.maps.Animation.DROP,
            icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                scaledSize: new google.maps.Size(32, 32)
            }
        });
        
        // Create info window content
        const contentString = `
            <div class="store-marker-content">
                <div class="store-marker-name">${store.name}</div>
                <div class="store-marker-details">${store.address}</div>
                <div class="store-marker-details">${store.hours}</div>
                <div class="store-marker-details">
                    <span class="inventory-indicator ${store.inventoryStatus}"></span>
                    ${store.inventory}
                </div>
                <a href="#" class="store-marker-action">View Details</a>
            </div>
        `;
        
        // Create info window
        const infoWindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 250
        });
        
        // Add click listener to marker
        marker.addListener('click', () => {
            // Close any open info window
            if (activeInfoWindow) {
                activeInfoWindow.close();
            }
            
            // Open this info window
            infoWindow.open(map, marker);
            activeInfoWindow = infoWindow;
            
            // Highlight corresponding store in list
            document.querySelectorAll('.store-card').forEach((card, i) => {
                if (i === index) {
                    card.classList.add('selected');
                    card.scrollIntoView({ behavior: 'smooth' });
                } else {
                    card.classList.remove('selected');
                }
            });
        });
        
        markers.push(marker);
    });
    
    // Add click listeners to store cards
    document.querySelectorAll('.store-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            if (index < storeLocations.length) {
                const store = storeLocations[index];
                
                // Pan to store location
                map.panTo(store.position);
                map.setZoom(14);
                
                // Trigger marker click
                google.maps.event.trigger(markers[index], 'click');
            }
        });
    });
    
    // Set up map control buttons
    setupMapControls(map, storeLocations, markers);
}

/**
 * Set up map control buttons
 */
function setupMapControls(map, storeLocations, markers) {
    const useLocationBtn = document.getElementById('use-my-location');
    if (useLocationBtn) {
        useLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                useLocationBtn.innerHTML = '<div class="loading-spinner"></div>';
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        
                        // Add user location marker
                        new google.maps.Marker({
                            position: userLocation,
                            map: map,
                            title: 'Your Location',
                            animation: google.maps.Animation.DROP,
                            icon: {
                                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                                scaledSize: new google.maps.Size(32, 32)
                            }
                        });
                        
                        // Center map on user location
                        map.setCenter(userLocation);
                        map.setZoom(13);
                        
                        // Show toast notification
                        showToastNotification('Using your current location', 'info');
                        
                        // Calculate distances to stores
                        calculateDistancesToStores(userLocation, storeLocations, markers, map);
                        
                        // Reset button
                        useLocationBtn.innerHTML = '<i class="fas fa-location-arrow" aria-hidden="true"></i>';
                    },
                    error => {
                        useLocationBtn.innerHTML = '<i class="fas fa-location-arrow" aria-hidden="true"></i>';
                        showToastNotification('Unable to get your location: ' + error.message, 'error');
                    }
                );
            } else {
                showToastNotification('Geolocation is not supported by your browser', 'error');
            }
        });
    }
    
    const zoomInBtn = document.getElementById('zoom-in');
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            map.setZoom(map.getZoom() + 1);
        });
    }
    
    const zoomOutBtn = document.getElementById('zoom-out');
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            map.setZoom(map.getZoom() - 1);
        });
    }
}

/**
 * Calculate distances between user and stores
 */
function calculateDistancesToStores(userLocation, stores, markers, map) {
    const service = new google.maps.DistanceMatrixService();
    const destinations = stores.map(store => store.position);
    
    service.getDistanceMatrix({
        origins: [userLocation],
        destinations: destinations,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }, (response, status) => {
        if (status === 'OK') {
            const results = response.rows[0].elements;
            
            // Update store distances
            stores.forEach((store, i) => {
                if (results[i].status === 'OK') {
                    // Update distance display
                    const distance = results[i].distance.text;
                    store.distance = distance;
                    
                    // Update store card
                    const storeCards = document.querySelectorAll('.store-card');
                    const distanceElement = storeCards[i].querySelector('.store-distance');
                    if (distanceElement) {
                        const parts = distanceElement.textContent.split('•');
                        const hours = parts.length > 1 ? parts[1].trim() : '';
                        distanceElement.textContent = `${distance} • ${hours}`;
                    }
                }
            });
            
            // Sort store list by distance
            const storeList = document.querySelector('.store-list');
            if (storeList) {
                const storeCards = Array.from(storeList.querySelectorAll('.store-card'));
                
                // Sort cards based on new distances
                storeCards.sort((a, b) => {
                    const aIndex = storeCards.indexOf(a);
                    const bIndex = storeCards.indexOf(b);
                    
                    if (aIndex >= 0 && bIndex >= 0 && 
                        stores[aIndex] && stores[bIndex] && 
                        stores[aIndex].distance && stores[bIndex].distance) {
                        
                        const aDistance = parseFloat(stores[aIndex].distance.replace(/[^\d.]/g, ''));
                        const bDistance = parseFloat(stores[bIndex].distance.replace(/[^\d.]/g, ''));
                        
                        return aDistance - bDistance;
                    }
                    return 0;
                });
                
                // Re-append in sorted order
                storeCards.forEach(card => {
                    storeList.appendChild(card);
                });
                
                // Show notification
                showToastNotification('Stores sorted by distance from your location', 'success');
            }
        }
    });
}

/**
 * Toast notification helper function
 */
function showToastNotification(message, type = 'info') {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    
    // Set toast content and type
    toast.textContent = message;
    toast.className = `toast-notification ${type}`;
    
    // Show the toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
