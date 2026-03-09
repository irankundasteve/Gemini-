import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="page not-found">
      <p className="label">🌱</p>
      <h1>This seed failed to germinate.</h1>
      <p>The page you are looking for has been pruned or never existed.</p>
      <div className="cta-row" style={{ justifyContent: 'center' }}>
        <Link className="button-link" to="/">Return to Nursery</Link>
        <Link className="button-link alt" to="/archive">View Current Harvest</Link>
      </div>
      <Link className="button-link float-cta" to="/">Return to Nursery</Link>
    </div>
  );
}

export default NotFoundPage;
