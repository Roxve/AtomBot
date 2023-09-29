export async function CreateProfile(db, id) {
		await db.add(id + ".money", 0);
		await db.add(id + ".bank", 0);
		return db
}
