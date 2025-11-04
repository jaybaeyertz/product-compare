// ---------- CONFIG: insert your RapidAPI key here ----------
const RAPIDAPI_HOST = "YOUR_CHOSEN_API_HOST_FROM_RAPIDAPI"; // e.g. "product-search-example.p.rapidapi.com"
const RAPIDAPI_KEY  = "YOUR_RAPIDAPI_KEY";
// ---------------------------------------------------------

const searchBtn = document.getElementById('searchBtn');
const searchBox = document.getElementById('searchBox');
const resultsDiv = document.getElementById('results');

searchBtn.addEventListener('click', () => runSearch(searchBox.value));
searchBox.addEventListener('keyup', (e)=>{ if(e.key==='Enter') runSearch(searchBox.value); });

async function runSearch(query){
  if(!query) return alert('Type something to search.');
  resultsDiv.innerHTML = '<p>Searching…</p>';
  try{
    const res = await fetch(`https://${RAPIDAPI_HOST}/search?query=${encodeURIComponent(query)}&limit=12`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });
    if(!res.ok) throw new Error('API error '+res.status);
    const data = await res.json();
    showResults(data);
  } catch(err){
    resultsDiv.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
    console.error(err);
  }
}

function showResults(apiData){
  // Different APIs return different shapes. This demo assumes apiData.results[] with fields: title, price, image, merchants[]
  resultsDiv.innerHTML = '';
  const items = apiData.results || apiData.items || [];
  if(!items.length) { resultsDiv.innerHTML = '<p>No results.</p>'; return; }

  items.forEach(item => {
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <h3>${item.title||item.name}</h3>
      <img src="${item.image||''}" alt="${item.title||''}" />
      <p>Lowest price: ${item.price ? item.price.display || item.price : 'N/A'}</p>
      <div class="merchant">
        ${ (item.offers || item.merchants || []).slice(0,3).map(o=>`
          <div>${o.store || o.merchant || o.seller} — ${o.price || o.listPrice || ''} 
            <a class="buyBtn" href="${o.link || '#'}" target="_blank" rel="noopener">Buy</a>
          </div>
        `).join('') }
      </div>
    `;
    resultsDiv.appendChild(card);
  });
}
