---
title: Streaming
summary: How video and music play while they download, and how the player picks a quality that your connection can keep up with.
sources:
- Peterson and Davie, Computer Networks: A Systems Approach, section 7.2.4 (Transmitting MPEG over a Network, which covers HTTP adaptive streaming) | https://book.systemsapproach.org/data/multimedia.html
- RFC 8216, HTTP Live Streaming | https://www.rfc-editor.org/rfc/rfc8216
check:
- Streaming plays media while it is still being downloaded | Peterson and Davie 7.2.4
- A player keeps a buffer of media to smooth out changes in network speed | Peterson and Davie 7.2.4
- In HTTP adaptive streaming, media is split into short segments, each available at several bit rates | Peterson and Davie 7.2.4 and RFC 8216
- The player picks a bit rate for each segment based on how fast recent segments downloaded | Peterson and Davie 7.2.4
- Adaptive streaming uses ordinary HTTP servers | Peterson and Davie 7.2.4
---

When you press play on a video, it starts at once, long before the whole file has arrived. This page explains how, and why the picture sometimes gets blurrier for a moment.

## Start with a tap and a bucket

Water comes from a tap at a changing rate. You drink at a steady rate. A bucket in between smooths it out. As long as the bucket has water in it, you never go thirsty. The player's *buffer* is that bucket.

## The idea

A video is a long run of data. The player does not wait for all of it. It downloads the start, begins to play, and keeps downloading ahead of what you are watching. If the download is slower than playback for long enough, the buffer empties and the video stops to "buffer".

## How much data is a video?

The *bit rate* is the number of bits a second the video needs.

:::example Worked example
A video is encoded at 5 million bits a second. It lasts one hour. This was computed by a script.

5,000,000 bits a second × 3,600 seconds = 18,000,000,000 bits. Divide by 8 to get bytes: 2,250,000,000 bytes, which is 2.25 gigabytes.

So an hour at that bit rate uses about 2.25 GB.
:::

## Adaptive bit rate

Your connection speed changes. So services cut a video into short segments, a few seconds each, and prepare each segment at several bit rates. The player downloads one segment at a time with ordinary HTTP. After each one, it checks how fast it arrived and picks the quality for the next one.

:::example Worked example
These bit rates are made up.

| Quality | Bit rate |
|---|---|
| 1080p | 5 million bits a second |
| 720p | 3 million bits a second |
| 480p | 1.5 million bits a second |

The last segment arrived at 4 million bits a second. The player picks the best quality that fits: 720p, at 3 million. If the speed rises above 5 million, it moves up to 1080p.
:::

That is why a picture can get softer for a moment, instead of stopping.

## Common mistakes

- **"Streaming downloads the whole file first."** It plays while it downloads.
- **"A video has one quality."** The player switches between several, segment by segment.

## Check yourself

:::check
Q: What does the buffer do?
A: It holds downloaded video ahead of playback, so short slow patches do not stop it.
Q: Why is video cut into short segments?
A: So the player can change quality between segments.
Q: A video uses 2 million bits a second. About how many bytes is that in one second?
A: 250,000 bytes.
:::

:::deeper
**Live streams.** Live video has less time to buffer, so the delay between the event and your screen matters, and services trade quality against delay.
:::
