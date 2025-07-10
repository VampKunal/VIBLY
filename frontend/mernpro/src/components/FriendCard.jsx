import { Link } from "react-router";
import { getLanguageFlag } from "../constant/getLanguageFlag";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullname} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullname}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage) && (
              <img
                src={getLanguageFlag(friend.nativeLanguage)}
                alt={`${friend.nativeLanguage} flag`}
                className="h-3 mr-1 inline-block"
              />
            )}
            Speaks: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage) && (
              <img
                src={getLanguageFlag(friend.learningLanguage)}
                alt={`${friend.learningLanguage} flag`}
                className="h-3 mr-1 inline-block"
              />
            )}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;