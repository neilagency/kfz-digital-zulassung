-- ═══════════════════════════════════════════════════════════
-- BASELINE SCHEMA SNAPSHOT — Turso Production
-- Generated: 2026-04-20T14:10:47.257Z
-- ═══════════════════════════════════════════════════════════

-- TABLES

CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wpPostId" INTEGER,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL DEFAULT '',
    "featuredImage" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "author" TEXT NOT NULL DEFAULT 'Admin',
    "metaTitle" TEXT NOT NULL DEFAULT '',
    "metaDescription" TEXT NOT NULL DEFAULT '',
    "focusKeyword" TEXT NOT NULL DEFAULT '',
    "canonical" TEXT NOT NULL DEFAULT '',
    "robots" TEXT NOT NULL DEFAULT 'index, follow',
    "ogTitle" TEXT NOT NULL DEFAULT '',
    "ogDescription" TEXT NOT NULL DEFAULT '',
    "ogImage" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '',
    "views" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
, "scheduledAt" DATETIME, featuredImageId TEXT NOT NULL DEFAULT "");

CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wpCatId" INTEGER,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "count" INTEGER NOT NULL DEFAULT 0,
    "parent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "discountType" TEXT NOT NULL DEFAULT 'fixed',
    "discountValue" REAL NOT NULL DEFAULT 0,
    "minOrderValue" REAL NOT NULL DEFAULT 0,
    "maxUsageTotal" INTEGER NOT NULL DEFAULT 0,
    "maxUsagePerUser" INTEGER NOT NULL DEFAULT 1,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "productSlugs" TEXT NOT NULL DEFAULT '',
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "showBanner" INTEGER NOT NULL DEFAULT 0,
    "bannerText" TEXT NOT NULL DEFAULT '',
    "startDate" DATETIME,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  );

CREATE TABLE "CouponUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "couponId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "orderId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CouponUsage_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "postcode" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "street" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT 'DE',
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "totalSpent" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
, password TEXT, lastLoginAt DATETIME, emailSubscribed INTEGER NOT NULL DEFAULT 1, unsubscribeToken TEXT NOT NULL DEFAULT "");

CREATE TABLE "EmailCampaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL DEFAULT '',
    "heading" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "ctaText" TEXT NOT NULL DEFAULT '',
    "ctaUrl" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "totalRecipients" INTEGER NOT NULL DEFAULT 0,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "errorLog" TEXT NOT NULL DEFAULT '',
    "sentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  , targetMode TEXT NOT NULL DEFAULT "all", targetEmails TEXT NOT NULL DEFAULT "", targetSegment TEXT NOT NULL DEFAULT "", scheduledAt DATETIME, openCount INTEGER NOT NULL DEFAULT 0, clickCount INTEGER NOT NULL DEFAULT 0, templateId TEXT NOT NULL DEFAULT "");

CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT,
    "billingName" TEXT NOT NULL DEFAULT '',
    "billingEmail" TEXT NOT NULL DEFAULT '',
    "billingAddress" TEXT NOT NULL DEFAULT '',
    "billingCity" TEXT NOT NULL DEFAULT '',
    "billingPostcode" TEXT NOT NULL DEFAULT '',
    "billingCountry" TEXT NOT NULL DEFAULT 'DE',
    "companyName" TEXT NOT NULL DEFAULT '',
    "companyTaxId" TEXT NOT NULL DEFAULT '',
    "items" TEXT NOT NULL DEFAULT '[]',
    "subtotal" REAL NOT NULL DEFAULT 0,
    "taxRate" REAL NOT NULL DEFAULT 19,
    "taxAmount" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL DEFAULT 0,
    "paymentMethod" TEXT NOT NULL DEFAULT '',
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "transactionId" TEXT NOT NULL DEFAULT '',
    "pdfUrl" TEXT NOT NULL DEFAULT '',
    "invoiceDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
  );

CREATE TABLE "Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wpMediaId" INTEGER,
    "title" TEXT NOT NULL DEFAULT '',
    "altText" TEXT NOT NULL DEFAULT '',
    "sourceUrl" TEXT NOT NULL,
    "localPath" TEXT NOT NULL DEFAULT '',
    "mimeType" TEXT NOT NULL DEFAULT '',
    "width" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,
    "fileSize" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
