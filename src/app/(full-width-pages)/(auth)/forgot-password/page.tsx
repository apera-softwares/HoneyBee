"use client";
import AuthRigthSidebar from "@/components/AuthRigthSidebar";
import {
  INPUT_CLASS,
  INPUT_REQUIRED_ERROR_CLASS,
} from "@/constant/constantClassName";
import Image from "next/image";
import { useState, useEffect } from "react";
import Logo from "../../../../assets/logo/logo.png";
import { useRouter } from "next/navigation";
import { IoArrowBackOutline } from "react-icons/io5";
// import Loader from "@/components/ui/loader/Loader";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { sendOtp, resetPassword } from "@/lib/redux/slices/authSlice";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPassword() {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const router = useRouter();
  const loggedInUser = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (loggedInUser) {
      router.replace("/");
    }
  }, [loggedInUser]);

  // if (loggedInUser) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFormData()) return;

    const payload = {
      email: formData.email,
    };
    setLoading(true);
    try {
      await dispatch(sendOtp(payload)).unwrap();
      toast.success("OTP sent to your email.");
      setStep(1);
    } catch (error: any) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Failed to send otp. Please try again";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateResetPasswordFormData()) return;

    const payload = {
      otp: formData.otp,
      email: formData.email,
      password: formData.password,
    };
    setLoading(true);

    try {
      await dispatch(resetPassword(payload)).unwrap();
      toast.success(
        "Password reset successfully, wait you will be redirect to login page"
      );
      handleClearData();
      router.push("/signin");
    } catch (error: any) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Failed to reset password. Please try again";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateFormData = () => {
    let isValidData = true;
    const tempErrors = { ...errors };

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (formData.email.trim() === "") {
      tempErrors.email = "Email is required";
      isValidData = false;
    } else if (!emailRegex?.test(formData.email)) {
      tempErrors.email = "Please enter a valid email";
      isValidData = false;
    } else {
      tempErrors.email = "";
    }

    setErrors(tempErrors);
    return isValidData;
  };

  const validateResetPasswordFormData = () => {
    let isValidData = true;
    const tempErrors = { ...errors };

    if (formData.otp.trim() === "") {
      tempErrors.otp = "OTP is required";
      isValidData = false;
    } else if (formData.otp.trim().length !== 4) {
      tempErrors.otp = "Please enter valid otp";
      isValidData = false;
    } else {
      tempErrors.otp = "";
    }

    //validate password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (formData.password.trim() === "") {
      tempErrors.password = "Password is required";
      isValidData = false;
    } else if (!passwordRegex.test(formData.password)) {
      tempErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
      isValidData = false;
    } else {
      tempErrors.password = "";
    }

    if (formData.confirmPassword.trim() === "") {
      tempErrors.confirmPassword = "Confirm password is required";
      isValidData = false;
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword =
        " Password and confirm password must be the same";
      isValidData = false;
    } else {
      tempErrors.confirmPassword = "";
    }

    setErrors(tempErrors);
    return isValidData;
  };

  const handleClearData = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
    });

    setErrors({
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
    });
  };


  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Toaster />
      {/* Left side - Form */}

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center   px-3 sm:px-6  py-10">
        <div className="absolute top-8 left-1/2 md:left-8 transform -translate-x-1/2 md:translate-x-0 ">
          <Image src={Logo} alt="Logo" width={230} height={60} />
        </div>

        {step === 0 ? (
          <div className="w-full max-w-[482px] mx-auto  mt-12 sm:mt-24">
            <h2 className="text-center md:text-start text-2xl md:text-3xl font-bold text-slate-800 mb-4">
              Forgot password?
            </h2>
            <p className="text-center md:text-start text-base sm:text-lg text-slate-800 mb-8">
              Enter the email associated with your Honeybee Harry{"'"}s club
              account, and we’ll send you a password reset link.{" "}
            </p>
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Your Email"
                  className={`${INPUT_CLASS}`}
                />
                <span className={`${INPUT_REQUIRED_ERROR_CLASS}`}>
                  {errors.email || ""}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex justify-center items-center w-full h-14 text-white bg-gradient-to-r from-gradient-start to-gradient-end rounded-full shadow-lg font-bold hover:cursor-pointer"
              >
                Send OTP
              </button>
            </form>

            <div
              className="mt-6 text-center flex justify-center items-center cursor-pointer"
              onClick={() => router.push("/signin")}
            >
              <IoArrowBackOutline />
              <span className="text-black text-sm font-medium ml-2">
                {" "}
                Back to log in{" "}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[482px] mx-auto  mt-12 sm:mt-24">
            <h2 className="text-center md:text-start text-2xl md:text-3xl font-bold text-slate-800 mb-4">
              Reset Password
            </h2>
            <p className="text-center md:text-start text-base sm:text-lg text-slate-800 mb-8"></p>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  className={`${INPUT_CLASS}`}
                />
                <span className={`${INPUT_REQUIRED_ERROR_CLASS}`}>
                  {errors.otp || ""}
                </span>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`${INPUT_CLASS}`}
                />
                <span className={`${INPUT_REQUIRED_ERROR_CLASS}`}>
                  {errors.password || ""}
                </span>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`${INPUT_CLASS}`}
                />
                <span className={`${INPUT_REQUIRED_ERROR_CLASS}`}>
                  {errors.confirmPassword || ""}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex justify-center items-center w-full h-14 text-white bg-gradient-to-r from-gradient-start to-gradient-end rounded-full shadow-lg font-bold hover:cursor-pointer"
              >
                {/* {loading ? (<Loader/>):("Reset password")} */}
                Reset Password
              </button>
            </form>

            <div
              className="mt-6 text-center flex justify-center items-center cursor-pointer"
              onClick={() => router.push("/signin")}
            >
              <IoArrowBackOutline />
              <span className="text-black text-sm font-medium ml-2">
                {" "}
                Back to log in{" "}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right side - Hidden on small screens */}
      <div className="hidden md:block md:w-1/2 p-4">
        <AuthRigthSidebar />
      </div>
    </div>
  );
}
