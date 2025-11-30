import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketOptions {
    url: string;
    onMessage?: (data: any) => void;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: Event) => void;
    reconnect?: boolean;
    reconnectInterval?: number;
}

interface WebSocketHook {
    sendMessage: (data: any) => void;
    isConnected: boolean;
    lastMessage: any;
}

/**
 * Custom hook for WebSocket connection with auto-reconnect.
 * 
 * @param options WebSocket configuration options
 * @returns WebSocket hook interface
 */
export const useWebSocket = (options: WebSocketOptions): WebSocketHook => {
    const {
        url,
        onMessage,
        onOpen,
        onClose,
        onError,
        reconnect = true,
        reconnectInterval = 3000,
    } = options;

    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<any>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        try {
            // Determine WebSocket protocol (ws:// or wss://)
            const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
            const wsUrl = `${protocol}${window.location.host}${url}`;

            wsRef.current = new WebSocket(wsUrl);

            wsRef.current.onopen = () => {
                console.log('WebSocket connected:', wsUrl);
                setIsConnected(true);
                if (onOpen) onOpen();
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setLastMessage(data);
                    if (onMessage) onMessage(data);
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', error);
                }
            };

            wsRef.current.onclose = () => {
                console.log('WebSocket disconnected');
                setIsConnected(false);
                if (onClose) onClose();

                // Auto-reconnect
                if (reconnect && !reconnectTimeoutRef.current) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectTimeoutRef.current = null;
                        connect();
                    }, reconnectInterval);
                }
            };

            wsRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                if (onError) onError(error);
            };
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
        }
    }, [url, onMessage, onOpen, onClose, onError, reconnect, reconnectInterval]);

    const sendMessage = useCallback((data: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket is not connected');
        }
    }, []);

    useEffect(() => {
        connect();

        return () => {
            // Cleanup
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connect]);

    return {
        sendMessage,
        isConnected,
        lastMessage,
    };
};