, fileName TEXT NOT NULL DEFAULT '', originalName TEXT NOT NULL DEFAULT '', thumbnailUrl TEXT NOT NULL DEFAULT '', folder TEXT NOT NULL DEFAULT '', usedIn TEXT NOT NULL DEFAULT '[]', mediumUrl TEXT NOT NULL DEFAULT '', largeUrl TEXT NOT NULL DEFAULT '', webpUrl TEXT NOT NULL DEFAULT '', avifUrl TEXT NOT NULL DEFAULT '', useCount INTEGER NOT NULL DEFAULT 0);

CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" INTEGER NOT NULL,
    "wpOrderId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "total" REAL NOT NULL DEFAULT 0,
    "subtotal" REAL NOT NULL DEFAULT 0,
    "paymentFee" REAL NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "paymentMethod" TEXT NOT NULL DEFAULT '',
    "paymentTitle" TEXT NOT NULL DEFAULT '',
    "transactionId" TEXT NOT NULL DEFAULT '',
    "billingEmail" TEXT NOT NULL DEFAULT '',
    "billingPhone" TEXT NOT NULL DEFAULT '',
    "billingFirst" TEXT NOT NULL DEFAULT '',
    "billingLast" TEXT NOT NULL DEFAULT '',
    "billingStreet" TEXT NOT NULL DEFAULT '',
    "billingCity" TEXT NOT NULL DEFAULT '',
    "billingPostcode" TEXT NOT NULL DEFAULT '',
    "serviceData" TEXT NOT NULL DEFAULT '{}',
    "productName" TEXT NOT NULL DEFAULT '',
    "productId" INTEGER,
    "customerId" TEXT,
    "datePaid" DATETIME,
    "dateCompleted" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL, "deletedAt" DATETIME, "discountAmount" REAL NOT NULL DEFAULT 0, "couponCode" TEXT NOT NULL DEFAULT '', "completionEmailSent" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "OrderDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL DEFAULT 0,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrderDocument_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productId" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "OrderMessage" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "orderId" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "attachments" TEXT NOT NULL DEFAULT '[]',
        "sentBy" TEXT NOT NULL DEFAULT 'admin',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE
      );

CREATE TABLE "OrderNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'system',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrderNote_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wpPageId" INTEGER,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "author" TEXT NOT NULL DEFAULT 'iKFZ-Team',
    "template" TEXT NOT NULL DEFAULT '',
    "parent" INTEGER NOT NULL DEFAULT 0,
    "menuOrder" INTEGER NOT NULL DEFAULT 0,
    "featuredImage" TEXT NOT NULL DEFAULT '',
    "metaTitle" TEXT NOT NULL DEFAULT '',
    "metaDescription" TEXT NOT NULL DEFAULT '',
    "focusKeywords" TEXT NOT NULL DEFAULT '',
    "seoScore" INTEGER NOT NULL DEFAULT 0,
    "canonical" TEXT NOT NULL DEFAULT '',
    "robots" TEXT NOT NULL DEFAULT 'index, follow',
    "schemaType" TEXT NOT NULL DEFAULT '',
    "schemaData" TEXT NOT NULL DEFAULT '',
    "ogTitle" TEXT NOT NULL DEFAULT '',
    "ogDescription" TEXT NOT NULL DEFAULT '',
    "ogImage" TEXT NOT NULL DEFAULT '',
    "ogType" TEXT NOT NULL DEFAULT 'article',
    "twitterTitle" TEXT NOT NULL DEFAULT '',
    "twitterDescription" TEXT NOT NULL DEFAULT '',
    "twitterImage" TEXT NOT NULL DEFAULT '',
    "twitterCard" TEXT NOT NULL DEFAULT 'summary_large_image',
    "internalLinks" INTEGER NOT NULL DEFAULT 0,
    "externalLinks" INTEGER NOT NULL DEFAULT 0,
    "isFooterPage" BOOLEAN NOT NULL DEFAULT false,
    "pageType" TEXT NOT NULL DEFAULT 'page',
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "gatewayId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL DEFAULT '',
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "method" TEXT NOT NULL DEFAULT '',
    "providerData" TEXT NOT NULL DEFAULT '{}',
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "PaymentGateway" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gatewayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "fee" REAL NOT NULL DEFAULT 0,
    "apiKey" TEXT NOT NULL DEFAULT '',
    "secretKey" TEXT NOT NULL DEFAULT '',
    "mode" TEXT NOT NULL DEFAULT 'live',
    "icon" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "settings" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wpProductId" INTEGER,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "price" REAL NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "serviceType" TEXT NOT NULL DEFAULT '',
    "options" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
