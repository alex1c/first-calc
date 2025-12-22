# Production Deployment Checklist

This checklist ensures all aspects of the application are ready for production deployment.

## 🔍 Performance & Optimization

### Lighthouse Audit
- [ ] Run Lighthouse audit for all major pages
- [ ] Achieve Performance score ≥ 90
- [ ] Achieve Accessibility score ≥ 95
- [ ] Achieve Best Practices score ≥ 90
- [ ] Achieve SEO score ≥ 95
- [ ] Fix all critical issues identified

### Core Web Vitals
- [ ] **LCP (Largest Contentful Paint)**: Target < 2.5s
  - Optimize images (use Next.js Image component)
  - Minimize render-blocking resources
  - Use CDN for static assets
- [ ] **FID (First Input Delay)**: Target < 100ms
  - Minimize JavaScript execution time
  - Use code splitting
  - Defer non-critical JavaScript
- [ ] **CLS (Cumulative Layout Shift)**: Target < 0.1
  - Set explicit dimensions for images
  - Reserve space for dynamic content
  - Avoid inserting content above existing content

### JavaScript & CSS Optimization
- [ ] Enable production builds (`next build`)
- [ ] Verify minification is enabled
- [ ] Check bundle sizes:
  - [ ] Main bundle < 200KB (gzipped)
  - [ ] Total initial load < 500KB (gzipped)
- [ ] Implement code splitting:
  - [ ] Dynamic imports for heavy components
  - [ ] Route-based code splitting
- [ ] Remove unused dependencies
- [ ] Tree-shake unused code

### Image Optimization
- [ ] All images use Next.js Image component
- [ ] Images are in WebP format where possible
- [ ] Images have appropriate sizes and srcset
- [ ] Lazy loading enabled for below-fold images
- [ ] Placeholder images for better CLS
- [ ] Optimize OG images

### Static Generation (ISR)
- [ ] Configure ISR for calculator pages
- [ ] Set appropriate revalidation times
- [ ] Pre-generate popular pages at build time
- [ ] Configure fallback strategies
- [ ] Test ISR regeneration

## 🌐 SEO & Metadata

### Sitemap
- [ ] Generate sitemap.xml
- [ ] Include all calculators, standards, and articles
- [ ] Include hreflang tags for all locales
- [ ] Submit sitemap to Google Search Console
- [ ] Verify sitemap in Google Search Console
- [ ] Check for crawl errors

### Hreflang
- [ ] Verify hreflang tags on all pages
- [ ] Test alternate language links
- [ ] Ensure canonical URLs are correct
- [ ] Check hreflang implementation in sitemap

### Metadata
- [ ] All pages have unique titles
- [ ] All pages have unique descriptions
- [ ] OG tags configured for all pages
- [ ] Twitter Card tags configured
- [ ] Verify metadata in social media preview tools

### robots.txt
- [ ] robots.txt file exists and is correct
- [ ] Allow crawling of public pages
- [ ] Disallow admin and API routes
- [ ] Include sitemap reference

## 🔒 Security

### Environment Variables
- [ ] No sensitive data in client-side code
- [ ] Environment variables properly configured
- [ ] API keys secured
- [ ] No secrets in version control

### Headers & Security
- [ ] Security headers configured:
  - [ ] Content-Security-Policy
  - [ ] X-Frame-Options
  - [ ] X-Content-Type-Options
  - [ ] Referrer-Policy
  - [ ] Permissions-Policy
- [ ] HTTPS enforced
- [ ] HSTS enabled

### Input Validation
- [ ] All user inputs validated
- [ ] XSS protection in place
- [ ] SQL injection prevention (if applicable)
- [ ] Rate limiting on API routes

## 🚀 Vercel Configuration

### vercel.json
- [ ] Create vercel.json for redirects
- [ ] Configure redirects from old URLs:
  ```json
  {
    "redirects": [
      {
        "source": "/old-path",
        "destination": "/new-path",
        "permanent": true
      }
    ]
  }
  ```
