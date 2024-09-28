export function modifyUsersData(users, requests, currentUserId) {
  return users.map((user) => {
    const isFriend = user.friends.includes(currentUserId);
    const requestSent = requests.some(
      (request) =>
        request.senderId === currentUserId && request.receiverId === user.id
    );
    const requestReceived = requests.some(
      (request) =>
        request.senderId === user.id && request.receiverId === currentUserId
    );

    return {
      ...user,
      userFriend: isFriend,
      userAlreadySendRequest: requestSent,
      userRequestPending: requestReceived,
    };
  });
}

export function filterPendingFriendRequests(data) {
  if (!data.success) {
    return null;
  }

  const userId = data.userId;
  const pendingRequests = data.friendsRequests.filter((request) => {
    return request.receiverId === userId && request.status === 'PENDING';
  });

  return {
    success: true,
    userId,
    friendsRequests: pendingRequests,
  };
}

export function filterNowAcceptedFriendRequest(data, userId) {
  const friendId = userId;
  if (!data.success) {
    return null;
  }

  const currentUserId = data.userId;

  const updatedRequests = data.friendsRequests.map((request) => {
    if (
      request.senderId === friendId &&
      request.receiverId === currentUserId &&
      request.status === 'PENDING'
    ) {
      return {
        ...request,
        status: 'ACCEPTED',
      };
    }
    return request;
  });

  return {
    ...data,
    friendsRequests: updatedRequests,
  };
}

export function filterNowDenyedFriendRequest(data, userId) {
  const friendId = userId;
  if (!data.success) {
    return null;
  }

  const currentUserId = data.userId;

  const updatedRequests = data.friendsRequests.map((request) => {
    if (
      request.senderId === friendId &&
      request.receiverId === currentUserId &&
      request.status === 'PENDING'
    ) {
      return {
        ...request,
        status: 'REJECTED',
      };
    }
    return request;
  });

  return {
    ...data,
    friendsRequests: updatedRequests,
  };
}