, content TEXT NOT NULL DEFAULT '', heroTitle TEXT NOT NULL DEFAULT '', heroSubtitle TEXT NOT NULL DEFAULT '', featuredImage TEXT NOT NULL DEFAULT '', faqItems TEXT NOT NULL DEFAULT '[]', metaTitle TEXT NOT NULL DEFAULT '', metaDescription TEXT NOT NULL DEFAULT '', canonical TEXT NOT NULL DEFAULT '', robots TEXT NOT NULL DEFAULT 'index, follow', ogTitle TEXT NOT NULL DEFAULT '', ogDescription TEXT NOT NULL DEFAULT '', ogImage TEXT NOT NULL DEFAULT '', formType TEXT NOT NULL DEFAULT '');

CREATE TABLE "Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL DEFAULT '',
    "group" TEXT NOT NULL DEFAULT 'general'
);

CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wpTagId" INTEGER,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);


-- INDEXES

CREATE INDEX "BlogPost_createdAt_idx" ON "BlogPost"("createdAt");
CREATE INDEX "BlogPost_publishedAt_idx" ON "BlogPost"("publishedAt");
CREATE INDEX "BlogPost_slug_idx" ON "BlogPost"("slug");
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE INDEX "BlogPost_status_createdAt_idx"
  ON "BlogPost"("status", "createdAt");
CREATE INDEX "BlogPost_status_idx" ON "BlogPost"("status");
CREATE INDEX "BlogPost_status_scheduledAt_idx" ON "BlogPost"("status", "scheduledAt");
CREATE UNIQUE INDEX "BlogPost_wpPostId_key" ON "BlogPost"("wpPostId");
CREATE INDEX "Category_slug_idx" ON "Category"("slug");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE UNIQUE INDEX "Category_wpCatId_key" ON "Category"("wpCatId");
CREATE INDEX "Coupon_code_idx" ON "Coupon"("code");
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
CREATE INDEX "Coupon_endDate_idx" ON "Coupon"("endDate");
CREATE INDEX "Coupon_isActive_idx" ON "Coupon"("isActive");
CREATE UNIQUE INDEX "CouponUsage_couponId_email_key" ON "CouponUsage"("couponId", "email");
CREATE INDEX "CouponUsage_couponId_idx" ON "CouponUsage"("couponId");
CREATE INDEX "CouponUsage_email_idx" ON "CouponUsage"("email");
CREATE INDEX "Customer_createdAt_idx" ON "Customer"("createdAt");
CREATE INDEX Customer_emailSubscribed_idx ON Customer(emailSubscribed);
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE INDEX "Customer_firstName_lastName_idx" ON "Customer"("firstName", "lastName");
CREATE INDEX "EmailCampaign_createdAt_idx" ON "EmailCampaign"("createdAt");
CREATE INDEX EmailCampaign_scheduledAt_idx ON EmailCampaign(scheduledAt);
CREATE INDEX "EmailCampaign_status_idx" ON "EmailCampaign"("status");
CREATE INDEX "Invoice_billingEmail_idx" ON "Invoice"("billingEmail");
CREATE INDEX "Invoice_createdAt_idx" ON "Invoice"("createdAt");
CREATE INDEX "Invoice_customerId_idx" ON "Invoice"("customerId");
CREATE INDEX "Invoice_invoiceDate_idx" ON "Invoice"("invoiceDate");
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");
CREATE INDEX "Invoice_orderId_idx" ON "Invoice"("orderId");
CREATE INDEX "Invoice_paymentStatus_idx" ON "Invoice"("paymentStatus");
CREATE INDEX Media_createdAt_idx ON Media(createdAt);
CREATE INDEX Media_fileName_idx ON Media(fileName);
CREATE INDEX Media_folder_idx ON Media(folder);
CREATE INDEX Media_mimeType_idx ON Media(mimeType);
CREATE INDEX "Media_useCount_idx" ON "Media"("useCount");
CREATE UNIQUE INDEX "Media_wpMediaId_key" ON "Media"("wpMediaId");
CREATE INDEX "Order_billingEmail_idx" ON "Order"("billingEmail");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "Order_deletedAt_createdAt_idx" ON "Order"("deletedAt", "createdAt");
CREATE INDEX "Order_deletedAt_idx" ON "Order"("deletedAt");
CREATE INDEX "Order_deletedAt_status_createdAt_idx"
  ON "Order"("deletedAt", "status", "createdAt");
