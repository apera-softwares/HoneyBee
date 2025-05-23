"use client";
import AuthRigthSidebar from "@/components/AuthRigthSidebar";
import { INPUT_CLASS, INPUT_REQUIRED_ERROR_CLASS } from "@/constant/constantClassName";
import Image from "next/image";
import { useState, useEffect } from "react";
import Logo from '../../../../assets/logo/logo.png'
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { userSignup } from "@/lib/redux/slices/userSlice";
import Loader from "@/components/ui/loader/Loader";

export default function CreateAccountPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: ""
    })
    const router = useRouter()
    const dispatch = useAppDispatch()

    const loggedInUser = useAppSelector((state) => state.user.user);

    useEffect(() => {

        if (loggedInUser) {
            router.replace("/")
        }
    }, [loggedInUser]);

    // if (loggedInUser) return null;


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFormData()) return;
        setLoading(true)
        dispatch(userSignup(formData)).then((res: any) => {
            if (res.meta.requestStatus === "fulfilled") {
                toast.success("Account Creation successful!");
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    role: ""
                });
                router.push("/signin");
                setLoading(false)
            } else {
                toast.error(res.payload || "Account Creation failed. Please try again.");
                setLoading(false)
            }
        })
    };



    const validateFormData = () => {
        let isValidData = true;
        const tempErrors = { ...errors };

        const nameRegex = /^[A-Za-z]+(-[A-Za-z]+)*$/;;
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
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (formData.password.trim() === "") {
            tempErrors.password = "Password is required";
            isValidData = false;
        } else if (!passwordRegex.test(formData.password)) {
            tempErrors.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
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
                <div className="w-full max-w-[482px] mx-auto  mt-12 sm:mt-24 ">
                    <h2 className="text-center md:text-start text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
                        Create an account
                    </h2>
                    <p className=" text-base  sm:text-lg md:text-start text-slate-800 mb-8">
                        Your account will be activated by an Admin. Fill out the info below to
                        request access to Honeybee Harry.
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
                            <span className={`${INPUT_REQUIRED_ERROR_CLASS}`}>{errors.firstName || ""}</span>
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
                            <span className={`${INPUT_REQUIRED_ERROR_CLASS}`} >{errors.lastName || ""}</span>
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
                            <span className={`${INPUT_REQUIRED_ERROR_CLASS}`} >{errors.email || ""}</span>
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
                            <span className={`${INPUT_REQUIRED_ERROR_CLASS}`} >{errors.password || ""}</span>
                        </div>
                        <div>
                            <label className="block textsm font-bold text-black mb-2">
                                Select role ?
                            </label>
                            <div className="flex items-center space-x-6">
                                <label className="inline-flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="A_TEAM"
                                        checked={formData.role === "A_TEAM"}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-gray-700">A team</span>
                                </label>
                                <label className="inline-flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="B_TEAM"
                                        checked={formData.role === "B_TEAM"}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-gray-700">B team</span>
                                </label>
                            </div>
                            <span className={`${INPUT_REQUIRED_ERROR_CLASS}`} >{errors.role || ""}</span>
                        </div>

                        <button
                            type="submit"
                            className="flex justify-center  items-center w-full h-14 text-white bg-gradient-to-b from-orange-500 to-amber-400 rounded-full shadow-lg font-bold hover:cursor-pointer"
                        >
                            {loading ? (<Loader />
                            ) : ("Create account")}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-black text-sm font-medium">
                            Already have an account?{" "}
                        </span>
                        <span className="text-black text-sm font-extrabold cursor-pointer" onClick={() => router.push("/signin")}>
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
