import { useMemo, useState } from 'react';

const roleList = ['Super Admin', 'Agronomist', 'Inventory Manager', 'Content Editor'];
const navItems = ['users', 'content', 'inventory', 'analytics', 'forms', 'media'];

const permissionsByRole = {
  'Super Admin': navItems,
  Agronomist: ['content', 'inventory', 'media'],
  'Inventory Manager': ['inventory', 'analytics'],
  'Content Editor': ['users', 'content', 'forms', 'media']
};

function AdminPage() {
  const [role, setRole] = useState('Super Admin');
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('users');

  const allowed = useMemo(() => new Set(permissionsByRole[role] || []), [role]);

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-logo">Verdant Vault</div>
        <button className="collapse-toggle" onClick={() => setCollapsed((c) => !c)}>
          {collapsed ? '»' : '«'}
        </button>
        <nav>
          {navItems.map((item) => {
            const enabled = allowed.has(item);
            return (
              <button
                key={item}
                className={`sidebar-item ${active === item ? 'active' : ''}`}
                disabled={!enabled}
                onClick={() => setActive(item)}
                title={item}
              >
                {collapsed ? item[0].toUpperCase() : item.toUpperCase()}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="admin-main-wrap">
        <header className="admin-header">
          <div>Admin / {active}</div>
          <div className="header-right">
            <span>🔔</span>
            <span>{role}</span>
          </div>
        </header>

        <main className="admin-main">
          <section className="admin-toolbar">
            <h1>Verdant Vault Operations</h1>
            <label htmlFor="role-selector">Access level</label>
            <select id="role-selector" value={role} onChange={(e) => setRole(e.target.value)}>
              {roleList.map((entry) => (
                <option key={entry} value={entry}>{entry}</option>
              ))}
            </select>
          </section>

          <section className="module-grid users">
            <article className="module-card span-12">
              <h2>User/Client Management</h2>
              <p>Total Subscribers: 2,394</p>
              <div className="skeleton-row" />
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Tier</th><th>Status</th><th>Taste Profile</th></tr></thead>
                  <tbody>
                    <tr><td>A. Lin</td><td>Canopy</td><td>Active</td><td>Citrus, pepper</td></tr>
                    <tr><td>M. Rios</td><td>Sprout</td><td>Waitlist</td><td>Mineral, sweet</td></tr>
                  </tbody>
                </table>
              </div>
            </article>
            <article className="module-card"><h3>No active harvests</h3><p>Awaiting first batch registration.</p><button>Invite User</button></article>
            <article className="module-card"><h3>Sync Interrupted</h3><p>Retry Database Connection.</p></article>
            <article className="module-card"><h3>Review Queue</h3><p>19 taste profiles need moderation.</p></article>
          </section>

          <section className="module-grid two-col">
            <article className="module-card">
              <h2>Content Management</h2>
              <p>Draft Empty. Begin your botanical narrative.</p>
              <p className="error">Headline exceeds 6 words. Shorten copy.</p>
            </article>
            <article className="module-card">
              <h2>SEO + Preview</h2>
              <p>Home, Archive, and Science metadata controls.</p>
            </article>
          </section>

          <section className="module-grid three-col">
            <article className="module-card"><h2>Live Sensor Feed</h2><p>21°C · 67% · pH 6.1</p></article>
            <article className="module-card"><h2>Vault Empty</h2><p>No heirloom varieties currently in growth.</p><button>Add Variety</button></article>
            <article className="module-card"><h2>Sensor Offline</h2><p>Check Vault IoT Gateway.</p></article>
          </section>

          <section className="module-grid two-col">
            <article className="module-card"><h2>Data Pending</h2><p>Analytics will populate after next sync.</p><button>Refresh API</button></article>
            <article className="module-card"><h2>API Timeout</h2><p>Reconnect to Algolia/Instagram.</p></article>
          </section>

          <section className="module-grid two-col">
            <article className="module-card"><h2>No Submissions</h2><p>Your waitlist is currently clear.</p><button>Share Signup Link</button></article>
            <article className="module-card"><h2>Export Failed</h2><p>Verify Mailchimp API Key.</p></article>
          </section>

          <section className="module-grid">
            <article className="module-card span-12">
              <h2>Media Library</h2>
              <p>Vault is Dark. Upload botanical photography.</p>
              <div className="media-grid">
                <div className="media-thumb">1:1</div><div className="media-thumb selected">1:1</div><div className="media-thumb">1:1</div><div className="media-thumb">1:1</div>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminPage;
