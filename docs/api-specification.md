# API Specification - Forex Traffic Platform

## Base URL
```
https://api.forextraffic.io/v1
```

## Authentication

### Bearer Token
```
Authorization: Bearer <api_key>
```

### Rate Limiting
- Limite: 1000 richieste/ora per API key
- Header di risposta: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## 1. AUTH ENDPOINTS

### 1.1 User Login
```
POST /auth/login

Request:
{
  "email": "admin@company.com",
  "password": "secure_password"
}

Response (200):
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "email": "admin@company.com",
    "full_name": "John Doe",
    "role": "admin",
    "company_id": 1
  }
}
```

### 1.2 Refresh Token
```
POST /auth/refresh

Request:
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}

Response (200):
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 3600
}
```

### 1.3 User Logout
```
POST /auth/logout

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "message": "Logged out successfully"
}
```

---

## 2. LANDING PAGES ENDPOINTS

### 2.1 Get All Landing Pages
```
GET /landing-pages

Query Parameters:
  - page: int (default: 1)
  - limit: int (default: 20, max: 100)
  - status: enum (draft|published|archived)
  - sort: string (created_at, updated_at, title)
  - order: enum (asc|desc)

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": [
    {
      "id": 1,
      "title": "Best Forex Trading Platform",
      "slug": "best-forex-platform",
      "description": "Discover the best forex trading experience...",
      "template_type": "advanced",
      "status": "published",
      "seo_optimized": true,
      "featured_image_url": "https://...",
      "video_url": "https://youtube.com/...",
      "primary_cta_text": "Sign Up Now",
      "primary_cta_url": "https://broker.com/signup",
      "published_at": "2026-01-15T10:30:00Z",
      "created_at": "2026-01-10T10:00:00Z",
      "updated_at": "2026-01-15T10:30:00Z",
      "stats": {
        "impressions": 15420,
        "clicks": 324,
        "conversions": 42,
        "conversion_rate": 2.8
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### 2.2 Get Landing Page by ID
```
GET /landing-pages/:id

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": {
    "id": 1,
    "company_id": 1,
    "title": "Best Forex Trading Platform",
    "slug": "best-forex-platform",
    "description": "Discover the best forex trading experience...",
    "template_type": "advanced",
    "content": {
      "sections": [
        {
          "type": "hero",
          "title": "Welcome to Premium Trading",
          "subtitle": "Start your journey today",
          "background_image": "https://..."
        },
        {
          "type": "features",
          "items": [
            {"title": "Low Spreads", "description": "...", "icon": "..."}
          ]
        },
        {
          "type": "testimonials",
          "items": [
            {"author": "John", "text": "Great platform", "rating": 5}
          ]
        },
        {
          "type": "pricing",
          "plans": []
        },
        {
          "type": "comparison",
          "platforms": []
        }
      ]
    },
    "meta_title": "Best Forex Trading Platform 2026",
    "meta_description": "Discover the best forex trading...",
    "meta_keywords": "forex, trading, platform, broker",
    "featured_image_url": "https://...",
    "video_url": "https://youtube.com/...",
    "status": "published",
    "seo_optimized": true,
    "conversion_goal": "registration",
    "primary_cta_text": "Sign Up Now",
    "primary_cta_url": "https://broker.com/signup",
    "secondary_cta_text": "Learn More",
    "secondary_cta_url": "https://...",
    "published_at": "2026-01-15T10:30:00Z",
    "created_at": "2026-01-10T10:00:00Z",
    "updated_at": "2026-01-15T10:30:00Z"
  }
}
```

### 2.3 Create Landing Page
```
POST /landing-pages

Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Request:
{
  "title": "Best Forex Trading Platform",
  "slug": "best-forex-platform",
  "description": "Discover the best forex trading experience...",
  "template_type": "advanced",
  "content": {
    "sections": [...]
  },
  "meta_title": "Best Forex Trading Platform 2026",
  "meta_description": "Discover the best forex trading...",
  "meta_keywords": "forex, trading, platform",
  "featured_image_url": "https://...",
  "video_url": "https://youtube.com/...",
  "primary_cta_text": "Sign Up Now",
  "primary_cta_url": "https://broker.com/signup"
}

