(async function detectVisitorCity() {
  try {
    // Get visitor location from free IP geolocation API
    const res = await fetch('https://ipapi.co/json/');
    const geo = await res.json();

    const city = geo.city || 'Your City';
    const state = geo.region_code || geo.region || '';

    // Update welcome badge
    document.getElementById('welcome-city').textContent = city.toUpperCase();
    document.getElementById('welcome-state').textContent = state ? state + ', USA' : 'We serve your area';
    document.getElementById('welcome-label').textContent = 'Welcome to';

    // Update subtitle
    document.getElementById('area-sub').textContent =
      'We proudly serve ' + city + ' and all surrounding communities. Fast, reliable electrical service near you.';

    // Show detected city tag at front of list
    const cityTag = document.getElementById('detected-city-tag');
    document.getElementById('detected-city-name').textContent = city;
    cityTag.style.display = 'flex';

    // Swap image to city-specific Unsplash photo
    const img = document.getElementById('area-img');
    img.style.opacity = '0';

    const newImg = new Image();
    const query = encodeURIComponent(city + ' ' + state + ' neighborhood');
    newImg.src = 'https://source.unsplash.com/800x400/?' + query;
    newImg.onload = function() {
      img.src = newImg.src;
      img.style.opacity = '1';
    };
    newImg.onerror = function() {
      // Fallback: just fade back in with default
      img.style.opacity = '1';
    };

  } catch(e) {
    // Silently fall back to defaults if geolocation fails
    document.getElementById('welcome-city').textContent = 'Your Area';
    document.getElementById('welcome-state').textContent = 'We serve your community';
  }
})();

// ─────────────────────────────────────────────

// Handle form submission manually
(function() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successDiv = document.querySelector('[data-fs-success]');
  const errorDiv = document.querySelector('[data-fs-error]');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!submitBtn || !successDiv || !errorDiv) return;

    // Reset messages
    successDiv.style.display = 'none';
    errorDiv.style.display = 'none';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const formData = new FormData(form);
      const response = await fetch('https://formspree.io/f/mykolzbv', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        form.style.display = 'none';
        successDiv.style.display = 'block';
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const result = await response.json().catch(() => null);
        const serverMessage = result && result.error ? result.error : 'Something went wrong. Please try again.';
        errorDiv.style.display = 'block';
        errorDiv.textContent = serverMessage;
      }
    } catch (error) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = 'Network error. Please check your connection and try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
})();

// ─────────────────────────────────────────────

// Highlight the form when any anchor link points to #contact
document.querySelectorAll('a[href="#contact"]').forEach(function(link) {
  link.addEventListener('click', function() {
    setTimeout(function() {
      var form = document.getElementById('contact-form');
      if (form) {
        form.classList.add('highlight');
        setTimeout(function() { form.classList.remove('highlight'); }, 1400);
      }
    }, 500);
  });
});

// ─────────────────────────────────────────────

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  // Toggle clicked
  if (!isOpen) item.classList.add('open');
}