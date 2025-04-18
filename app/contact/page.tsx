"use client"

import type React from "react"
import {useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { toast } from 'react-toastify';


export default function ContactPage() {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async(e: React.FormEvent) => {
    
    e.preventDefault()
    setIsSubmitting(true)


    const payload = {
      fullName:formData.name,
      email:formData.email,
      subject:formData.subject,
      message:formData.message
    }


    try {
      const response = await fetch("http://localhost:8080/api/contact/addContact", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Parse the JSON response
      const data = await response.json();
      alert(data.Massage);

      toast.success(`Hello, ${formData.name}! your massage submitted successfully!`);
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setIsSubmitting(true);
    } catch (error) {
    
      toast.error("Error :"+error);
    }finally{
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Contact Us</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="flex flex-col space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Reach out to us through any of these channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-gray-500">info@modernbookstore.com</p>
                  <p className="text-sm text-gray-500">For general inquiries and customer support</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-sm text-gray-500">(555) 123-4567</p>
                  <p className="text-sm text-gray-500">Mon-Fri, 9:00 AM - 6:00 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-sm text-gray-500">123 Book Lane</p>
                  <p className="text-sm text-gray-500">Literary District, Bookville 12345</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <h3 className="font-medium">Hours</h3>
                  <p className="text-sm text-gray-500">Monday - Friday: 9:00 AM - 8:00 PM</p>
                  <p className="text-sm text-gray-500">Saturday: 10:00 AM - 6:00 PM</p>
                  <p className="text-sm text-gray-500">Sunday: 12:00 PM - 5:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Do you offer international shipping?</h3>
                <p className="text-sm text-gray-500">
                  Yes, we ship to most countries worldwide. Shipping rates vary by location.
                </p>
              </div>
              <div>
                <h3 className="font-medium">What is your return policy?</h3>
                <p className="text-sm text-gray-500">
                  We accept returns within 30 days of purchase. Books must be in original condition.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Do you have a physical store?</h3>
                <p className="text-sm text-gray-500">
                  Yes, our flagship store is located at 123 Book Lane, Literary District.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Can I order a book that's not listed on your website?</h3>
                <p className="text-sm text-gray-500">
                  Contact us with the book details, and we'll try to source it for you.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function redirect(arg0: string) {
  throw new Error("Function not implemented.")
}