Response (201):
{
  "data": {
    "id": 1,
    "title": "Best Forex Trading Platform",
    "slug": "best-forex-platform",
    "status": "draft",
    "created_at": "2026-01-10T10:00:00Z"
  },
  "message": "Landing page created successfully"
}
```

### 2.4 Update Landing Page
```
PUT /landing-pages/:id

Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Request:
{
  "title": "Updated Title",
  "content": {...},
  "status": "published"
}

Response (200):
{
  "data": {...},
  "message": "Landing page updated successfully"
}
```

### 2.5 Delete Landing Page
```
DELETE /landing-pages/:id

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "message": "Landing page deleted successfully"
}
```

### 2.6 Publish Landing Page
```
POST /landing-pages/:id/publish

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": {
    "id": 1,
    "status": "published",
    "published_at": "2026-01-15T10:30:00Z"
  },
  "message": "Landing page published successfully"
}
```

### 2.7 Get Landing Page by Slug (Public)
```
GET /public/landing-pages/:company_slug/:page_slug

Response (200):
{
  "data": {
    "id": 1,
    "title": "Best Forex Trading Platform",
    "content": {...},
    "primary_cta_url": "https://broker.com/signup"
  }
}
```

---

## 3. CAMPAIGNS ENDPOINTS

### 3.1 Get All Campaigns
```
GET /campaigns

Query Parameters:
  - page: int (default: 1)
  - limit: int (default: 20)
  - status: enum (draft|active|paused|completed|archived)
  - landing_page_id: int
  - sort: string
  - order: enum (asc|desc)

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": [
    {
      "id": 1,
      "name": "Q1 2026 Campaign",
      "description": "First quarter campaign",
      "campaign_type": "cpc",
      "status": "active",
      "landing_page_id": 1,
      "budget_daily": 500,
      "budget_total": 15000,
      "spent_total": 3250,
      "start_date": "2026-01-01",
      "end_date": "2026-03-31",
      "target_audience": {
        "countries": ["US", "UK", "DE"],
        "age_range": "25-65",
        "interests": ["finance", "trading"]
      },
      "created_at": "2025-12-20T10:00:00Z",
      "updated_at": "2026-01-10T15:30:00Z"
    }
  ],
  "pagination": {...}
}
```

### 3.2 Get Campaign by ID
```
GET /campaigns/:id

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": {
    "id": 1,
    "name": "Q1 2026 Campaign",
    "description": "First quarter campaign",
    "campaign_type": "cpc",
    "status": "active",
    "landing_page_id": 1,
    "company_id": 1,
    "budget_daily": 500,
    "budget_total": 15000,
    "spent_total": 3250,
    "start_date": "2026-01-01",
    "end_date": "2026-03-31",
    "target_audience": {...},
    "created_at": "2025-12-20T10:00:00Z",
    "updated_at": "2026-01-10T15:30:00Z",
    "performance": {
      "impressions": 125000,
      "clicks": 2850,
      "conversions": 380,
      "conversion_rate": 3.04,
      "cpc": 1.14,
      "cpa": 8.55,
      "roi": 145.23
    }
  }
}
```

### 3.3 Create Campaign
```
POST /campaigns

Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Request:
{
  "name": "Q1 2026 Campaign",
  "description": "First quarter campaign",
  "campaign_type": "cpc",
  "landing_page_id": 1,
  "budget_daily": 500,
  "budget_total": 15000,
  "start_date": "2026-01-01",
  "end_date": "2026-03-31",
  "target_audience": {
    "countries": ["US", "UK", "DE"],
    "age_range": "25-65",
    "interests": ["finance", "trading"]
  }
}

Response (201):
{
  "data": {"id": 1, ...},
  "message": "Campaign created successfully"
}
```

### 3.4 Update Campaign
```
PUT /campaigns/:id

Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Request:
{
  "status": "paused",
  "budget_daily": 600
}

Response (200):
{
  "data": {...},
  "message": "Campaign updated successfully"
}
```

### 3.5 Launch Campaign
```
POST /campaigns/:id/launch

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": {"status": "active", ...},
  "message": "Campaign launched successfully"
}
```

### 3.6 Pause Campaign
```
POST /campaigns/:id/pause

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": {"status": "paused", ...},
  "message": "Campaign paused successfully"
}
```

---

## 4. ANALYTICS ENDPOINTS

### 4.1 Get Analytics Summary (Dashboard)
```
GET /analytics/summary

