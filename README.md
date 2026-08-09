# LionShare File Sharing Utility

![LionShare logo](assets/images/lionshare-logo.png)

LionShare is a privacy-first WordPress file-sharing utility that transfers files directly between browsers using WebRTC. Shared file contents are not uploaded to or stored by WordPress.

## Features

- Browser-to-browser file transfers powered by PeerJS and WebRTC
- Expiring share links with 2, 5, or 10 minute lifetimes
- Multiple-file selection with automatic ZIP packaging
- QR code and copyable link sharing
- Direct-to-disk streaming in supported Chromium browsers
- In-browser previews for images, PDFs, and text files
- English and Spanish interfaces
- Light and dark themes
- White-label app title, logo, app icon, and favicon
- Brizy-compatible responsive layout that respects builder boundaries
- Locally bundled JavaScript dependencies with no front-end CDN requirement

## Requirements

- WordPress 6.2 or newer
- PHP 7.4 or newer
- HTTPS on the public-facing WordPress page
- A modern browser with WebRTC support

The sender must keep the LionShare page open until the recipient finishes receiving the file. The sender's browser is the file source.

## Install from a ZIP file

1. Download the latest `lionshare.zip` package from the repository's Releases page.
2. In WordPress, open **Plugins → Add New Plugin → Upload Plugin**.
3. Select the ZIP file and click **Install Now**.
4. Activate **LionShare File Sharing Utility**.
5. Create or edit the WordPress page where LionShare should appear.
6. Add the shortcode:

   ```text
   [lionshare]
   ```

7. Publish or update the page.

## Manual installation

1. Download or clone this repository.
2. Place the plugin files in:

   ```text
   wp-content/plugins/lionshare/
   ```

3. Verify that `lionshare.php` is directly inside that directory.
4. Activate the plugin from **WordPress → Plugins**.
5. Add `[lionshare]` to a WordPress page.

## Brizy Builder setup

1. Add a Brizy **Shortcode** element to the page.
2. Enter `[lionshare]` as the shortcode.
3. Set the Brizy section, row, or column width to the size you want LionShare to occupy.

LionShare fills 100% of its immediate Brizy parent without breaking outside the builder container. For a wider app, adjust the containing Brizy section or row rather than adding viewport-width CSS to the plugin.

## White-label settings

Open **WordPress → Settings → LionShare**. You can change:

- **App title** — defaults to `LionShare`
- **Logo** — recommended transparent horizontal PNG
- **App icon** — recommended square 512 × 512 PNG
- **Favicon** — PNG, ICO, or an SVG when WordPress permits SVG uploads

Use **Use default** beside an image field to restore the included LionShare branding.

## Using LionShare

### Send a file

1. Open the WordPress page containing LionShare.
2. Drag files into the drop zone or click it to browse.
3. Choose the link expiration time.
4. Click **Generate secure link**.
5. Copy the link or let the recipient scan the QR code.
6. Keep the page open until the transfer is complete.

When several files are selected, LionShare packages them into a ZIP file inside the sender's browser.

### Receive a file

1. Open the shared link while it is still valid and the sender is online.
2. In supported Chromium browsers, choose between saving directly to disk or receiving the file in browser memory.
3. Other browsers receive the file in memory and provide a preview or download button.

A file saved directly to disk no longer self-destructs. The recipient is responsible for deleting that local copy.

## Privacy and networking notes

- WordPress does not receive or store the shared file contents.
- IndexedDB temporarily stores sender and in-browser receiver copies on their respective devices.
- PeerJS signaling is used to establish the WebRTC connection.
- Network conditions, firewalls, NAT behavior, browser memory, and available disk space can affect transfers.
- LionShare does not scan files for malware. Only accept files from trusted senders and scan downloaded files appropriately.

## Custom PeerJS configuration

Developers can supply custom PeerJS connection settings with the `lionshare_peer_config` WordPress filter:

```php
add_filter(
    'lionshare_peer_config',
    function () {
        return array(
            'host'   => 'peer.example.com',
            'port'   => 443,
            'path'   => '/peerjs',
            'secure' => true,
        );
    }
);
```

## Project structure

```text
assets/       Front-end, admin, branding, and bundled vendor assets
includes/     WordPress plugin and settings classes
templates/    LionShare shortcode interface
lionshare.php Main WordPress plugin bootstrap
readme.txt    WordPress-style plugin documentation
uninstall.php Settings cleanup on uninstall
```

## Attribution

LionShare is based on the original [Giraffile](https://github.com/coffeetron832/Giraffile) project created by **jahp / coffeetron832**. Giraffile is used and adapted under the MIT License.

The original copyright and permission notice are retained in [LICENSE](LICENSE). Licenses for PeerJS, JSZip, and QRCode.js are included under [`assets/vendor/licenses`](assets/vendor/licenses).

## License

LionShare is distributed under the [MIT License](LICENSE).
