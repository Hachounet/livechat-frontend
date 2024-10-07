export const createGroupContent = (
  <>
    <h1 className="text-2xl text-pink-300 self-center">Create group</h1>
    <form
      // eslint-disable-next-line no-undef
      onSubmit={(e) => handleCreateGroupSubmit(e)}
      action=""
      className="flex gap-2 flex-col items-center pt-2"
    >
      <input
        name="groupname"
        type="text"
        placeholder="Group name"
        className="input input-bordered input-primary w-[90%] max-w-xs"
      />
      <select
        name="choice"
        className="select select-primary w-[90%] max-w-xs"
      >
        <option value={true}>Public group</option>
        <option value={false}>Private group</option>
      </select>
      <button
        type="submit"
        className="btn btn-success btn-outline"
      >
        Create group
      </button>
    </form>
  </>
);

export const settingsContent = (
  <>
    <h2 className="text-2xl">Group Settings</h2>
    {/* Contenu des paramètres du groupe */}
    <p>Modify your group settings here.</p>
  </>
);

export const othersGroupsSettingsContent = (
  <>
    <h2 className="text-2xl">Actions</h2>
  </>
);
