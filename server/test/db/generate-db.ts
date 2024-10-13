import generateUsers from "./generate-users";
import generateFriends from "./generate-friends";
import generateFriendRequests from "./generate-friend-requests";

async function generateDatabase() {
  await generateUsers();
  await generateFriends();
  await generateFriendRequests();
}

export { generateDatabase };
