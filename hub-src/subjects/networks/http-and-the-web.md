---
title: HTTP and the web
summary: How a browser asks a server for a page, what the request and reply look like, and what the status codes mean.
practise:
- net/6.2 | Web Waiter
sources:
- RFC 9110, HTTP Semantics | https://www.rfc-editor.org/rfc/rfc9110
- RFC 9112, HTTP/1.1 | https://www.rfc-editor.org/rfc/rfc9112
- RFC 3986, Uniform Resource Identifier (URI): Generic Syntax | https://www.rfc-editor.org/rfc/rfc3986
- Peterson and Davie, Computer Networks: A Systems Approach, section 9.1.2 (World Wide Web (HTTP)) | https://book.systemsapproach.org/applications/traditional.html
check:
- A URL has a scheme, a host and a path | RFC 3986 section 3 and Peterson and Davie 9.1.2
- An HTTP request has a request line, header lines and an optional body | RFC 9112 section 3
- An HTTP/1.1 request must include a Host header | RFC 9112 section 3.2
- GET asks for a resource and POST sends data to be processed | RFC 9110 section 9
- Status codes starting with 2 mean success, 3 redirection, 4 client error and 5 server error | RFC 9110 section 15
- 200 means OK and 404 means Not Found | RFC 9110 section 15
- Each HTTP request is independent, so HTTP is stateless | RFC 9110 section 3.3
- HTTP/1.1 runs over TCP | RFC 9112 section 9
---

Every web page you open starts with one short question and one answer. This page shows what they look like, so you can read them yourself.

## Start with ordering at a counter

You say what you want: "A flat white, please." The server answers: "Here you are," or "Sorry, we have none." A browser and a web server do the same. The browser asks. The server replies with a result code and, usually, the item.

## The address

A web address is a *URL*. In `https://www.example.com/index.html`:

- `https` is the *scheme*, which says how to talk.
- `www.example.com` is the *host*, which DNS turns into an IP address.
- `/index.html` is the *path*, which says which page.

## The request and the reply

The browser connects (over TCP, as in the handshake page) and sends a text request. The server sends a text reply.

:::example Worked example
A request:

```
GET /index.html HTTP/1.1
Host: www.example.com
```

The first line says what to do (GET), which page (`/index.html`), and the version. The `Host` header says which site, because one server can host many.

A reply:

```
HTTP/1.1 200 OK
Content-Type: text/html

<html> ... the page ... </html>
```

The first line has the version, a code (200) and a short reason (OK). Then come headers, a blank line and the content.
:::

## Methods and status codes

The most common *methods* are GET, which asks for something, and POST, which sends data to be processed, such as a form.

Status codes are grouped by their first digit:

| Starts with | Meaning | Example |
|---|---|---|
| 2 | Success | 200 OK |
| 3 | Redirection | 301 Moved Permanently |
| 4 | The request was wrong | 404 Not Found |
| 5 | The server failed | 500 Internal Server Error |

## No memory

Each request stands alone. The server does not remember the last one. This keeps servers simple. The next page explains how sites add memory.

## Common mistakes

- **"HTTP and HTML are the same."** HTTP is the way to ask for a page. HTML is the language of the page.
- **"A 404 means the server is down."** It means the server is working and has no page at that path.

## Check yourself

:::check
Q: Which part of a URL tells you how to talk to the server?
A: The scheme, such as https.
Q: What does a 5xx status code mean?
A: The server had a problem.
Q: Why is HTTP called stateless?
A: Each request is treated on its own, with no memory of earlier ones.
:::

:::deeper
**Newer versions.** HTTP/2 sends the same messages in a binary form and shares one connection between many requests. HTTP/3 runs over QUIC instead of TCP.
:::
