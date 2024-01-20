import admin from "@/pages/api/firebaseAdmin";

export async function readDataFromDb(nodePath) {
    try {
      const database = admin.database();
      const ref = database.ref(`urls/${nodePath}`);

      const snapshot = await ref.once('value');
      const data = snapshot.val();

      return data;
    } catch (error) {
      console.error('Error reading node data:', error.message);
      throw error;
    }
}

export async function updateDataOnDb(nodePath, newData) {
  try {
    const database = admin.database();
    const ref = database.ref(`urls/${nodePath}`);

    await ref.update(newData);

  } catch (error) {
    console.error('Error updating node:', error.message);
  }
}