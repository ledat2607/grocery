"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted: ", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Images */}
      <Image
        src="/vet.png" // left grocery image (e.g., fruits/veggies)
        alt="Grocery Left"
        width={400}
        height={400}
        className="absolute top-0 left-0 w-1/3 h-auto opacity-50 pointer-events-none"
      />
      <Image
        src="/fruit.png" // right grocery image (e.g., cart/products)
        alt="Grocery Right"
        width={400}
        height={400}
        className="absolute bottom-0 right-0 w-1/3 h-auto opacity-50 pointer-events-none"
      />

      {/* Animated Lines */}
      <div className="absolute w-full h-full top-0 left-0 overflow-hidden">
        <motion.div
          className="absolute w-64 h-1 bg-green-500 rounded-full opacity-75"
          initial={{ x: "-100vw" }}
          animate={{ x: "100vw" }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-64 h-1 bg-green-500 rounded-full opacity-75"
          initial={{ x: "100vw" }}
          animate={{ x: "-100vw" }}
          transition={{
            duration: 5,
            delay: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-xl rounded-lg max-w-lg w-full p-8 space-y-6 z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl font-bold text-center text-gray-800"
        >
          Contact Us
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Name Input */}
          <div className="flex flex-col">
            <label htmlFor="name" className="font-medium text-gray-700">
              Your Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="mt-1 border rounded-md focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col">
            <label htmlFor="email" className="font-medium text-gray-700">
              Your Email
            </label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              type="email"
              required
              className="mt-1 border rounded-md focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          {/* Message Textarea */}
          <div className="flex flex-col">
            <label htmlFor="message" className="font-medium text-gray-700">
              Your Message
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message"
              required
              className="mt-1 border rounded-md focus:ring-2 focus:ring-green-400 focus:border-transparent"
              rows={5}
            />
          </div>

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg shadow-lg"
            >
              Send Message
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ContactPage;
