### WebSocket

#### HTTP的难处

> 对于 HTTP 协议，通信只能由客户端发起，服务端无法主动向客户端推送信息，通过轮询方式就很消耗资源。

- 服务器消耗资源大
- 效率低下：有效轮询收获的信息少
- 网络压力大：HTTP请求包含各种头部，即使我们的请求里面没有任何信息，一个HTTP也要有好几百B的数据量，导致网络上产生各种无用流量

#### 协议介绍

> WebSocket 是一种全新的协议，将 TCP 的 Socket 应用在了 web page 上，从而使通信双方建立起一个保持在活动状态连接通道，并且属于全双工工作模式。
>
> WebSocket 协议是基于 Frame 而非 Stream ，也就是说，数据的传输不是像传统的流式读写一样按字节发送，而是采用一帧一帧的 Frame

#### 握手过程

通过`HTTP`请求向服务器请求更换协议

```js
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: ************==
Sec-WebSocket-Version: **
```

服务端接收到请求后，便会将请求头中的`Sec-WebSocket-Key`字段提取出来，追加一个固定的串，然后进行`SHA-1`加密，再进行一次`base64`编码生成一个新的`key`，作为响应头`Sec-WebSocket-Accept`返回，客户端会通过`Sec-WebSocket-Accept`与自己编码加密后的串进行匹配，匹配成功可以建立连接

101响应

```js
HTTP/1.1 101 Switching Protocols
Connection: Upgrade
Upgrade: WebSocket
Sec-WebSocket-Accept: ******************
```

握手成功后就是全双工通信了。



> 如果请求头带有`Sec-WebSocket-Protocol`字段，则服务器需要在响应头中包含同样的字段，内容就是选择的子协议之一。



#### 帧的结构

- FIN： 1 bit，用于表明是否是分片的最后一帧
- RSV1、2、3： 1 bit each，除非扩展协议为它们定义了非零值的含义，否则三者都应当被设置为 0
- opcode： 4 bit， 用于表明帧的含义
  - `0x00` ：当前帧继续传输上一帧的 payload
  - `0x01` ：当前帧的payload是文本数据
  - `0x02` ：当前帧的payload是二进制数据
  - `0x08` ：当前帧终止了链接
  - `0x09` ：当前帧为ping帧
  - `0x0a` ：当前帧为pong帧
- mask： 1 bit，标志位，表明payload是否用掩码处理
- payload_len： 7 bit / 7 + 16 bit / 7 + 64 bit，payload长度小于125 byte就是7 bit，如果是126则是 7+16，如果是127则是7+64
- masking-key： 32 bit，所有由客户端发送给服务器的帧都被一个包含在帧里面的 32 bit 的值进行了掩码处理。
- payload： 该帧的数据

#### 数据帧和控制帧

- 数据帧：opcode被置为 0x01 、0x02 的帧
- 控制帧：opcode被置为 0x00 、0x08 、0x09 、0x0a的帧，所有的控制帧必须有一个小于等于125字节（<=125btyes）的payload。而且控制帧**不允许被分片**

**心跳机制**

> 握手完成之后的任意时刻，客户端或者服务器都能够发送一个 ping 到对面。当 ping 被接收以后，接收方必须尽快回送一个 pong。这就是一次心跳，可以通过这个机制来确保客户端仍处于连接状态。一般Ping Frame用来对一个有超时机制的套接字keepalive或者验证对方是否有响应。
>
> 心跳检测的时候发送的帧就是`opcode`设为0x08的ping帧和opcode设为0x09的pong帧，当收到了一个 ping，回送的 pong 需要和 ping 具有一样的 payload data



#### 分片

payload 可以被划分为多个独立的帧。接收端被认为能够缓存这些帧，直到某个帧的 `fin` 位被设置。

> 分片的目的是：当消息传输开始时，允许传输一个未知大小的消息。相当于让产生数据和发送数据能够并行进行

合并各个帧的逻辑大致如下：

- 收到第一个帧
- 记录第一个帧的opcode，等于记录payload的类型
- 连接各个帧的payload直到`fin`被设置
- 判断后续每个包的opcode为0



#### 断开连接

- 发送关闭连接请求（Close Handshake）：发送一个 opcode 为 `0x8` 的控制帧来关闭连接。
- 关闭WebSocket连接：一旦收到这样一帧，另一端就需要发送一个关闭帧作为回应。但如果它正在发送数据，则可以推迟到当前数据发送完，再发送Close Frame。



#### 为什么需要掩码处理

> 有一些代理会以为websocket是个普通的http请求，在对请求数据转发的时候会解释请求。如果发现类似HTTP 请求头的时候就会转发相应的请求到服务器，如果请求数据是故意伪造的，那么有些代理就会向目标地址发起请求。这个可以用来攻击目标服务或者故意污染代理服务，导致其他用户会访问伪造的数据而被攻击。