"use client";
import AuthRigthSidebar from "@/components/AuthRigthSidebar";
import { INPUT_CLASS, INPUT_REQUIRED_ERROR_CLASS } from "@/constant/constantClassName";
import Image from "next/image";
import { useState, useEffect } from "react";
import Logo from '../../../../assets/logo/logo.png'
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginUser } from "@/lib/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import Loader from "@/components/ui/loader/Loader";
import { fetchUserProfile } from "@/lib/redux/slices/loginPersonProfile";
import Checkbox from "@/components/form/input/Checkbox";

export default function Login() {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const loggedInUser = useAppSelector((state) => state.user.user);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (loggedInUser) {
            router.replace("/")
        }
    }, [loggedInUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateFormData()) return;

        dispatch(loginUser(formData)).then((res: any) => {
            setLoading(true)
            if (res.meta.requestStatus === "fulfilled") {
                if (!res.payload) {
                    toast.error("User not verified");
                    setFormData({ email: "", password: "" });
                    setLoading(false);
                    return;
                } else {
                    dispatch(fetchUserProfile());
                    toast.success("Login successful!");
                    setFormData({ email: "", password: "" });
                    router.push("/");
                    setLoading(false)
                }
            } else {
                toast.error(res.payload || "Login failed. Please try again.");
                setLoading(false)
            }
        });
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

        //validate password
        if (formData.password.trim() === "") {
            tempErrors.password = "Password is required";
            isValidData = false;
        } else {
            tempErrors.password = "";
        }

        setErrors(tempErrors);
        return isValidData;

    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Left side - Form */}

            <div className="w-full md:w-1/2 flex flex-col justify-center items-center   px-3 sm:px-6  py-10 ">
                <div className="absolute top-8 left-1/2 md:left-8 transform -translate-x-1/2 md:translate-x-0 ">
                    <Image src={Logo} alt="Logo" width={230} height={60} />
                </div>
                <div className="w-full max-w-[482px] mx-auto  mt-12 sm:mt-24  ">
                    <h2 className=" text-center md:text-start text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                        Login                </h2>
                    <p className="text-center md:text-start text-base sm:text-lg text-slate-800 mb-8">
                        Log in to track your referrals, check commissions, and grow your hive — one buzz at a time.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-6">

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
                            <span className={`${INPUT_REQUIRED_ERROR_CLASS}`}>{errors.email || ""}</span>
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
                                className={`${INPUT_CLASS} `}
                            />
                            <span className={`${INPUT_REQUIRED_ERROR_CLASS}`}>{errors.password || ""}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-sm mt-2">
                            <label className="flex items-center space-x-2">

                                <Checkbox checked={true} onChange={() => { }} />
                                <span className="text-slate-800 font-bold">Remember Me</span>
                            </label>
                            <span
                                className="text-gray-500 underline cursor-pointer hover:text-gray-700"
                                onClick={() => router.push("/forgot-password")}
                            >
                                Forgot Password?
                            </span>
                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="flex justify-center items-center  w-full h-14 text-white bg-gradient-to-r from-gradient-start to-gradient-end rounded-full shadow-lg font-bold hover:cursor-pointer"
                        >


                            {loading ? (<Loader />) : ("Login")}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-black text-sm font-medium">
                            Don’t have an account?                   </span>
                        <span className="text-black text-sm font-extrabold cursor-pointer" onClick={() => router.push("/signup")}>
                            Create now
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
