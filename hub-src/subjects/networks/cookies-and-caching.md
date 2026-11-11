---
title: Cookies and caching
summary: How a site remembers you between requests with cookies, and how saved copies make pages load faster.
sources:
- RFC 6265, HTTP State Management Mechanism | https://www.rfc-editor.org/rfc/rfc6265
- RFC 9111, HTTP Caching | https://www.rfc-editor.org/rfc/rfc9111
- RFC 9110, HTTP Semantics | https://www.rfc-editor.org/rfc/rfc9110
check:
- A server sets a cookie with a Set-Cookie header, and the browser sends it back in a Cookie header on later requests | RFC 6265 section 4
- A cookie can have an expiry set by Expires or Max-Age | RFC 6265 sections 4.1.2.1 and 4.1.2.2
- The Secure attribute limits a cookie to secure connections, and HttpOnly hides it from scripts | RFC 6265 sections 4.1.2.5 and 4.1.2.6
- Cache-Control with max-age says how many seconds a response stays fresh | RFC 9111 section 5.2.2.1
- A client can ask the server whether a stored copy is still current, using an ETag and If-None-Match | RFC 9110 section 13.1.2 and RFC 9111 section 4.3.1
- A 304 Not Modified response means the stored copy can be used | RFC 9110 section 15.4.5
---

HTTP forgets each request. Yet a shop remembers what is in your basket, and a page you saw a minute ago loads at once. Cookies and caches are how.

## Start with a coat-check ticket

You hand over your coat and get a ticket. On the next visit you show the ticket, and they know which coat is yours. They do not remember you. They only recognise the ticket. A cookie is the ticket.

## Cookies

A server sends a small piece of text with its reply, in a `Set-Cookie` header. The browser stores it. On every later request to that site, the browser sends it back in a `Cookie` header. The server reads the value and knows which session this is.

A cookie can have a lifetime (`Max-Age` or `Expires`). It can be marked `Secure`, so it only travels over secure connections, and `HttpOnly`, so scripts on the page cannot read it.

## Caching

A *cache* is a saved copy. A server can say how long a copy stays fresh:

`Cache-Control: max-age=3600`

That means "you can reuse this for 3,600 seconds (one hour) without asking me".

When a copy is old, the browser does not have to download it again. It can ask: "has this changed?" It sends the copy's *ETag* (a label for its version) in an `If-None-Match` header. If nothing changed, the server replies `304 Not Modified`, with no body, and the browser uses its copy.

:::example Worked example
A page is sent with `Cache-Control: max-age=3600`. The browser fetches it at time 0 seconds.

| Time | What happens |
|---|---|
| 0 s | Downloaded and saved |
| 1,800 s | Still fresh (under 3,600), so the saved copy is used. No request is sent. |
| 4,000 s | Not fresh (over 3,600). The browser asks with its ETag. |
| 4,000 s, reply 304 | Nothing changed, so the saved copy is used, and a fresh lifetime starts. |
:::

## Common mistakes

- **"A cookie is a program."** It is a small piece of text.
- **"Caching means the page never updates."** The `max-age` limits it, and the browser can check with the server.

## Check yourself

:::check
Q: Which header does the browser use to send a cookie back?
A: The Cookie header.
Q: A response has max-age=60. After how many seconds is it no longer fresh?
A: After 60 seconds.
Q: What does a 304 reply tell the browser?
A: The saved copy is still current, so use it.
:::

:::deeper
**Tracking.** A cookie from a site other than the one you are visiting can be used to follow people across sites. Browsers now give people more control over these.
:::
