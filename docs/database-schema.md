# Database Schema - Forex Traffic Platform

## Panoramica
Schema PostgreSQL completo per la gestione di landing page, campagne, tracking e analytics.

---

## Tabelle Principali

### 1. Users (Utenti Amministratori)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('admin', 'manager', 'viewer') DEFAULT 'viewer',
    company_id INT REFERENCES companies(id),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### 2. Companies (Broker/Aziende)
```sql
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    email VARCHAR(255),
    phone VARCHAR(20),
    country VARCHAR(100),
    status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
    subscription_tier ENUM('free', 'starter', 'professional', 'enterprise') DEFAULT 'starter',
    api_key VARCHAR(255) UNIQUE,
    api_secret VARCHAR(255),
    monthly_credits INT DEFAULT 0,
    credits_used INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### 3. Landing Pages
```sql
CREATE TABLE landing_pages (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    template_type ENUM('basic', 'advanced', 'premium', 'custom') DEFAULT 'basic',
    content JSONB,
    meta_title VARCHAR(500),
    meta_description VARCHAR(500),
    meta_keywords VARCHAR(500),
    featured_image_url VARCHAR(500),
    video_url VARCHAR(500),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    seo_optimized BOOLEAN DEFAULT FALSE,
    conversion_goal VARCHAR(50),
    primary_cta_text VARCHAR(255),
    primary_cta_url VARCHAR(500),
    secondary_cta_text VARCHAR(255),
    secondary_cta_url VARCHAR(500),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    UNIQUE(company_id, slug)
);
```

### 4. Campaigns (Campagne Pubblicitarie)
```sql
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    landing_page_id INT NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type ENUM('cpc', 'cpm', 'cpa', 'custom') DEFAULT 'cpc',
    status ENUM('draft', 'active', 'paused', 'completed', 'archived') DEFAULT 'draft',
    budget_daily DECIMAL(10, 2),
    budget_total DECIMAL(10, 2),
    spent_total DECIMAL(10, 2) DEFAULT 0,
    target_audience JSONB,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### 5. Traffic Sources
