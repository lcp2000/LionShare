=== LionShare File Sharing Utility ===
Contributors: lionshare
Tags: file sharing, peer-to-peer, p2p, privacy, qr code
Requires at least: 6.2
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.0.0
License: MIT
License URI: https://opensource.org/license/mit

Private, expiring browser-to-browser file sharing for WordPress, with white-label branding.

== Description ==

LionShare adds a peer-to-peer file sharing app to WordPress. File contents remain in the sender's browser and travel directly to the receiver through a WebRTC data connection. WordPress does not receive or store the shared file bytes.

Features:

* One or many files, with automatic ZIP packaging for multi-file shares.
* 1.5 GB selection limit.
* Two, five, or ten minute expiration.
* QR code and copyable sharing link.
* Direct-to-disk streaming in supported Chromium browsers.
* Browser previews for images, PDFs, and text files.
* English and Spanish interfaces.
* Light and dark themes.
* White-label title, logo, app icon, and favicon.
* Bundled PeerJS, JSZip, and QRCode.js assets; no front-end CDN dependency.

LionShare is based on the MIT-licensed Giraffile project by jahp / coffeetron832.

Important: Peer-to-peer delivery requires the sender to keep the sharing page open until the receiver finishes. WebRTC may use signaling or relay infrastructure to establish connectivity, but file contents are never stored by WordPress.

== Installation ==

1. Upload `lionshare.zip` from Plugins > Add New > Upload Plugin.
2. Activate LionShare.
3. Create or edit a page and add the shortcode `[lionshare]`.
4. Open Settings > LionShare to change the app title, logo, icon, or favicon.

For the cleanest app experience, use a full-width page template without a sidebar.

== Frequently Asked Questions ==

= Are files uploaded to WordPress? =

No. File bytes remain in browser storage on the sender's device and are sent through a peer-to-peer WebRTC data connection.

= Must the sender keep the page open? =

Yes. The sender's browser is the source of the file. Closing the tab or losing connectivity ends availability.

= Why does direct-to-disk saving not appear in Firefox or Safari? =

That option depends on the File System Access API. Browsers without it receive the file into browser memory and then offer a normal download.

= Can I use my own PeerJS signaling server? =

Yes. Developers can filter `lionshare_peer_config` and return PeerJS connection options such as host, port, path, secure, and key.

== Changelog ==

= 1.0.0 =

* Initial WordPress release.
