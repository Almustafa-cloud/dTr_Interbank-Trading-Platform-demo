"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  TrendingUp,
  TrendingDown,
  LogOut,
  Activity,
  DollarSign,
  User,
  Home,
  ArrowLeft,
  Building2,
  Wifi,
  WifiOff,
} from "lucide-react"
import { useDerivWebSocket } from "../hooks/useDerivWebSocket"

const DERIV_APP_ID = "85224" // dTr_Interbank app ID
const REDIRECT_URI = typeof window !== "undefined" ? `${window.location.origin}/dashboard` : ""

interface UserAccount {
  balance: number
  currency: string
  loginid: string
  email?: string
}

interface TickData {
  symbol: string
  quote: number
  pip_size: number
  epoch: number
}

export default function TradingDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null)
  const [tickData, setTickData] = useState<TickData | null>(null)
  const [isTrading, setIsTrading] = useState(false)
  const [priceHistory, setPriceHistory] = useState<number[]>([])
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")

  const { toast } = useToast()
  const { connect, disconnect, authorize, getAccountStatus, subscribeToTicks, buyContract, isConnected } =
    useDerivWebSocket()

  // Handle OAuth redirect and token extraction
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tokenFromUrl = urlParams.get("token1")

    if (tokenFromUrl) {
      setToken(tokenFromUrl)
      // Clean URL after extracting token
      window.history.replaceState({}, document.title, window.location.pathname)
      toast({
        title: "Authentication Token Received",
        description: "Connecting to dTr_Interbank platform...",
      })
    }
  }, [toast])

  // Initialize WebSocket connection with reconnection logic
  useEffect(() => {
    setConnectionStatus("connecting")
    connect()

    const reconnectInterval = setInterval(() => {
      if (!isConnected) {
        console.log("Attempting to reconnect WebSocket...")
        connect()
      }
    }, 5000)

    return () => {
      clearInterval(reconnectInterval)
      disconnect()
    }
  }, [connect, disconnect, isConnected])

  // Update connection status
  useEffect(() => {
    setConnectionStatus(isConnected ? "connected" : "disconnected")
  }, [isConnected])

  // Authorize user when token is available and WebSocket is connected
  useEffect(() => {
    if (token && isConnected && !isAuthenticated) {
      handleAuthorization()
    }
  }, [token, isConnected, isAuthenticated])

  const handleLogin = () => {
    const authUrl = `https://oauth.deriv.com/oauth2/authorize?app_id=${DERIV_APP_ID}&l=en&brand=deriv&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
    window.location.href = authUrl
  }

  const handleAuthorization = async () => {
    if (!token) return

    try {
      toast({
        title: "Authorizing...",
        description: "Connecting to your dTr_Interbank account",
      })

      const authResult = await authorize(token)
      if (authResult.authorize) {
        setIsAuthenticated(true)

        // Get account information
        const accountInfo = await getAccountStatus()
        if (accountInfo.get_account_status) {
          setUserAccount({
            balance: authResult.authorize.balance,
            currency: authResult.authorize.currency,
            loginid: authResult.authorize.loginid,
            email: authResult.authorize.email,
          })
        }

        // Subscribe to R_100 ticks for real-time data
        subscribeToTicks("R_100", (data) => {
          if (data.tick) {
            const newTick: TickData = {
              symbol: data.tick.symbol,
              quote: data.tick.quote,
              pip_size: data.tick.pip_size,
              epoch: data.tick.epoch,
            }
            setTickData(newTick)

            // Update price history for trend analysis
            setPriceHistory((prev) => {
              const newHistory = [...prev, data.tick.quote].slice(-20) // Keep last 20 prices
              return newHistory
            })
          }
        })

        toast({
          title: "Connected Successfully",
          description: "Welcome to dTr_Interbank trading platform",
        })
      }
    } catch (error) {
      console.error("Authorization failed:", error)
      toast({
        title: "Authorization Failed",
        description: "Please try logging in again. Check your credentials.",
        variant: "destructive",
      })
    }
  }

  const handleBuyCall = async () => {
    if (!isAuthenticated || isTrading) return

    setIsTrading(true)
    try {
      toast({
        title: "Executing Trade...",
        description: "Processing your CALL contract order",
      })

      const contractParams = {
        contract_type: "CALL",
        symbol: "R_100",
        amount: 10,
        duration: 5,
        duration_unit: "t", // ticks
        currency: "USD",
      }

      const result = await buyContract(contractParams)

      if (result.buy) {
        toast({
          title: "Trade Executed Successfully! 🎉",
          description: `Contract ID: ${result.buy.contract_id}\nLongcode: ${result.buy.longcode || "CALL contract on R_100"}`,
        })
      } else if (result.error) {
        toast({
          title: "Trade Execution Failed",
          description: result.error.message || "Unable to execute trade",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Trade execution failed:", error)
      toast({
        title: "Trade Failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsTrading(false)
    }
  }

  const handleLogout = () => {
    setToken(null)
    setIsAuthenticated(false)
    setUserAccount(null)
    setTickData(null)
    setPriceHistory([])
    disconnect()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out from dTr_Interbank",
    })
  }

  const getPriceTrend = () => {
    if (priceHistory.length < 2) return "neutral"
    const current = priceHistory[priceHistory.length - 1]
    const previous = priceHistory[priceHistory.length - 2]
    return current > previous ? "up" : current < previous ? "down" : "neutral"
  }

  const formatPrice = (price: number) => {
    return price?.toFixed(5) || "0.00000"
  }

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="h-4 w-4 text-green-500" />
      case "connecting":
        return <Activity className="h-4 w-4 text-yellow-500 animate-pulse" />
      default:
        return <WifiOff className="h-4 w-4 text-red-500" />
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="absolute top-4 left-4">
          <Link href="/">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">dTr_Interbank</CardTitle>
                <div className="text-sm text-gray-400">Professional Trading Platform</div>
              </div>
            </div>
            <p className="text-gray-400 mt-2">Connect to your Deriv account to access institutional trading</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {getConnectionIcon()}
              <span className="text-sm text-gray-400 capitalize">{connectionStatus}</span>
            </div>
            <Button
              onClick={handleLogin}
              disabled={connectionStatus !== "connected"}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              Login with Deriv
            </Button>
            <div className="text-center text-sm text-gray-500">
              Secure OAuth authentication • App ID: {DERIV_APP_ID}
            </div>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">dTr_Interbank</h1>
                <p className="text-gray-400">Professional Trading Dashboard</p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Account Information */}
        {userAccount && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Account Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {userAccount.balance.toFixed(2)} {userAccount.currency}
                </div>
                <p className="text-xs text-gray-500 mt-1">Available for trading</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Login ID</CardTitle>
                <User className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{userAccount.loginid}</div>
                <p className="text-xs text-gray-500 mt-1">{userAccount.email}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Connection Status</CardTitle>
                {getConnectionIcon()}
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      connectionStatus === "connected"
                        ? "bg-green-500 animate-pulse"
                        : connectionStatus === "connecting"
                          ? "bg-yellow-500 animate-pulse"
                          : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`text-sm capitalize ${
                      connectionStatus === "connected"
                        ? "text-green-500"
                        : connectionStatus === "connecting"
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  >
                    {connectionStatus}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Real-time Price Display */}
        {tickData && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>R_100 - Volatility Index</span>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      getPriceTrend() === "up" ? "default" : getPriceTrend() === "down" ? "destructive" : "secondary"
                    }
                    className={`${
                      getPriceTrend() === "up"
                        ? "bg-green-600"
                        : getPriceTrend() === "down"
                          ? "bg-red-600"
                          : "bg-gray-600"
                    }`}
                  >
                    {getPriceTrend() === "up" && <TrendingUp className="w-3 h-3 mr-1" />}
                    {getPriceTrend() === "down" && <TrendingDown className="w-3 h-3 mr-1" />}
                    {getPriceTrend() === "neutral" && <Activity className="w-3 h-3 mr-1" />}
                    {getPriceTrend().toUpperCase()}
                  </Badge>
                  <Badge className="bg-green-600 text-white">LIVE</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-6xl font-mono font-bold mb-2 text-blue-400">{formatPrice(tickData.quote)}</div>
                <div className="text-sm text-gray-400">
                  Last updated: {new Date(tickData.epoch * 1000).toLocaleTimeString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">Pip size: {tickData.pip_size}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trading Panel */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Execute Trade</CardTitle>
            <p className="text-sm text-gray-400">Buy CALL contract on R_100 volatility index</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-gray-700/50 p-3 rounded">
                <span className="text-gray-400 block">Symbol:</span>
                <div className="font-semibold text-blue-400">R_100</div>
              </div>
              <div className="bg-gray-700/50 p-3 rounded">
                <span className="text-gray-400 block">Amount:</span>
                <div className="font-semibold text-green-400">$10 USD</div>
              </div>
              <div className="bg-gray-700/50 p-3 rounded">
                <span className="text-gray-400 block">Duration:</span>
                <div className="font-semibold text-yellow-400">5 Ticks</div>
              </div>
              <div className="bg-gray-700/50 p-3 rounded">
                <span className="text-gray-400 block">Type:</span>
                <div className="font-semibold text-purple-400">CALL</div>
              </div>
            </div>

            <Button
              onClick={handleBuyCall}
              disabled={isTrading || !tickData || connectionStatus !== "connected"}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              {isTrading ? "Executing Trade..." : "Buy CALL Contract"}
            </Button>

            {(!tickData || connectionStatus !== "connected") && (
              <p className="text-center text-sm text-gray-500">
                {!tickData ? "Waiting for market data..." : "Connection required to trade"}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Price History Visualization */}
        {priceHistory.length > 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Price Movement History</CardTitle>
              <p className="text-sm text-gray-400">Real-time price visualization (last 20 ticks)</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-end space-x-1 h-24">
                {priceHistory.map((price, index) => {
                  const maxPrice = Math.max(...priceHistory)
                  const minPrice = Math.min(...priceHistory)
                  const range = maxPrice - minPrice || 1
                  const height = ((price - minPrice) / range) * 80 + 10

                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t flex-1 transition-all duration-300"
                      style={{ height: `${height}px` }}
                      title={`${formatPrice(price)}`}
                    />
                  )
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Oldest</span>
                <span>Latest</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster />
    </div>
  )
}