```sql
CREATE TABLE traffic_sources (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    source_type ENUM('direct', 'search', 'social', 'referral', 'display', 'email', 'other') DEFAULT 'direct',
    channel VARCHAR(100),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### 6. Page Views (Impressions)
```sql
CREATE TABLE page_views (
    id BIGSERIAL PRIMARY KEY,
    landing_page_id INT NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
    campaign_id INT REFERENCES campaigns(id) ON DELETE SET NULL,
    traffic_source_id INT REFERENCES traffic_sources(id) ON DELETE SET NULL,
    visitor_id UUID NOT NULL,
    ip_address INET,
    user_agent TEXT,
    referrer_url VARCHAR(500),
    country_code VARCHAR(2),
    country_name VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    device_type ENUM('desktop', 'mobile', 'tablet', 'unknown') DEFAULT 'unknown',
    browser_name VARCHAR(100),
    browser_version VARCHAR(50),
    os_name VARCHAR(100),
    os_version VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_duration_seconds INT,
    scroll_depth_percentage INT,
    INDEX idx_landing_page_timestamp (landing_page_id, timestamp),
    INDEX idx_visitor_id (visitor_id),
    INDEX idx_campaign_timestamp (campaign_id, timestamp)
);
```

### 7. Click Events
```sql
CREATE TABLE click_events (
    id BIGSERIAL PRIMARY KEY,
    landing_page_id INT NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
    campaign_id INT REFERENCES campaigns(id) ON DELETE SET NULL,
    visitor_id UUID NOT NULL,
    page_view_id BIGINT REFERENCES page_views(id) ON DELETE CASCADE,
    element_type ENUM('button', 'link', 'image', 'form', 'cta', 'other') DEFAULT 'link',
    element_id VARCHAR(255),
    element_text VARCHAR(500),
    element_url VARCHAR(500),
    click_position_x INT,
    click_position_y INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_landing_page_timestamp (landing_page_id, timestamp),
    INDEX idx_visitor_id (visitor_id),
    INDEX idx_element_type (element_type)
);
```

### 8. Conversions (Registrazioni/Iscrizioni)
```sql
CREATE TABLE conversions (
    id SERIAL PRIMARY KEY,
    landing_page_id INT NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
    campaign_id INT REFERENCES campaigns(id) ON DELETE SET NULL,
    traffic_source_id INT REFERENCES traffic_sources(id) ON DELETE SET NULL,
    visitor_id UUID NOT NULL,
    page_view_id BIGINT REFERENCES page_views(id) ON DELETE SET NULL,
    conversion_type ENUM('registration', 'subscription', 'demo_request', 'download', 'contact', 'other') DEFAULT 'registration',
    lead_email VARCHAR(255),
    lead_phone VARCHAR(20),
    lead_first_name VARCHAR(100),
    lead_last_name VARCHAR(100),
    lead_country VARCHAR(100),
    lead_status ENUM('new', 'contacted', 'qualified', 'rejected', 'converted') DEFAULT 'new',
    conversion_value DECIMAL(10, 2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_landing_page_timestamp (landing_page_id, timestamp),
    INDEX idx_campaign_timestamp (campaign_id, timestamp),
    INDEX idx_visitor_id (visitor_id),
    INDEX idx_lead_email (lead_email)
);
```

### 9. Analytics Aggregated (Dati Aggregati Giornalieri)
```sql
CREATE TABLE analytics_daily (
    id SERIAL PRIMARY KEY,
    landing_page_id INT NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
    campaign_id INT REFERENCES campaigns(id) ON DELETE SET NULL,
    traffic_source_id INT REFERENCES traffic_sources(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    conversion_rate DECIMAL(5, 2) DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    bounce_rate DECIMAL(5, 2) DEFAULT 0,
    avg_session_duration_seconds INT DEFAULT 0,
    avg_scroll_depth DECIMAL(5, 2) DEFAULT 0,
    revenue DECIMAL(10, 2) DEFAULT 0,
    cost DECIMAL(10, 2) DEFAULT 0,
    roi DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_landing_page_date (landing_page_id, date),
    INDEX idx_campaign_date (campaign_id, date),
    INDEX idx_traffic_source_date (traffic_source_id, date),
    UNIQUE(landing_page_id, campaign_id, traffic_source_id, date)
);
```

### 10. Analytics by Country
```sql
CREATE TABLE analytics_by_country (
    id SERIAL PRIMARY KEY,
    landing_page_id INT NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
    campaign_id INT REFERENCES campaigns(id) ON DELETE SET NULL,
    country_code VARCHAR(2) NOT NULL,
    country_name VARCHAR(100),
    date DATE NOT NULL,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    avg_cpc DECIMAL(10, 4) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_landing_page_country_date (landing_page_id, country_code, date),
    INDEX idx_campaign_country_date (campaign_id, country_code, date)
);
```

### 11. Analytics by Device
```sql
CREATE TABLE analytics_by_device (
    id SERIAL PRIMARY KEY,
    landing_page_id INT NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
    campaign_id INT REFERENCES campaigns(id) ON DELETE SET NULL,
    device_type ENUM('desktop', 'mobile', 'tablet', 'unknown') DEFAULT 'unknown',
    date DATE NOT NULL,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    bounce_rate DECIMAL(5, 2) DEFAULT 0,
    conversion_rate DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_landing_page_device_date (landing_page_id, device_type, date),
    INDEX idx_campaign_device_date (campaign_id, device_type, date)
);
```

### 12. Notifications
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    landing_page_id INT REFERENCES landing_pages(id) ON DELETE CASCADE,
    campaign_id INT REFERENCES campaigns(id) ON DELETE CASCADE,
    notification_type ENUM('conversion_increase', 'conversion_decrease', 'budget_limit', 'campaign_end', 'performance_alert', 'system') DEFAULT 'system',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity ENUM('info', 'warning', 'critical') DEFAULT 'info',
    threshold_value DECIMAL(10, 2),
    actual_value DECIMAL(10, 2),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_company_unread (company_id, is_read),
    INDEX idx_created_at (created_at)
);
```

### 13. Export Jobs
```sql
CREATE TABLE export_jobs (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    export_type ENUM('excel', 'csv', 'pdf') DEFAULT 'csv',
    data_type ENUM('analytics', 'conversions', 'page_views', 'clicks', 'all') DEFAULT 'analytics',
    date_from DATE,
    date_to DATE,
    filters JSONB,
    file_url VARCHAR(500),
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_company_created_at (company_id, created_at)
);
```

### 14. API Keys (per integrazioni esterne)
```sql
CREATE TABLE api_keys (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    permissions JSONB,
    rate_limit INT DEFAULT 1000,
    status ENUM('active', 'inactive', 'revoked') DEFAULT 'active',
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_company_active (company_id, status)
);
```

### 15. Audit Log
```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    company_id INT REFERENCES companies(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id INT,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    status ENUM('success', 'failure') DEFAULT 'success',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_company_created_at (company_id, created_at),
    INDEX idx_user_created_at (user_id, created_at)
);
```

---

## Indici Principali e Performance

```sql
-- Indici per query frequenti
CREATE INDEX idx_page_views_landing_page_date ON page_views(landing_page_id, timestamp DESC);
CREATE INDEX idx_page_views_campaign_date ON page_views(campaign_id, timestamp DESC);
CREATE INDEX idx_page_views_visitor ON page_views(visitor_id);
CREATE INDEX idx_click_events_page_view ON click_events(page_view_id);
CREATE INDEX idx_conversions_landing_page_date ON conversions(landing_page_id, timestamp DESC);
CREATE INDEX idx_conversions_campaign_date ON conversions(campaign_id, timestamp DESC);
CREATE INDEX idx_conversions_visitor ON conversions(visitor_id);
```

---

## Viste Utili

```sql
-- Vista: Performance complessiva per landing page
CREATE VIEW v_landing_page_performance AS
SELECT
    lp.id,
    lp.title,
    COUNT(DISTINCT pv.visitor_id) as unique_visitors,
    COUNT(DISTINCT pv.id) as impressions,
    COUNT(DISTINCT CASE WHEN ce.id IS NOT NULL THEN ce.id END) as clicks,
    COUNT(DISTINCT CASE WHEN c.id IS NOT NULL THEN c.id END) as conversions,
    ROUND(COUNT(DISTINCT CASE WHEN c.id IS NOT NULL THEN c.id END)::NUMERIC / COUNT(DISTINCT pv.id) * 100, 2) as conversion_rate,
    DATE(MAX(pv.timestamp)) as last_activity
FROM landing_pages lp
LEFT JOIN page_views pv ON lp.id = pv.landing_page_id
LEFT JOIN click_events ce ON pv.id = ce.page_view_id
LEFT JOIN conversions c ON pv.id = c.page_view_id
GROUP BY lp.id, lp.title;

-- Vista: Performance per campagna
CREATE VIEW v_campaign_performance AS
SELECT
    c.id,
    c.name,
    COUNT(DISTINCT pv.visitor_id) as unique_visitors,
    COUNT(DISTINCT pv.id) as impressions,
    COUNT(DISTINCT CASE WHEN ce.id IS NOT NULL THEN ce.id END) as clicks,
    COUNT(DISTINCT CASE WHEN conv.id IS NOT NULL THEN conv.id END) as conversions,
    ROUND(COUNT(DISTINCT CASE WHEN conv.id IS NOT NULL THEN conv.id END)::NUMERIC / COUNT(DISTINCT pv.id) * 100, 2) as conversion_rate,
    SUM(c.spent_total) as total_spent
FROM campaigns c
LEFT JOIN page_views pv ON c.id = pv.campaign_id
LEFT JOIN click_events ce ON pv.id = ce.page_view_id
LEFT JOIN conversions conv ON pv.id = conv.page_view_id
GROUP BY c.id, c.name;
```

---

## Considerazioni di Scalabilità

1. **Partitioning**: Le tabelle `page_views`, `click_events` e `conversions` dovrebbero essere partizionate per data (mensile) per gestire miliardi di record.
2. **Tablespaces**: Separare indici e dati su diversi storage per performance ottimale.
3. **Archivio**: Implementare una strategia di archivio per dati storici (>1 anno) in storage separato.
4. **Replication**: Configurare replica master-slave per HA e backup.
5. **Cache**: Utilizzare Redis per cache dei dati aggregati e sessioni.
