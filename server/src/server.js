import app from './app.js'
import dotenv from 'dotenv'
import { scheduleOrderStatusUpdates } from './utils/orderStatusUpdater.js'

dotenv.config();

const port = process.env.PORT || 8000;

// Start the server
const server = app.listen(port, () => {
  console.log(`✅ Server running on ${port}`);
  
  // Start the automatic order status update scheduler
  // Updates will run every 2 minutes
  const updateInterval = 2; // minutes
  const scheduler = scheduleOrderStatusUpdates(updateInterval);
  
  // Store the scheduler in the app for potential cleanup
  app.set('orderStatusScheduler', scheduler);
  
  console.log(`🔄 Automatic order status updates scheduled every ${updateInterval} minutes`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  
  // Clear the scheduler interval
  const scheduler = app.get('orderStatusScheduler');
  if (scheduler) {
    clearInterval(scheduler);
    console.log('Order status scheduler stopped');
  }
  
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
