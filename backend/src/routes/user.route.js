import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getRecommendedUsers, getMyFriends,sendFriendRequest, acceptFriendRequest, getFriendRequests,
     getOutgoingFriendRequests } from "../controller/user.controller.js";

const routes = express.Router();

routes.use(protectRoute);

routes.get("/",getRecommendedUsers);
routes.get("/friends",getMyFriends);
routes.post("/friend-request/:id",sendFriendRequest);
routes.put("/friend-request/:id/accept",acceptFriendRequest );
routes.get("/friend-request",getFriendRequests);
routes.get("/outgoing-friend-request",getOutgoingFriendRequests);

export default routes;