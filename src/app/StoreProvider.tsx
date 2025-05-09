/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { RootSpinner } from "@/components/Spinner";
import { useGetProfileQuery } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hook";
import { persistor, store } from "@/redux/store";
import { TUniObject } from "@/type/index.type";
import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>{children}</AuthProvider>
      </PersistGate>
    </Provider>
  );
};

export default Providers;

const AuthProvider = ({ children }: ProvidersProps) => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetProfileQuery(undefined);
  // console.log({ data, isLoading, isError })
  useEffect(() => {
    const profile = { ...data?.data?.profile };
    const weekDays = profile?.weeklySchedules?.weekDays.map(
      (item: TUniObject) => item.dayName
    );
    const  userinfo = { ...data?.data };
    delete userinfo?.profile;
    delete profile.weeklySchedules;
    dispatch(
      setUser({
        user: {
          ...userinfo,
          ...profile,
          id: userinfo?.id,
          profileId: profile?.id,
          weekDays,
        },
      })
    );
  }, [data]);
  if (isLoading) {
    return <RootSpinner />;
  }
  // if (!data?.data?.id) {
  //   return 
  // }
  return children;
};