Query Parameters:
  - date_from: date (default: 30 days ago)
  - date_to: date (default: today)
  - landing_page_id: int (optional)
  - campaign_id: int (optional)
  - traffic_source_id: int (optional)

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": {
    "total_impressions": 542000,
    "total_clicks": 12850,
    "total_conversions": 1245,
    "total_unique_visitors": 48920,
    "overall_conversion_rate": 2.3,
    "overall_cpc": 0.98,
    "overall_bounce_rate": 42.5,
    "total_revenue": 45230.50,
    "total_cost": 12645.30,
    "overall_roi": 257.8,
    "date_range": {
      "from": "2026-01-01",
      "to": "2026-01-31"
    }
  }
}
```

### 4.2 Get Analytics Time Series
```
GET /analytics/timeseries

Query Parameters:
  - date_from: date
  - date_to: date
  - landing_page_id: int (optional)
  - campaign_id: int (optional)
  - granularity: enum (hourly|daily|weekly|monthly) (default: daily)

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": [
    {
      "date": "2026-01-01",
      "impressions": 15420,
      "clicks": 324,
      "conversions": 42,
      "unique_visitors": 12500,
      "conversion_rate": 2.72,
      "bounce_rate": 38.2,
      "revenue": 1520.50,
      "cost": 318.40,
      "roi": 378.2
    },
    {
      "date": "2026-01-02",
      "impressions": 16800,
      "clicks": 378,
      "conversions": 45,
      ...
    }
  ]
}
```

### 4.3 Get Analytics by Country
```
GET /analytics/by-country

Query Parameters:
  - date_from: date
  - date_to: date
  - landing_page_id: int (optional)
  - campaign_id: int (optional)
  - limit: int (default: 50)

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": [
    {
      "country_code": "US",
      "country_name": "United States",
      "impressions": 245000,
      "clicks": 5800,
      "conversions": 480,
      "unique_visitors": 22500,
      "conversion_rate": 1.96,
      "cpc": 1.05,
      "cpa": 10.50
    },
    {
      "country_code": "UK",
      "country_name": "United Kingdom",
      "impressions": 158000,
      "clicks": 3950,
      "conversions": 320,
      ...
    }
  ]
}
```

### 4.4 Get Analytics by Device
```
GET /analytics/by-device

Query Parameters:
  - date_from: date
  - date_to: date
  - landing_page_id: int (optional)
  - campaign_id: int (optional)

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": [
    {
      "device_type": "desktop",
      "impressions": 325000,
      "clicks": 7250,
      "conversions": 620,
      "unique_visitors": 28500,
      "conversion_rate": 2.45,
      "bounce_rate": 35.8,
      "avg_session_duration": 245
    },
    {
      "device_type": "mobile",
      "impressions": 185000,
      "clicks": 4850,
      "conversions": 540,
      ...
    },
    {
      "device_type": "tablet",
      ...
    }
  ]
}
```

### 4.5 Get Analytics by Traffic Source
```
GET /analytics/by-traffic-source

Query Parameters:
  - date_from: date
  - date_to: date
  - landing_page_id: int (optional)
  - campaign_id: int (optional)

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": [
    {
      "traffic_source_id": 1,
      "traffic_source_name": "Google Ads",
      "source_type": "display",
      "impressions": 125000,
      "clicks": 3200,
      "conversions": 380,
      "unique_visitors": 12500,
      "conversion_rate": 3.04,
      "cpc": 1.22,
      "cpa": 8.55
    },
    {
      "traffic_source_id": 2,
      "traffic_source_name": "Facebook",
      ...
    }
  ]
}
```

### 4.6 Get Conversion Details
```
GET /analytics/conversions

