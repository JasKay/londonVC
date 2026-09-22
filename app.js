// ---------- mobile nav menu ----------
try{
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if(hamburger && mobileMenu){
    hamburger.addEventListener('click', function(){
      mobileMenu.classList.toggle('open');
    });
  }
}catch(err){ console.error('[nav]', err); }

// ---------- region -> country -> university picker (index page only) ----------
// Starter data only — not exhaustive. Top 5 countries per region are shown as
// quick picks; "Others ▾" falls back to a broader region-wide list (covering
// a few more countries) so nothing is a dead end. Typing anything not listed
// still saves fine either way.
try{
  const COUNTRIES_BY_REGION = {
    'Europe': ['UK', 'France', 'Italy', 'Germany', 'Spain'],
    'North America': ['United States', 'Canada'],
    'Latin America': ['Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia'],
    'ME & Africa': ['South Africa', 'Egypt', 'Saudi Arabia', 'Lebanon', 'Kenya'],
    'Asia': ['Singapore', 'China', 'Japan', 'India', 'South Korea'],
    'Oceania': ['Australia', 'New Zealand']
  };

  const UNIVERSITIES_BY_COUNTRY = {
    'UK': ['Imperial College London', 'University College London (UCL)', 'London School of Economics (LSE)', "King's College London", 'University of Oxford', 'University of Cambridge', 'University of Manchester', 'University of Edinburgh', 'City, University of London', 'Queen Mary University of London'],
    'France': ['Sciences Po', 'Sorbonne University'],
    'Italy': ['Bocconi University', 'Sapienza University of Rome', 'Politecnico di Milano'],
    'Germany': ['Technical University of Munich', 'Ludwig Maximilian University of Munich', 'Heidelberg University'],
    'Spain': ['IE University', 'Universidad Autónoma de Madrid', 'University of Barcelona'],
    'United States': ['Harvard University', 'Stanford University', 'MIT', 'New York University', 'University of Michigan', 'UCLA', 'UC Berkeley', 'Columbia University'],
    'Canada': ['University of Toronto', 'McGill University'],
    'Brazil': ['Universidade de São Paulo'],
    'Mexico': ['UNAM (Mexico)', 'Tecnológico de Monterrey'],
    'Argentina': ['Universidad de Buenos Aires'],
    'Chile': ['Pontificia Universidad Católica de Chile'],
    'Colombia': ['Universidad de los Andes (Colombia)'],
    'South Africa': ['University of Cape Town', 'University of the Witwatersrand'],
    'Egypt': ['American University in Cairo'],
    'Saudi Arabia': ['King Abdullah University of Science and Technology'],
    'Lebanon': ['American University of Beirut'],
    'Kenya': ['University of Nairobi'],
    'Singapore': ['National University of Singapore', 'Nanyang Technological University'],
    'China': ['Tsinghua University', 'Peking University'],
    'Japan': ['University of Tokyo'],
    'India': ['IIT Bombay'],
    'South Korea': ['Seoul National University'],
    'Australia': ['University of Sydney', 'University of Melbourne', 'Australian National University', 'UNSW Sydney', 'Monash University', 'University of Queensland'],
    'New Zealand': ['University of Auckland']
  };

  // broader fallback lists for when someone picks a country not in the top 5
  const UNIVERSITIES_OTHERS_BY_REGION = {
    'Europe': ['University of Amsterdam', 'ETH Zurich', 'Trinity College Dublin'],
    'North America': ['Harvard University', 'Stanford University', 'MIT', 'University of Toronto', 'McGill University'],
    'Latin America': ['Pontificia Universidad Católica del Perú'],
    'ME & Africa': ['University of Nairobi', 'American University of Beirut'],
    'Asia': ['University of Hong Kong'],
    'Oceania': ['University of Auckland']
  };

  // extra countries offered as suggestions once "Others" is picked — still just
  // suggestions, typing anything else works fine too
  const OTHER_COUNTRIES_BY_REGION = {
    'Europe': ['Ireland', 'Netherlands', 'Switzerland', 'Portugal', 'Sweden', 'Belgium', 'Poland', 'Austria', 'Denmark', 'Norway'],
    'North America': ['Bermuda', 'Jamaica', 'Bahamas'],
    'Latin America': ['Peru', 'Ecuador', 'Uruguay', 'Venezuela', 'Bolivia', 'Costa Rica'],
    'ME & Africa': ['Nigeria', 'Morocco', 'UAE', 'Israel', 'Ghana', 'Tunisia', 'Jordan'],
    'Asia': ['Hong Kong', 'Malaysia', 'Thailand', 'Vietnam', 'Indonesia', 'Philippines', 'Taiwan'],
    'Oceania': ['Fiji', 'Papua New Guinea']
  };

  const uniInput = document.getElementById('uni');
  const uniDatalist = document.getElementById('uniOptions');
  const countryChipRow = document.getElementById('countryChipRow');
  const otherCountryField = document.getElementById('otherCountryField');
  const otherCountryInput = document.getElementById('otherCountryInput');
  const otherCountryOptions = document.getElementById('otherCountryOptions');

  if(uniInput && uniDatalist && countryChipRow){

    function resetUniField(){
      uniInput.placeholder = 'Start typing your university, or pick a region and country first';
      uniDatalist.innerHTML = '';
    }

    function enableUniField(list, placeholderText){
      uniDatalist.innerHTML = list.map(function(name){ return '<option value="' + name + '"></option>'; }).join('');
      uniInput.placeholder = placeholderText;
      // no auto-focus here — jumping the keyboard open right after a tap felt like a glitch on mobile
    }

    function hideOtherCountryField(){
      if(otherCountryField){ otherCountryField.style.display = 'none'; }
      if(otherCountryInput){ otherCountryInput.value = ''; }
    }

    document.querySelectorAll('.region-chip').forEach(function(chip){
      chip.addEventListener('click', function(){
        document.querySelectorAll('.region-chip').forEach(function(c){ c.classList.remove('selected'); });
        chip.classList.add('selected');
        const region = chip.getAttribute('data-region');

        resetUniField();
        hideOtherCountryField();

        const countries = COUNTRIES_BY_REGION[region] || [];
        let html = countries.map(function(country){
          return '<button type="button" class="pick-chip country-chip" data-country="' + country + '" data-region="' + region + '">' + country + '</button>';
        }).join('');
        html += '<button type="button" class="pick-chip country-chip others-chip" data-others-for="' + region + '">Others <span class="chevron-down">▾</span></button>';
        countryChipRow.innerHTML = html;

        countryChipRow.querySelectorAll('.country-chip').forEach(function(cbtn){
          cbtn.addEventListener('click', function(){
            countryChipRow.querySelectorAll('.country-chip').forEach(function(c){ c.classList.remove('selected'); });
            cbtn.classList.add('selected');

            if(cbtn.classList.contains('others-chip')){
              const r = cbtn.getAttribute('data-others-for');
              resetUniField();
              if(otherCountryOptions){
                const suggestions = OTHER_COUNTRIES_BY_REGION[r] || [];
                otherCountryOptions.innerHTML = suggestions.map(function(c){ return '<option value="' + c + '"></option>'; }).join('');
              }
              if(otherCountryField) otherCountryField.style.display = 'block';
              if(otherCountryInput) otherCountryInput.value = '';
              // fallback list ready immediately in case they skip straight to typing a university
              enableUniField(UNIVERSITIES_OTHERS_BY_REGION[r] || [], 'Or type your country above, then your university…');
            } else {
              hideOtherCountryField();
              const country = cbtn.getAttribute('data-country');
              enableUniField(UNIVERSITIES_BY_COUNTRY[country] || [], 'Type your university…');
            }
          });
        });
      });
    });

    // once a country is typed/picked in the "Others" search field, narrow the
    // university list if we happen to have data for it, otherwise leave it open to free typing
    if(otherCountryInput){
      otherCountryInput.addEventListener('input', function(){
        const typed = otherCountryInput.value.trim();
        if(!typed) return;
        const matchedList = UNIVERSITIES_BY_COUNTRY[typed];
        if(matchedList){
          enableUniField(matchedList, 'Type your university…');
        } else {
          enableUniField([], 'Type your university…');
        }
      });
    }

    // ---- reverse detection: typing a known university auto-selects its region/country ----
    // Build a country -> region index and a lowercase uni-name -> country index from
    // the same data already defined above, so this stays in sync automatically.
    const COUNTRY_TO_REGION = {};
    Object.keys(COUNTRIES_BY_REGION).forEach(function(region){
      COUNTRIES_BY_REGION[region].forEach(function(country){ COUNTRY_TO_REGION[country] = region; });
    });

    const UNI_NAME_TO_COUNTRY = {};
    Object.keys(UNIVERSITIES_BY_COUNTRY).forEach(function(country){
      UNIVERSITIES_BY_COUNTRY[country].forEach(function(uniName){
        UNI_NAME_TO_COUNTRY[uniName.toLowerCase()] = country;
      });
    });

    let detectionSuppressed = false; // avoid re-triggering while we're setting chips programmatically

    function selectRegionAndCountryProgrammatically(region, country){
      detectionSuppressed = true;
      const regionChip = document.querySelector('.region-chip[data-region="' + region + '"]');
      if(regionChip) regionChip.click();
      // the region click rebuilds the country row asynchronously-in-effect (synchronously here),
      // so the country chip now exists — select it right after
      const countryChip = document.querySelector('.country-chip[data-country="' + country + '"]');
      if(countryChip) countryChip.click();
      detectionSuppressed = false;
    }

    uniInput.addEventListener('input', function(){
      if(detectionSuppressed) return;
      const typed = uniInput.value.trim().toLowerCase();
      if(typed.length < 3) return;
      const matchedCountry = UNI_NAME_TO_COUNTRY[typed];
      if(matchedCountry){
        const region = COUNTRY_TO_REGION[matchedCountry];
        const alreadySelected = document.querySelector('.country-chip.selected');
        const alreadyCorrect = alreadySelected && alreadySelected.getAttribute('data-country') === matchedCountry;
        if(region && !alreadyCorrect){
          const typedValue = uniInput.value;
          selectRegionAndCountryProgrammatically(region, matchedCountry);
          uniInput.value = typedValue; // the programmatic region/country selection resets the datalist; restore what they typed
        }
      }
    });
  }
}catch(err){ console.error('[university picker]', err); }

