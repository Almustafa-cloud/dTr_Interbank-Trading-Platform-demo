"use client"

import { useCallback, useRef, useState } from "react"

interface WebSocketMessage {
  [key: string]: any
}

interface ContractParams {
  contract_type: string
  symbol: string
  amount: number
  duration: number
  duration_unit: string
  currency: string
}

export const useDerivWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const callbacksRef = useRef<Map<string, (data: any) => void>>(new Map())
  const requestIdRef = useRef(1)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    // Use app_id 85224 for dTr_Interbank
    const ws = new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=85224")

    ws.onopen = () => {
      console.log("dTr_Interbank WebSocket connected")
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log("WebSocket message received:", data)

        // Handle tick subscription callbacks
        if (data.tick) {
          const callback = callbacksRef.current.get("tick_R_100")
          if (callback) {
            callback(data)
          }
        }

        // Handle request-response messages
        if (data.req_id) {
          const callback = callbacksRef.current.get(`req_${data.req_id}`)
          if (callback) {
            callback(data)
            callbacksRef.current.delete(`req_${data.req_id}`)
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    ws.onclose = (event) => {
      console.log("WebSocket disconnected:", event.code, event.reason)
      setIsConnected(false)
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      setIsConnected(false)
    }

    wsRef.current = ws
  }, [])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
      setIsConnected(false)
      callbacksRef.current.clear()
    }
  }, [])

  const sendMessage = useCallback((message: WebSocketMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket is not connected"))
        return
      }

      const reqId = requestIdRef.current++
      const messageWithId = { ...message, req_id: reqId }

      // Set up callback for response
      callbacksRef.current.set(`req_${reqId}`, (data) => {
        if (data.error) {
          reject(data.error)
        } else {
          resolve(data)
        }
      })

      console.log("Sending WebSocket message:", messageWithId)
      wsRef.current.send(JSON.stringify(messageWithId))

      // Set timeout for request (15 seconds)
      setTimeout(() => {
        if (callbacksRef.current.has(`req_${reqId}`)) {
          callbacksRef.current.delete(`req_${reqId}`)
          reject(new Error("Request timeout"))
        }
      }, 15000)
    })
  }, [])

  const authorize = useCallback(
    async (token: string) => {
      console.log("Authorizing with token...")
      return sendMessage({
        authorize: token,
      })
    },
    [sendMessage],
  )

  const getAccountStatus = useCallback(async () => {
    console.log("Getting account status...")
    return sendMessage({
      get_account_status: 1,
    })
  }, [sendMessage])

  const subscribeToTicks = useCallback((symbol: string, callback: (data: any) => void) => {
    console.log(`Subscribing to ticks for ${symbol}`)
    callbacksRef.current.set(`tick_${symbol}`, callback)

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          ticks: symbol,
          subscribe: 1,
        }),
      )
    }
  }, [])

  const buyContract = useCallback(
    async (params: ContractParams) => {
      console.log("Executing buy contract:", params)
      return sendMessage({
        buy: 1,
        price: params.amount,
        parameters: {
          contract_type: params.contract_type,
          symbol: params.symbol,
          amount: params.amount,
          duration: params.duration,
          duration_unit: params.duration_unit,
          currency: params.currency,
        },
      })
    },
    [sendMessage],
  )

  return {
    connect,
    disconnect,
    authorize,
    getAccountStatus,
    subscribeToTicks,
    buyContract,
    isConnected,
  }
}
