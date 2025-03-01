# Google AdSense Setup Guide

This document provides instructions on how to set up Google AdSense for your Insurance Short Rate Calculator website.

## Prerequisites

Before applying for Google AdSense, ensure your website meets these requirements:

1. Your website has original, valuable content
2. Your website complies with Google's program policies
3. Your website has a privacy policy page (already created)
4. Your website has a cookie consent mechanism (already implemented)
5. Your website is accessible to Google's crawlers

## Step 1: Apply for Google AdSense

1. Go to [Google AdSense](https://www.google.com/adsense/start/)
2. Sign in with your Google account
3. Enter your website URL (e.g., `https://www.insuranceshortrateCalculator.com`)
4. Enter your contact information
5. Accept the terms and conditions
6. Submit your application

## Step 2: Add AdSense Code to Your Website

After your application is approved, Google will provide you with an AdSense code snippet. You'll need to add this to your website.

1. In your AdSense account, find your AdSense code (it looks like `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>`)
2. Add this code to the `<head>` section of all your HTML files:
   - `index.html`
   - `cancellation-letter.html`
   - `privacy-policy.html`

Example:
```html
<head>
    <!-- Existing head content -->
    
    <!-- Google AdSense Code -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
</head>
```

## Step 3: Create Ad Units

1. In your AdSense account, go to "Ads" > "By ad unit"
2. Click "Create new ad unit"
3. Name your ad unit (e.g., "Sidebar Ad", "Banner Ad")
4. Choose the ad size and type
5. Save your ad unit
6. Copy the provided ad code

## Step 4: Replace Placeholder Ads

Open the `adsense-integration.js` file and replace the placeholder comments with your actual AdSense ad unit codes:

```javascript
// Replace left sidebar ads
const leftSidebarAds = document.querySelectorAll('.ad-left .ad-placeholder');
leftSidebarAds.forEach(placeholder => {
    placeholder.innerHTML = `
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    `;
});
```

Repeat this for the right sidebar and banner ad sections, using the appropriate ad unit codes.

## Step 5: Update Google Analytics ID (Optional)

If you're using Google Analytics, update the Analytics ID in the `cookie-consent.js` file:

```javascript
// Disable Google Analytics tracking if it exists
if (window.ga) {
    window['ga-disable-UA-XXXXXXXX-X'] = true; // Replace with your actual GA ID
}
```

## Step 6: Test Your Ads

1. Visit your website and accept cookies in the consent banner
2. Check that ads are displaying correctly in all ad spaces
3. Test on different devices and browsers to ensure responsive behavior

## Troubleshooting

- **No ads appearing**: It can take up to 24-48 hours for ads to start appearing after initial setup
- **Ad spaces showing blank**: Check browser console for errors; ensure your ad code is correctly implemented
- **Policy violations**: Review Google's AdSense program policies to ensure compliance

## Additional Resources

- [Google AdSense Help Center](https://support.google.com/adsense/)
- [AdSense Program Policies](https://support.google.com/adsense/answer/48182)
- [Ad Placement Policies](https://support.google.com/adsense/answer/1346295)

## Notes

- The cookie consent mechanism is already implemented and will only enable personalized ads if the user accepts cookies
- Non-personalized ads will be shown to users who decline cookies
- The privacy policy page includes all necessary disclosures about AdSense and cookies 