// ---------- best-effort IP geolocation for region/country (index page only) ----------
// Pre-selects a region/country based on approximate location so students can skip a step —
// they can still change it by tapping any other chip. Uses a free, unauthenticated API;
// fails silently (leaves the picker untouched) if it's unreachable or rate-limited.
try{
  const geoRegionRow = document.querySelector('.region-chip-row');
  if(geoRegionRow && document.getElementById('uni')){
    const COUNTRY_NAME_TO_REGION_COUNTRY = {
      'United Kingdom': ['Europe', 'UK'], 'France': ['Europe', 'France'], 'Italy': ['Europe', 'Italy'],
      'Germany': ['Europe', 'Germany'], 'Spain': ['Europe', 'Spain'],
      'United States': ['North America', 'United States'], 'Canada': ['North America', 'Canada'],
      'Brazil': ['Latin America', 'Brazil'], 'Mexico': ['Latin America', 'Mexico'],
      'Argentina': ['Latin America', 'Argentina'], 'Chile': ['Latin America', 'Chile'], 'Colombia': ['Latin America', 'Colombia'],
      'South Africa': ['ME & Africa', 'South Africa'], 'Egypt': ['ME & Africa', 'Egypt'],
      'Saudi Arabia': ['ME & Africa', 'Saudi Arabia'], 'Lebanon': ['ME & Africa', 'Lebanon'], 'Kenya': ['ME & Africa', 'Kenya'],
      'Singapore': ['Asia', 'Singapore'], 'China': ['Asia', 'China'], 'Japan': ['Asia', 'Japan'],
      'India': ['Asia', 'India'], 'South Korea': ['Asia', 'South Korea'],
      'Australia': ['Oceania', 'Australia'], 'New Zealand': ['Oceania', 'New Zealand']
    };

    fetch('https://ipapi.co/json/')
      .then(function(res){ return res.ok ? res.json() : null; })
      .then(function(data){
        if(!data || !data.country_name) return;
        const match = COUNTRY_NAME_TO_REGION_COUNTRY[data.country_name];
        if(!match) return; // country not in our starter list — leave it for the person to pick manually
        const [region, country] = match;
        const regionChip = document.querySelector('.region-chip[data-region="' + region + '"]');
        if(regionChip){
          regionChip.click();
          const countryChip = document.querySelector('.country-chip[data-country="' + country + '"]');
          if(countryChip) countryChip.click();
        }
      })
      .catch(function(){ /* silent — geolocation is a nice-to-have, not a requirement */ });
  }
}catch(err){ console.error('[ip geolocation]', err); }

