"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Smartphone,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Activity,
  Building2,
} from "lucide-react"

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState<string | null>(null)

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      title: "Interbank Trading",
      description: "Access institutional-grade trading with real-time interbank rates and execution.",
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Secure Infrastructure",
      description: "Bank-level security with OAuth authentication and encrypted data transmission.",
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Ultra-Low Latency",
      description: "Sub-millisecond execution with direct market access and WebSocket connectivity.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
      title: "Advanced Analytics",
      description: "Professional-grade charting and risk management tools for institutional traders.",
    },
    {
      icon: <Smartphone className="h-8 w-8 text-pink-500" />,
      title: "Cross-Platform",
      description: "Trade seamlessly across desktop, mobile, and tablet devices.",
    },
    {
      icon: <Globe className="h-8 w-8 text-cyan-500" />,
      title: "Global Markets",
      description: "Access to international markets with 24/7 trading capabilities.",
    },
  ]

  const stats = [
    { label: "Daily Volume", value: "$2.5B+", icon: <Activity className="h-5 w-5" /> },
    { label: "Institutions", value: "500+", icon: <Building2 className="h-5 w-5" /> },
    { label: "Uptime", value: "99.99%", icon: <Shield className="h-5 w-5" /> },
    { label: "Latency", value: "<1ms", icon: <Zap className="h-5 w-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">dTr_Interbank</span>
                <div className="text-xs text-gray-400">Professional Trading Platform</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
                  Trading Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-600/20 text-blue-400 border-blue-600/30">
              Institutional Trading Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Interbank Trading
              <br />
              <span className="text-blue-400">Redefined</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience institutional-grade trading with real-time interbank rates, advanced analytics, and ultra-low
              latency execution. Built for professional traders and financial institutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Launch Trading Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg bg-transparent"
              >
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2 text-blue-500">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Institutional-Grade Features</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Advanced trading infrastructure designed for professional traders and financial institutions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`bg-gray-800 border-gray-700 transition-all duration-300 cursor-pointer ${
                  isHovered === feature.title ? "transform scale-105 border-blue-500/50" : ""
                }`}
                onMouseEnter={() => setIsHovered(feature.title)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {feature.icon}
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Preview Section */}
      <section className="py-24 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Professional Trading
                <br />
                <span className="text-blue-400">Interface</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Our advanced trading platform provides institutional-grade tools with an intuitive interface. Execute
                trades, monitor positions, and analyze markets with professional precision.
              </p>
              <div className="space-y-4">
                {[
                  "Real-time interbank rates and spreads",
                  "Advanced order management system",
                  "Risk management and position monitoring",
                  "Comprehensive trade analytics and reporting",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-8">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">R_100 - Volatility Index</span>
                    <Badge className="bg-green-600 text-white">LIVE</Badge>
                  </div>
                  <div className="text-4xl font-mono font-bold mb-4">1,234.56789</div>
                  <div className="flex items-center space-x-2 mb-6">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-500 text-sm">+0.0023 (+0.18%)</span>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Execute Trade</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Institutions</h2>
            <p className="text-xl text-gray-400">Leading financial institutions choose dTr_Interbank</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "David Chen",
                role: "Head of Trading, Global Bank",
                content:
                  "The platform's execution speed and reliability have significantly improved our trading operations.",
                rating: 5,
              },
              {
                name: "Sarah Williams",
                role: "Portfolio Manager, Hedge Fund",
                content: "Outstanding analytics and risk management tools. Essential for institutional trading.",
                rating: 5,
              },
              {
                name: "Michael Johnson",
                role: "Trading Director, Investment Firm",
                content: "Best-in-class interbank rates and transparent pricing. Highly recommended.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600/20 to-cyan-600/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Trade?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Experience institutional-grade trading with dTr_Interbank. Join leading financial institutions worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Start Trading Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg bg-transparent"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">dTr_Interbank</span>
                  <div className="text-xs text-gray-400">Professional Trading Platform</div>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Institutional-grade trading platform providing real-time interbank rates, advanced analytics, and
                professional trading tools for financial institutions worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Trading Dashboard
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Market Data
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Analytics
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 dTr_Interbank. All rights reserved. Professional Trading Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