Query Parameters:
  - page: int (default: 1)
  - limit: int (default: 50)
  - date_from: date
  - date_to: date
  - landing_page_id: int (optional)
  - campaign_id: int (optional)
  - status: enum (new|contacted|qualified|rejected|converted)

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": [
    {
      "id": 1,
      "landing_page_id": 1,
      "campaign_id": 5,
      "conversion_type": "registration",
      "lead_email": "user@example.com",
      "lead_phone": "+1234567890",
      "lead_first_name": "John",
      "lead_last_name": "Doe",
      "lead_country": "US",
      "lead_status": "new",
      "conversion_value": 25.50,
      "timestamp": "2026-01-10T14:30:00Z",
      "visitor_id": "uuid-string",
      "device_type": "desktop",
      "browser": "Chrome",
      "country": "US"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1245
  }
}
```

### 4.7 Get Top Performing Landing Pages
```
GET /analytics/top-landing-pages

Query Parameters:
  - date_from: date
  - date_to: date
  - campaign_id: int (optional)
  - limit: int (default: 10)
  - sort_by: enum (conversions|conversion_rate|cpc|roi) (default: conversions)

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": [
    {
      "id": 1,
      "title": "Best Forex Trading Platform",
      "impressions": 125000,
      "clicks": 2850,
      "conversions": 380,
      "unique_visitors": 22500,
      "conversion_rate": 3.04,
      "bounce_rate": 32.5,
      "avg_session_duration": 285,
      "revenue": 15200.50,
      "roi": 245.8
    }
  ]
}
```

### 4.8 Get Comparison Report
```
GET /analytics/comparison

Query Parameters:
  - landing_page_ids: array of ints (comma-separated)
  - date_from: date
  - date_to: date

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": {
    "comparison": [
      {
        "landing_page_id": 1,
        "title": "Page 1",
        "impressions": 125000,
        "clicks": 2850,
        "conversions": 380,
        "conversion_rate": 3.04
      },
      {
        "landing_page_id": 2,
        "title": "Page 2",
        "impressions": 98000,
        "clicks": 1950,
        "conversions": 245,
        "conversion_rate": 2.50
      }
    ],
    "winner": "landing_page_1",
    "improvement_percentage": 21.6
  }
}
```

---

## 5. TRACKING PIXEL ENDPOINT

### 5.1 Tracking Pixel (Public)
```
GET /track/pixel.gif

Query Parameters:
  - lp: string (landing_page_id)
  - c: string (campaign_id, optional)
  - s: string (traffic_source_id, optional)
  - v: string (visitor_id, UUID)
  - utm_source: string
  - utm_medium: string
  - utm_campaign: string
  - utm_content: string
  - utm_term: string
  - ref: string (referrer URL)

Example:
/track/pixel.gif?lp=1&c=5&v=abc-uuid&utm_source=google&utm_medium=cpc&utm_campaign=q1_2026

Response:
1x1 transparent GIF image
Status: 200
```

### 5.2 Track Event (JavaScript)
```
POST /track/event

Headers:
  Content-Type: application/json

Request:
{
  "event_type": "click",
  "landing_page_id": 1,
  "campaign_id": 5,
  "visitor_id": "uuid-string",
  "page_view_id": "uuid-string",
  "element_id": "cta-button-primary",
  "element_text": "Sign Up Now",
  "element_url": "https://broker.com/signup",
  "click_position": {"x": 450, "y": 320},
  "timestamp": "2026-01-10T14:30:00Z"
}

Response (200):
{
  "status": "success",
  "message": "Event tracked successfully"
}
```

### 5.3 Track Conversion (Public)
```
POST /track/conversion

Headers:
  Content-Type: application/json

Request:
{
  "landing_page_id": 1,
  "campaign_id": 5,
  "visitor_id": "uuid-string",
  "page_view_id": "uuid-string",
  "conversion_type": "registration",
  "lead_email": "user@example.com",
  "lead_phone": "+1234567890",
  "lead_first_name": "John",
  "lead_last_name": "Doe",
  "lead_country": "US",
  "conversion_value": 25.50,
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "q1_2026"
}

Response (201):
{
  "status": "success",
  "conversion_id": 12345,
  "message": "Conversion tracked successfully"
}
```

---

## 6. TRAFFIC SOURCES ENDPOINTS

### 6.1 Get All Traffic Sources
```
GET /traffic-sources