// ---------- name/email placeholder progression (index page only) ----------
// Email's placeholder only appears once a name has been typed — a small nudge
// to fill the form in order rather than a hard requirement.
try{
  const fnameInput = document.getElementById('fname');
  const emailInput = document.getElementById('email');
  if(fnameInput && emailInput){
    fnameInput.addEventListener('input', function(){
      emailInput.placeholder = fnameInput.value.trim().length > 0 ? 'Type your university email here…' : '';
    });
  }
}catch(err){ console.error('[placeholder progression]', err); }

// ---------- university-email nudge (index page only) ----------
// Soft nudge only — never blocks submission. Flags common personal email
// providers so students know a university address gets them a verified badge.
try{
  const emailInputForNudge = document.getElementById('email');
  const emailNudge = document.getElementById('emailNudge');
  if(emailInputForNudge && emailNudge){
    const PERSONAL_EMAIL_DOMAINS = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
      'live.com', 'aol.com', 'protonmail.com', 'msn.com', 'me.com'
    ];
    emailInputForNudge.addEventListener('blur', function(){
      const value = emailInputForNudge.value.trim().toLowerCase();
      const atIndex = value.indexOf('@');
      if(atIndex === -1){ emailNudge.style.display = 'none'; return; }
      const domain = value.slice(atIndex + 1);
      emailNudge.style.display = PERSONAL_EMAIL_DOMAINS.indexOf(domain) > -1 ? 'block' : 'none';
    });
    emailInputForNudge.addEventListener('input', function(){
      emailNudge.style.display = 'none'; // hide while actively typing, re-check on blur
    });
  }
}catch(err){ console.error('[email nudge]', err); }

