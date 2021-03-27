module.exports = {
	apps: [
	// add your other nodejs service here
    {
      name: 'blog api',
      script: './serve/dist/app.js',
      instances: 1,
      autorestart: true,
      watch: true,
      ignore_watch: ['node_modules', 'logs'],
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        REMOTE_ADDR: ''
      }
    }
  ]
};
