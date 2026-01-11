const crypto = require('crypto');

/**
 * Generate secure API keys for external admin access
 */
function generateApiKey(prefix = 'pk_live', length = 32) {
  const randomBytes = crypto.randomBytes(length);
  const apiKey = `${prefix}_${randomBytes.toString('hex')}`;
  return apiKey;
}

/**
 * Generate multiple API keys
 */
function generateMultipleKeys(count = 2, prefix = 'pk_live') {
  const keys = [];
  for (let i = 0; i < count; i++) {
    keys.push(generateApiKey(prefix));
  }
  return keys;
}

// Generate keys for different environments
console.log('=== Ofbyte Print API Key Generator ===\n');

console.log('Production API Keys:');
const prodKeys = generateMultipleKeys(2, 'pk_live_admin_2024');
prodKeys.forEach((key, index) => {
  console.log(`${index + 1}. ${key}`);
});

console.log('\nDevelopment API Keys:');
const devKeys = generateMultipleKeys(2, 'pk_test_admin_2024');
devKeys.forEach((key, index) => {
  console.log(`${index + 1}. ${key}`);
});

console.log('\n=== Environment Configuration ===');
console.log('Add these to your .env file:');
console.log(`API_KEYS=${prodKeys.join(',')}`);

console.log('\n=== Security Notes ===');
console.log('1. Store these keys securely');
console.log('2. Never commit them to version control');
console.log('3. Rotate keys regularly');
console.log('4. Use different keys for different environments');
console.log('5. Monitor API usage and access logs');

module.exports = {
  generateApiKey,
  generateMultipleKeys
};