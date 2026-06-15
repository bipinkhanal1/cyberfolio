// ========================
// BLOG ROUTES
// ========================
const express = require('express');
const slugify = require('slugify');
const { Blog, Certification, Skill, Service, Testimonial, Contact,
        Settings, FAQ, Profile, Analytics, Media } = require('../models');
const { authenticate } = require('../middleware/auth');

// Blog Router
const blogRouter = express.Router();

blogRouter.get('/', async (req, res) => {
  try {
    const { category, tag, featured, search, page = 1, limit = 9 } = req.query;
    const filter = { status: 'published' };
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (featured === 'true') filter.featured = true;

    const skip = (Number(page) - 1) * Number(limit);
    const [posts, total] = await Promise.all([
      Blog.find(filter).select('-content -comments').sort('-publishedAt').skip(skip).limit(Number(limit)),
      Blog.countDocuments(filter)
    ]);
    res.json({ posts, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

blogRouter.get('/categories', async (req, res) => {
  try {
    const categories = await Blog.distinct('category', { status: 'published' });
    res.json({ categories });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

blogRouter.get('/:slug', async (req, res) => {
  try {
    const post = await Blog.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { views: 1 } }, { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ post });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

blogRouter.get('/admin/all', authenticate, async (req, res) => {
  try {
    const posts = await Blog.find().sort('-createdAt');
    res.json({ posts });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

blogRouter.post('/', authenticate, async (req, res) => {
  try {
    const data = req.body;
    let slug = slugify(data.title, { lower: true, strict: true });
    if (await Blog.findOne({ slug })) slug = `${slug}-${Date.now()}`;
    // Estimate reading time (~200 wpm)
    const words = data.content ? data.content.split(/\s+/).length : 0;
    data.readingTime = Math.ceil(words / 200);
    if (data.status === 'published' && !data.publishedAt) data.publishedAt = new Date();
    const post = await Blog.create({ ...data, slug });
    res.status(201).json({ post });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

blogRouter.put('/:id', authenticate, async (req, res) => {
  try {
    const data = req.body;
    if (data.status === 'published' && !data.publishedAt) data.publishedAt = new Date();
    const post = await Blog.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ post });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

blogRouter.delete('/:id', authenticate, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// Approve/reject comment
blogRouter.patch('/:id/comments/:commentId', authenticate, async (req, res) => {
  try {
    const { approved } = req.body;
    await Blog.updateOne(
      { _id: req.params.id, 'comments._id': req.params.commentId },
      { $set: { 'comments.$.approved': approved } }
    );
    res.json({ message: 'Comment updated' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ========================
// CERTIFICATIONS ROUTER
// ========================
const certRouter = express.Router();

certRouter.get('/', async (req, res) => {
  try {
    const certs = await Certification.find().sort({ order: 1, issueDate: -1 });
    res.json({ certifications: certs });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

certRouter.post('/', authenticate, async (req, res) => {
  try {
    const cert = await Certification.create(req.body);
    res.status(201).json({ certification: cert });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

certRouter.put('/:id', authenticate, async (req, res) => {
  try {
    const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ certification: cert });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

certRouter.delete('/:id', authenticate, async (req, res) => {
  try {
    await Certification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certification deleted' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ========================
// SKILLS ROUTER
// ========================
const skillRouter = express.Router();

skillRouter.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, category: 1 });
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});
    res.json({ skills, grouped });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

skillRouter.post('/', authenticate, async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ skill });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

skillRouter.put('/:id', authenticate, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ skill });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

skillRouter.delete('/:id', authenticate, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ========================
// SERVICES ROUTER
// ========================
const serviceRouter = express.Router();

serviceRouter.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json({ services });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

serviceRouter.post('/', authenticate, async (req, res) => {
  try {
    const data = req.body;
    data.slug = slugify(data.title, { lower: true, strict: true });
    const service = await Service.create(data);
    res.status(201).json({ service });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

serviceRouter.put('/:id', authenticate, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ service });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

serviceRouter.delete('/:id', authenticate, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ========================
// TESTIMONIALS ROUTER
// ========================
const testimonialRouter = express.Router();

testimonialRouter.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort({ order: 1 });
    res.json({ testimonials });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

testimonialRouter.get('/admin/all', authenticate, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort('-createdAt');
    res.json({ testimonials });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

testimonialRouter.post('/', authenticate, async (req, res) => {
  try {
    const t = await Testimonial.create(req.body);
    res.status(201).json({ testimonial: t });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

testimonialRouter.put('/:id', authenticate, async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ testimonial: t });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

testimonialRouter.delete('/:id', authenticate, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial deleted' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ========================
// CONTACT ROUTER
// ========================
const contactRouter = express.Router();
const nodemailer = require('nodemailer');

contactRouter.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, phone, company, service, budget } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const contact = await Contact.create({
      name, email, subject, message, phone, company, service, budget,
      ipAddress: req.ip, userAgent: req.headers['user-agent']
    });

    // Send email notification if configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact: ${subject}`,
        html: `<h3>New contact form submission</h3>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Subject:</strong> ${subject}</p>
               <p><strong>Message:</strong></p><p>${message}</p>`
      }).catch(() => {});
    }

    res.status(201).json({ message: 'Message sent successfully', id: contact._id });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

contactRouter.get('/', authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)),
      Contact.countDocuments(filter)
    ]);
    res.json({ contacts, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

contactRouter.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ contact });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

contactRouter.delete('/:id', authenticate, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ========================
// SETTINGS ROUTER
// ========================
const settingsRouter = express.Router();

settingsRouter.get('/', async (req, res) => {
  try {
    const { group } = req.query;
    const filter = group ? { group } : {};
    const settings = await Settings.find(filter);
    const map = settings.reduce((acc, s) => { acc[s.key] = s.value; return acc; }, {});
    res.json({ settings: map, raw: settings });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

settingsRouter.put('/', authenticate, async (req, res) => {
  try {
    const updates = req.body;
    const ops = Object.entries(updates).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { $set: { value } },
        upsert: true
      }
    }));
    await Settings.bulkWrite(ops);
    res.json({ message: 'Settings saved' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ========================
// PROFILE ROUTER
// ========================
const profileRouter = express.Router();

profileRouter.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({ name: 'Your Name', title: 'Security Researcher' });
    res.json({ profile });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

profileRouter.put('/', authenticate, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(req.body);
    } else {
      Object.assign(profile, req.body);
      await profile.save();
    }
    res.json({ profile });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ========================
// FAQ ROUTER
// ========================
const faqRouter = express.Router();

faqRouter.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;
    const faqs = await FAQ.find(filter).sort({ order: 1 });
    res.json({ faqs });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

faqRouter.post('/', authenticate, async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ faq });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

faqRouter.put('/:id', authenticate, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ faq });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

faqRouter.delete('/:id', authenticate, async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ deleted' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ========================
// ANALYTICS ROUTER
// ========================
const analyticsRouter = express.Router();

analyticsRouter.get('/summary', authenticate, async (req, res) => {
  try {
    const { Project } = require('../models');
    const { Blog: BlogModel } = require('../models');
    const [
      totalProjects, totalPosts, totalContacts, unreadContacts,
      recentAnalytics
    ] = await Promise.all([
      Project.countDocuments({ status: 'published' }),
      Blog.countDocuments({ status: 'published' }),
      Contact.countDocuments({}),
      Contact.countDocuments({ status: 'unread' }),
      Analytics.find().sort('-date').limit(30)
    ]);

    const totalViews = recentAnalytics.reduce((s, a) => s + a.pageViews, 0);
    const totalVisitors = recentAnalytics.reduce((s, a) => s + a.uniqueVisitors, 0);

    res.json({
      totalProjects, totalPosts, totalContacts, unreadContacts,
      totalViews, totalVisitors, recentAnalytics
    });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

analyticsRouter.post('/track', async (req, res) => {
  try {
    const { path: pagePath, referrer } = req.body;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    await Analytics.findOneAndUpdate(
      { date: today },
      { $inc: { pageViews: 1 } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ========================
// MEDIA ROUTER
// ========================
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const mediaRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('File type not allowed'));
  }
});

mediaRouter.get('/', authenticate, async (req, res) => {
  try {
    const { folder, type, page = 1, limit = 24 } = req.query;
    const filter = {};
    if (folder) filter.folder = folder;
    if (type) filter.type = type;
    const skip = (Number(page) - 1) * Number(limit);
    const [media, total] = await Promise.all([
      Media.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)),
      Media.countDocuments(filter)
    ]);
    res.json({ media, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

mediaRouter.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const { folder = 'general', alt, caption } = req.body;
    const ext = req.file.mimetype === 'application/pdf' ? 'pdf' : 'webp';
    const filename = `${uuidv4()}.${ext}`;
    const uploadPath = path.join(__dirname, '../../uploads', folder);

    const fs = require('fs');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

    if (req.file.mimetype !== 'application/pdf') {
      await sharp(req.file.buffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(path.join(uploadPath, filename));
    } else {
      fs.writeFileSync(path.join(uploadPath, filename), req.file.buffer);
    }

    const url = `${process.env.API_URL || 'http://localhost:5000'}/uploads/${folder}/${filename}`;
    const media = await Media.create({
      filename, originalName: req.file.originalname, url,
      type: req.file.mimetype.startsWith('image') ? 'image' : 'document',
      mimeType: req.file.mimetype,
      size: req.file.size, alt, caption, folder,
      uploadedBy: req.user._id
    });

    res.status(201).json({ media });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

mediaRouter.delete('/:id', authenticate, async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) return res.status(404).json({ error: 'Media not found' });
    // Optionally delete the file from disk
    const fs = require('fs');
    const filePath = path.join(__dirname, '../../uploads', media.folder, media.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ message: 'Media deleted' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = {
  blogRouter, certRouter, skillRouter, serviceRouter,
  testimonialRouter, contactRouter, settingsRouter,
  profileRouter, faqRouter, analyticsRouter, mediaRouter
};
