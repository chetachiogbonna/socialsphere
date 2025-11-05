"use client";

import { useState, useRef, useMemo } from "react";
import { Upload, Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { uploadImage } from "@/lib/utils";
import { Id } from "../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    firstName: string;
    lastName: string;
    username: string;
    profilePic: string;
    coverPhoto: string | undefined;
    bio: string | undefined;
    clerk_userId: string,
    email: string,
    profilePicId: string | undefined,
    coverPhotoId: string | undefined
  }
}

function EditProfileModal({
  isOpen,
  onClose,
  user
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    username: user.username || "",
    bio: user.bio || ""
  });

  const [profilePic, setProfilePic] = useState(null as File | null);
  const [coverPhoto, setCoverPhoto] = useState(null as File | null);
  const [isLoading, setIsLoading] = useState(false);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter()

  const valuesHavntChange = useMemo(() => {
    return Object.entries({ ...formData, profilePic, coverPhoto }).every(([name, value]) => {
      return user[name as keyof typeof user] === value ? true : (value === "" || value === null) ? true : false

    })
  }, [formData, profilePic, coverPhoto, user])

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)
  const getImageUrl = useMutation(api.storage.getImageUrl)
  const updateUser = useMutation(api.user.updateUser)
  // const deleteImage = useMutation(api.storage.deleteById)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleprofilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
    }
  };

  const handlecoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPhoto(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);

    try {
      // await Promise.all([
      //   (async () => {
      //     if (user.profilePicId) {
      //       await deleteImage({ imageId: user.profilePicId as Id<"_storage"> })
      //     }
      //   })(),
      //   (async () => {
      //     if (user.coverPhotoId) {
      //       await deleteImage({ imageId: user.coverPhotoId as Id<"_storage"> })
      //     }
      //   })()
      // ]);

      const url = await generateUploadUrl();

      let profilePicId: null | string = null
      let coverPhotoId: null | string = null

      const uploadProfilePic = async () => {
        if (!profilePic) return;

        profilePicId = await uploadImage(url, profilePic)
        return await getImageUrl({ storageId: profilePicId as Id<"_storage"> })
      }

      const uploadCoverPhoto = async () => {
        if (!coverPhoto) return;

        coverPhotoId = await uploadImage(url, coverPhoto)
        return await getImageUrl({ storageId: coverPhotoId as Id<"_storage"> })
      }

      const [profilePicUrl, coverPhotoUrl] = await Promise.all([
        uploadProfilePic(),
        uploadCoverPhoto()
      ]);

      await updateUser({
        clerk_userId: user.clerk_userId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        email: user.email,
        profile_pic: profilePicUrl || user.profilePic,
        profile_pic_id: profilePicId || undefined,
        cover_photo: coverPhotoUrl || undefined,
        cover_photo_id: coverPhotoId || undefined,
        bio: formData.bio,
      })

      onClose();
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occured. Please try again."
      );

      console.error("Error completing onboarding:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700 text-white"
        showCloseButton={!isLoading}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="cover-photo">Cover Photo</Label>
            <div className="relative h-40 bg-gray-800 rounded-lg overflow-hidden group">
              {coverPhoto || user.coverPhoto ? (
                <img
                  src={coverPhoto ? URL.createObjectURL(coverPhoto) : user.coverPhoto}
                  alt="Cover"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-800" />
              )}
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <div className="flex items-center gap-2 text-white">
                  <Camera className="w-5 h-5" />
                  <span className="text-sm font-medium">Change Cover</span>
                </div>
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handlecoverPhotoChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-picture">Profile Picture</Label>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <img
                  src={profilePic ? URL.createObjectURL(profilePic) : user.profilePic}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-800"
                />
                <button
                  type="button"
                  onClick={() => profileInputRef.current?.click()}
                  className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center"
                >
                  <Upload className="w-5 h-5 text-white" />
                </button>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleprofilePicChange}
                  className="hidden"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => profileInputRef.current?.click()}
                className="border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-300"
              >
                Change Photo
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="@username"
              className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              maxLength={160}
              placeholder="Tell us about yourself"
              className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-400">
              {formData.bio.length}/160 characters
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveProfile}
              disabled={isLoading || valuesHavntChange}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditProfileModal