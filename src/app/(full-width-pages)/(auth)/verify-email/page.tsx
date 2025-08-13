"use client";
import { Suspense } from "react";
import AuthRigthSidebar from "@/components/auth/AuthRigthSidebar";
import Image from "next/image";
import { useState, useEffect } from "react";
import Logo from "../../../../assets/logo/logo.png";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch, } from "@/lib/redux/hooks";
import { verifyAccount } from "@/lib/redux/slices/authSlice";
import { FaCircleCheck } from "react-icons/fa6";
import { LuLoaderCircle } from "react-icons/lu";
import { VscError } from "react-icons/vsc";
import Link from "next/link";

type Status = "loading" | "success" | "error";

function VerifyEmail() {

  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string>("");
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!token || !email) {
      setStatus("error");
      setError("Invalid verification link.");
      return;
    }
    handleVerifyAccount();
  }, []);

  const handleVerifyAccount = async () => {
    if (!token || !email) {
      setStatus("error");
      setError("Invalid verification link.");
      return;
    }
    setStatus("loading");
    const payload = {
      email,
      token,
    };
    try {
      const response = await dispatch(verifyAccount(payload)).unwrap();
      toast.success(response.msg||"Account verification successfull");
      setStatus("success");
    } catch (error: any) {
        console.log("error while verify account",error);
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message ||
            "Something went wrong while verifying account. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left side - Form */}

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center   px-3 sm:px-6  py-10 ">
        <div className="absolute top-8 left-1/2 md:left-8 transform -translate-x-1/2 md:translate-x-0 ">
          <Image src={Logo} alt="Logo" width={230} height={60} />
        </div>
        <div className="w-full mx-auto  mt-12 sm:mt-24  ">
          {status === "loading" ? (
            <div className="flex flex-col items-center px-6 py-16  border border-gray-200 rounded-xl shadow-md">
              <LuLoaderCircle className="text-primary text-6xl animate-spin mb-4" />
              <h2 className=" text-xl font-semibold mb-2">
                Verifying your account ...
              </h2>
              <p className="text-center text-base">
                Please wait while we verify your account.
                <br />
                This may take a few seconds.
              </p>
            </div>
          ) : status === "success" ? (
            <div className=" flex flex-col items-center px-6 py-16 border border-gray-200 rounded-xl shadow-md">
              <div className="relative flex items-center justify-center mb-6">
                {/* Ripple Effect */}
                <span className="absolute w-20 h-20 rounded-full bg-green-200 opacity-75 ripple"></span>
                <span
                  className="absolute w-20 h-20 rounded-full bg-green-200 opacity-50 ripple"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <FaCircleCheck className="relative z-10 text-6xl text-green-500" />
              </div>
              <h2 className="text-lg text-center font-semibold mb-6">
                Account Verified Successfully!
              </h2>
              <Link
                href="/signin"
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-all duration-500 cursor-pointer"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center px-6 py-16 border border-gray-200  rounded-xl shadow-md">
              <VscError className="text-6xl text-red-500 mb-6" />
              <h2 className="text-lg text-center font-semibold mb-2">
                Account Verification Failed !
              </h2>
              <p className="text-center text-red-500 mb-6">{error || ""}</p>
              <button
                onClick={handleVerifyAccount}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-all duration-500 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Hidden on small screens */}
      <div className="hidden md:block md:w-1/2 p-4">
        <AuthRigthSidebar />
      </div>
    </div>
  );
}


export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}