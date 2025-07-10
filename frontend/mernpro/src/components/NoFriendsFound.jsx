import { UsersIcon } from "lucide-react";

const NoFriendsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <UsersIcon className="size-16 text-base-content opacity-40 mb-4" />
      <h3 className="text-xl font-semibold mb-2">No Friends Yet</h3>
      <p className="text-base-content opacity-70 mb-4">
        Connect with people below to start building meaningful relationships!
      </p>
    </div>
  );
};

export default NoFriendsFound;