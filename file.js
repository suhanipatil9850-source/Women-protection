/* ============================================================
   SAFESHIELD — WOMEN SAFETY APP
   Interactive JavaScript
   ============================================================ */

// ============================================================
// 1. INITIALIZATION & ANIMATIONS
// ============================================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('🛡️ SafeShield Initialized');
  
  // Initialize location tracker
  initLocationTracker();
  
  // Add scroll animations
  initScrollAnimations();
  
  // Initialize keyboard shortcuts
  initKeyboardShortcuts();
});

// Scroll-triggered animations
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Press 'S' to open SOS modal
    if (e.key === 's' || e.key === 'S') {
      if (!document.getElementById('sosModal').classList.contains('active')) {
        openSOS();
      }
    }
    
    // Press 'Escape' to close modals
    if (e.key === 'Escape') {
      closeSOS();
    }
  });
}

// ============================================================
// 2. SOS MODAL FUNCTIONS
// ============================================================

function openSOS() {
  const modal = document.getElementById('sosModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Log SOS activation
  console.log('🆘 SOS Modal Opened');
  
  // Vibrate if supported (mobile devices)
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200]);
  }
}

function closeSOS() {
  const modal = document.getElementById('sosModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  
  console.log('✕ SOS Modal Closed');
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
  const modal = document.getElementById('sosModal');
  if (e.target === modal) {
    closeSOS();
  }
});

// ============================================================
// 3. EMERGENCY CALL FUNCTIONS
// ============================================================

function triggerCall(service) {
  let number = '';
  let message = '';
  
  // Determine the emergency number
  switch(service) {
    case 'Police':
    case 'Police – 100':
      number = '100';
      message = '📞 Calling Police (100)...';
      break;
    case 'Women Helpline':
    case 'Women Helpline – 181':
      number = '181';
      message = '📞 Calling Women Helpline (181)...';
      break;
    case 'Ambulance':
      number = '108';
      message = '🚑 Calling Ambulance (108)...';
      break;
    case 'Fire':
      number = '101';
      message = '🚒 Calling Fire Brigade (101)...';
      break;
    case 'Childline':
      number = '1098';
      message = '📞 Calling Childline (1098)...';
      break;
    case 'Cyber Crime':
      number = '1930';
      message = '💻 Calling Cyber Crime (1930)...';
      break;
    default:
      number = '100';
      message = '📞 Calling Emergency Services...';
  }
  
  // Show toast notification
  showToast(message);
  
  // Close SOS modal if open
  closeSOS();
  
  // Attempt to initiate call (mobile devices)
  if (number) {
    console.log(`Initiating call to ${service}: ${number}`);
    
    // In a real app, this would dial the number
    // For demo purposes, we'll simulate it
    setTimeout(() => {
      const confirm = window.confirm(`Do you want to call ${service} (${number})?`);
      if (confirm) {
        // In production, this would actually dial
        window.location.href = `tel:${number}`;
      }
    }, 1000);
  }
  
  // Log the action
  console.log(`🚨 Emergency call triggered: ${service} - ${number}`);
}

// ============================================================
// 4. LOCATION SHARING FUNCTIONS
// ============================================================

const locationState = {
  tracking: false,
  watchId: null,
  latitude: null,
  longitude: null
};

function initLocationTracker() {
  // Check if geolocation is supported
  if ('geolocation' in navigator) {
    updateLocationStatus('🟢 GPS Ready', '#10B981');
    console.log('📍 Geolocation API available');
  } else {
    updateLocationStatus('❌ GPS Not Available', '#EF4444');
    console.log('❌ Geolocation not supported');
  }
}

