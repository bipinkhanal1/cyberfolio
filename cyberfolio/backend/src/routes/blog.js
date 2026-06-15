const {
  blogRouter, certRouter, skillRouter, serviceRouter,
  testimonialRouter, contactRouter, settingsRouter,
  profileRouter, faqRouter, analyticsRouter, mediaRouter
} = require('./allRoutes');

// Each file just exports its router
module.exports = blogRouter;
