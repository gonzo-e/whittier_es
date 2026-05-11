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

function handleFormSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  // In production this POST goes to the Next.js API route /api/contact
  // For this mockup we just show the success state
  form.style.display = 'none';
  success.style.display = 'block';
  // Also hide the OR divider
  document.querySelector('.contact-divider').style.display = 'none';
}

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