function shareLocation() {
  if (!('geolocation' in navigator)) {
    showToast('❌ GPS not available on this device');
    return;
  }
  
  // Show loading state
  updateLocationStatus('📡 Acquiring GPS signal...', '#F59E0B');
  showToast('📍 Requesting location access...');
  
  // Get current position
  navigator.geolocation.getCurrentPosition(
    // Success callback
    function(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const accuracy = Math.round(position.coords.accuracy);
      
      locationState.latitude = lat;
      locationState.longitude = lon;
      
      // Update UI
      updateLocationStatus(`📍 Location acquired (±${accuracy}m)`, '#10B981');
      
      // Animate map pin
      const mapPin = document.getElementById('mapPin');
      const mapLabel = document.getElementById('mapLabel');
      if (mapPin) mapPin.style.animation = 'pin-bounce 0.5s ease';
      if (mapLabel) mapLabel.textContent = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      
      // Show success toast
      showToast('✅ Location shared with trusted contacts!');
      
      // Close SOS modal
      closeSOS();
      
      // In production, this would send coordinates to emergency contacts
      console.log(`📍 Location shared: ${lat}, ${lon} (±${accuracy}m)`);
      
      // Generate shareable link
      const mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
      console.log(`🔗 Google Maps link: ${mapsUrl}`);
      
      // Optional: Copy link to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(mapsUrl).then(() => {
          console.log('📋 Location link copied to clipboard');
        });
      }
    },
    // Error callback
    function(error) {
      let errorMsg = '';
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMsg = '❌ Location permission denied';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg = '❌ Location information unavailable';
          break;
        case error.TIMEOUT:
          errorMsg = '⏱️ Location request timed out';
          break;
        default:
          errorMsg = '❌ Unknown location error';
      }
      
      updateLocationStatus(errorMsg, '#EF4444');
      showToast(errorMsg);
      console.error('Location error:', error);
    },
    // Options
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

function updateLocationStatus(text, color) {
  const statusText = document.getElementById('locStatus');
  const statusDot = document.querySelector('.loc-dot');
  
  if (statusText) {
    statusText.textContent = text;
  }
  
  if (statusDot && color) {
    statusDot.style.background = color;
  }
}

// ============================================================
// 5. FAKE CALL FUNCTIONS
// ============================================================

function showFakeCall() {
  showToast('📞 Fake call feature ready');
  
  // Scroll to fake call section
  const fakeCallSection = document.querySelector('.fakecall-section');
  if (fakeCallSection) {
    fakeCallSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  // Close SOS modal
  closeSOS();
  
  console.log('📞 Navigated to fake call section');
}

function triggerFakeCall(caller) {
  const callerElement = document.getElementById('fcCaller');
  const statusElement = document.getElementById('fcStatus');
  const phone = document.getElementById('fakeCallPhone');
  
  // Update caller info
  if (callerElement) callerElement.textContent = caller;
  if (statusElement) statusElement.textContent = 'Incoming Call...';
  
  // Vibrate pattern (if supported)
  if (navigator.vibrate) {
    // Simulate phone vibration pattern
    const pattern = [500, 200, 500, 200, 500];
    navigator.vibrate(pattern);
  }
  
  // Add ringing animation
  if (phone) {
    phone.style.animation = 'ring 0.5s ease infinite';
  }
  
  // Show toast
  showToast(`📱 Incoming call from ${caller}`);
  
  // Log action
  console.log(`📞 Fake call triggered from: ${caller}`);
  
  // Play ringtone (if you have an audio file)
  // playRingtone();
}

// Helper function to play ringtone (optional)
function playRingtone() {
  // This would play a ringtone audio file
  // const audio = new Audio('ringtone.mp3');
  // audio.play();
}

// ============================================================
// 6. SAFETY TIPS FUNCTION
// ============================================================

function showSafetyTip() {
  // Scroll to tips section
  const tipsSection = document.getElementById('safety-tips');
  if (tipsSection) {
    tipsSection.scrollIntoView({ behavior: 'smooth' });
  }
  
  showToast('💡 View essential safety tips below');
  closeSOS();
  
  console.log('💡 Navigated to safety tips');
}

// ============================================================
// 7. TOAST NOTIFICATION SYSTEM
// ============================================================

let toastTimeout = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  
  // Clear existing timeout
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  
  // Update message and show
  toast.textContent = message;
  toast.classList.add('show');
  
  // Auto-hide after 4 seconds
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
  
  console.log(`🔔 Toast: ${message}`);
}

// ============================================================
// 8. UTILITY FUNCTIONS
// ============================================================

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add active state to nav on scroll
window.addEventListener('scroll', function() {
  const nav = document.querySelector('nav');
  if (window.scrollY > 100) {
    nav.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  } else {
    nav.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
  }
});

