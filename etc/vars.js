 
	export async function getButtons(db) {
		if(!(await db.get("vars.buttons"))) {
			db.set("vars.buttons", 0);
			return 0;
	}

		return await db.get("vars.buttons");
	}
	export async function addButton(db) {
		await db.add("vars.buttons", 1);
	}
