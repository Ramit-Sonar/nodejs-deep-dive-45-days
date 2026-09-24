# 🚀 Episode 11 — Creating a Server

## 🖥️ Server
A **server** is a computer or software that provides data/services to clients over a network.

- 🖥️ **Hardware Server** → Physical computer.
- ⚙️ **Software Server** → Program running on a computer that handles client requests.

Our own computer can also act as a server, but it has limitations like power failure, unstable internet, limited CPU/RAM/storage, and difficulty handling many users.

## ☁️ AWS EC2
**AWS EC2 is also a computer/server**, but it is a cloud-based computer provided by AWS. We use cloud servers because they provide infrastructure designed for continuous availability, remote access, scalability, and handling applications reliably.

## 🌐 Client → DNS → Server
When a client accesses a website:

**Client → Domain Name → DNS → IP Address → Server**

- 🌐 **DNS** → Converts a domain name into an IP address.
- 📍 **IP Address** → Identifies the network destination.
- 🚪 **Port Number** → Identifies the particular service/application on that computer.

A computer can run multiple servers using different ports:

**Port 3000 → Server 1 | Port 5000 → Server 2 | Port 7777 → Server 3**

So the port number helps the operating system know which server/application should receive the request.

## 📦 TCP/IP & Packets
**TCP/IP** is a set of networking protocols used for communication over networks.

- 🌐 **IP** → Handles addressing and routing.
- 🔗 **TCP** → Provides reliable and ordered delivery of data.
- 📦 **Packets** → Data is divided into smaller pieces for transmission through the network.

**Data → Packets → Network → Server → Data**

## 📡 Protocols
A **protocol** is a set of rules for communication.

- 🌐 **HTTP** → Web communication
- 📁 **FTP** → File transfer
- 📧 **SMTP** → Sending email

## 🌊 Stream & 🧺 Buffer
**Stream** → Continuous flow of data, usually processed piece by piece.

**Buffer** → Temporary memory that holds binary data/chunks while data is being transferred or processed.

**Stream = 🚰 Pipe | Buffer = 🪣 Bucket | Data = 💧 Water**

## 🔌 Socket
A **socket** is a communication endpoint through which applications send and receive data over a network.

**Client ↔ Socket ↔ Network ↔ Socket ↔ Server**

## 🔄 Socket vs WebSocket
**Socket** → A general communication endpoint used for network communication. Depending on the protocol and connection handling, the connection may be closed after communication.

**WebSocket** → A protocol that keeps a **persistent connection open**, allowing the client and server to continuously exchange data in both directions.

**Typical Request/Response:** Client → Request → Server → Response → Connection may close

**WebSocket:** Client ⇄ Persistent Connection ⇄ Server

WebSocket is commonly used for real-time communication such as chat and live notifications.

## 🏗️ How Large Applications Store Data
Large applications generally don't store every type of data on one server. Different specialized services can handle different responsibilities.

**Client → Backend → Database / File Storage / Cache**

For example:

**React → Node.js/Express → MongoDB Atlas (database) + Cloudinary (media/files)**

## 🧠 Overall Flow

**Client → DNS → IP + Port → Server → HTTP/WebSocket → Socket → TCP/IP → Packets → Network**

> ⭐ **Core Idea:** A server is a computer or software that provides services to clients. The client finds the server using DNS/IP, connects to the required port, and communicates through networking protocols such as HTTP or WebSocket. Modern applications separate different types of data and responsibilities across specialized services.