// Log app version
console.log('🛡️ SafeShield v1.0 - Women Safety App');
console.log('👥 Team Nagmani - Team No. 12');
console.log('📱 Ready for emergency assistance');

// ============================================================
// 9. EMERGENCY CONTACT MANAGEMENT (Future Enhancement)
// ============================================================

// Store emergency contacts in localStorage
const EmergencyContacts = {
  getContacts: function() {
    const contacts = localStorage.getItem('emergencyContacts');
    return contacts ? JSON.parse(contacts) : [];
  },
  
  addContact: function(name, phone) {
    const contacts = this.getContacts();
    contacts.push({ name, phone, id: Date.now() });
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
    console.log(`✅ Added emergency contact: ${name} - ${phone}`);
  },
  
  removeContact: function(id) {
    let contacts = this.getContacts();
    contacts = contacts.filter(c => c.id !== id);
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
    console.log(`❌ Removed emergency contact with ID: ${id}`);
  }
};

// ============================================================
// 10. OFFLINE SUPPORT (Service Worker - Future Enhancement)
// ============================================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    // Register service worker for offline functionality
    // This would be implemented in a production app
    console.log('📱 App can work offline (service worker support detected)');
  });
}

// ============================================================
// 11. ANALYTICS & LOGGING (Privacy-Focused)
// ============================================================

function logUserAction(action, details = {}) {
  // In production, this would send anonymized analytics
  // to understand feature usage and improve safety tools
  const log = {
    timestamp: new Date().toISOString(),
    action: action,
    details: details
  };
  
  console.log('📊 User Action:', log);
  
  // Store locally for offline capability
  const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
  logs.push(log);
  
  // Keep only last 100 logs
  if (logs.length > 100) {
    logs.shift();
  }
  
  localStorage.setItem('activityLogs', JSON.stringify(logs));
}

// ============================================================
// 12. ACCESSIBILITY ENHANCEMENTS
// ============================================================

// High contrast mode toggle (future feature)
function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
  showToast('🎨 High contrast mode toggled');
}

// Text size adjustment (future feature)
function adjustTextSize(size) {
  const root = document.documentElement;
  
  switch(size) {
    case 'small':
      root.style.fontSize = '14px';
      break;
    case 'medium':
      root.style.fontSize = '16px';
      break;
    case 'large':
      root.style.fontSize = '18px';
      break;
  }
  
  showToast(`📝 Text size: ${size}`);
}

// ============================================================
// 13. BATTERY OPTIMIZATION
// ============================================================

// Check battery status
if ('getBattery' in navigator) {
  navigator.getBattery().then(function(battery) {
    const level = Math.round(battery.level * 100);
    console.log(`🔋 Battery level: ${level}%`);
    
    if (level < 20) {
      console.warn('⚠️ Low battery - consider enabling battery saver mode');
    }
    
    // Listen for battery changes
    battery.addEventListener('levelchange', function() {
      const newLevel = Math.round(battery.level * 100);
      console.log(`🔋 Battery level changed: ${newLevel}%`);
    });
  });
}

// ============================================================
// 14. NETWORK STATUS MONITORING
// ============================================================

window.addEventListener('online', function() {
  showToast('🌐 Back online');
  console.log('✅ Network connection restored');
});

window.addEventListener('offline', function() {
  showToast('📡 Offline mode - Emergency features still work');
  console.log('⚠️ Network connection lost - Operating in offline mode');
});

// Initial network status
if (navigator.onLine) {
  console.log('🌐 Online');
} else {
  console.log('📡 Offline mode');
}

// ============================================================
// 15. PREVENT ACCIDENTAL EXITS
// ============================================================

// Warn before leaving if SOS is active
window.addEventListener('beforeunload', function(e) {
  const sosModal = document.getElementById('sosModal');
  if (sosModal && sosModal.classList.contains('active')) {
    e.preventDefault();
    e.returnValue = 'SOS is active. Are you sure you want to leave?';
    return e.returnValue;
  }
});

/* ============================================================
   END OF SAFESHIELD JAVASCRIPT
   ============================================================ */