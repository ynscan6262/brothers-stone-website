/* ===== FIREBASE CONFIG ===== */
const firebaseConfig = {
  apiKey: "AIzaSyCslS0x8HDi7ukeF4ix9dQ42DzpJXCes0w",
  authDomain: "marco-bbebe.firebaseapp.com",
  databaseURL: "https://marco-bbebe-default-rtdb.firebaseio.com",
  projectId: "marco-bbebe",
  storageBucket: "marco-bbebe.firebasestorage.app",
  messagingSenderId: "771883535999",
  appId: "1:771883535999:web:1dfd1bb8d3e7822005b94a"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

async function fbGet(key) {
  try {
    const snap = await db.ref(key).once('value');
    return snap.val();
  } catch (e) {
    console.error('fbGet error:', e);
    return null;
  }
}

async function fbSet(key, val) {
  try {
    await db.ref(key).set(val);
  } catch (e) {
    console.error('fbSet error:', e);
  }
}

async function fbRemove(key) {
  try {
    await db.ref(key).remove();
  } catch (e) {
    console.error('fbRemove error:', e);
  }
}
