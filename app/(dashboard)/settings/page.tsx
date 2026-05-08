"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import SettingsTabs from "./components/SettingsTabs";
import SchoolProfile, { type SchoolProfileSavePayload } from "./components/SchoolProfile";
import UserProfile, { type UserProfileFormData } from "./components/UserProfile";
import SubscriptionDetail from "./components/SubscriptionDetail";
import Notifications from "./components/Notifications";
import ChangePassword from "./components/ChangePassword";
import Skeleton from "@/components/ui/Skeleton";
import {
  settingsTabs,
  initialSchoolProfile,
  currentPlanDetails,
  mapUserMeSubscriptionToSubscriptionDetail,
  initialNotificationSettings,
  mergeNotificationSettingsFromMySchool,
  type PasswordChangeData,
  type SubscriptionDetail as SubscriptionDetailModel,
} from "./data";
import {
  getMySchoolApi,
  updateMySchoolApi,
  updateReceiveReviewActivitySettingsApi,
  type MySchoolData,
} from "@/lib/api/myshool.api";
import { changePasswordApi, getUserMeSubscriptionApi } from "@/lib/api/account.api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateUser } from "@/redux/slices/auth.slice";
import type { SchoolDetails } from "@/redux/slices/auth.slice";
import {
  getUserProfileApi,
  updateUserProfileApi,
  type UserProfileData,
} from "@/lib/api/user.api";

