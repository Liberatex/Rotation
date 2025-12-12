// Environment configuration
// In production, use environment variables or expo-constants

const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000/api/v1',
    wsUrl: 'http://localhost:3000',
  },
  staging: {
    apiUrl: 'https://api-staging.rotation.app/api/v1',
    wsUrl: 'https://api-staging.rotation.app',
  },
  prod: {
    apiUrl: 'https://api.rotation.app/api/v1',
    wsUrl: 'https://api.rotation.app',
  },
};

const getEnvVars = () => {
  // In development, use dev environment
  // In production builds, this would check __DEV__ or environment variables
  if (__DEV__) {
    return ENV.dev;
  }
  // For now, default to dev. Configure based on your build process
  return ENV.dev;
};

export default getEnvVars();

