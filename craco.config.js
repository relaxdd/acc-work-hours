const path = require(`path`);

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@svg': path.resolve(__dirname, 'src/assets/svg'),
    },
  },
};