CREATE INDEX "Order_deletedAt_status_idx" ON "Order"("deletedAt", "status");
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE UNIQUE INDEX "Order_wpOrderId_key" ON "Order"("wpOrderId");
CREATE INDEX "OrderDocument_orderId_idx" ON "OrderDocument"("orderId");
CREATE UNIQUE INDEX "OrderDocument_token_key" ON "OrderDocument"("token");
CREATE INDEX "OrderMessage_createdAt_idx" ON "OrderMessage"("createdAt");
CREATE INDEX "OrderMessage_orderId_idx" ON "OrderMessage"("orderId");
CREATE INDEX "Page_seoScore_idx" ON "Page"("seoScore");
CREATE INDEX "Page_slug_idx" ON "Page"("slug");
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
CREATE INDEX "Page_status_idx" ON "Page"("status");
CREATE UNIQUE INDEX "Page_wpPageId_key" ON "Page"("wpPageId");
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
CREATE UNIQUE INDEX "PaymentGateway_gatewayId_key" ON "PaymentGateway"("gatewayId");
CREATE INDEX Product_createdAt_idx ON Product(createdAt);
CREATE INDEX Product_isActive_idx ON Product(isActive);
CREATE INDEX Product_serviceType_idx ON Product(serviceType);
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE UNIQUE INDEX "Product_wpProductId_key" ON "Product"("wpProductId");
CREATE INDEX "Setting_group_idx"
  ON "Setting"("group");
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");
CREATE INDEX "Tag_slug_idx" ON "Tag"("slug");
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");
CREATE UNIQUE INDEX "Tag_wpTagId_key" ON "Tag"("wpTagId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");


-- ═══════════════════════════════════════════════════════════
-- COLUMN DETAILS (PRAGMA table_info)
-- ═══════════════════════════════════════════════════════════

-- BlogPost
--   id | TEXT | notnull=1 | default=null | pk=1
--   wpPostId | INTEGER | notnull=0 | default=null | pk=0
--   slug | TEXT | notnull=1 | default=null | pk=0
--   title | TEXT | notnull=1 | default=null | pk=0
--   content | TEXT | notnull=1 | default=null | pk=0
--   excerpt | TEXT | notnull=1 | default='' | pk=0
--   featuredImage | TEXT | notnull=1 | default='' | pk=0
--   status | TEXT | notnull=1 | default='draft' | pk=0
--   author | TEXT | notnull=1 | default='Admin' | pk=0
--   metaTitle | TEXT | notnull=1 | default='' | pk=0
--   metaDescription | TEXT | notnull=1 | default='' | pk=0
--   focusKeyword | TEXT | notnull=1 | default='' | pk=0
--   canonical | TEXT | notnull=1 | default='' | pk=0
--   robots | TEXT | notnull=1 | default='index, follow' | pk=0
--   ogTitle | TEXT | notnull=1 | default='' | pk=0
--   ogDescription | TEXT | notnull=1 | default='' | pk=0
--   ogImage | TEXT | notnull=1 | default='' | pk=0
--   category | TEXT | notnull=1 | default='' | pk=0
--   tags | TEXT | notnull=1 | default='' | pk=0
--   views | INTEGER | notnull=1 | default=0 | pk=0
--   publishedAt | DATETIME | notnull=0 | default=null | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0
--   updatedAt | DATETIME | notnull=1 | default=null | pk=0
--   scheduledAt | DATETIME | notnull=0 | default=null | pk=0
--   featuredImageId | TEXT | notnull=1 | default="" | pk=0

-- Category
--   id | TEXT | notnull=1 | default=null | pk=1
--   wpCatId | INTEGER | notnull=0 | default=null | pk=0
--   name | TEXT | notnull=1 | default=null | pk=0
--   slug | TEXT | notnull=1 | default=null | pk=0
--   description | TEXT | notnull=1 | default='' | pk=0
--   count | INTEGER | notnull=1 | default=0 | pk=0
--   parent | INTEGER | notnull=1 | default=0 | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0
--   updatedAt | DATETIME | notnull=1 | default=null | pk=0

