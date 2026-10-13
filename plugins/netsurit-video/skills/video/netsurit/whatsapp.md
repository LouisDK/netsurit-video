# Delivering on WhatsApp (the primary send)

```bash
node <skill>/engine/tools/export.mjs pieces/<name> --formats 9:16,16:9 --share
node <skill>/scripts/whatsapp.mjs pieces/<name>          # 9:16 must be in the piece's formats
```

| file | what | send it |
|---|---|---|
| `renders/whatsapp.mp4` | 720×1280 H.264, CRF 18 (or two-pass sized to 15 MB if that is bigger), AAC 96k, fast start | in chats, as a video |
| `renders/whatsapp-hd.mp4` | 1080×1920, CRF 18, AAC 160k | as a document, by email, Teams or a link |
| `renders/final-1920x1080.mp4` (or `final.mp4` if 16:9 is main) | 16:9 master | decks, LinkedIn, the intranet |

Why: WhatsApp's HD send is capped at 720p and very large videos get squeezed hard, so a file that is already 720p and inside the limit leaves it little to do. The Enterprise Brain (2:57) came out at 14.8 MB with SSIM 0.9993 against the lossless frames; small text stayed crisp.

**Before it goes out:** send `whatsapp.mp4` to yourself (once as a normal send, once with HD), watch it on a phone with the sound on and off, and check the first frame (the thumbnail is the lower third: title, name, unit). WhatsApp doesn't publish its compression settings, so this is the one check the tools can't do.

**Length:** under 3 minutes keeps a 720p file comfortably under the limit; past ~4 minutes text starts to soften (the script warns under ~350 kbit/s). Make a shorter cut rather than squeezing.
