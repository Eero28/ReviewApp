module.exports = {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env', // The module name you'll import from
          path: '.env',        // Path to the .env file
        },
      ],
    ],
  };
  