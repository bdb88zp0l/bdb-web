/**
 * The ProfileProvider component is a React context provider that manages the user's profile data. It fetches the user's profile information from the server and stores it in the component's state, as well as in the Redux store. The ProfileContext provides the profile data and a fetchProfile function to its consumers.
 *
 * @param {object} props - The props passed to the ProfileProvider component.
 * @param {React.ReactNode} props.children - The child components that will consume the ProfileContext.
 * @returns {React.ReactElement} - The ProfileProvider component.
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userPrivateRequest } from "@/config/axios.config";
import { setUser, loginFailure } from "@/shared/redux/store/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";

// Define the shape of the context
interface ProfileContextType {
  profile: any; // Replace `any` with a more specific type based on your profile structure
  fetchProfile: any;
}

// Create the ProfileContext with a default value of `null`
export const ProfileContext = createContext<ProfileContextType | null>(null);

// ProfileProvider component
export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const auth = useSelector((state: any) => state.auth);
  const [profile, setProfile] = useState<any>(null);
  // Redux hooks for dispatching actions and accessing state
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const publicUrls = ["/", "/authentication/sign-in/signin-cover/"];
  const fetchProfile = async () => {
    try {
      const response = await userPrivateRequest.get("/api/profile/info", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setProfile(response.data?.data ?? {}); // Set the profile data in state

      // Save the user profile data to Redux store
      dispatch(setUser(response.data?.data ?? {}));
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      dispatch(loginFailure({ token: null, user: null }));
      localStorage.removeItem("token");
      if (publicUrls.indexOf(pathname) === -1) {
        router.push("/");
      }
    }
  };
  useEffect(() => {
    if (auth.token) {
      // Fetch user profile if authenticated

      fetchProfile();
    } else if (!auth.token && publicUrls.indexOf(pathname) === -1) {
      router.push("/");
    }
  }, [auth.token]);

  return (
    <ProfileContext.Provider value={{ profile, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use the ProfileContext
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === null) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
