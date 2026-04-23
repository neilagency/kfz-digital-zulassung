/**
 * Next.js Instrumentation — runs once on server startup.
 * Used to start the blog post scheduler (auto-publish scheduled posts).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startScheduler } = await import('./lib/scheduler');
    startScheduler();
  }
}