-- Coupon
--   id | TEXT | notnull=1 | default=null | pk=1
--   code | TEXT | notnull=1 | default=null | pk=0
--   description | TEXT | notnull=1 | default='' | pk=0
--   discountType | TEXT | notnull=1 | default='fixed' | pk=0
--   discountValue | REAL | notnull=1 | default=0 | pk=0
--   minOrderValue | REAL | notnull=1 | default=0 | pk=0
--   maxUsageTotal | INTEGER | notnull=1 | default=0 | pk=0
--   maxUsagePerUser | INTEGER | notnull=1 | default=1 | pk=0
--   usageCount | INTEGER | notnull=1 | default=0 | pk=0
--   productSlugs | TEXT | notnull=1 | default='' | pk=0
--   isActive | INTEGER | notnull=1 | default=1 | pk=0
--   showBanner | INTEGER | notnull=1 | default=0 | pk=0
--   bannerText | TEXT | notnull=1 | default='' | pk=0
--   startDate | DATETIME | notnull=0 | default=null | pk=0
--   endDate | DATETIME | notnull=0 | default=null | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0
--   updatedAt | DATETIME | notnull=1 | default=null | pk=0

-- CouponUsage
--   id | TEXT | notnull=1 | default=null | pk=1
--   couponId | TEXT | notnull=1 | default=null | pk=0
--   email | TEXT | notnull=1 | default=null | pk=0
--   orderId | TEXT | notnull=0 | default=null | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0

-- Customer
--   id | TEXT | notnull=1 | default=null | pk=1
--   email | TEXT | notnull=1 | default=null | pk=0
--   firstName | TEXT | notnull=1 | default='' | pk=0
--   lastName | TEXT | notnull=1 | default='' | pk=0
--   phone | TEXT | notnull=1 | default='' | pk=0
--   city | TEXT | notnull=1 | default='' | pk=0
--   postcode | TEXT | notnull=1 | default='' | pk=0
--   address | TEXT | notnull=1 | default='' | pk=0
--   street | TEXT | notnull=1 | default='' | pk=0
--   country | TEXT | notnull=1 | default='DE' | pk=0
--   totalOrders | INTEGER | notnull=1 | default=0 | pk=0
--   totalSpent | REAL | notnull=1 | default=0 | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0
--   updatedAt | DATETIME | notnull=1 | default=null | pk=0
--   password | TEXT | notnull=0 | default=null | pk=0
--   lastLoginAt | DATETIME | notnull=0 | default=null | pk=0
--   emailSubscribed | INTEGER | notnull=1 | default=1 | pk=0
--   unsubscribeToken | TEXT | notnull=1 | default="" | pk=0

-- EmailCampaign
--   id | TEXT | notnull=1 | default=null | pk=1
--   name | TEXT | notnull=1 | default=null | pk=0
--   subject | TEXT | notnull=1 | default='' | pk=0
--   heading | TEXT | notnull=1 | default='' | pk=0
--   content | TEXT | notnull=1 | default='' | pk=0
--   imageUrl | TEXT | notnull=1 | default='' | pk=0
--   ctaText | TEXT | notnull=1 | default='' | pk=0
--   ctaUrl | TEXT | notnull=1 | default='' | pk=0
--   status | TEXT | notnull=1 | default='draft' | pk=0
--   totalRecipients | INTEGER | notnull=1 | default=0 | pk=0
--   sentCount | INTEGER | notnull=1 | default=0 | pk=0
--   failedCount | INTEGER | notnull=1 | default=0 | pk=0
--   errorLog | TEXT | notnull=1 | default='' | pk=0
--   sentAt | DATETIME | notnull=0 | default=null | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0
--   updatedAt | DATETIME | notnull=1 | default=null | pk=0
--   targetMode | TEXT | notnull=1 | default="all" | pk=0
--   targetEmails | TEXT | notnull=1 | default="" | pk=0
--   targetSegment | TEXT | notnull=1 | default="" | pk=0
--   scheduledAt | DATETIME | notnull=0 | default=null | pk=0
--   openCount | INTEGER | notnull=1 | default=0 | pk=0
--   clickCount | INTEGER | notnull=1 | default=0 | pk=0
--   templateId | TEXT | notnull=1 | default="" | pk=0