Query Parameters:
  - page: int (default: 1)
  - limit: int (default: 20)

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": [
    {
      "id": 1,
      "name": "Google Ads",
      "source_type": "display",
      "channel": "paid_search",
      "utm_source": "google",
      "utm_medium": "cpc",
      "status": "active",
      "created_at": "2025-12-01T10:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### 6.2 Create Traffic Source
```
POST /traffic-sources

Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Request:
{
  "name": "Google Ads",
  "source_type": "display",
  "channel": "paid_search",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "q1_2026",
  "description": "Main Google Ads traffic source"
}

Response (201):
{
  "data": {"id": 1, ...},
  "message": "Traffic source created successfully"
}
```

---

## 7. EXPORT ENDPOINTS

### 7.1 Export Analytics
```
POST /exports/analytics

Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Request:
{
  "export_type": "csv",
  "date_from": "2026-01-01",
  "date_to": "2026-01-31",
  "landing_page_ids": [1, 2, 3],
  "campaign_ids": [5],
  "include_data": ["impressions", "clicks", "conversions", "revenue"]
}

Response (202):
{
  "export_id": 123,
  "status": "processing",
  "message": "Export job created. You will be notified when complete."
}
```

### 7.2 Get Export Status
```
GET /exports/:export_id

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": {
    "id": 123,
    "export_type": "csv",
    "status": "completed",
    "file_url": "https://cdn.forextraffic.io/exports/export-123.csv",
    "file_size": "2.5 MB",
    "created_at": "2026-01-10T10:00:00Z",
    "completed_at": "2026-01-10T10:05:30Z"
  }
}
```

### 7.3 Export Conversions
```
POST /exports/conversions

Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Request:
{
  "export_type": "excel",
  "date_from": "2026-01-01",
  "date_to": "2026-01-31",
  "campaign_ids": [5],
  "status_filter": "new"
}

Response (202):
{
  "export_id": 124,
  "status": "processing"
}
```

---

## 8. NOTIFICATIONS ENDPOINTS

### 8.1 Get Notifications
```
GET /notifications

Query Parameters:
  - page: int (default: 1)
  - limit: int (default: 20)
  - is_read: boolean (optional)
  - severity: enum (info|warning|critical)

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "data": [
    {
      "id": 1,
      "notification_type": "conversion_increase",
      "title": "Conversion Increase Alert",
      "message": "Campaign 'Q1 2026' conversions increased by 45%",
      "severity": "info",
      "threshold_value": 250,
      "actual_value": 362,
      "landing_page_id": 1,
      "campaign_id": 5,
      "is_read": false,
      "created_at": "2026-01-10T14:30:00Z"
    }
  ],
  "unread_count": 5
}
```

### 8.2 Mark Notification as Read
```
PUT /notifications/:notification_id/read

Headers:
  Authorization: Bearer <token>

Response (200):
{
  "message": "Notification marked as read"
}
```

### 8.3 Create Alert Rule
```
POST /notifications/alert-rules

Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Request:
{
  "name": "High Conversion Alert",
  "landing_page_id": 1,
  "alert_type": "conversion_increase",
  "threshold_type": "percentage",
  "threshold_value": 50,
  "baseline_period_days": 7,
  "check_frequency_minutes": 60,
  "enabled": true
}

Response (201):
{
  "data": {"id": 1, ...},
  "message": "Alert rule created successfully"
}
```

---

## 9. ERROR RESPONSES

### Standard Error Format
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid",
    "status_code": 400,
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2026-01-10T14:30:00Z",
    "request_id": "req-uuid-string"
  }
}
```

### HTTP Status Codes
- **200 OK**: Richiesta completata con successo
- **201 Created**: Risorsa creata con successo
- **202 Accepted**: Richiesta accettata per l'elaborazione asincrona
- **204 No Content**: Richiesta completata senza contenuto
- **400 Bad Request**: Richiesta non valida
- **401 Unauthorized**: Autenticazione richiesta
- **403 Forbidden**: Accesso non autorizzato
- **404 Not Found**: Risorsa non trovata
- **409 Conflict**: Conflitto (es. slug duplicato)
- **422 Unprocessable Entity**: Dati non validi
- **429 Too Many Requests**: Rate limit superato
- **500 Internal Server Error**: Errore del server
- **503 Service Unavailable**: Servizio non disponibile

---

## 10. WEBHOOKS

### Webhook Events

#### Conversion Completed
```
Event Type: conversion.created
Method: POST
Headers: X-Webhook-Signature: sha256=...

