import profileModel from "../models/profile.model.js";
import userModel from "../models/user.model.js";
import { uploadFile, deleteFile } from "../services/storage.service.js"

export const uploadProfile = async (req, res) => {
  const { name, address, mobile } = req.body;
  const bannerFile = req.files.banner?.[0];
  const avatarFile = req.files.avatar?.[0];
  const userId = req.user._id;

  try {
    if (!name || !address || !mobile) {
      return res.status(400).json({
        message: "fill the form",
        success: false
      });
    }

    if (!bannerFile || !avatarFile) {
      return res.status(400).json({
        message: "banner and avatar required",
        success: false
      });
    }

    const existing = await profileModel.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({
        message: "profile already exists",
        success: false
      });
    }

    const banner = await uploadFile(bannerFile, `zomato/${userId}/profile/banner`);
    const avatar = await uploadFile(avatarFile, `zomato/${userId}/profile/avatar`);

    const profile = await profileModel.create({
      user: userId,
      banner: banner.secure_url,
      bannerPublic: banner.public_id,
      avatar: avatar.secure_url,
      avatarPublic: avatar.public_id,
      name,
      address,
      mobile,
      email: req.user.email
    });

    return res.status(200).json({
      message: "profile uploaded successfully",
      success: true,
      profile
    });

  } catch (error) {
    console.log("error in upload profile : ", error);
    return res.status(500).json({
      message: "error in upload profile",
      success: false,
      error: error.message
    });
  }
};

export const getProfile = async (req, res) => {
  const userId = req.user._id;

  try {
    const profile = await profileModel.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({
        message: "profile not found",
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      profile
    });

  } catch (error) {
    console.log("error in get profile:", error);
    return res.status(500).json({
      success: false,
      message: "error fetching profile",
      error: error.message
    });
  }
};


export const updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { name, address, mobile } = req.body;

  const bannerFile = req.files?.banner?.[0];
  const avatarFile = req.files?.avatar?.[0];

  try {
    const profile = await profileModel.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({
        message: "profile not found",
        success: false
      });
    }

    if (name) profile.name = name;
    if (address) profile.address = address;
    if (mobile) profile.mobile = mobile;

    if (bannerFile) {

      if (profile.bannerPublic) {
        await deleteFile(profile.bannerPublic);
      }

      const banner = await uploadFile(
        bannerFile,
        `zomato/${userId}/profile/banner`
      );

      profile.banner = banner.secure_url;
      profile.bannerPublic = banner.public_id;
    }
    if (avatarFile) {
      if (profile.avatarPublic) {
        await deleteFile(profile.avatarPublic);
      }

      const avatar = await uploadFile(
        avatarFile,
        `zomato/${userId}/profile/avatar`
      );

      profile.avatar = avatar.secure_url;
      profile.avatarPublic = avatar.public_id;
    }

    await profile.save();

    return res.status(200).json({
      message: "profile updated successfully",
      success: true,
      profile
    });

  } catch (error) {
    console.log("error in update profile:", error);
    return res.status(500).json({
      message: "error updating profile",
      success: false,
      error: error.message
    });
  }
};