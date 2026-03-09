import { useEffect, useState } from 'react';

const photo = 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?auto=format&fit=crop&w=800&q=80';

function ArchivePage() {
  const [varieties, setVarieties] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/archive').then((res) => res.json()).then(setVarieties).catch(() => setVarieties([
      { name: 'Scarlet Frill Mustard', available: true, cycle: 'Day 11/14' },
      { name: 'Shiso Crimson', available: false, cycle: 'Day 7/21' }
    ]));
  }, []);

  const filtered = varieties.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('show')),
      { threshold: 0.2 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filtered.length]);

  return (
    <div className="page">
      <header className="archive-top">
        <div>
          <p className="label">Product Catalog</p>
          <h1>The Archive</h1>
          <p>A curated set of rare greens grown to order.</p>
        </div>
        <div className="searchbar">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by flavor or variety" aria-label="Search archive" />
          <button className="alt">Filter</button>
        </div>
      </header>

      <section className="archive-grid">
        {filtered.map((item, index) => (
          <article key={item.name} className={`card reveal ${index === 0 ? 'selected' : ''}`} style={{ transitionDelay: `${index * 100}ms` }}>
            <h3>{item.name}</h3>
            <p className="data">{item.cycle || 'Day 1/14'} • IoT sensor log</p>
            <span className={item.available ? 'badge' : 'badge muted'}>{item.available ? 'Live Availability' : 'Notify When Ripe'}</span>
            <div className="image-frame">
              <img className="botanical-image loaded" src={photo} alt="Heirloom flat-lay on copper" />
              <div className="image-overlay">800x800 • View Macro</div>
            </div>
            <p>Customer profile: peppery, mineral, sweet finish.</p>
            <div className="cta-row">
              <button>Add to Box</button>
              <button className="alt">Notify When Ripe</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default ArchivePage;
