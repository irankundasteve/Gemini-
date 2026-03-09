import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const batchSchema = new mongoose.Schema({
  name: String,
  tier: String,
  available: Boolean,
  cycle: String
});

const auditSchema = new mongoose.Schema({
  actorId: String,
  role: String,
  action: String,
  module: String,
  details: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

const Batch = mongoose.models.Batch || mongoose.model('Batch', batchSchema);
const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditSchema);

const roles = {
  SUPER_ADMIN: 'Super Admin',
  AGRONOMIST: 'Agronomist',
  INVENTORY_MANAGER: 'Inventory Manager',
  CONTENT_EDITOR: 'Content Editor'
};

const permissions = {
  [roles.SUPER_ADMIN]: {
    userManagement: true,
    contentManagement: true,
    ordersInventory: true,
    analyticsReporting: true,
    formSubmissions: true,
    mediaLibrary: true
  },
  [roles.AGRONOMIST]: {
    userManagement: false,
    contentManagement: true,
    ordersInventory: true,
    analyticsReporting: false,
    formSubmissions: false,
    mediaLibrary: true
  },
  [roles.INVENTORY_MANAGER]: {
    userManagement: false,
    contentManagement: false,
    ordersInventory: true,
    analyticsReporting: true,
    formSubmissions: false,
    mediaLibrary: false
  },
  [roles.CONTENT_EDITOR]: {
    userManagement: true,
    contentManagement: true,
    ordersInventory: false,
    analyticsReporting: false,
    formSubmissions: true,
    mediaLibrary: true
  }
};

const fallbackArchive = [
  { name: 'Scarlet Frill Mustard', tier: 'Canopy', available: true, cycle: 'Day 11/14' },
  { name: 'Shiso Crimson', tier: 'Sprout', available: false, cycle: 'Day 7/21' },
  { name: 'Coriander Micro', tier: 'Vault Reserve', available: true, cycle: 'Day 9/12' }
];

const fallbackDashboard = {
  userClientManagement: {
    reserveRegistrations: 148,
    subscriptionMix: { sprout: 44, canopy: 61, vaultReserve: 43 },
    pendingReviews: 19
  },
  contentManagement: {
    heroAsset: 'macro-growth-footage-v3.mp4',
    journalPosts: 12,
    nutrientChartVersion: '2026.03',
    seoProfiles: ['Home', 'Archive', 'Science'],
    legalVersion: 'v2.1'
  },
  ordersInventory: {
    currentBatchVarieties: 22,
    lowStock: 4,
    iot: { tempC: 21, humidity: 67, pH: 6.1 },
    impact: { carbonKg: 1824, waterLiters: 120432 }
  },
  analyticsReporting: {
    algoliaWeeklySearches: 7832,
    instagramEngagementRate: 4.6,
    impactTrend: '+12.4%'
  },
  formSubmissions: {
    newsletterSubscribers: 2394,
    notifyWhenRipeRequests: 163,
    reserveYourBatchRequests: 89
  },
  mediaLibrary: {
    heroAssets: 7,
    productPhotos: 134,
    scienceAssets: 48,
    botanicalGallery: 96
  },
  globalRules: {
    auditLog: 'Enabled',
    roleLockdown: 'Explicit assignment required',
    backup: 'Daily automated snapshots',
    realtimeSync: 'Enabled without publish step'
  }
};

const connectDb = async () => {
  if (!process.env.MONGODB_URI) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (_error) {
    console.error('MongoDB unavailable, running with fallback data');
  }
};

const getRole = (req) => req.headers['x-role'] || roles.SUPER_ADMIN;
const getActorId = (req) => req.headers['x-user-id'] || 'system-admin';

const requirePermission = (moduleKey) => (req, res, next) => {
  const role = getRole(req);
  const rolePermissions = permissions[role];

  if (!rolePermissions || !rolePermissions[moduleKey]) {
    return res.status(403).json({
      message: `Role ${role} cannot access ${moduleKey}`
    });
  }

  return next();
};

const logAudit = async ({ req, action, module, details }) => {
  const payload = {
    actorId: getActorId(req),
    role: getRole(req),
    action,
    module,
    details
  };

  if (mongoose.connection.readyState !== 1) {
    return payload;
  }

  await AuditLog.create(payload);
  return payload;
};

app.get('/api/impact', async (_req, res) => {
  res.json(fallbackDashboard.ordersInventory.impact);
});

app.get('/api/archive', async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(fallbackArchive);
  }

  const data = await Batch.find().lean();
  return res.json(data.length ? data : fallbackArchive);
});

app.get('/api/admin/roles', (_req, res) => {
  res.json({ roles, permissions });
});

app.get('/api/admin/dashboard', requirePermission('analyticsReporting'), (_req, res) => {
  res.json(fallbackDashboard);
});

app.get('/api/admin/module/:moduleKey', (req, res) => {
  const { moduleKey } = req.params;
  const permissionCheck = requirePermission(moduleKey);

  permissionCheck(req, res, () => {
    if (!fallbackDashboard[moduleKey]) {
      return res.status(404).json({ message: 'Module not found' });
    }

    return res.json(fallbackDashboard[moduleKey]);
  });
});

app.post('/api/admin/archive', requirePermission('ordersInventory'), async (req, res) => {
  const payload = req.body;

  await logAudit({
    req,
    action: 'UPSERT_ARCHIVE_VARIETY',
    module: 'ordersInventory',
    details: payload
  });

  if (mongoose.connection.readyState !== 1) {
    return res.status(200).json({ saved: payload, fallbackMode: true });
  }

  const saved = await Batch.findOneAndUpdate({ name: payload.name }, payload, {
    new: true,
    upsert: true
  }).lean();

  return res.status(200).json({ saved, fallbackMode: false });
});

app.post('/api/admin/content/seo', requirePermission('contentManagement'), async (req, res) => {
  const seoPayload = req.body;

  await logAudit({
    req,
    action: 'UPDATE_SEO_PROFILE',
    module: 'contentManagement',
    details: seoPayload
  });

  return res.status(200).json({
    saved: seoPayload,
    synced: true,
    publishStep: false
  });
});

app.get('/api/admin/audit-logs', requirePermission('userManagement'), async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json([
      {
        actorId: 'system-admin',
        role: roles.SUPER_ADMIN,
        action: 'SYSTEM_BOOT',
        module: 'globalRules',
        details: { realtimeSync: true },
        createdAt: new Date().toISOString()
      }
    ]);
  }

  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100).lean();
  return res.json(logs);
});

connectDb().finally(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
