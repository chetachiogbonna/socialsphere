"use client";

import { useState, useRef } from "react";
import { Upload, Camera, ArrowRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { set } from "zod";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { uploadImage } from "@/lib/utils";
import { Id } from "../../convex/_generated/dataModel";
import useCurrentUserStore from "@/stores/useCurrentUserStore";
import { User } from "@/types";

interface OnboardingModalProps {
  isOpen: boolean;
  user: User
}

function OnboardingModal({
  isOpen,
  user,
}: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [profileImage, setProfileImage] = useState(null as File | null);
  const [coverPhoto, setCoverPhoto] = useState(null as File | null);
  const [bio, setBio] = useState(user.bio);
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const { currentUser } = useCurrentUserStore()

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)
  const getImageUrl = useMutation(api.storage.getImageUrl)
  const updateUser = useMutation(api.user.updateUser)

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPhoto(file);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setDirection("right")
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection("left");
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    if (step < 3) {
      setDirection("right")
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);

    if (!bio) return;

    try {
      const url = await generateUploadUrl();

      let profileImageId: null | string = null
      let coverPhotoId: null | string = null

      const uploadProfileImage = async () => {
        if (!profileImage) return;

        profileImageId = await uploadImage(url, profileImage)
        return await getImageUrl({ storageId: profileImageId as Id<"_storage"> })
      }

      const uploadCoverImage = async () => {
        if (!coverPhoto) return;

        coverPhotoId = await uploadImage(url, coverPhoto)
        return await getImageUrl({ storageId: coverPhotoId as Id<"_storage"> })
      }

      const [profilePicUrl, coverPhotoUrl] = await Promise.all([
        uploadProfileImage(),
        uploadCoverImage()
      ])

      await updateUser({
        clerk_userId: user.clerk_userId,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        profile_pic: profilePicUrl || user.profile_pic,
        profile_pic_id: profileImageId || undefined,
        cover_photo: coverPhotoUrl || undefined,
        cover_photo_id: coverPhotoId || undefined,
        bio: bio,
      })
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="max-w-2xl bg-gray-900 border-gray-700 text-white max-h-[90dvh] mt-6"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Complete Your Profile
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Let's set up your profile in just a few steps
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 my-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? "bg-blue-500" : "bg-gray-700"
                }`}
            />
          ))}
        </div>

        <div className="overflow-hidden">
          {step === 1 && (
            <div className={`space-y-6 text-center slide-from-${direction}`}>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Upload Your Profile Picture
                </h3>
                <p className="text-sm text-gray-400">
                  Choose a photo that represents you
                </p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="relative group">
                  <Image
                    src={profileImage ? URL.createObjectURL(profileImage) : user.profile_pic}
                    alt="Profile"
                    width={160}
                    height={160}
                    className="w-40 h-40 rounded-full object-cover border-4 border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => profileInputRef.current?.click()}
                    className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex flex-col items-center justify-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-white" />
                    <span className="text-sm text-white font-medium">
                      Change Photo
                    </span>
                  </button>
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => profileInputRef.current?.click()}
                  className="border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-300"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Photo
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={`space-y-6 text-center slide-from-${direction}`}>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Add a Cover Photo
                </h3>
                <p className="text-sm text-gray-400">
                  Make your profile stand out with a cover image
                </p>
              </div>

              <div className="relative h-48 bg-gray-800 rounded-lg overflow-hidden group">
                {coverPhoto ? (
                  <Image
                    src={URL.createObjectURL(coverPhoto || new Blob())}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Camera className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">No cover photo yet</p>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
                >
                  <Camera className="w-8 h-8 text-white" />
                  <span className="text-sm text-white font-medium">
                    {coverPhoto ? "Change Cover Photo" : "Upload Cover Photo"}
                  </span>
                </button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverPhotoChange}
                  className="hidden"
                />
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => coverInputRef.current?.click()}
                  className="border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-300"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {coverPhoto ? "Change Cover Photo" : "Upload Cover Photo"}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={`space-y-6 text-center slide-from-${direction}`}>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Tell Us About Yourself</h3>
                <p className="text-sm text-gray-400">
                  Write a short bio to introduce yourself
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-300">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={6}
                  maxLength={160}
                  placeholder="Tell people about yourself... What do you do? What are your interests?"
                  className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500 resize-none"
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">
                    {bio?.length}/160 characters
                  </p>
                  <p className="flex flex-col text-xs text-gray-500">
                    <span>You can always change this later</span>
                    <span>Must not be empty (Min length: 20)</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div>
            {step > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300"
              >
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {step < 3 && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300"
              >
                Skip
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleComplete}
                disabled={!bio || bio.length < 20 || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? "Completing..." : "Complete Profile"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OnboardingModal;