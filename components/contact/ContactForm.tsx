"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, UserCheck } from "lucide-react";
import { CONTACT_PAGE_DATA } from "@/lib/copy-data";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  reason: string;
  message: string;
  consent: boolean;
}

const INITIAL_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  reason: "General",
  message: "",
  consent: false,
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { form } = CONTACT_PAGE_DATA;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Please provide a contact phone number.");
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage("Please enter your message or inquiry details.");
      return;
    }
    if (!formData.consent) {
      setErrorMessage("Please confirm your consent to process your inquiry.");
      return;
    }

    setIsSubmitting(true);

    // Simulate advisory dispatch
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitted(true);
      setFormData(INITIAL_FORM);
    } catch {
      setErrorMessage("Unable to send inquiry at this moment. Please call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inquiry-form" className="py-20 sm:py-28 lg:py-32 bg-[#FDFDFD] text-[#252A2D] border-b border-neutral-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Advisory Orientation & Trust Guarantees */}
          <div className="lg:col-span-5 max-w-lg">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-3">
              Direct Advisory
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[#252A2D] leading-[1.14] mb-6">
              Schedule a Consultation or Send an Inquiry
            </h2>
            <p className="text-base sm:text-lg text-[#52525B] leading-relaxed font-normal mb-8">
              Whether you are evaluating a property in Abuja, exploring structured real estate wealth vehicles (GIAP or WealthStream), or seeking strategic portfolio consultation, our executive advisory team is at your service.
            </p>

            <div className="space-y-6 pt-4 border-t border-neutral-200/80">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-sm bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 mt-0.5 text-[#BE933C]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#252A2D]">
                    Confidential &amp; Verified
                  </h3>
                  <p className="text-xs text-[#52525B] leading-relaxed mt-0.5">
                    Your details and portfolio requirements are handled with strict institutional confidentiality.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-sm bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 mt-0.5 text-[#BE933C]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#252A2D]">
                    Prompt Advisory Turnaround
                  </h3>
                  <p className="text-xs text-[#52525B] leading-relaxed mt-0.5">
                    All formal inquiries are reviewed by our senior team within one business day.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-sm bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 mt-0.5 text-[#BE933C]">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#252A2D]">
                    Dedicated Investment Advisor
                  </h3>
                  <p className="text-xs text-[#52525B] leading-relaxed mt-0.5">
                    Consultations are conducted in-person at our Guzape Smart Office or via secure video conference for diaspora clients.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Controlled Advisory Form */}
          <div className="lg:col-span-7 bg-[#F8F8F6] border border-neutral-200/80 p-8 sm:p-10 lg:p-12 rounded-sm shadow-sm">
            {isSubmitted ? (
              <div className="py-12 sm:py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-[#BE933C]/10 border border-[#BE933C]/30 flex items-center justify-center mx-auto text-[#BE933C] mb-6">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-black text-[#252A2D] mb-3">
                  Inquiry Received
                </h3>
                <p className="text-sm sm:text-base text-[#52525B] max-w-md mx-auto leading-relaxed mb-8">
                  Thank you for reaching out to Jeje-Ola Properties. An investment advisor will review your message and reach out to you within one business day.
                </p>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setIsSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {errorMessage && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm rounded-sm">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252A2D] mb-2"
                    >
                      Full Name <span className="text-[#BE933C]">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Dr. Aliyu Bello"
                      className="w-full px-4 py-3 text-sm bg-white border border-neutral-300 rounded-sm text-[#252A2D] placeholder-neutral-400 focus:outline-none focus:border-[#BE933C] focus:ring-1 focus:ring-[#BE933C] transition-colors"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252A2D] mb-2"
                    >
                      Email Address <span className="text-[#BE933C]">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@organization.com"
                      className="w-full px-4 py-3 text-sm bg-white border border-neutral-300 rounded-sm text-[#252A2D] placeholder-neutral-400 focus:outline-none focus:border-[#BE933C] focus:ring-1 focus:ring-[#BE933C] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252A2D] mb-2"
                    >
                      Phone Number <span className="text-[#BE933C]">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 800 000 0000"
                      className="w-full px-4 py-3 text-sm bg-white border border-neutral-300 rounded-sm text-[#252A2D] placeholder-neutral-400 focus:outline-none focus:border-[#BE933C] focus:ring-1 focus:ring-[#BE933C] transition-colors"
                    />
                  </div>

                  {/* Country / Location */}
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252A2D] mb-2"
                    >
                      Country / Current Location
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="e.g. Nigeria, United Kingdom, USA"
                      className="w-full px-4 py-3 text-sm bg-white border border-neutral-300 rounded-sm text-[#252A2D] placeholder-neutral-400 focus:outline-none focus:border-[#BE933C] focus:ring-1 focus:ring-[#BE933C] transition-colors"
                    />
                  </div>
                </div>

                {/* Reason for Inquiry */}
                <div>
                  <label
                    htmlFor="reason"
                    className="block text-xs uppercase tracking-wider font-semibold text-[#252A2D] mb-2"
                  >
                    Reason for Contact <span className="text-[#BE933C]">*</span>
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-white border border-neutral-300 rounded-sm text-[#252A2D] focus:outline-none focus:border-[#BE933C] focus:ring-1 focus:ring-[#BE933C] transition-colors"
                  >
                    {form.reasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs uppercase tracking-wider font-semibold text-[#252A2D] mb-2"
                  >
                    Message / Investment Goals <span className="text-[#BE933C]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about the property, investment plan, or inquiry you would like to discuss..."
                    className="w-full px-4 py-3 text-sm bg-white border border-neutral-300 rounded-sm text-[#252A2D] placeholder-neutral-400 focus:outline-none focus:border-[#BE933C] focus:ring-1 focus:ring-[#BE933C] transition-colors resize-y"
                  />
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start gap-3 pt-1">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded-sm border-neutral-300 text-[#BE933C] focus:ring-[#BE933C]"
                  />
                  <label htmlFor="consent" className="text-xs text-[#52525B] leading-relaxed cursor-pointer select-none">
                    {form.consentText}
                  </label>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    icon={<ArrowRight className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? "Sending Inquiry..." : form.submitLabel}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
