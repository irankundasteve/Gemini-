import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArchivePage from './pages/ArchivePage';
import SciencePage from './pages/SciencePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminPage from './pages/AdminPage';

const links = [
  { to: '/archive', label: 'Shop' },
  { to: '/science', label: 'The Science' },
  { to: '/#subscriptions', label: 'Subscriptions' },
  { to: '/archive', label: 'Archive' }
];

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="app-shell">
      {!isAdmin && (
        <header className="site-header">
          <nav className="top-nav">
            <NavLink to="/" className="logo">Verdant Vault</NavLink>
            <div className="nav-links">
              {links.map((link) => (
                <NavLink key={`${link.to}-${link.label}`} to={link.to}>{link.label}</NavLink>
              ))}
              <button className="bag-button" aria-label="Shopping bag">👜</button>
            </div>
          </nav>
        </header>
      )}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/science" element={<SciencePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdmin && (
        <>
          <footer className="site-footer">
            <p>Contact Information • Privacy Policy • Terms of Service</p>
            <p>Instagram Feed (Graph API) • Newsletter Signup (Mailchimp)</p>
          </footer>
          <div className="mobile-sticky-nav">
            <button onClick={() => navigator.vibrate?.(30)}>Reserve Your Batch</button>
            <button onClick={() => navigator.vibrate?.(30)}>Explore Varieties</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
