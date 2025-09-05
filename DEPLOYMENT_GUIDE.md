# 🚀 Sacred Shifter Connect - Production Deployment Guide

## Pre-Deployment Checklist ✅

### 1. Environment Setup
- [ ] Create production Supabase project
- [ ] Set up environment variables in `.env.production`
- [ ] Configure Sentry for error tracking
- [ ] Set up domain and SSL certificates
- [ ] Configure CDN (if using)

### 2. Database Setup
- [ ] Run all migrations: `npm run db:migrate`
- [ ] Verify RLS policies are active
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Run performance indexes migration

### 3. Security Verification
- [ ] Test JWT verification on all edge functions
- [ ] Verify RLS policies prevent unauthorized access
- [ ] Test admin route protection
- [ ] Verify input validation on all endpoints
- [ ] Check CORS configuration

### 4. Performance Testing
- [ ] Run bundle analysis: `npm run build:analyze`
- [ ] Test Core Web Vitals
- [ ] Verify memory usage is stable
- [ ] Test PWA functionality
- [ ] Load test critical endpoints

## Environment Variables

Create `.env.production` with the following variables:

```bash
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional - Error Tracking
VITE_SENTRY_DSN=your-sentry-dsn-here
SENTRY_AUTH_TOKEN=your-sentry-auth-token
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-sentry-project

# Optional - AI Features
OPENAI_API_KEY=your-openai-api-key

# Environment
NODE_ENV=production
```

## Deployment Steps

### 1. Build the Application
```bash
# Install dependencies
npm ci

# Run type checking
npm run type-check

# Run tests
npm run test

# Build for production
npm run build
```

### 2. Database Migration
```bash
# Push migrations to production
npm run db:migrate

# Verify RLS policies
supabase db diff

# Run performance indexes
supabase db push --include-all
```

### 3. Deploy to Hosting Platform

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
# ... add other variables
```

#### Netlify Deployment
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist

# Set environment variables in Netlify dashboard
```

#### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4. Post-Deployment Verification

#### Health Checks
```bash
# Test main endpoints
curl https://your-domain.com/
curl https://your-domain.com/api/health

# Test authentication
curl -X POST https://your-domain.com/api/auth/signin

# Test protected routes (should redirect to auth)
curl https://your-domain.com/dashboard
```

#### Performance Monitoring
1. Check Core Web Vitals in Google PageSpeed Insights
2. Monitor bundle size and loading times
3. Verify PWA functionality
4. Test on mobile devices

#### Error Monitoring
1. Check Sentry dashboard for errors
2. Monitor application logs
3. Verify error boundaries are working
4. Test error scenarios

## Production Configuration

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Supabase Configuration
```sql
-- Enable connection pooling
ALTER DATABASE postgres SET max_connections = 100;

-- Set up monitoring
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Configure RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ... (all other tables)
```

## Monitoring Setup

### 1. Sentry Configuration
- Set up error tracking
- Configure performance monitoring
- Set up alerts for critical errors
- Monitor Core Web Vitals

### 2. Application Monitoring
- Set up uptime monitoring
- Monitor database performance
- Track user analytics
- Monitor API response times

### 3. Log Management
- Set up centralized logging
- Configure log aggregation
- Set up log retention policies
- Monitor log levels

## Security Checklist

### 1. Authentication & Authorization
- [ ] JWT verification enabled on all edge functions
- [ ] RLS policies active on all tables
- [ ] Admin routes properly protected
- [ ] Input validation on all endpoints

### 2. Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] API keys stored securely
- [ ] User data properly isolated
- [ ] Backup encryption enabled

### 3. Network Security
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Rate limiting implemented

## Performance Optimization

### 1. Bundle Optimization
- [ ] Code splitting implemented
- [ ] Tree shaking enabled
- [ ] Dead code eliminated
- [ ] Bundle size < 2MB

### 2. Database Optimization
- [ ] Indexes on frequently queried columns
- [ ] Query optimization completed
- [ ] Connection pooling configured
- [ ] Caching strategy implemented

### 3. CDN Configuration
- [ ] Static assets cached
- [ ] Gzip compression enabled
- [ ] Browser caching configured
- [ ] Image optimization enabled

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm ci
npm run build
```

#### 2. Database Connection Issues
```bash
# Check Supabase status
supabase status

# Verify environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

#### 3. Authentication Issues
- Check JWT token expiration
- Verify Supabase configuration
- Check RLS policies
- Test with different browsers

#### 4. Performance Issues
- Run bundle analysis
- Check Core Web Vitals
- Monitor memory usage
- Optimize images and assets

## Maintenance

### Daily Tasks
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Monitor resource usage

### Weekly Tasks
- [ ] Review security logs
- [ ] Update dependencies
- [ ] Performance optimization
- [ ] Backup verification

### Monthly Tasks
- [ ] Security audit
- [ ] Database optimization
- [ ] Feature updates
- [ ] Capacity planning

## Support

For deployment issues or questions:
1. Check the logs in your hosting platform
2. Review Sentry for error details
3. Check Supabase dashboard for database issues
4. Consult the troubleshooting section above

---

**Remember**: This is a spiritual technology platform. Ensure all deployments maintain the sacred integrity and consciousness-elevating purpose of the application. ✨
