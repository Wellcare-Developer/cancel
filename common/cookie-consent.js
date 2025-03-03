// Cookie Consent Banner
document.addEventListener('DOMContentLoaded', function() {
    // Check if user has already consented
    if (!localStorage.getItem('cookieConsent')) {
        createConsentBanner();
    }
});

function createConsentBanner() {
    // Create banner element
    const banner = document.createElement('div');
    banner.className = 'cookie-consent-banner';
    
    // Banner content
    banner.innerHTML = `
        <div class="cookie-content">
            <p>This website uses cookies to enhance your experience and to display personalized ads through Google AdSense. 
               By clicking "Accept", you consent to the use of cookies. 
               <a href="pages/Privacy/privacy-policy.html" id="privacy-policy-link">Learn more about our Privacy Policy</a>.</p>
            <div class="cookie-buttons">
                <button id="cookie-accept" class="cookie-button accept">Accept</button>
                <button id="cookie-decline" class="cookie-button decline">Decline</button>
            </div>
        </div>
    `;
    
    // Append banner to body
    document.body.appendChild(banner);
    
    // 动态调整隐私政策链接
    const privacyLink = document.getElementById('privacy-policy-link');
    if (privacyLink) {
        // 检查当前URL是否是本地文件
        const isLocalFile = window.location.protocol === 'file:';
        
        if (isLocalFile) {
            // 如果是本地文件，使用相对路径
            // 根据当前页面的深度调整路径
            const pathDepth = (window.location.pathname.match(/\//g) || []).length;
            let relativePath = '';
            
            if (pathDepth <= 2) {
                relativePath = 'pages/Privacy/privacy-policy.html';
            } else {
                // 对于更深层次的页面，添加适当数量的../
                const upDirs = '../'.repeat(pathDepth - 2);
                relativePath = upDirs + 'pages/Privacy/privacy-policy.html';
            }
            
            privacyLink.href = relativePath;
        } else {
            // 如果是服务器，使用根路径
            privacyLink.href = '/pages/Privacy/privacy-policy.html';
        }
    }
    
    // Add event listeners to buttons
    document.getElementById('cookie-accept').addEventListener('click', function() {
        acceptCookies();
        removeBanner(banner);
    });
    
    document.getElementById('cookie-decline').addEventListener('click', function() {
        declineCookies();
        removeBanner(banner);
    });
}

function acceptCookies() {
    // Set consent in localStorage
    localStorage.setItem('cookieConsent', 'accepted');
    
    // Initialize Google Analytics and AdSense with full functionality
    console.log('Cookies accepted - Analytics and AdSense enabled');
    
    // Load AdSense script if it exists
    if (typeof initializeAdSense === 'function') {
        initializeAdSense();
    } else {
        // If adsense-integration.js is not yet loaded, we can load it dynamically
        loadScript('adsense-integration.js', function() {
            if (typeof initializeAdSense === 'function') {
                initializeAdSense();
            }
        });
    }
}

function declineCookies() {
    // Set declined consent in localStorage
    localStorage.setItem('cookieConsent', 'declined');
    
    console.log('Cookies declined - Limited functionality enabled');
    
    // Set up non-personalized ads
    if (typeof setupNonPersonalizedAds === 'function') {
        setupNonPersonalizedAds();
    } else {
        // If adsense-integration.js is not yet loaded, we can load it dynamically
        loadScript('adsense-integration.js', function() {
            if (typeof setupNonPersonalizedAds === 'function') {
                setupNonPersonalizedAds();
            }
        });
    }
    
    // Disable Google Analytics tracking if it exists
    if (window.ga) {
        window['ga-disable-UA-XXXXXXXX-X'] = true; // Replace with your actual GA ID
    }
}

function removeBanner(banner) {
    // Add fade-out class
    banner.classList.add('fade-out');
    
    // Remove banner after animation completes
    setTimeout(function() {
        banner.remove();
    }, 300);
}

// Helper function to load scripts dynamically
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
} 