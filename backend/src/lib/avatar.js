/** Reliable avatar URLs (DiceBear). Replaces fragile third-party PNG hosts. */
export function generateAvatarUrl(name = "User", seed = "") {
  const avatarSeed = encodeURIComponent(String(seed || name || "user").trim());
  return `https://api.dicebear.com/7.x/thumbs/png?seed=${avatarSeed}&size=256`;
}

export function normalizeProfilePic(user) {
  const plain = user?.toObject ? user.toObject() : { ...user };
  const brokenOrMissing =
    !plain.profilePic || plain.profilePic.includes("iran.liara.run");

  if (brokenOrMissing) {
    plain.profilePic = generateAvatarUrl(
      plain.fullname,
      plain._id?.toString() || plain.email
    );
  }

  delete plain.password;
  return plain;
}

export function normalizeUsers(users) {
  return users.map((u) => normalizeProfilePic(u));
}
