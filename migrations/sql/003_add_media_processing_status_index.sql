-- Add index on processingStatus for Media table query performance
CREATE INDEX IF NOT EXISTS "Media_processingStatus_idx" ON "Media"("processingStatus");
