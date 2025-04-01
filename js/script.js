// Smart Grocery List App JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('item-search');
    const groceryItems = document.querySelectorAll('.grocery-list .list-item');
    const voiceSearchButton = document.querySelector('.voice-search');
    
    // Handle regular text search
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        groceryItems.forEach(item => {
            const itemName = item.querySelector('.item-name').textContent.toLowerCase();
            if (searchTerm === '' || itemName.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Voice search functionality (simulated)
    voiceSearchButton.addEventListener('click', function() {
        // Apply pulse animation
        this.classList.add('pulsing');
        searchInput.placeholder = 'Listening...';
        
        // Simulate voice recognition after a short delay
        setTimeout(() => {
            this.classList.remove('pulsing');
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
            navItems.forEach(ni => ni.classList.remove('active'));
            screens.forEach(screen => screen.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Show corresponding screen
            const targetScreenId = this.getAttribute('data-screen');
            document.getElementById(targetScreenId).classList.add('active');
        });
    });

    // Simulate checkbox functionality
    const checkboxes = document.querySelectorAll('.item-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            this.classList.toggle('checked');
            if (this.classList.contains('checked')) {
                this.innerHTML = '<i class="fas fa-check" style="color: var(--primary-color);"></i>';
                this.parentElement.style.opacity = '0.5';
            } else {
                this.innerHTML = '';
                this.parentElement.style.opacity = '1';
            }
        });
    });

    // Add item button effect
    const addItemButton = document.querySelector('.add-item');
    if (addItemButton) {
        addItemButton.addEventListener('click', function() {
            this.classList.add('pressed');
            setTimeout(() => {
                this.classList.remove('pressed');
                // Here would be the code to show add item modal/form
                alert('Add new item functionality would appear here');
            }, 200);
        });
    }

    // Apply coupon button effect
    const couponButtons = document.querySelectorAll('.apply-coupon');
    
    couponButtons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Applied!';
            this.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 2000);
        });
    });

    // Store card selection effect
    const storeCards = document.querySelectorAll('.store-card');
    
    storeCards.forEach(card => {
        card.addEventListener('click', function() {
            storeCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Add some CSS for the interactions we defined above
    const style = document.createElement('style');
    style.textContent = `
        .item-checkbox.checked {
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .add-item.pressed {
            transform: scale(0.95);
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .store-card.selected {
            border: 2px solid var(--primary-color);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
    
    // Bonus Features Functionality
    const featureToggles = document.querySelectorAll('.feature-toggle input[type="checkbox"]');
    const mealModeToggle = document.getElementById('meal-mode-toggle');
    const mealModePanel = document.getElementById('meal-mode-panel');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Toggle feature functionality
    featureToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const featureId = this.id;
            const isEnabled = this.checked;
            
            if (featureId === 'meal-mode-toggle' && isEnabled) {
                // Show the Meal Mode panel when toggled on
                mealModePanel.style.display = 'block';
            } else if (featureId === 'student-mode-toggle') {
                // Apply student mode styling and filter
                document.body.classList.toggle('student-mode', isEnabled);
                // Simulate applying student discounts
                if (isEnabled) {
                    const storeCards = document.querySelectorAll('.store-card');
                    storeCards.forEach(card => {
                        const storeName = card.querySelector('.store-name').textContent;
                        if (storeName === 'Walmart' || storeName === 'Target') {
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
                    // Add eco badges to appropriate items
                    const appleItem = document.querySelector('.item-name[innerText="Apples (bag)"]');
                    if (appleItem) {
                        const listItem = appleItem.closest('.list-item');
                        const priceDiv = listItem.querySelector('.item-price');
                        if (!priceDiv.querySelector('.eco-badge')) {
                            const ecoBadge = document.createElement('div');
                            ecoBadge.className = 'eco-badge';
                            ecoBadge.innerHTML = '<i class="fas fa-leaf"></i> Locally Grown';
                            priceDiv.appendChild(ecoBadge);
                        }
                    }
                } else {
                    // Remove eco badges
                    document.querySelectorAll('.eco-badge').forEach(badge => badge.remove());
                }
            } else if (featureId === 'group-grocery-toggle') {
                // Show group planning mode
                document.body.classList.toggle('group-mode', isEnabled);
                if (isEnabled) {
                    // Add share buttons to list items
                    document.querySelectorAll('.list-item').forEach(item => {
                        if (!item.querySelector('.share-button')) {
                            const shareBtn = document.createElement('button');
                            shareBtn.className = 'share-button';
                            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
                            shareBtn.addEventListener('click', function(e) {
                                e.stopPropagation();
                                alert('Item shared with your group!');
                            });
                            item.appendChild(shareBtn);
                        }
                    });
                } else {
                    // Remove share buttons
                    document.querySelectorAll('.share-button').forEach(btn => btn.remove());
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
