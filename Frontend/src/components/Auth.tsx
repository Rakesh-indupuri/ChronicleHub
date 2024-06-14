
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@rakesh_indupuri/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Spinner } from "./Spinner";  

export const Auth = ({ type }: { type: "signup" | "signin" | "update" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    const sendRequest = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
            const token = response.data.token;
            localStorage.setItem("token", token);
            navigate("/blogs");
        } catch (e) {
            alert("Sorry, an unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const updateRequest = async () => {
        setLoading(true);
        try {
            const response = await axios.put(`${BACKEND_URL}/api/v1/user/update`, postInputs, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (response.status === 200) {
                navigate("/signin");
            } else {
                alert("Error while updating profile");
            }
        } catch (e) {
            alert("Sorry, an unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col justify-center">
            <div className="flex justify-center">
                <div>
                    <div className="px-10">
                        <div className="text-2xl font-libre font-bold">
                            {type === "signup" ? "Create an Account" : type === "signin" ? "Login to your account" : "Update your Profile"}
                        </div>
                        <div className="font-chivo text-slate-400">
                            {type === "signup" ? "Already have an account?" : type === "signin" ? "Don't have an account?" : "Redirect to"}
                            <Link className="pl-2 underline" to={type === "signup" ? "/signin" : "/signup"}>
                                {type === "signup" || type === "update" ? "Login" : "Sign Up"}
                            </Link>
                        </div>
                    </div>
                    <div className="pt-5">
                        {(type === "signup" || type === "update") && (
                            <LabelledInput
                                label="Name"
                                placeholder="UserName"
                                onChange={(e) => {
                                    setPostInputs({
                                        ...postInputs,
                                        name: e.target.value
                                    });
                                }}
                            />
                        )}
                        <LabelledInput
                            label="Email"
                            placeholder="user@gmail.com"
                            onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    email: e.target.value
                                });
                            }}
                        />
                        <LabelledInput
                            label="Password"
                            type={"password"}
                            placeholder="Enter your password"
                            onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    password: e.target.value
                                });
                            }}
                        />
                         
                        <button
                            onClick={type === "signin" || type === "signup" ? sendRequest : updateRequest}
                            type="button"
                            className={`w-full font-chivo ${loading ? 'text-gray-800 bg-white' : 'text-white bg-gray-800 hover:bg-gray-900'} focus:outline-none focus:ring-4 focus:ring-gray-300 
                            font-medium rounded-lg text-sm mt-4 px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700
                            dark:border-gray-700 flex justify-center items-center`}
                            disabled={loading}
                        >
                            {loading ? <Spinner /> : type === "signup" ? "Sign Up" : type === "signin" ? "Sign In" : "Update"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

const LabelledInput = ({ label, placeholder, onChange, type }: LabelledInputType) => {
    return (
        <div>
            <label className="block mb-2 text-sm font-libre font-semibold text-black">{label}</label>
            <input
                onChange={onChange}
                type={type || "text"}
                id="first_name"
                className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
                font-chivo focus:border-blue-500 block w-full p-2.5"
                placeholder={placeholder}
                required
            />
        </div>
    );
};