- [ ] Configure headers
- [ ] Set up rewrites if needed

### CDN Configuration
- [ ] Enable Vercel CDN
- [ ] Configure caching headers
- [ ] Set cache TTL for static assets
- [ ] Configure edge caching

### Environment Variables
- [ ] Set production environment variables in Vercel
- [ ] Verify all required variables are set
- [ ] Test environment variable access

## 📊 Monitoring & Analytics

### Error Tracking
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure error boundaries
- [ ] Test error reporting
- [ ] Set up alerts for critical errors

### Analytics
- [ ] Configure analytics (e.g., Google Analytics)
- [ ] Set up conversion tracking
- [ ] Verify tracking is working

### Performance Monitoring
- [ ] Set up performance monitoring
- [ ] Configure Real User Monitoring (RUM)
- [ ] Set up alerts for performance degradation

## 🧪 Testing

### Functionality Testing
- [ ] Test all calculators work correctly
- [ ] Test search functionality
- [ ] Test navigation between pages
- [ ] Test locale switching
- [ ] Test responsive design on mobile devices
- [ ] Test form submissions
- [ ] Test API endpoints

### Browser Testing
- [ ] Test in Chrome (latest)
- [ ] Test in Firefox (latest)
- [ ] Test in Safari (latest)
- [ ] Test in Edge (latest)
- [ ] Test on mobile browsers (iOS Safari, Chrome Mobile)

### Accessibility Testing
- [ ] Run automated accessibility tests
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Verify color contrast ratios
- [ ] Test focus indicators

## 📝 Documentation

### Code Documentation
- [ ] All public functions have JSDoc comments
- [ ] Complex logic is commented
- [ ] README.md is up to date
- [ ] API documentation is complete

### User Documentation
- [ ] Help pages are complete
- [ ] FAQ sections are populated
- [ ] How-to guides are accurate

## 🔄 Pre-Deployment

### Final Checks
- [ ] Run `npm run build` successfully
- [ ] Run `npm run lint` with no errors
- [ ] Run `npm test` (if tests exist)
- [ ] Check for console errors
- [ ] Verify all links work
- [ ] Check for broken images
- [ ] Verify all forms submit correctly

### Database/Data
- [ ] All calculator schemas are valid
- [ ] All standards data is correct
- [ ] All articles are published
- [ ] No test data in production

### Backup
- [ ] Backup all data
- [ ] Document rollback procedure
- [ ] Test rollback procedure

## 🚢 Deployment

### Deployment Steps
1. [ ] Merge all changes to main branch
2. [ ] Tag release version
3. [ ] Deploy to staging environment
4. [ ] Test staging deployment
5. [ ] Deploy to production
6. [ ] Monitor deployment logs
7. [ ] Verify production deployment

### Post-Deployment
- [ ] Verify site is accessible
- [ ] Check all critical pages load
- [ ] Test search functionality
- [ ] Verify analytics are tracking
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify CDN is serving assets

## 📈 Post-Launch Monitoring

### First 24 Hours
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Check server logs
- [ ] Monitor user feedback
- [ ] Verify analytics data

### First Week
- [ ] Review Core Web Vitals
- [ ] Check Google Search Console for issues
- [ ] Review user feedback
- [ ] Monitor conversion rates
- [ ] Check for any security issues

## 🔧 Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Review and update content
- [ ] Monitor performance trends
- [ ] Review and optimize slow queries
- [ ] Update security patches
- [ ] Review and update SEO content

## 📋 Quick Reference

### Build Commands
```bash
# Production build
npm run build

# Start production server
npm start

# Lint check
npm run lint

# Type check
npm run type-check
```

### Environment Variables Required
- `NEXT_PUBLIC_DATA_SOURCE` (optional, default: 'local')
- `NEXT_PUBLIC_API_URL` (if using external API)

### Key URLs to Verify
- Production URL: [Your production URL]
- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`
- Search: `/[locale]/search`

---

**Last Updated**: 2024-02-XX
**Version**: 1.0.0





