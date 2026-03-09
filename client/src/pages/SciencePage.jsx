import { useEffect } from 'react';

const ledImage = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80';

const nutrients = [
  { name: 'Iron Density', value: '82%' },
  { name: 'Folate Retention', value: '76%' },
  { name: 'Anthocyanins', value: '69%' }
];

function SciencePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('show')),
      { threshold: 0.2 }
    );
    document.querySelectorAll('.reveal, .chart-bar').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="science-hero">
        <img src={ledImage} alt="Hydroponic LED array" />
        <div className="science-hero-content">
          <p className="label">Precision Climate Control</p>
          <h1>The Science of Flavor</h1>
          <div className="cta-row">
            <button>View Methodology</button>
            <button className="alt">Join the Lab</button>
          </div>
        </div>
      </section>

      <div className="page science-layout">
        <section className="reveal">
          <h2>Nutrient Density Comparison</h2>
          {nutrients.map((item) => (
            <div key={item.name}>
              <p>{item.name}</p>
              <div className="chart-bar" style={{ '--value': item.value }}><span /></div>
            </div>
          ))}
        </section>

        <section className="metric-grid reveal">
          <article className="metric"><h3>Temp</h3><p className="data">21°C</p></article>
          <article className="metric"><h3>Humidity</h3><p className="data">67%</p></article>
          <article className="metric"><h3>pH Level</h3><p className="data">6.1</p></article>
        </section>

        <section className="reveal" style={{ maxWidth: 800 }}>
          <h2>Agronomist Journal Feed</h2>
          <p>Spectrum-specific lighting tests improved leaf texture and reduced bitterness this cycle.</p>
          <details>
            <summary>Technical specifications</summary>
            <p>Channel map: 450nm / 660nm / 730nm.</p>
          </details>
        </section>
      </div>
    </>
  );
}

export default SciencePage;