function mySchoolToSchoolDetails(data: MySchoolData): SchoolDetails {
  const profile =
    data.profileImage?.trim() ||
    (Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery[0] : null);
  return {
    name: data.name,
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
    location: data.location ?? "",
    profileImage: profile,
  };
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s) => s.auth?.user ?? null);

  const [activeTab, setActiveTab] = useState(settingsTabs[0].id);
  const [openManagePlan, setOpenManagePlan] = useState(false);
  const [mySchool, setMySchool] = useState<MySchoolData | null>(null);
  const [schoolProfileLoading, setSchoolProfileLoading] = useState(true);
  const [subscriptionDetailData, setSubscriptionDetailData] = useState<SubscriptionDetailModel | null>(
    null
  );
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [userProfileLoading, setUserProfileLoading] = useState(true);

  const isNetworkError = (err: unknown): boolean => {
    if (!(err instanceof Error)) return false;
    const msg = err.message.toLowerCase();
    return msg.includes("network error") || msg.includes("failed to fetch");
  };

  const loadMySchool = useCallback(async () => {
    setSchoolProfileLoading(true);
    try {
      const data = await getMySchoolApi();
      setMySchool(data);
    } catch (err) {
      if (!isNetworkError(err)) {
        toast.error(err instanceof Error ? err.message : "Failed to load school profile.");
      }
      setMySchool(null);
    } finally {
      setSchoolProfileLoading(false);
    }
  }, []);

  const loadSubscription = useCallback(async () => {
    setSubscriptionLoading(true);
    try {
      const api = await getUserMeSubscriptionApi();
      setSubscriptionDetailData(
        mapUserMeSubscriptionToSubscriptionDetail(api, currentPlanDetails.toolkitFeatures)
      );
    } catch (err) {
      if (!isNetworkError(err)) {
        toast.error(err instanceof Error ? err.message : "Failed to load subscription.");
      }
      setSubscriptionDetailData(null);
    } finally {
      setSubscriptionLoading(false);
    }
  }, []);

  const loadUserProfile = useCallback(async () => {
    setUserProfileLoading(true);
    try {
      const data = await getUserProfileApi();
      setUserProfile(data);
      dispatch(
        updateUser({
          name: data.name,
          email: data.email,
          profileImage: data.profileImage ?? "",
        })
      );
    } catch (err) {
      if (!isNetworkError(err)) {
        toast.error(err instanceof Error ? err.message : "Failed to load user profile.");
      }
      setUserProfile(null);
    } finally {
      setUserProfileLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadMySchool();
  }, [loadMySchool]);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const schoolProfileFormData = useMemo(() => {
    if (!mySchool) return initialSchoolProfile;
    return {
      schoolName: mySchool.name,
      currentPassword: "",
      imageUrl: mySchool.profileImage,
    };
  }, [mySchool]);

  const userProfileFormData = useMemo<UserProfileFormData | null>(() => {
    if (!userProfile && !authUser) return null;
    return {
      profileImage: userProfile?.profileImage ?? authUser?.profileImage ?? null,
      name: userProfile?.name ?? authUser?.name ?? "",
      email: userProfile?.email ?? authUser?.email ?? "",
      phone: userProfile?.phone ?? "",
      location: userProfile?.location ?? "",
    };
  }, [userProfile, authUser]);

  const notificationSettingsData = useMemo(
    () =>
      mySchool
        ? mergeNotificationSettingsFromMySchool(initialNotificationSettings, mySchool)
        : initialNotificationSettings,
    [mySchool]
  );

  const handleSaveSchoolProfile = async (payload: SchoolProfileSavePayload) => {
    if (!mySchool) {
      toast.error("School data is not loaded yet.");
      return;
    }
    const name = payload.schoolName.trim();
    if (!name) {
      toast.error("School name is required.");
      return;
    }

    try {
      const updated = await updateMySchoolApi(
        {
          name,
          type: mySchool.type,
          country: mySchool.country,
          state: mySchool.state,
          city: mySchool.city,
          foundedYear: mySchool.foundedYear,
          principalName: mySchool.principalName,
          bio: mySchool.bio,
          websiteUrl: mySchool.websiteUrl,
          profileImage: payload.profileImageFile ?? undefined,
        },
        mySchool
      );
      setMySchool(updated);

      if (authUser) {
        dispatch(
          updateUser({
            schoolDetails: mySchoolToSchoolDetails(updated),
          })
        );
      }

      toast.success("School profile updated successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update school profile.");
      throw err;
    }
  };

  const handleReviewSubmissionActivityChange = useCallback(
    async (enabled: boolean) => {
      try {
        const result = await updateReceiveReviewActivitySettingsApi(enabled);
        setMySchool((prev) =>
          prev
            ? { ...prev, receiveReviewSubmissionActivity: result.receiveReviewSubmissionActivity }
            : null
        );
        toast.success(result.message);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to update review notifications."
        );
        throw err;
      }
    },
    []
  );

  const handleFollowActivitySaved = useCallback((receiveFollowActivity: boolean) => {
    setMySchool((prev) => (prev ? { ...prev, receiveFollowActivity } : null));
  }, []);

  const handleChangePassword = async (data: PasswordChangeData) => {
    await changePasswordApi({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  const handleSaveUserProfile = useCallback(
    async (payload: {
      name: string;
      email: string;
      phone: string;
      location: string;
      profileImageFile?: File | null;
    }) => {
      try {
        const updated = await updateUserProfileApi({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          location: payload.location,
          profileImage: payload.profileImageFile ?? null,
        });
        setUserProfile(updated);
        dispatch(
          updateUser({
            name: updated.name,
            email: updated.email,
            profileImage: updated.profileImage ?? "",
          })
        );
        toast.success("User profile updated successfully.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update user profile.");
        throw err;
      }
    },
    [dispatch]
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "user-profile":
        if (userProfileLoading) {
          return (
            <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-6 text-sm text-custom-gray/80">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-40 rounded-md" />
              </div>
              <div className="mt-4 space-y-3">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          );
        }
        if (!userProfileFormData) {
          return (
            <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-6 text-sm text-custom-gray/80">
              Could not load user profile.{" "}
              <button
                type="button"
                className="text-custom-teal font-medium underline"
                onClick={() => loadUserProfile()}
              >
                Retry
              </button>
            </div>
          );
        }
        return <UserProfile data={userProfileFormData} onSave={handleSaveUserProfile} />;
      case "school-profile":
        if (schoolProfileLoading) {
          return (
            <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-6 text-sm text-custom-gray/80">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-40 rounded-md" />
              </div>
              <div className="mt-4 space-y-3">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-2/3 rounded-lg" />
              </div>
            </div>
          );
        }
        if (!mySchool) {
          return (
            <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-6 text-sm text-custom-gray/80">
              Could not load school profile.{" "}
              <button
                type="button"
                className="text-custom-teal font-medium underline"
                onClick={() => loadMySchool()}
              >
                Retry
              </button>
            </div>
          );
        }
        return (
          <SchoolProfile
            data={schoolProfileFormData}
            onSave={handleSaveSchoolProfile}
          />
        );
      case "subscription-detail":
        if (subscriptionLoading) {
          return (
            <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-6 text-sm text-custom-gray/80">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
              <div className="mt-4 space-y-3">
                <Skeleton className="h-6 w-1/2 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          );
        }
        if (!subscriptionDetailData) {
          return (
            <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-6 text-sm text-custom-gray/80">
              Could not load subscription.{" "}
              <button
                type="button"
                className="text-custom-teal font-medium underline"
                onClick={() => loadSubscription()}
              >
                Retry
              </button>
            </div>
          );
        }
        return (
          <SubscriptionDetail
            data={subscriptionDetailData}
            openManagePlan={openManagePlan}
            onManagePlanOpened={() => setOpenManagePlan(false)}
          />
        );
      case "notifications":
        if (schoolProfileLoading) {
          return (
            <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-6 text-sm text-custom-gray/80">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-56 rounded-md" />
              </div>
              <div className="mt-4 space-y-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          );
        }
        if (!mySchool) {
          return (
            <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-6 text-sm text-custom-gray/80">
              Could not load school settings.{" "}
              <button
                type="button"
                className="text-custom-teal font-medium underline"
                onClick={() => loadMySchool()}
              >
                Retry
              </button>
            </div>
          );
        }
        return (
          <Notifications
            data={notificationSettingsData}
            onReviewSubmissionActivityChange={handleReviewSubmissionActivityChange}
            onFollowActivitySaved={handleFollowActivitySaved}
            onNavigateToManagePlan={() => {
              setActiveTab("subscription-detail");
              setOpenManagePlan(true);
            }}
          />
        );
      case "change-password":
        return <ChangePassword onSave={handleChangePassword} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#4A4A4A] mb-2">
            Settings
          </h1>
        </div>

        {/* Main Content with Tabs */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Left Sidebar - Tabs */}
          <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Right Content Area */}
          <div className="flex-1 w-full">{renderActiveTab()}</div>
        </div>
      </div>
    </div>
  );
}