-- Invoice
--   id | TEXT | notnull=1 | default=null | pk=1
--   invoiceNumber | TEXT | notnull=1 | default=null | pk=0
--   orderId | TEXT | notnull=1 | default=null | pk=0
--   customerId | TEXT | notnull=0 | default=null | pk=0
--   billingName | TEXT | notnull=1 | default='' | pk=0
--   billingEmail | TEXT | notnull=1 | default='' | pk=0
--   billingAddress | TEXT | notnull=1 | default='' | pk=0
--   billingCity | TEXT | notnull=1 | default='' | pk=0
--   billingPostcode | TEXT | notnull=1 | default='' | pk=0
--   billingCountry | TEXT | notnull=1 | default='DE' | pk=0
--   companyName | TEXT | notnull=1 | default='' | pk=0
--   companyTaxId | TEXT | notnull=1 | default='' | pk=0
--   items | TEXT | notnull=1 | default='[]' | pk=0
--   subtotal | REAL | notnull=1 | default=0 | pk=0
--   taxRate | REAL | notnull=1 | default=19 | pk=0
--   taxAmount | REAL | notnull=1 | default=0 | pk=0
--   total | REAL | notnull=1 | default=0 | pk=0
--   paymentMethod | TEXT | notnull=1 | default='' | pk=0
--   paymentStatus | TEXT | notnull=1 | default='pending' | pk=0
--   transactionId | TEXT | notnull=1 | default='' | pk=0
--   pdfUrl | TEXT | notnull=1 | default='' | pk=0
--   invoiceDate | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0
--   dueDate | DATETIME | notnull=0 | default=null | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0
--   updatedAt | DATETIME | notnull=1 | default=null | pk=0

-- Media
--   id | TEXT | notnull=1 | default=null | pk=1
--   wpMediaId | INTEGER | notnull=0 | default=null | pk=0
--   title | TEXT | notnull=1 | default='' | pk=0
--   altText | TEXT | notnull=1 | default='' | pk=0
--   sourceUrl | TEXT | notnull=1 | default=null | pk=0
--   localPath | TEXT | notnull=1 | default='' | pk=0
--   mimeType | TEXT | notnull=1 | default='' | pk=0
--   width | INTEGER | notnull=1 | default=0 | pk=0
--   height | INTEGER | notnull=1 | default=0 | pk=0
--   fileSize | INTEGER | notnull=1 | default=0 | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0
--   updatedAt | DATETIME | notnull=1 | default=null | pk=0
--   fileName | TEXT | notnull=1 | default='' | pk=0
--   originalName | TEXT | notnull=1 | default='' | pk=0
--   thumbnailUrl | TEXT | notnull=1 | default='' | pk=0
--   folder | TEXT | notnull=1 | default='' | pk=0
--   usedIn | TEXT | notnull=1 | default='[]' | pk=0
--   mediumUrl | TEXT | notnull=1 | default='' | pk=0
--   largeUrl | TEXT | notnull=1 | default='' | pk=0
--   webpUrl | TEXT | notnull=1 | default='' | pk=0
--   avifUrl | TEXT | notnull=1 | default='' | pk=0
--   useCount | INTEGER | notnull=1 | default=0 | pk=0

-- Order
--   id | TEXT | notnull=1 | default=null | pk=1
--   orderNumber | INTEGER | notnull=1 | default=null | pk=0
--   wpOrderId | INTEGER | notnull=0 | default=null | pk=0
--   status | TEXT | notnull=1 | default='pending' | pk=0
--   total | REAL | notnull=1 | default=0 | pk=0
--   subtotal | REAL | notnull=1 | default=0 | pk=0
--   paymentFee | REAL | notnull=1 | default=0 | pk=0
--   currency | TEXT | notnull=1 | default='EUR' | pk=0
--   paymentMethod | TEXT | notnull=1 | default='' | pk=0
--   paymentTitle | TEXT | notnull=1 | default='' | pk=0
--   transactionId | TEXT | notnull=1 | default='' | pk=0
--   billingEmail | TEXT | notnull=1 | default='' | pk=0
--   billingPhone | TEXT | notnull=1 | default='' | pk=0
--   billingFirst | TEXT | notnull=1 | default='' | pk=0
--   billingLast | TEXT | notnull=1 | default='' | pk=0
--   billingStreet | TEXT | notnull=1 | default='' | pk=0
--   billingCity | TEXT | notnull=1 | default='' | pk=0
--   billingPostcode | TEXT | notnull=1 | default='' | pk=0
--   serviceData | TEXT | notnull=1 | default='{}' | pk=0
--   productName | TEXT | notnull=1 | default='' | pk=0
--   productId | INTEGER | notnull=0 | default=null | pk=0
--   customerId | TEXT | notnull=0 | default=null | pk=0
--   datePaid | DATETIME | notnull=0 | default=null | pk=0
--   dateCompleted | DATETIME | notnull=0 | default=null | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0
--   updatedAt | DATETIME | notnull=1 | default=null | pk=0
--   deletedAt | DATETIME | notnull=0 | default=null | pk=0
--   discountAmount | REAL | notnull=1 | default=0 | pk=0
--   couponCode | TEXT | notnull=1 | default='' | pk=0
--   completionEmailSent | INTEGER | notnull=1 | default=0 | pk=0