// ---------- Enter key moves to the next field instead of submitting ----------
try{
  const form = document.getElementById('signupForm');
  if(form){
    const focusableSelector = 'input:not([type=hidden]):not([disabled]), select, textarea, button[type=submit]';
    form.addEventListener('keydown', function(e){
      if(e.key !== 'Enter') return;
      const tag = e.target.tagName.toLowerCase();
      if(tag === 'textarea') return; // allow real newlines where relevant
      if(e.target.type === 'submit') return; // let submit buttons behave normally
      e.preventDefault();
      const focusable = Array.prototype.slice.call(form.querySelectorAll(focusableSelector));
      const idx = focusable.indexOf(e.target);
      if(idx > -1 && idx < focusable.length - 1){
        focusable[idx + 1].focus();
      }
    });
  }
}catch(err){ console.error('[enter key nav]', err); }


// ---------- year chip selection (signup form, index page only) ----------
try{
  const yearInput = document.getElementById('year');
  if(yearInput){
    document.querySelectorAll('.pick-chip[data-year]').forEach(function(chip){
      chip.addEventListener('click', function(){
        document.querySelectorAll('.pick-chip[data-year]').forEach(function(c){ c.classList.remove('selected'); });
        chip.classList.add('selected');
        yearInput.value = chip.getAttribute('data-year');
      });
    });
  }
}catch(err){ console.error('[year chips]', err); }