Payload:
{
  "event_type": "conversion.created",
  "event_id": "evt-uuid",
  "timestamp": "2026-01-10T14:30:00Z",
  "data": {
    "conversion_id": 12345,
    "landing_page_id": 1,
    "campaign_id": 5,
    "lead_email": "user@example.com",
    "conversion_value": 25.50,
    "conversion_type": "registration"
  }
}
```

#### Campaign Performance Alert
```
Event Type: campaign.performance_alert
Method: POST

Payload:
{
  "event_type": "campaign.performance_alert",
  "event_id": "evt-uuid",
  "timestamp": "2026-01-10T14:30:00Z",
  "data": {
    "campaign_id": 5,
    "alert_type": "conversion_increase",
    "threshold_value": 50,
    "actual_change_percentage": 65
  }
}
```

---

## 11. TRACKING SCRIPT

### JavaScript Tracking Code
```html
<!-- Aggiungi questo script nella pagina -->
<script>
  (function() {
    // Configuration
    const config = {
      landingPageId: 1,
      campaignId: 5,
      trackingDomain: 'https://track.forextraffic.io'
    };
    
    // Generate or retrieve visitor ID
    let visitorId = localStorage.getItem('forex_visitor_id');
    if (!visitorId) {
      visitorId = 'uuid-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('forex_visitor_id', visitorId);
    }
    
    // Track page view
    function trackPageView() {
      const trackingPixel = new Image();
      trackingPixel.src = config.trackingDomain + '/track/pixel.gif?' +
        'lp=' + config.landingPageId +
        '&c=' + config.campaignId +
        '&v=' + visitorId +
        '&utm_source=' + getUrlParam('utm_source') +
        '&utm_medium=' + getUrlParam('utm_medium') +
        '&utm_campaign=' + getUrlParam('utm_campaign') +
        '&ref=' + encodeURIComponent(document.referrer);
    }
    
    // Track button clicks
    function trackClick(element) {
      fetch(config.trackingDomain + '/track/event', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          event_type: 'click',
          landing_page_id: config.landingPageId,
          campaign_id: config.campaignId,
          visitor_id: visitorId,
          element_id: element.id,
          element_text: element.textContent,
          element_url: element.href || element.getAttribute('data-url')
        })
      });
    }
    
    // Track form conversion
    window.trackConversion = function(email, phone, firstName, lastName, country) {
      fetch(config.trackingDomain + '/track/conversion', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          landing_page_id: config.landingPageId,
          campaign_id: config.campaignId,
          visitor_id: visitorId,
          conversion_type: 'registration',
          lead_email: email,
          lead_phone: phone,
          lead_first_name: firstName,
          lead_last_name: lastName,
          lead_country: country
        })
      });
    };
    
    // Utility function
    function getUrlParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param) || '';
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
      trackPageView();
      
      // Attach click tracking to all CTA buttons
      document.querySelectorAll('[data-track-click]').forEach(el => {
        el.addEventListener('click', function(e) {
          trackClick(this);
        });
      });
    });
  })();
</script>
```

Nell'HTML della landing page:
```html
<!-- Primary CTA Button -->
<button id="cta-primary" data-track-click="true" onclick="trackConversion('email@example.com', '+1234567890', 'John', 'Doe', 'US')">
  Sign Up Now
</button>

<!-- Secondary Link -->
<a href="https://broker.com/learn" data-track-click="true">Learn More</a>
```

---

## Rate Limiting & Best Practices

1. **Batch Requests**: Aggregare richieste quando possibile
2. **Caching**: Cache risposte per 5-10 minuti
3. **Retry Logic**: Implementare retry con backoff esponenziale
4. **Async Operations**: Usare webhook per operazioni lunghe
5. **Error Handling**: Implementare gestione robusta degli errori
6. **Data Validation**: Validare dati prima dell'invio

---

Questa API specification fornisce una base completa per il progetto. Sarà necessario adattarla in base alle specifiche esigenze di business e ai requisiti di sicurezza.
