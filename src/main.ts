import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App container is missing');
app.innerHTML = `
  <header><p class="eyebrow">Every world has a way.</p><h1>Waywild</h1><p>En värld, två perspektiv.</p></header>
  <main aria-label="Världsvyer">
    <section aria-labelledby="map-title"><h2 id="map-title">Karta</h2><div class="placeholder"><span>01</span><p>Här kommer världen sedd uppifrån.</p></div></section>
    <section aria-labelledby="world-title"><h2 id="world-title">Förstaperson</h2><div class="placeholder"><span>02</span><p>Här kommer dalgången att ta form.</p></div></section>
  </main>
  <footer>Första steget: webbskal. Gång och terräng kommer i nästa steg.</footer>
`;
