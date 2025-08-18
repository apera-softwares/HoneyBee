"use client";
import AuthRigthSidebar from "@/components/auth/AuthRigthSidebar";
import {
  INPUT_CLASS,
  INPUT_REQUIRED_ERROR_CLASS,
} from "@/constant/constantClassName";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import Logo from "../../../../assets/logo/logo.png";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { signup } from "@/lib/redux/slices/authSlice";
import Loader from "@/components/ui/loader/Loader";
// import Radio from "@/components/form/input/Radio";
import LeadCard from "@/components/common/LeadCard";
import Spinner from "@/components/common/Spinner";
import Checkbox from "@/components/form/input/Checkbox";
import Link from "next/link";

function CreateAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector((state) => state.user.user);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: role === "a" ? "A_TEAM" : role === "b" ? "B_TEAM" : "",
    agree:false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    agree:"",
  });

  useEffect(() => {
    if (loggedInUser) {
      router.replace("/");
    }
  }, [loggedInUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleAgreeToTermsAndContions = (value:boolean)=>{setFormData((prev)=>({...prev,agree:value}))};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFormData()) return;
    setLoading(true);
    try {
      await dispatch(signup(formData)).unwrap();
         toast.success(
        "Signup Successfull!. Please check your email to verify your account"
      );
      clearData();
      router.push("/signin");
    } catch (error: any) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Failed to signup. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateFormData = () => {
    let isValidData = true;
    const tempErrors = { ...errors };

    const nameRegex = /^[A-Za-z]+(-[A-Za-z]+)*$/;
    // Validate firstName
    if (formData.firstName.trim() === "") {
      tempErrors.firstName = "First name is required";
      isValidData = false;
    } else if (!nameRegex?.test(formData.firstName)) {
      tempErrors.firstName = "Please enter valid first name";
      isValidData = false;
    } else {
      tempErrors.firstName = "";
    }

    // Validate lastName
    if (formData?.lastName.trim() === "") {
      tempErrors.lastName = "Last name is required";
      isValidData = false;
    } else if (!nameRegex?.test(formData.lastName)) {
      tempErrors.lastName = "Please enter valid last name";
      isValidData = false;
    } else {
      tempErrors.lastName = "";
    }

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

    // Validate role
    if (formData.role.trim() === "") {
      tempErrors.role = "Role is required";
      isValidData = false;
    } else {
      tempErrors.role = "";
    }

    if(!formData.agree)
    {
      tempErrors.agree = "You must agree to the terms and conditions";
      isValidData = false;
    }else{
      tempErrors.agree = "";
    }


    setErrors(tempErrors);
    return isValidData;
  };

  const clearData = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      agree:false
    });

    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      agree:"",
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center   px-3 sm:px-6  py-10 ">
        <div className="absolute top-8 left-1/2 md:left-8 transform -translate-x-1/2 md:translate-x-0 ">
          <Image src={Logo} alt="Logo" width={230} height={60} />
        </div>
        <div className="w-full max-w-[482px] mx-auto  mt-12 sm:mt-24 ">
          <h2 className="text-center md:text-start text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
            Create an account
          </h2>
          <p className=" text-base  sm:text-lg md:text-start text-slate-800 mb-8">
            {/* Your account will be activated by an Admin. Fill out the info below
            to request access to Honeybee Harry. */}
            {` Check your email for a verification link to activate your Honeybee Harry's Referral Club account.`}
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                First name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Catherine Chen"
                className={`${INPUT_CLASS} `}
              />
              <span className={`${INPUT_REQUIRED_ERROR_CLASS}`}>
                {errors.firstName || ""}
              </span>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Catherine Chen"
                className={`${INPUT_CLASS}`}
              />
              <span className={`${INPUT_REQUIRED_ERROR_CLASS}`}>
                {errors.lastName || ""}
              </span>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Catherine.chen@honeybeen.com"
                className={`${INPUT_CLASS}`}
              />
              <span className={`${INPUT_REQUIRED_ERROR_CLASS}`}>
                {errors.email || ""}
              </span>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Type your password"
                className={`${INPUT_CLASS}`}
              />
              <span className={`${INPUT_REQUIRED_ERROR_CLASS}`}>
                {errors.password || ""}
              </span>
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Select role
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LeadCard
                  title="Enroll Your Product"
                  value="A Team"
                  point="List and promote your product to a wider audience easily."
                  from="signup"
                  active={formData.role === "A_TEAM"}
                  onClick={() =>
                    setFormData((prev: any) => ({ ...prev, role: "A_TEAM" }))
                  }
                />
                <LeadCard
                  title="Become a Member"
                  value="B Team"
                  point="Get access to exclusive tools and insights for team collaboration."
                  from="signup"
                  active={formData.role === "B_TEAM"}
                  onClick={() =>
                    setFormData((prev: any) => ({ ...prev, role: "B_TEAM" }))
                  }
                />
              </div>
              <span className={`${INPUT_REQUIRED_ERROR_CLASS}`}>
                {errors.role || ""}
              </span>
            </div>
            <div>
              <label className=" flex items-center flex-wrap">
                 <Checkbox  checked={formData.agree} onChange={handleAgreeToTermsAndContions}  /> &nbsp; I read and  agree to  &nbsp; <Link href={"/terms-and-conditions"} className="text-primary hover:text-primary-hover transition-all duration-500">terms and conditions</Link>
              </label>
                <span className={`${INPUT_REQUIRED_ERROR_CLASS}`}>
                {errors.agree || ""}
              </span>

        
  
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex justify-center  items-center w-full h-14 text-white bg-gradient-to-r from-gradient-start to-gradient-end rounded-full shadow-lg font-bold hover:cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? <Loader /> : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-black text-sm font-medium">
              Already have an account?{" "}
            </span>
            <span
              className="text-black text-sm font-extrabold cursor-pointer"
              onClick={() => router.push("/signin")}
            >
              Log in
            </span>
          </div>
        </div>
      </div>

      {/* Right side - Hidden on small screens */}
      <div className="hidden md:block md:w-1/2 p-4">
        <AuthRigthSidebar />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <CreateAccountPage />
    </Suspense>
  );
}
