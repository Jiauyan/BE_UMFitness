// Only configure dotenv if not in production
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
  
  require('./src/server');
