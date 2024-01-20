import admin from 'firebase-admin';

const serviceAccount = require("../../config/serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://short-url-69298-default-rtdb.firebaseio.com',
  });
}

export default admin;