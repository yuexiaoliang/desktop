interface WebSocketClientOptions {
  url: string;
  pingInterval: number;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  open: () => void;
  message: (event: MessageEvent) => void;
}

export const createWebSocketClient = (options: WebSocketClientOptions) => {
  let socket: WebSocket | null = null;
  let pingIntervalId: NodeJS.Timeout | null = null;
  let reconnectAttempts = 0;

  const connect = () => {
    socket = new WebSocket(options.url);

    socket.onopen = () => {
      console.log('WebSocket连接已打开');
      options.open();
      reconnectAttempts = 0;
      startHeartbeat();
    };

    socket.onmessage = (event: MessageEvent) => {
      let data = event.data;
      try {
        data = JSON.parse(data);
      } catch (error) {}
      // 处理收到的消息
      options.message(data);
    };

    socket.onclose = (event: CloseEvent) => {
      console.log('WebSocket连接已关闭:', event.code, event.reason);
      stopHeartbeat();
      reconnect();
    };

    socket.onerror = (error: Event) => {
      console.error('WebSocket连接发生错误:', error);
    };
  };

  const startHeartbeat = () => {
    stopHeartbeat(); // 先停止之前的心跳定时器

    socket?.addEventListener('pong', () => {
      console.log('收到心跳回应');
    });

    const sendHeartbeat = () => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send('ping');
      }
    };

    pingIntervalId = setInterval(sendHeartbeat, options.pingInterval);
  };

  const stopHeartbeat = () => {
    clearInterval(pingIntervalId!);
  };

  const reconnect = () => {
    if (reconnectAttempts >= options.maxReconnectAttempts) {
      console.error('WebSocket连接失败，已达到最大重连次数');
      return;
    }

    reconnectAttempts++;
    console.log(`正在尝试重新连接，第 ${reconnectAttempts} 次`);

    setTimeout(() => {
      connect();
    }, options.reconnectInterval);
  };

  const send = (message: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(typeof message === 'string' ? message : JSON.stringify(message));
    } else {
      console.error('WebSocket连接未打开，无法发送消息');
    }
  };

  const close = () => {
    socket?.close();
  };

  return {
    connect,
    send,
    close
  };
};
