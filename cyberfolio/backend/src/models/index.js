// ========================
// USER MODEL
// ========================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['admin', 'editor'], default: 'admin' },
  avatar: { type: String, default: '' },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },
  refreshTokens: [{ type: String, select: false }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

const User = mongoose.model('User', userSchema);

// ========================
// PROJECT MODEL
// ========================
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  category: { type: String, required: true, enum: ['web-security', 'network', 'malware-analysis', 'ctf', 'tool', 'research', 'other'] },
  tags: [{ type: String, trim: true }],
  coverImage: { type: String },
  images: [{ type: String }],
  technologies: [{ type: String }],
  githubUrl: { type: String },
  liveUrl: { type: String },
  caseStudyUrl: { type: String },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
  completedAt: { type: Date },
  views: { type: Number, default: 0 },
  order: { type: Number, default: 0 }
}, { timestamps: true });

projectSchema.index({ slug: 1, status: 1, category: 1 });
const Project = mongoose.model('Project', projectSchema);

// ========================
// BLOG MODEL
// ========================
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String },
  category: { type: String, required: true },
  tags: [{ type: String, trim: true }],
  status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
  publishedAt: { type: Date },
  scheduledAt: { type: Date },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  readingTime: { type: Number },
  seoTitle: { type: String },
  seoDescription: { type: String },
  seoKeywords: [{ type: String }],
  comments: [{
    author: { type: String },
    email: { type: String },
    content: { type: String },
    approved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

blogSchema.index({ slug: 1, status: 1 });
const Blog = mongoose.model('Blog', blogSchema);

// ========================
// CERTIFICATION MODEL
// ========================
const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  credentialId: { type: String },
  credentialUrl: { type: String },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date },
  image: { type: String },
  category: { type: String, enum: ['offensive', 'defensive', 'cloud', 'network', 'compliance', 'other'] },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const Certification = mongoose.model('Certification', certificationSchema);

// ========================
// SKILL MODEL
// ========================
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  proficiency: { type: Number, min: 0, max: 100, required: true },
  icon: { type: String },
  color: { type: String },
  years: { type: Number },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);

// ========================
// SERVICE MODEL
// ========================
const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  icon: { type: String },
  features: [{ type: String }],
  pricing: {
    basic: {
      name: String,
      price: Number,
      currency: { type: String, default: 'USD' },
      period: { type: String, default: 'one-time' },
      features: [String],
      highlighted: { type: Boolean, default: false }
    },
    standard: {
      name: String,
      price: Number,
      currency: { type: String, default: 'USD' },
      period: { type: String, default: 'one-time' },
      features: [String],
      highlighted: { type: Boolean, default: false }
    },
    premium: {
      name: String,
      price: Number,
      currency: { type: String, default: 'USD' },
      period: { type: String, default: 'one-time' },
      features: [String],
      highlighted: { type: Boolean, default: false }
    }
  },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

// ========================
// TESTIMONIAL MODEL
// ========================
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String },
  company: { type: String },
  avatar: { type: String },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  featured: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

// ========================
// CONTACT MODEL
// ========================
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  service: { type: String },
  budget: { type: String },
  status: { type: String, enum: ['unread', 'read', 'replied', 'archived'], default: 'unread' },
  ipAddress: { type: String },
  userAgent: { type: String },
  notes: { type: String }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

// ========================
// SETTINGS MODEL
// ========================
const settingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  value: { type: mongoose.Schema.Types.Mixed },
  group: { type: String, required: true },
  label: { type: String },
  type: { type: String, enum: ['string', 'number', 'boolean', 'array', 'object', 'json'] }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

// ========================
// FAQ MODEL
// ========================
const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'general' },
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true }
}, { timestamps: true });

const FAQ = mongoose.model('FAQ', faqSchema);

// ========================
// PROFILE MODEL
// ========================
const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String },
  tagline: { type: String },
  bio: { type: String },
  shortBio: { type: String },
  avatar: { type: String },
  heroImage: { type: String },
  resumeUrl: { type: String },
  location: { type: String },
  email: { type: String },
  phone: { type: String },
  availability: { type: String, enum: ['available', 'busy', 'not-available'] },
  yearsExperience: { type: Number },
  projectsCompleted: { type: Number },
  clientsSatisfied: { type: Number },
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    hackerone: String,
    bugcrowd: String,
    tryhackme: String,
    hackthebox: String,
    youtube: String,
    instagram: String,
    website: String
  },
  seo: {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String
  },
  analytics: {
    googleAnalyticsId: String,
    clarityId: String
  },
  contact: {
    mapEmbedUrl: String,
    address: String,
    workingHours: String
  }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

// ========================
// ANALYTICS MODEL
// ========================
const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  pageViews: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
  pages: [{
    path: String,
    views: Number
  }],
  referrers: [{
    source: String,
    count: Number
  }],
  countries: [{
    country: String,
    count: Number
  }],
  devices: {
    desktop: Number,
    mobile: Number,
    tablet: Number
  }
}, { timestamps: true });

const Analytics = mongoose.model('Analytics', analyticsSchema);

// ========================
// MEDIA MODEL
// ========================
const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String },
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'document', 'video'] },
  mimeType: { type: String },
  size: { type: Number },
  alt: { type: String },
  caption: { type: String },
  folder: { type: String, default: 'general' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);

// ========================
// AUDIT LOG MODEL
// ========================
const auditSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  resource: { type: String },
  resourceId: { type: String },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  success: { type: Boolean, default: true }
}, { timestamps: true });

const AuditLog = mongoose.model('AuditLog', auditSchema);

module.exports = {
  User, Project, Blog, Certification, Skill, Service,
  Testimonial, Contact, Settings, FAQ, Profile,
  Analytics, Media, AuditLog
};
