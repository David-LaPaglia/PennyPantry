// Smart Grocery List App JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Set up map initialization
    window.initMap = initializeGoogleMap;
    // Detect touch capability
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    document.body.classList.toggle('touch-device', isTouchDevice);
    
    // Set active screen based on URL hash or default to grocery list
    const setInitialScreen = () => {
        const hash = window.location.hash.substring(1);
        const validScreens = ['grocery-list-screen', 'rewards-screen', 'price-tracker-screen', 'store-locator-screen', 'budget-screen'];
        const targetScreen = validScreens.includes(hash) ? hash : 'grocery-list-screen';
        
        // Remove active class from all screens and nav items
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => {
            n.classList.remove('active');
            n.removeAttribute('aria-current');
        });
        
        // Activate target screen and nav item
        document.getElementById(targetScreen).classList.add('active');
        const navItem = document.querySelector(`.nav-item[data-screen="${targetScreen}"]`);
        navItem.classList.add('active');
        navItem.setAttribute('aria-current', 'page');
    };
    
    // Initialize active screen
    setInitialScreen();
    
    // Search functionality
    const searchInput = document.getElementById('item-search');
    const groceryItems = document.querySelectorAll('.grocery-list .list-item');
    const voiceSearchButton = document.querySelector('.voice-search-btn');
    
    // Handle regular text search
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        let hasResults = false;
        
        groceryItems.forEach(item => {
            const itemName = item.querySelector('.item-name').textContent.toLowerCase();
            if (searchTerm === '' || itemName.includes(searchTerm)) {
                item.style.display = '';
                hasResults = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show no results message if needed
        const noResultsMessage = document.getElementById('no-results-message') || createNoResultsMessage();
        noResultsMessage.style.display = hasResults || searchTerm === '' ? 'none' : 'block';
    });
    
    // Create 'no results' message element
    function createNoResultsMessage() {
        const message = document.createElement('div');
        message.id = 'no-results-message';
        message.className = 'no-results';
        message.innerHTML = '<i class="fas fa-search"></i><p>No items found</p>';
        message.style.display = 'none';
        document.querySelector('.grocery-list').appendChild(message);
        return message;
    }
    
    // Voice search functionality (simulated)
    voiceSearchButton.addEventListener('click', function() {
        // Apply pulse animation to the icon
        const voiceIcon = this.querySelector('.voice-search');
        voiceIcon.classList.add('pulsing');
        searchInput.placeholder = 'Listening...';
        // Focus on search to show keyboard on mobile
        searchInput.focus();
        
        // Simulate voice recognition after a short delay
        setTimeout(() => {
            voiceIcon.classList.remove('pulsing');
            searchInput.placeholder = 'Search items...';
            
            // Simulate a voice search result
            const voiceResults = ['milk', 'bread', 'apples', 'chicken'];
            const randomResult = voiceResults[Math.floor(Math.random() * voiceResults.length)];
            
            searchInput.value = randomResult;
            // Trigger the input event to filter items
            searchInput.dispatchEvent(new Event('input'));
        }, 2000);
    });
    
    // Navigation functionality
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    const screens = document.querySelectorAll('.screen');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items and screens
            navItems.forEach(ni => {
                ni.classList.remove('active');
                ni.removeAttribute('aria-current');
            });
            screens.forEach(screen => screen.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            this.setAttribute('aria-current', 'page');
            
            // Show corresponding screen
            const targetScreenId = this.getAttribute('data-screen');
            document.getElementById(targetScreenId).classList.add('active');
            
            // Update URL hash for bookmarking/history
            window.location.hash = targetScreenId;
            
            // Scroll to top when switching screens
            window.scrollTo(0, 0);
            
            // Animate transition
            animateScreenTransition(targetScreenId);
        });
    });
    
    // Smooth screen transitions
    function animateScreenTransition(screenId) {
        const screen = document.getElementById(screenId);
        screen.classList.add('screen-transition');
        setTimeout(() => {
            screen.classList.remove('screen-transition');
        }, 300);
    }

    // Enhance checkbox functionality
    const checkboxes = document.querySelectorAll('.item-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            const isChecked = this.classList.toggle('checked');
            this.setAttribute('aria-checked', isChecked);
            
            if (isChecked) {
                this.innerHTML = '<i class="fas fa-check" style="color: var(--primary-color);"></i>';
                // Apply strike-through and reduced opacity to the entire list item
                const listItem = this.closest('.list-item');
                listItem.classList.add('item-completed');
                // Move completed items to the bottom of the list
                setTimeout(() => {
                    const parent = listItem.parentElement;
                    parent.appendChild(listItem);
                }, 500);
            } else {
                this.innerHTML = '';
                this.closest('.list-item').classList.remove('item-completed');
            }
        });
    });

    // Add item button with modal
    const addItemButton = document.querySelector('.add-item');
    if (addItemButton) {
        // Create the add item modal if it doesn't exist
        let addItemModal = document.getElementById('add-item-modal');
        if (!addItemModal) {
            addItemModal = createAddItemModal();
            document.querySelector('.container').appendChild(addItemModal);
        }
        
        addItemButton.addEventListener('click', function() {
            this.classList.add('pressed');
            setTimeout(() => {
                this.classList.remove('pressed');
                // Show the add item modal
                addItemModal.style.display = 'block';
                // Focus on the first input field
                setTimeout(() => {
                    const firstInput = addItemModal.querySelector('input');
                    if (firstInput) firstInput.focus();
                }, 100);
            }, 200);
        });
    }
    
    // Create add item modal HTML
    function createAddItemModal() {
        const modal = document.createElement('div');
        modal.id = 'add-item-modal';
        modal.className = 'modal';
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'add-item-title');
        modal.setAttribute('aria-hidden', 'true');
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="add-item-title"><i class="fas fa-plus" aria-hidden="true"></i> Add New Item</h2>
                    <button class="close-modal" aria-label="Close add item panel">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="input-group">
                        <label for="new-item-name">Item Name</label>
                        <input type="text" id="new-item-name" placeholder="Enter item name">
                    </div>
                    <div class="input-group">
                        <label for="new-item-quantity">Quantity</label>
                        <input type="number" id="new-item-quantity" value="1" min="1">
                    </div>
                    <div class="input-group">
                        <label for="new-item-category">Category</label>
                        <select id="new-item-category">
                            <option value="dairy">Dairy</option>
                            <option value="meat">Meat & Seafood</option>
                            <option value="produce">Produce</option>
                            <option value="bakery">Bakery</option>
                            <option value="pantry">Pantry</option>
                            <option value="household">Household</option>
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-cancel">Cancel</button>
                        <button class="btn-add">Add Item</button>
                    </div>
                </div>
            </div>
        `;
        
        // Set up event listeners for the modal
        setTimeout(() => {
            // Close modal when clicking close button
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            // Close modal when clicking cancel
            const cancelBtn = modal.querySelector('.btn-cancel');
            cancelBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            // Add item functionality
            const addBtn = modal.querySelector('.btn-add');
            addBtn.addEventListener('click', () => {
                const itemName = document.getElementById('new-item-name').value;
                const quantity = document.getElementById('new-item-quantity').value;
                const category = document.getElementById('new-item-category').value;
                
                if (itemName.trim() !== '') {
                    addNewItemToList(itemName, quantity, category);
                    modal.style.display = 'none';
                    // Reset form
                    document.getElementById('new-item-name').value = '';
                    document.getElementById('new-item-quantity').value = '1';
                }
            });
        }, 100);
        
        return modal;
    }
    
    // Function to add a new item to the grocery list
    function addNewItemToList(name, quantity, category) {
        const groceryList = document.querySelector('.grocery-list');
        const newItem = document.createElement('div');
        newItem.className = 'list-item';
        newItem.innerHTML = `
            <div class="item-info">
                <button class="item-checkbox" aria-label="Mark item as complete" role="checkbox" aria-checked="false"></button>
                <span class="item-name">${name} (${quantity})</span>
            </div>
            <div class="item-price">
                <span class="price-value">$--.-</span>
                <div class="price-message">Checking prices...</div>
            </div>
        `;
        
        // Add to the top of the list
        if (groceryList.firstChild) {
            groceryList.insertBefore(newItem, groceryList.firstChild);
        } else {
            groceryList.appendChild(newItem);
        }
        
        // Set up event listener for the new checkbox
        const checkbox = newItem.querySelector('.item-checkbox');
        checkbox.addEventListener('click', function() {
            const isChecked = this.classList.toggle('checked');
            this.setAttribute('aria-checked', isChecked);
            
            if (isChecked) {
                this.innerHTML = '<i class="fas fa-check" style="color: var(--primary-color);"></i>';
                newItem.classList.add('item-completed');
                setTimeout(() => {
                    groceryList.appendChild(newItem);
                }, 500);
            } else {
                this.innerHTML = '';
                newItem.classList.remove('item-completed');
            }
        });
        
        // Simulate price loading after a delay
        setTimeout(() => {
            const priceElement = newItem.querySelector('.price-value');
            const messageElement = newItem.querySelector('.price-message');
            
            // Generate a random price
            const basePrice = (Math.random() * 15 + 2).toFixed(2);
            priceElement.textContent = `$${basePrice}`;
            
            // Randomly show a savings badge
            if (Math.random() > 0.5) {
                messageElement.className = 'savings-badge';
                const saveAmount = (Math.random() * 2).toFixed(2);
                const stores = ['Walmart', 'Target', 'Kroger', 'Safeway'];
                const randomStore = stores[Math.floor(Math.random() * stores.length)];
                messageElement.innerHTML = `<i class="fas fa-bolt"></i><span class="save-amount">SAVE $${saveAmount}</span><span class="save-at">at ${randomStore}</span>`;
            } else {
                messageElement.remove();
            }
        }, 1500);
    }

    // Apply coupon button effect with improved feedback
    const couponButtons = document.querySelectorAll('.apply-coupon');
    
    couponButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Disable button to prevent multiple clicks
            this.disabled = true;
            const originalText = this.textContent;
            
            // Show loading state
            this.innerHTML = '<span class="loading-spinner"></span>';
            
            // Simulate processing
            setTimeout(() => {
                this.innerHTML = 'Applied!';
                this.style.backgroundColor = '#4CAF50';
                
                // Update coupon card appearance
                const couponCard = this.closest('.coupon-card');
                if (couponCard) {
                    couponCard.classList.add('coupon-applied');
                }
                
                // Show toast notification
                showToastNotification('Coupon applied successfully!', 'success');
                
                // Reset button after delay
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.backgroundColor = '';
                    this.disabled = false;
                }, 2000);
            }, 800);
        });
    });
    
    // Toast notification function
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

    // Store card selection with enhanced feedback
    const storeCards = document.querySelectorAll('.store-card');
    
    storeCards.forEach(card => {
        card.addEventListener('click', function() {
            storeCards.forEach(c => {
                c.classList.remove('selected');
                c.setAttribute('aria-selected', 'false');
            });
            
            this.classList.add('selected');
            this.setAttribute('aria-selected', 'true');
            
            // Extract store info for feedback
            const storeName = this.querySelector('.store-name')?.textContent || 'Store';
            const storePrice = this.querySelector('.store-price')?.textContent || '';
            
            // Show selection feedback
            showToastNotification(`Selected ${storeName} - ${storePrice}`, 'info');
            
            // Animate the selection
            this.classList.add('pulse-once');
            setTimeout(() => {
                this.classList.remove('pulse-once');
            }, 700);
            
            // Show optimization button if not already present
            showOptimizeButton();
        });
    });
    
    // Show optimization action button
    function showOptimizeButton() {
        let optimizeBtn = document.getElementById('optimize-shopping-btn');
        
        if (!optimizeBtn) {
            optimizeBtn = document.createElement('button');
            optimizeBtn.id = 'optimize-shopping-btn';
            optimizeBtn.className = 'action-button';
            optimizeBtn.innerHTML = '<i class="fas fa-route"></i> Optimize Shopping';
            document.querySelector('.store-comparison').appendChild(optimizeBtn);
            
            // Add event listener
            optimizeBtn.addEventListener('click', function() {
                this.innerHTML = '<span class="loading-spinner"></span> Optimizing...';
                
                // Simulate optimization
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-check"></i> Optimized!';
                    showToastNotification('Shopping route optimized!', 'success');
                    
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-route"></i> Optimize Shopping';
                    }, 2000);
                }, 1500);
            });
        }
    }

    // Add CSS for enhanced interactions and mobile support
    const style = document.createElement('style');
    style.textContent = `
        /* Checkbox styling */
        .item-checkbox.checked {
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Completed item styling */
        .item-completed .item-name {
            text-decoration: line-through;
            opacity: 0.6;
        }
        
        .item-completed .item-price,
        .item-completed .savings-badge,
        .item-completed .best-price-badge,
        .item-completed .coupon-badge {
            opacity: 0.5;
        }
        
        /* Button press effects */
        .add-item.pressed {
            transform: scale(0.95);
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        /* Store card selection */
        .store-card.selected {
            border: 2px solid var(--primary-color);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        /* Pulse animation for selection */
        .pulse-once {
            animation: pulse-once 0.7s ease-in-out;
        }
        
        @keyframes pulse-once {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
        }
        
        /* Screen transitions */
        .screen-transition {
            animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0.7; }
            to { opacity: 1; }
        }
        
        /* Toast notifications */
        .toast-notification {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 0.9rem;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 80%;
        }
        
        .toast-notification.show {
            opacity: 1;
        }
        
        .toast-notification.success {
            background-color: var(--primary-color);
        }
        
        .toast-notification.error {
            background-color: #F44336;
        }
        
        .toast-notification.info {
            background-color: var(--secondary-color);
        }
        
        /* Action button */
        .action-button {
            display: block;
            width: 100%;
            padding: 12px;
            margin-top: 15px;
            border: none;
            border-radius: var(--border-radius);
            background-color: var(--secondary-color);
            color: white;
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .action-button:hover {
            background-color: #0c7cd5;
        }
        
        .action-button:active {
            transform: scale(0.98);
        }
        
        /* No results message */
        .no-results {
            text-align: center;
            padding: 30px 0;
            color: #666;
        }
        
        .no-results i {
            font-size: 2rem;
            margin-bottom: 10px;
            opacity: 0.5;
        }
        
        /* Applied coupon styling */
        .coupon-applied {
            border-left: 4px solid var(--primary-color) !important;
            background-color: #f9fff9;
            position: relative;
        }
        
        .coupon-applied::after {
            content: '✓';
            position: absolute;
            top: 10px;
            right: 10px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }
        
        /* Touch device specific */
        .touch-device .nav-item,
        .touch-device .item-checkbox,
        .touch-device .store-card,
        .touch-device .apply-coupon {
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
        }
        
        .touch-device .nav-tab {
            padding: 10px 0;
        }
    `;
    document.head.appendChild(style);
    
    // Bonus Features Functionality
    const featureToggles = document.querySelectorAll('.feature-toggle input[type="checkbox"]');
    const mealModeToggle = document.getElementById('meal-mode-toggle');
    const mealModePanel = document.getElementById('meal-mode-panel');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Toggle feature functionality with enhanced feedback
    featureToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const featureId = this.id;
            const isEnabled = this.checked;
            const featureItem = this.closest('.feature-item');
            const featureTitle = featureItem ? featureItem.querySelector('.feature-title')?.textContent || 'Feature' : 'Feature';
            
            // Show feedback when toggle changes
            showToastNotification(`${featureTitle} ${isEnabled ? 'enabled' : 'disabled'}`, isEnabled ? 'success' : 'info');
            
            if (featureId === 'meal-mode-toggle' && isEnabled) {
                // Show the Meal Mode panel when toggled on
                if (typeof openModal === 'function' && mealModePanel) {
                    openModal(mealModePanel);
                } else if (mealModePanel) {
                    mealModePanel.style.display = 'block';
                }
            } else if (featureId === 'student-mode-toggle') {
                // Apply student mode styling and filter
                document.body.classList.toggle('student-mode', isEnabled);
                // Simulate applying student discounts
                if (isEnabled) {
                    const storeCards = document.querySelectorAll('.store-card');
                    storeCards.forEach(card => {
                        const storeName = card.querySelector('.store-name')?.textContent;
                        if (storeName && (storeName === 'Walmart' || storeName === 'Target')) {
                            card.classList.add('student-discount');
                            const savingsText = card.querySelector('.store-savings');
                            if (savingsText) {
                                const originalText = savingsText.textContent;
                                savingsText.setAttribute('data-original', originalText);
                                savingsText.textContent = `STUDENT DEAL: ${originalText}`;
                            }
                        }
                    });
                } else {
                    // Revert to original prices
                    document.querySelectorAll('.student-discount').forEach(card => {
                        card.classList.remove('student-discount');
                        const savingsText = card.querySelector('.store-savings');
                        if (savingsText && savingsText.hasAttribute('data-original')) {
                            savingsText.textContent = savingsText.getAttribute('data-original');
                        }
                    });
                }
            } else if (featureId === 'sustainability-filter-toggle') {
                // Apply sustainability filter
                document.body.classList.toggle('eco-mode', isEnabled);
                // Simulate highlighting eco-friendly options
                if (isEnabled) {
                    const groceryItems = document.querySelectorAll('.list-item');
                    groceryItems.forEach(item => {
                        const itemName = item.querySelector('.item-name')?.textContent.toLowerCase();
                        if (itemName && (itemName.includes('apple') || itemName.includes('organic'))) {
                            const priceDiv = item.querySelector('.item-price');
                            if (priceDiv && !priceDiv.querySelector('.eco-badge')) {
                                const ecoBadge = document.createElement('div');
                                ecoBadge.className = 'eco-badge';
                                ecoBadge.innerHTML = '<i class="fas fa-leaf"></i> Eco-Friendly';
                                priceDiv.appendChild(ecoBadge);
                            }
                        }
                    });
                } else {
                    // Remove eco badges
                    document.querySelectorAll('.eco-badge').forEach(badge => badge.remove());
                }
            }
        });
    });
    
    // Close modals when clicking the X button
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
            
            // If this is the meal mode panel, uncheck the toggle
            if (modal.id === 'meal-mode-panel') {
                mealModeToggle.checked = false;
            }
        });
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
            
            // If this is the meal mode panel, uncheck the toggle
            if (event.target.id === 'meal-mode-panel') {
                mealModeToggle.checked = false;
            }
        }
    });
});
