/**
 * By convention, we list the migrations in a version file where the migration was introduced.
 *
 * This convention is a 0 padded migration number (in this case 0001), followed by the game version.
 *
 * Note that this convention is loosely enforced -- we'll throw an error if you attempt to save a
 * migration from an earlier version.
 */
Versions.register(1, (originalVersion, state) => {
	// IMPORTANT: WHEN WE DO MIGRATION, DO NOT USE SUGARCUBE
	// sugarcube maybe in an invalid state when this happens and/or
	// your script might not behave as you intend

	// This is a double edge sword. It means that we can always
	// expect migrations to be done before any sugarcube executes
	// *but* that means all migrations should be done as pure javascript

	// In addition, this should be before any other complex logic.
	// This means that classes stored in state will not be revived at this point
	// (any class solution should keep that in mind)

	// This migration is a good template. It serves as a marker for the baseline
	// version. It will (most likely) never be executed, as the baseline migration
	// will happen in sugarcube (unlike the other migrations)
	return Versions.stepper(originalVersion, 1).step(
		() => {
			// this is a no-op step
		},
		{ name: "placeholder" }
	).shouldContinue;
});
