'use client';

import { Button } from '@/components/ui/button';
import { Mail, Github, Linkedin, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../dashboard/components/Header';

export default function ContactPage() {
  const contactLinks = [
    {
      icon: Mail,
      label: 'Email',
      value: 'ry7989229@gmail.com',
      href: 'mailto:ry7989229@gmail.com',
      color: 'bg-red-500'
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'rati-yadav',
      href: 'https://github.com/rati-yadav',
      color: 'bg-gray-800'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Rati Yadav',
      href: 'https://www.linkedin.com/in/rati-yadav-995b923aa/',
      color: 'bg-blue-600'
    },
    {
      icon: Globe,
      label: 'Portfolio',
      value: 'Rati Yadav | Full Stack Developer',
      href: 'https://rati-yadav.github.io/Rati_Yadav_Portfolio/',
      color: 'bg-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 px-4 mx-auto max-w-screen-xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            I'd love to hear from you! Whether you have questions, feedback, or just want to connect, feel free to reach out through any of these channels.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {contactLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-primary hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex items-center mb-4">
                    <div className={`${link.color} p-4 rounded-lg mr-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{link.label}</h3>
                  </div>
                  <p className="text-gray-600 group-hover:text-primary transition-colors text-lg font-medium">
                    {link.value}
                  </p>
                  <div className="mt-4 text-sm text-gray-500 group-hover:text-primary transition-colors">
                    Click to connect →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50 px-4 mx-auto max-w-screen-xl">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Project</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <span className="font-semibold text-primary">AI Interview Mocker</span> is a cutting-edge platform that leverages artificial intelligence to provide realistic mock interview experiences. As the creator and maintainer of this project, I've dedicated myself to building a tool that genuinely helps students and professionals prepare for their interviews.
            </p>
            <p>
              Whether you're preparing for your first job interview or climbing the corporate ladder, this tool helps you practice, get instant AI-powered feedback, and build confidence. I believe that quality interview preparation should be accessible to everyone, which is why I built this platform.
            </p>
            <p>
              Built with modern web technologies (Next.js, React, Tailwind CSS) and powered by advanced AI (Gemini API), this project represents my commitment to making interview preparation smarter, not harder.
            </p>
          </div>
        </div>
      </section>

      {/* Why Me Section */}
      <section className="py-16 bg-white px-4 mx-auto max-w-screen-xl">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Reach Out?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions?</h3>
              <p className="text-gray-600">Have questions about the project or how to get the most out of it?</p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Feedback</h3>
              <p className="text-gray-600">Want to share your experience or suggest improvements?</p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaboration</h3>
              <p className="text-gray-600">Interested in collaborating or contributing to the project?</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 px-4 mx-auto max-w-screen-xl">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">Jump into the dashboard and start practicing your interviews today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg">
                Start Practicing
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-gray-300 text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4 mx-auto max-w-screen-xl">
        <div className="text-center">
          <p className="text-gray-600">
            Made with ❤️ by <span className="text-primary font-semibold">Rati Yadav</span>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2026 AI Interview Mocker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
