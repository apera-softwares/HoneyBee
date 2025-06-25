"use client";
import { useState } from "react";

const Contact = () => {
    const [result, setResult] = useState("");

    const onSubmit = async (event: any) => {
        event.preventDefault();
        setResult("Sending...");
        const formData = new FormData(event.target);
        formData.append("access_key", "7c8b31cf-d3ea-425b-926b-510ae8449f8f");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            setResult("Form Submitted Successfully ✅");
            event.target.reset();
        } else {
            console.error("Error", data);
            setResult(`❌ ${data.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-2xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Feedback Form</h2>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Your Name"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="you@example.com"
                        />
                    </div>


                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                            Feedback Feedback
                        </label>
                        <textarea
                            name="message"
                            rows={3}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Your general feedback and suggesions..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-11 bg-primary hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                    >
                        Submit Feedback
                    </button>
                </form>

                {result && (
                    <p className="mt-4 text-center text-sm text-gray-600">{result}</p>
                )}
            </div>
        </div>
    );
};

export default Contact;