-- OrderDocument
--   id | TEXT | notnull=1 | default=null | pk=1
--   orderId | TEXT | notnull=1 | default=null | pk=0
--   fileName | TEXT | notnull=1 | default=null | pk=0
--   fileUrl | TEXT | notnull=1 | default=null | pk=0
--   fileSize | INTEGER | notnull=1 | default=0 | pk=0
--   token | TEXT | notnull=1 | default=null | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0

-- OrderItem
--   id | TEXT | notnull=1 | default=null | pk=1
--   orderId | TEXT | notnull=1 | default=null | pk=0
--   productName | TEXT | notnull=1 | default=null | pk=0
--   productId | INTEGER | notnull=0 | default=null | pk=0
--   quantity | INTEGER | notnull=1 | default=1 | pk=0
--   price | REAL | notnull=1 | default=0 | pk=0
--   total | REAL | notnull=1 | default=0 | pk=0

-- OrderMessage
--   id | TEXT | notnull=1 | default=null | pk=1
--   orderId | TEXT | notnull=1 | default=null | pk=0
--   message | TEXT | notnull=1 | default=null | pk=0
--   attachments | TEXT | notnull=1 | default='[]' | pk=0
--   sentBy | TEXT | notnull=1 | default='admin' | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0

-- OrderNote
--   id | TEXT | notnull=1 | default=null | pk=1
--   orderId | TEXT | notnull=1 | default=null | pk=0
--   note | TEXT | notnull=1 | default=null | pk=0
--   author | TEXT | notnull=1 | default='system' | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0

-- Page
--   id | TEXT | notnull=1 | default=null | pk=1
--   wpPageId | INTEGER | notnull=0 | default=null | pk=0
--   slug | TEXT | notnull=1 | default=null | pk=0
--   title | TEXT | notnull=1 | default=null | pk=0
--   content | TEXT | notnull=1 | default=null | pk=0
--   excerpt | TEXT | notnull=1 | default='' | pk=0
--   status | TEXT | notnull=1 | default='draft' | pk=0
--   author | TEXT | notnull=1 | default='iKFZ-Team' | pk=0
--   template | TEXT | notnull=1 | default='' | pk=0
--   parent | INTEGER | notnull=1 | default=0 | pk=0
--   menuOrder | INTEGER | notnull=1 | default=0 | pk=0
--   featuredImage | TEXT | notnull=1 | default='' | pk=0
--   metaTitle | TEXT | notnull=1 | default='' | pk=0
--   metaDescription | TEXT | notnull=1 | default='' | pk=0
--   focusKeywords | TEXT | notnull=1 | default='' | pk=0
--   seoScore | INTEGER | notnull=1 | default=0 | pk=0
--   canonical | TEXT | notnull=1 | default='' | pk=0
--   robots | TEXT | notnull=1 | default='index, follow' | pk=0
--   schemaType | TEXT | notnull=1 | default='' | pk=0
--   schemaData | TEXT | notnull=1 | default='' | pk=0
--   ogTitle | TEXT | notnull=1 | default='' | pk=0
--   ogDescription | TEXT | notnull=1 | default='' | pk=0
--   ogImage | TEXT | notnull=1 | default='' | pk=0
--   ogType | TEXT | notnull=1 | default='article' | pk=0
--   twitterTitle | TEXT | notnull=1 | default='' | pk=0
--   twitterDescription | TEXT | notnull=1 | default='' | pk=0
--   twitterImage | TEXT | notnull=1 | default='' | pk=0
--   twitterCard | TEXT | notnull=1 | default='summary_large_image' | pk=0
--   internalLinks | INTEGER | notnull=1 | default=0 | pk=0
--   externalLinks | INTEGER | notnull=1 | default=0 | pk=0
--   isFooterPage | BOOLEAN | notnull=1 | default=false | pk=0
--   pageType | TEXT | notnull=1 | default='page' | pk=0
--   publishedAt | DATETIME | notnull=0 | default=null | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0
--   updatedAt | DATETIME | notnull=1 | default=null | pk=0

