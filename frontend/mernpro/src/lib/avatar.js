export function generateAvatarUrl(name = "User", seed = "") {
  const avatarSeed = encodeURIComponent(String(seed || name || "user").trim());
  return `https://api.dicebear.com/7.x/thumbs/png?seed=${avatarSeed}&size=256`;
}

export function getAvatarUrl(user) {
  if (!user) return generateAvatarUrl("User", "guest");

  const seed = user._id?.toString() || user.email || user.fullname;
  const pic = user.profilePic;

  if (pic && !pic.includes("iran.liara.run")) {
    return pic;
  }

  return generateAvatarUrl(user.fullname || "User", seed);
}
