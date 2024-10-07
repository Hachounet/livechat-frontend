export function modifyGroupsData(groups, memberships, currentUserId) {
  return groups.map((group) => {
    let isOwnedByUser = group.ownerId === currentUserId;
    let isMember = memberships.some(
      (membership) => membership.groupId === group.id
    );
    let canJoin = !isMember;

    if (isOwnedByUser) {
      canJoin = false;
      isMember = true;
    }

    return {
      ...group,
      isOwnedByUser: isOwnedByUser,
      isMember: isMember,
      canJoin: canJoin,
    };
  });
}