// ---------- signup form submission (index page only) ----------
try{
  const form = document.getElementById('signupForm');
  if(form){
    // ── BACKEND WIRING ─────────────────────────────────────────────
    // This form inserts each submission directly into a Supabase table via
    // Supabase's REST API. See SETUP_INSTRUCTIONS.md for the full setup
    // (SQL included) — you'll need a project URL and public anon key.
    const SUPABASE_URL = 'PASTE_YOUR_SUPABASE_PROJECT_URL_HERE';
    const SUPABASE_ANON_KEY = 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE';

    const submitBtn = document.getElementById('submitBtn');
    const errorMsg = document.getElementById('errorMsg');
    const successCard = document.getElementById('successCard');

    form.addEventListener('submit', function(e){
      e.preventDefault();

      if (SUPABASE_URL.indexOf('PASTE_YOUR') === 0 || SUPABASE_ANON_KEY.indexOf('PASTE_YOUR') === 0) {
        alert('Signup backend not connected yet — see SETUP_INSTRUCTIONS.md to link this form to Supabase.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';

      const payload = {
        name: document.getElementById('fname').value,
        email: document.getElementById('email').value,
        university: document.getElementById('uni').value,
        year: document.getElementById('year').value,
        interest: document.getElementById('interest').value
      };

      fetch(SUPABASE_URL + '/rest/v1/signups', {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      })
      .then(function(response){
        if (response.ok) {
          form.style.display = 'none';
          successCard.style.display = 'block';
        } else {
          return response.text().then(function(t){ throw new Error(t); });
        }
      })
      .catch(function(err){
        console.error('Supabase insert failed:', err);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
        errorMsg.style.display = 'block';
      });
    });
  }
}catch(err){ console.error('[signup form]', err); }

// ---------- hero headline rotation with atmospheric light + dots (index page only) ----------
// Cycles through 3 phrases once, then stops permanently on the first ("Compete in
// amazing challenges"). Each phrase fades out, pauses on a blank beat, then the next
// phrase (and its matching soft light glow) fades in. The 3 dots beneath the CTA
// track which phrase is currently showing. Clicking the headline manually
// advances to the next phrase too — a quiet "reel" interaction, no prompt needed.
try{
  const heroHeadline = document.getElementById('heroHeadline');
  const heroLight = document.getElementById('heroLight');
  const heroDotEls = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));

  if(heroHeadline && heroLight){
    // All three forced to exactly 3 lines via explicit <br> so the hero never
    // jumps in height when the phrase changes.
    const rotations = [
      { html:'Compete in<br>amazing<br><em>challenges.</em>', light:'light-gold' },
      { html:'Take on<br>challenges that<br><em>excite you.</em>', light:'light-warm' },
      { html:'Find your<br>next<br><em>challenge.</em>', light:'light-spot' }
    ];
    const DISPLAY_MS = 4200; // how long a phrase stays fully visible during auto-rotation
    const FADE_MS = 1100;    // fade-out duration (matches CSS transition)
    const GAP_MS = 700;      // blank pause between fade-out finishing and fade-in starting
    let currentIdx = 0;
    let autoStepsLeft = 3;   // 0→1, 1→2, 2→0 — three transitions, then auto-rotation stops
    let transitioning = false;

    function updateDots(idx){
      for(let i = 0; i < heroDotEls.length; i++){
        if(i === idx){ heroDotEls[i].classList.add('active'); }
        else{ heroDotEls[i].classList.remove('active'); }
      }
    }

    function showPhrase(idx){
      heroHeadline.innerHTML = rotations[idx].html;
      heroLight.className = 'hero-light active ' + rotations[idx].light;
      updateDots(idx);
    }

    function transitionTo(nextIdx){
      if(transitioning) return;
      transitioning = true;
      heroHeadline.style.opacity = '0';
      setTimeout(function(){
        currentIdx = nextIdx;
        showPhrase(currentIdx);
        heroHeadline.style.opacity = '1';
        transitioning = false;
      }, FADE_MS + GAP_MS);
    }

    // initial state — shown immediately, no fade-in delay on page load
    showPhrase(currentIdx);

    function scheduleAutoAdvance(){
      if(autoStepsLeft <= 0) return; // stop — stays on whatever phrase is showing
      setTimeout(function(){
        transitionTo((currentIdx + 1) % rotations.length);
        autoStepsLeft--;
        scheduleAutoAdvance();
      }, DISPLAY_MS);
    }
    scheduleAutoAdvance();

    // click the headline anytime to manually flick to the next phrase —
    // works indefinitely, even after auto-rotation has stopped.
    heroHeadline.addEventListener('click', function(){
      transitionTo((currentIdx + 1) % rotations.length);
    });
  }
}catch(err){ console.error('[hero rotation]', err); }