-- Payment
--   id | TEXT | notnull=1 | default=null | pk=1
--   orderId | TEXT | notnull=1 | default=null | pk=0
--   gatewayId | TEXT | notnull=1 | default=null | pk=0
--   transactionId | TEXT | notnull=1 | default='' | pk=0
--   amount | REAL | notnull=1 | default=null | pk=0
--   currency | TEXT | notnull=1 | default='EUR' | pk=0
--   status | TEXT | notnull=1 | default='pending' | pk=0
--   method | TEXT | notnull=1 | default='' | pk=0
--   providerData | TEXT | notnull=1 | default='{}' | pk=0
--   paidAt | DATETIME | notnull=0 | default=null | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0
--   updatedAt | DATETIME | notnull=1 | default=null | pk=0

-- PaymentGateway
--   id | TEXT | notnull=1 | default=null | pk=1
--   gatewayId | TEXT | notnull=1 | default=null | pk=0
--   name | TEXT | notnull=1 | default=null | pk=0
--   description | TEXT | notnull=1 | default='' | pk=0
--   isEnabled | BOOLEAN | notnull=1 | default=false | pk=0
--   fee | REAL | notnull=1 | default=0 | pk=0
--   apiKey | TEXT | notnull=1 | default='' | pk=0
--   secretKey | TEXT | notnull=1 | default='' | pk=0
--   mode | TEXT | notnull=1 | default='live' | pk=0
--   icon | TEXT | notnull=1 | default='' | pk=0
--   sortOrder | INTEGER | notnull=1 | default=0 | pk=0
--   settings | TEXT | notnull=1 | default='{}' | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0
--   updatedAt | DATETIME | notnull=1 | default=null | pk=0

-- Product
--   id | TEXT | notnull=1 | default=null | pk=1
--   wpProductId | INTEGER | notnull=0 | default=null | pk=0
--   name | TEXT | notnull=1 | default=null | pk=0
--   slug | TEXT | notnull=1 | default=null | pk=0
--   description | TEXT | notnull=1 | default='' | pk=0
--   price | REAL | notnull=1 | default=0 | pk=0
--   isActive | BOOLEAN | notnull=1 | default=true | pk=0
--   serviceType | TEXT | notnull=1 | default='' | pk=0
--   options | TEXT | notnull=1 | default='[]' | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0
--   updatedAt | DATETIME | notnull=1 | default=null | pk=0
--   content | TEXT | notnull=1 | default='' | pk=0
--   heroTitle | TEXT | notnull=1 | default='' | pk=0
--   heroSubtitle | TEXT | notnull=1 | default='' | pk=0
--   featuredImage | TEXT | notnull=1 | default='' | pk=0
--   faqItems | TEXT | notnull=1 | default='[]' | pk=0
--   metaTitle | TEXT | notnull=1 | default='' | pk=0
--   metaDescription | TEXT | notnull=1 | default='' | pk=0
--   canonical | TEXT | notnull=1 | default='' | pk=0
--   robots | TEXT | notnull=1 | default='index, follow' | pk=0
--   ogTitle | TEXT | notnull=1 | default='' | pk=0
--   ogDescription | TEXT | notnull=1 | default='' | pk=0
--   ogImage | TEXT | notnull=1 | default='' | pk=0
--   formType | TEXT | notnull=1 | default='' | pk=0

-- Setting
--   id | TEXT | notnull=1 | default=null | pk=1
--   key | TEXT | notnull=1 | default=null | pk=0
--   value | TEXT | notnull=1 | default='' | pk=0
--   group | TEXT | notnull=1 | default='general' | pk=0

-- Tag
--   id | TEXT | notnull=1 | default=null | pk=1
--   wpTagId | INTEGER | notnull=0 | default=null | pk=0
--   name | TEXT | notnull=1 | default=null | pk=0
--   slug | TEXT | notnull=1 | default=null | pk=0
--   description | TEXT | notnull=1 | default='' | pk=0
--   count | INTEGER | notnull=1 | default=0 | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0
--   updatedAt | DATETIME | notnull=1 | default=null | pk=0

-- User
--   id | TEXT | notnull=1 | default=null | pk=1
--   email | TEXT | notnull=1 | default=null | pk=0
--   password | TEXT | notnull=1 | default=null | pk=0
--   name | TEXT | notnull=1 | default=null | pk=0
--   role | TEXT | notnull=1 | default='admin' | pk=0
--   createdAt | DATETIME | notnull=1 | default=CURRENT_TIMESTAMP | pk=0
--   updatedAt | DATETIME | notnull=1 | default=null | pk=0

