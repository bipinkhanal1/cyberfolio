const express = require('express');
const { body, query, validationResult } = require('express-validator');
const slugify = require('slugify');
const { Project } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/projects - public
router.get('/', async (req, res) => {
  try {
    const { category, tag, featured, search, page = 1, limit = 12, sort = '-createdAt' } = req.query;
    const filter = { status: 'published' };

    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (featured === 'true') filter.featured = true;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [projects, total] = await Promise.all([
      Project.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Project.countDocuments(filter)
    ]);

    res.json({
      projects,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit), limit: Number(limit) }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/projects/:slug - public
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---- Admin routes below ----

// GET /api/projects/admin/all
router.get('/admin/all', authenticate, async (req, res) => {
  try {
    const projects = await Project.find().sort('-createdAt');
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/projects
router.post('/', authenticate, [
  body('title').notEmpty().trim(),
  body('description').notEmpty(),
  body('category').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = req.body;
    let slug = slugify(data.title, { lower: true, strict: true });
    const existing = await Project.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const project = await Project.create({ ...data, slug });
    res.status(201).json({ project });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/projects/:id
router.put('/:id', authenticate, async (req, res) => {
  try {
    const data = req.body;
    if (data.title) {
      data.slug = slugify(data.title, { lower: true, strict: true });
      const existing = await Project.findOne({ slug: data.slug, _id: { $ne: req.params.id } });
      if (existing) data.slug = `${data.slug}-${Date.now()}`;
    }

    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
