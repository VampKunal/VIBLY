import { useEffect, useState } from "react";
import { generateAvatarUrl, getAvatarUrl } from "../lib/avatar";

const UserAvatar = ({ user, className = "", alt }) => {
  const fallback = generateAvatarUrl(user?.fullname || "User", user?._id || user?.email);
  const [src, setSrc] = useState(() => getAvatarUrl(user));

  useEffect(() => {
    setSrc(getAvatarUrl(user));
  }, [user?._id, user?.profilePic, user?.fullname]);

  return (
    <img
      src={src}
      alt={alt || user?.fullname || "User"}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setSrc(fallback)}
    />
  );
};

export default UserAvatar;
