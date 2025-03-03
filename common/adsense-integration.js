// Google AdSense Integration
// This file should be included after you've been approved for Google AdSense

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize AdSense if user has consented to cookies
    if (localStorage.getItem('cookieConsent') === 'accepted') {
        initializeAdSense();
    }
});

function initializeAdSense() {
    // Replace placeholder ad elements with actual AdSense code
    replaceAdPlaceholders();
    
    // You can add additional AdSense configuration here
    console.log('AdSense initialized with personalized ads');
}

function replaceAdPlaceholders() {
    // Example of how to replace ad placeholders with actual AdSense code
    // You'll need to replace these with your actual AdSense ad units
    
    // Replace left sidebar ads
    const leftSidebarAds = document.querySelectorAll('.ad-left .ad-placeholder');
    leftSidebarAds.forEach(placeholder => {
        // Replace with your actual AdSense code for sidebar
        placeholder.innerHTML = `
            <!-- Replace this comment with your AdSense ad unit code -->
            <!-- Example: -->
            <!-- <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot="XXXXXXXXXX"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
                 <script>(adsbygoogle = window.adsbygoogle || []).push({});</script> -->
            <p>Google AdSense Ad</p>
        `;
    });
    
    // Replace right sidebar ads
    const rightSidebarAds = document.querySelectorAll('.ad-right .ad-placeholder');
    rightSidebarAds.forEach(placeholder => {
        // Replace with your actual AdSense code for sidebar
        placeholder.innerHTML = `
            <!-- Replace this comment with your AdSense ad unit code -->
            <p>Google AdSense Ad</p>
        `;
    });
    
    // Replace banner ads
    const bannerAds = document.querySelectorAll('.ad-banner .ad-placeholder');
    bannerAds.forEach(placeholder => {
        // Replace with your actual AdSense code for banner
        placeholder.innerHTML = `
            <!-- Replace this comment with your AdSense ad unit code -->
            <p>Google AdSense Banner</p>
        `;
    });
}

// Function to handle non-personalized ads if user declines cookies
function setupNonPersonalizedAds() {
    // This would be called if user declines cookies
    // You can set up non-personalized ads here
    
    // Example of setting non-personalized ads parameter
    // window.adsbygoogle = window.adsbygoogle || [];
    // window.adsbygoogle.requestNonPersonalizedAds = 1;
    
    console.log('AdSense initialized with non-personalized ads');
} 