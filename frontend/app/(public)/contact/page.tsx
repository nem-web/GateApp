import React from "react";
import ContactForm from "./ContactForm";
import { Mail, MapPin, MessageSquare, HelpCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0F1117] text-[#E5E7EB] font-sans selection:bg-[#6C63FF]/30">
      
      {/* HEADER SECTION */}
      <section className="relative pt-20 pb-12 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#6C63FF]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Get in Touch
          </h1>
          <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
            Have a question, feedback, or need help with your GATE preparation? We're here to assist you. Drop us a message!
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">
            
            {/* Left: Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Contact Information</h2>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">
                  Fill out the form and our team will get back to you within 24 hours. We prioritize support for all GATEPrep Pro users.
                </p>
              </div>

              <div className="space-y-6">
                {/* Email Card */}
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#1A1D27] border border-white/5 transition-colors hover:border-[#6C63FF]/30">
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#6C63FF]/10 text-[#6C63FF]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#9CA3AF] mb-1">Email Us</p>
                    <a href="mailto:contact@gateprep.tech" className="text-base font-semibold text-white hover:text-[#6C63FF] transition-colors">
                      contact@gateprep.tech
                    </a>
                  </div>
                </div>

                {/* Location Card */}
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#1A1D27] border border-white/5 transition-colors hover:border-[#6C63FF]/30">
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#6C63FF]/10 text-[#6C63FF]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#9CA3AF] mb-1">Location</p>
                    <p className="text-base font-semibold text-white">
                      India
                    </p>
                    <p className="text-sm text-[#9CA3AF] mt-0.5">Operating remotely worldwide.</p>
                  </div>
                </div>

                {/* Discord/Community Card */}
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#1A1D27] border border-white/5 transition-colors hover:border-[#6C63FF]/30">
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#6C63FF]/10 text-[#6C63FF]">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#9CA3AF] mb-1">Community</p>
                    <p className="text-base font-semibold text-white">
                      Join our Discord
                    </p>
                    <a href="#" className="text-sm text-[#6C63FF] hover:underline mt-0.5 block">
                      Connect with peers &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form Container */}
            <div className="rounded-[2rem] bg-[#1A1D27] p-6 sm:p-10 border border-white/5 shadow-2xl relative">
              <div className="absolute top-0 right-10 w-32 h-32 bg-[#6C63FF]/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-8">
                <HelpCircle className="text-[#6C63FF]" size={24} />
                <h3 className="text-2xl font-bold text-white">Send a Message</h3>
              </div>
              
              {/* Load the Client-Side Form */}
              <ContactForm />

            </div>
            
          </div>
        </div>
      </section>

    </div>
  );
}