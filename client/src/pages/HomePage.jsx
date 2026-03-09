import { useEffect, useState } from 'react';

const macroImage = 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1920&q=80';

function HomePage() {
  const [impact, setImpact] = useState({ carbonKg: 0, waterLiters: 0 });
  const [zoomed, setZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/impact').then((res) => res.json()).then(setImpact).catch(() => setImpact({ carbonKg: 1824, waterLiters: 120432 }));

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('show')),
      { threshold: 0.2 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="home-hero">
        <video autoPlay muted loop playsInline poster={macroImage}>
          <source src="https://cdn.coverr.co/videos/coverr-growing-sprouts-1579/1080p.mp4" type="video/mp4" />
        </video>
        <div className="home-hero-content">
          <p className="label">Rare Heirloom Greens</p>
          <h1 className="hero-title">Rare Greens. Precise Flavor.</h1>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <button>Reserve Your Batch</button>
            <button className="alt">Explore Varieties</button>
          </div>
        </div>
      </section>

      <div className="page home-grid">
        <section className="reveal">
          <h2>Weekly Harvest Highlight</h2>
          <p>Purple Rambo Radish — Current Batch</p>
          <img src={macroImage} alt="Purple Rambo Radish macro" className={`botanical-image ${imageLoaded ? 'loaded' : ''}`} onLoad={() => setImageLoaded(true)} onClick={() => setZoomed(true)} />
        </section>

        <section className="reveal" id="subscriptions">
          <h2>Subscription Tier Comparison</h2>
          <div className="cards-3">
            <article className="card"><h3>Sprout</h3><p>4 cultivars weekly with bright stems and mineral finish.</p></article>
            <article className="card"><h3>Canopy</h3><p>8 cultivars with chef pairings and guided tasting cues.</p></article>
            <article className="card"><h3>Vault Reserve</h3><p>12 cultivars plus priority harvest from limited-growth cycles.</p></article>
          </div>
        </section>

        <section className="reveal">
          <h2>Real-Time Impact Counter</h2>
          <div className="cards-3">
            <article className="card"><p className="label">Carbon Offset</p><h3>{impact.carbonKg.toLocaleString()} kg</h3></article>
            <article className="card"><p className="label">Water Savings</p><h3>{impact.waterLiters.toLocaleString()} L</h3></article>
            <article className="card"><p className="label">Sync</p><h3>Live API Feed</h3></article>
          </div>
        </section>
      </div>

      {zoomed && (
        <dialog open className="lightbox" onClick={() => setZoomed(false)}>
          <img src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=2200&q=90" alt="Zoomed botanical macro" />
          <p>Tap to close</p>
        </dialog>
      )}
    </>
  );
}

export default HomePage;