// ---------- category cards: pick top 4, cards reorder to the front (index page only) ----------
try{
  const catCards = Array.prototype.slice.call(document.querySelectorAll('.cat-card'));

  if(catCards.length){
    const catSelectionNote = document.getElementById('catSelectionNote');
    const interestHidden = document.getElementById('interest');
    const picksDisplay = document.getElementById('picksDisplay');

    // Direct name -> element map. Safer than rebuilding CSS attribute-selector
    // strings from category names (several contain "&" and spaces).
    const cardsByCat = {};
    catCards.forEach(function(c){ cardsByCat[c.getAttribute('data-cat')] = c; });

    const NATURAL_ORDER = catCards.map(function(c){ return c.getAttribute('data-cat'); });

    let selectedCats = []; // ordered, max 4 — the single source of truth

    function toggleCategory(cat){
      const idx = selectedCats.indexOf(cat);
      if(idx > -1){
        selectedCats.splice(idx, 1);
        return true;
      }
      if(selectedCats.length >= 4){ return false; } // already at 4, ignore
      selectedCats.push(cat);
      return true;
    }

    // Selected cards move to the front of the row (in pick order); everything
    // else follows in natural order. Cards that actually move get a brief
    // highlight pulse so the reorder is visible.
    function reorderCards(){
      const unselected = NATURAL_ORDER.filter(function(c){ return selectedCats.indexOf(c) === -1; });
      const finalOrder = selectedCats.concat(unselected);

      finalOrder.forEach(function(cat, i){
        const card = cardsByCat[cat];
        if(!card) return;
        const newOrder = String(i + 1);
        if(card.style.order !== newOrder){
          card.style.order = newOrder;
          card.classList.remove('just-moved');
          void card.offsetWidth; // restart animation if triggered again quickly
          card.classList.add('just-moved');
        }
      });
    }

    function updateCardRanks(){
      catCards.forEach(function(card){
        const cat = card.getAttribute('data-cat');
        const rankSpan = card.querySelector('.cat-card-rank');
        const idx = selectedCats.indexOf(cat);
        if(idx > -1){
          card.classList.add('selected');
          if(rankSpan) rankSpan.textContent = (idx + 1);
        } else {
          card.classList.remove('selected');
          if(rankSpan) rankSpan.textContent = '';
        }
      });
    }

    function updateNote(){
      if(!catSelectionNote) return;
      const continueBtn = document.getElementById('catContinueBtn');
      const count = selectedCats.length;

      if(count === 0){
        catSelectionNote.textContent = 'Choose up to 4 — tap a selected one again to remove it.';
        if(continueBtn) continueBtn.style.display = 'none';
      } else if(count === 4){
        catSelectionNote.textContent = "That's great — your top 4 are set.";
        if(continueBtn) continueBtn.style.display = 'inline-block';
      } else {
        catSelectionNote.textContent = 'Nice picks — add more, or continue whenever you\'re ready.';
        if(continueBtn) continueBtn.style.display = 'inline-block';
      }
    }

    function updateReadout(){
      if(interestHidden) interestHidden.value = selectedCats.join(', ');
      renderPicksDisplay();
    }

    function renderPicksDisplay(){
      if(!picksDisplay) return;

      if(selectedCats.length === 0){
        picksDisplay.innerHTML = '<a href="#challenges" class="picks-empty-prompt">↑ Go pick your top 4 above</a>';
        return;
      }

      picksDisplay.innerHTML = selectedCats.map(function(cat, i){
        const card = cardsByCat[cat];
        const emoji = card ? card.getAttribute('data-emoji') : '';
        return '<span class="interest-tag">' +
          '<span class="tag-rank">' + (i + 1) + '</span>' +
          '<span class="tag-label">' + emoji + ' ' + cat + '</span>' +
          '<button type="button" class="tag-remove" data-cat="' + cat.replace(/"/g, '&quot;') + '" aria-label="Remove ' + cat + '">×</button>' +
        '</span>';
      }).join('');

      picksDisplay.querySelectorAll('.tag-remove').forEach(function(btn){
        btn.addEventListener('click', function(){
          toggleCategory(btn.getAttribute('data-cat'));
          refreshAll();
        });
      });
    }

    function refreshAll(){
      updateCardRanks();
      reorderCards();
      updateNote();
      updateReadout();
    }

    // explicit starting order, matching natural DOM order (nothing moves on load)
    catCards.forEach(function(card, i){ card.style.order = String(i + 1); });

    catCards.forEach(function(card){
      card.addEventListener('click', function(){
        toggleCategory(card.getAttribute('data-cat'));
        refreshAll();
      });
    });

    updateNote();
    updateReadout();
  }
}catch(err){ console.error('[category cards]', err); }


// ---------- analogy carousel (Why Challenges page only) ----------
try{
  const analogyTrack = document.getElementById('analogyTrack');
  const analogyPrev = document.getElementById('analogyPrev');
  const analogyNext = document.getElementById('analogyNext');
  const analogyDotsWrap = document.getElementById('analogyDots');

  if(analogyTrack && analogyPrev && analogyNext){
    const slides = Array.prototype.slice.call(analogyTrack.querySelectorAll('.analogy-slide'));
    const dots = analogyDotsWrap ? Array.prototype.slice.call(analogyDotsWrap.querySelectorAll('.analogy-dot')) : [];
    let current = 0;

    function showSlide(idx){
      current = (idx + slides.length) % slides.length;
      slides.forEach(function(s, i){ s.classList.toggle('active', i === current); });
      dots.forEach(function(d, i){ d.classList.toggle('active', i === current); });
    }

    analogyPrev.addEventListener('click', function(){ showSlide(current - 1); });
    analogyNext.addEventListener('click', function(){ showSlide(current + 1); });
    dots.forEach(function(dot, i){
      dot.addEventListener('click', function(){ showSlide(i); });
    });
  }
}catch(err){ console.error('[analogy carousel]', err); }
