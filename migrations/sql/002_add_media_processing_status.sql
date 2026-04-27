-- Add processingStatus column to Media table for async pipeline tracking
ALTER TABLE "Media" ADD COLUMN "processingStatus" TEXT NOT NULL DEFAULT 'ready';
