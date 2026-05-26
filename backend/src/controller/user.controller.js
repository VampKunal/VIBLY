import mongoose from "mongoose";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import { normalizeProfilePic, normalizeUsers } from "../lib/avatar.js";

function idsMatch(a, b) {
  return a?.toString() === b?.toString();
}

function areFriends(friendsList, userId) {
  return friendsList?.some((id) => idsMatch(id, userId)) ?? false;
}

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const pendingRequests = await FriendRequest.find({
      status: "pending",
      $or: [{ sender: currentUserId }, { recipient: currentUserId }],
    }).select("sender recipient");

    const pendingUserIds = pendingRequests.flatMap((r) => [
      r.sender.toString(),
      r.recipient.toString(),
    ]);

    const excludeIds = [
      currentUserId.toString(),
      ...currentUser.friends.map((id) => id.toString()),
      ...pendingUserIds,
    ];

    const recommendedUsers = await User.find({
      _id: { $nin: excludeIds },
      fullname: { $exists: true, $ne: "" },
    })
      .select("-password")
      .sort({ isOnboarded: -1, createdAt: -1 });

    res.status(200).json(normalizeUsers(recommendedUsers));
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate("friends", "fullname profilePic nativeLanguage learningLanguage");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(normalizeUsers(user.friends || []));
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user._id;
    const { id: recipientId } = req.params;

    if (idsMatch(myId, recipientId)) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself." });
    }

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found." });
    }

    const sender = await User.findById(myId).select("friends");
    if (areFriends(sender.friends, recipientId) || areFriends(recipient.friends, myId)) {
      return res.status(400).json({ message: "You are already friends with this user." });
    }

    const existingRequest = await FriendRequest.findOne({
      status: "pending",
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      if (idsMatch(existingRequest.sender, recipientId)) {
        return res.status(400).json({
          message: "This user already sent you a friend request. Check your notifications.",
        });
      }
      return res.status(400).json({ message: "Friend request already sent." });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    await friendRequest.populate("recipient", "fullname profilePic nativeLanguage learningLanguage");

    res.status(201).json({
      message: "Friend request sent successfully.",
      friendRequest,
    });
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    if (!idsMatch(friendRequest.recipient, req.user._id)) {
      return res.status(403).json({ message: "You are not authorized to accept this friend request." });
    }

    if (friendRequest.status === "accepted") {
      return res.status(400).json({ message: "Friend request already accepted." });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    await friendRequest.populate("sender", "fullname profilePic");

    res.status(200).json({
      message: "Friend request accepted successfully.",
      friendRequest,
    });
  } catch (error) {
    console.error("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const userId = req.user._id;

    const incomingRequests = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "fullname profilePic nativeLanguage learningLanguage");

    const acceptedRequests = await FriendRequest.find({
      status: "accepted",
      $or: [{ recipient: userId }, { sender: userId }],
    })
      .sort({ updatedAt: -1 })
      .limit(20)
      .populate("sender", "fullname profilePic")
      .populate("recipient", "fullname profilePic");

    res.status(200).json({
      incomingRequests: incomingRequests.map((r) => ({
        ...r.toObject(),
        sender: normalizeProfilePic(r.sender),
      })),
      acceptedRequests: acceptedRequests.map((r) => ({
        ...r.toObject(),
        sender: normalizeProfilePic(r.sender),
        recipient: normalizeProfilePic(r.recipient),
      })),
    });
  } catch (error) {
    console.error("Error in getFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendRequests(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate("recipient", "fullname profilePic nativeLanguage learningLanguage");

    res.status(200).json(
      outgoingRequests.map((r) => ({
        ...r.toObject(),
        recipient: normalizeProfilePic(r.recipient),
      }))
    );
  } catch (error) {
    console.error("Error in getOutgoingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
