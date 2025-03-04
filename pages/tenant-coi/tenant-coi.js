// Global variables
let formData = {};

// DOM elements
const generateBtn = document.getElementById('generate-btn');
const printBtn = document.getElementById('print-btn');
const copyBtn = document.getElementById('copy-btn');
const emptyState = document.getElementById('empty-state');
const certificateContent = document.getElementById('certificate-content');
const certificatePreview = document.querySelector('.certificate-preview');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add generate button event listener
    generateBtn.addEventListener('click', validateAndGenerateCertificate);
    
    // Add print button event listener
    printBtn.addEventListener('click', printCertificate);
    
    // Add copy button event listener
    copyBtn.addEventListener('click', copyCertificateContent);
});

// Validate form and generate certificate
function validateAndGenerateCertificate() {
    // Get all input values
    const insuredName = document.getElementById('insured-name').value.trim();
    const insuredLocation = document.getElementById('insured-location').value.trim();
    const riskAddress = document.getElementById('risk-address').value.trim();
    const effectiveDate = document.getElementById('effective-date').value.trim();
    const expiryDate = document.getElementById('expiry-date').value.trim();
    
    // Get insurer
    let insurer = document.getElementById('insurer-select').value;
    if (insurer === 'other') {
        insurer = document.getElementById('insurer').value.trim();
    } else if (insurer) {
        // Convert selected value to display name
        const insurerSelect = document.getElementById('insurer-select');
        insurer = insurerSelect.options[insurerSelect.selectedIndex].text;
    }
    
    const policyNumber = document.getElementById('policy-number').value.trim();
    const liability = document.getElementById('liability-select').value === 'other' 
        ? document.getElementById('liability').value.trim()
        : document.getElementById('liability-select').value;
    const contentValue = document.getElementById('content-value-select').value === 'other'
        ? document.getElementById('content-value').value.trim()
        : document.getElementById('content-value-select').value;
    const deductible = document.getElementById('deductible-select').value === 'other'
        ? document.getElementById('deductible').value.trim()
        : document.getElementById('deductible-select').value;
    
    // Get signature
    const signatureName = document.getElementById('signature-name').value.trim();
    
    // Validate required fields
    const requiredFields = [
        { value: insuredName, name: 'Insured Name' },
        { value: insuredLocation, name: 'Insured Location' },
        { value: riskAddress, name: 'Risk Address' },
        { value: effectiveDate, name: 'Effective Date' },
        { value: expiryDate, name: 'Expiry Date' },
        { value: insurer, name: 'Insurer' },
        { value: policyNumber, name: 'Policy Number' },
        { value: liability, name: 'Liability' },
        { value: contentValue, name: 'Content Value' },
        { value: deductible, name: 'Deductible' },
        { value: signatureName, name: 'Authorized Signature Name' }
    ];
    
    // Check for empty fields
    const emptyFields = requiredFields.filter(field => !field.value);
    if (emptyFields.length > 0) {
        const fieldNames = emptyFields.map(field => field.name).join(', ');
        alert(`Please fill in the following required fields: ${fieldNames}`);
        return;
    }
    
    // Validate date format and logic
    const effectiveDateTime = new Date(effectiveDate);
    const expiryDateTime = new Date(expiryDate);
    
    if (isNaN(effectiveDateTime.getTime())) {
        alert('Please enter a valid effective date');
        return;
    }
    
    if (isNaN(expiryDateTime.getTime())) {
        alert('Please enter a valid expiry date');
        return;
    }
    
    if (effectiveDateTime >= expiryDateTime) {
        alert('Expiry date must be later than effective date');
        return;
    }
    
    // Save form data
    formData = {
        insuredName,
        insuredLocation,
        riskAddress,
        effectiveDate: formatDate(effectiveDateTime),
        expiryDate: formatDate(expiryDateTime),
        insurer,
        policyNumber,
        liability,
        contentValue,
        deductible,
        signatureName
    };
    
    // Generate certificate
    generateCertificate();
}

// Format date to more readable format
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format currency
function formatCurrency(amount) {
    if (!amount) return '';
    const number = parseInt(amount.replace(/[^0-9]/g, ''));
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number).replace('USD', '$');
}

// Generate certificate
function generateCertificate() {
    // Hide empty state, show certificate content
    emptyState.classList.add('hidden');
    certificateContent.classList.remove('hidden');
    
    // Create certificate HTML
    const certificateHTML = `
        <div class="certificate-header">
            <div class="certificate-logo">
                <img src="BrokerTeamInsurance_BT20-Colored.png" alt="Insurance Logo" class="logo-image">
            </div>
            <div class="certificate-title">
                <h2 style="font-size: 20px; color: #2c3e50; font-weight: 600; margin-bottom: 8px;">TENANT INSURANCE CONFIRMATION</h2>
                <h3 style="font-size: 14px; color: #7f8c8d; margin: 4px 0;">9560 MARKHAM RD UNIT 117, MARKHAM ON L6E 0V1</h3>
                <h3 style="font-size: 14px; color: #7f8c8d; margin: 4px 0;">TEL: (905) 472-5666</h3>
            </div>
        </div>
        
        <div class="certificate-body">
            <div class="certificate-section" style="margin-bottom: 25px;">
                <div class="certificate-row">
                    <div class="certificate-label">Insured:</div>
                    <div class="certificate-value">${formData.insuredName}</div>
                </div>
                <div class="certificate-row">
                    <div class="certificate-label">Insured Location:</div>
                    <div class="certificate-value">${formData.insuredLocation}</div>
                </div>
                <div class="certificate-row">
                    <div class="certificate-label">Risk Address:</div>
                    <div class="certificate-value">${formData.riskAddress}</div>
                </div>
            </div>
            
            <div class="certificate-section" style="margin-bottom: 25px;">
                <div class="certificate-row">
                    <div class="certificate-label">Insurer:</div>
                    <div class="certificate-value">${formData.insurer}</div>
                </div>
                <div class="certificate-row">
                    <div class="certificate-label">Policy Number:</div>
                    <div class="certificate-value">${formData.policyNumber}</div>
                </div>
            </div>
            
            <div class="certificate-section" style="margin-bottom: 25px;">
                <div class="certificate-row">
                    <div class="certificate-label">Effective Date:</div>
                    <div class="certificate-value">${formData.effectiveDate}</div>
                </div>
                <div class="certificate-row">
                    <div class="certificate-label">Expiry Date:</div>
                    <div class="certificate-value">${formData.expiryDate}</div>
                </div>
            </div>
            
            <div class="certificate-section coverage-section" style="margin: 80px 0 30px;">
                <h3 style="margin: 50px 0 15px; font-size: 16px; color: #2c3e50; font-weight: 600; padding-bottom: 8px; display: inline-block; border-bottom: 1px solid #000000; width: 50%;">Insurance Coverage</h3>
                <div class="certificate-row">
                    <div class="certificate-label">Liability:</div>
                    <div class="certificate-value">${formatCurrency(formData.liability)}</div>
                </div>
                <div class="certificate-row">
                    <div class="certificate-label">Content Value:</div>
                    <div class="certificate-value">${formatCurrency(formData.contentValue)}</div>
                </div>
                <div class="certificate-row">
                    <div class="certificate-label">Deductible:</div>
                    <div class="certificate-value">${formatCurrency(formData.deductible)}</div>
                </div>
            </div>
            
            <div class="certificate-section">
                <p class="certificate-note">This binder is valid for 365 days from the effective date. Terms and conditions are to be governed by actual policy issued by the insurer.</p>
            </div>
            
            <div class="certificate-footer" style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px; padding: 20px 0;">
                <div class="certificate-date" style="font-size: 14px; color: #7f8c8d; min-width: 200px;">
                    Signed Date: ${new Date().toLocaleDateString('en-US')}
                </div>
                
                <div class="certificate-signature" style="min-width: 320px; text-align: right; margin-bottom: -20px;">
                    <div style="border: 1px solid #3498db; border-radius: 5px; padding: 20px 30px; display: inline-block; position: relative; background: #f8f9fa; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; min-width: 260px;">
                        <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: white; padding: 0 10px; font-size: 12px; color: #7f8c8d;">Signed electronically by</div>
                        <div style="padding: 15px 0; font-family: 'Brush Script MT', 'Segoe Script', 'Bradley Hand', cursive; font-size: 32px; color: #2c3e50; line-height: 1.2; min-width: 240px; text-align: center;">
                            ${generateSignature(formData.signatureName)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Update certificate preview
    certificatePreview.innerHTML = certificateHTML;
    
    // Scroll to certificate section
    certificateContent.scrollIntoView({ behavior: 'smooth' });
}

// Print certificate
function printCertificate() {
    // Get certificate content
    const certificateHtml = certificatePreview.innerHTML;
    
    // Create print window
    const printWindow = window.open('', '_blank');
    
    // Write HTML content
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Certificate of Insurance - ${formData.insuredName}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 20px;
                }
                
                .certificate-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #2c3e50;
                    padding-bottom: 10px;
                }
                
                .logo-image {
                    max-width: 200px;
                    max-height: 80px;
                }
                
                .certificate-title {
                    text-align: right;
                }
                
                .certificate-title h2 {
                    font-size: 20px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 8px;
                }
                
                .certificate-title h3 {
                    font-size: 14px;
                    color: #7f8c8d;
                    margin: 4px 0;
                }
                
                .certificate-section {
                    margin-bottom: 20px;
                }
                
                .certificate-row {
                    display: flex;
                    margin-bottom: 10px;
                }
                
                .certificate-label {
                    font-weight: 600;
                    color: #34495e;
                    width: 200px;
                    flex-shrink: 0;
                    font-size: 14px;
                }
                
                .certificate-value {
                    color: #2c3e50;
                    font-weight: 500;
                    font-size: 14px;
                }
                
                .coverage-section h3 {
                    margin: 80px 0 15px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #2c3e50;
                    padding-bottom: 8px;
                    display: inline-block;
                    border-bottom: 1px solid #000000;
                    width: 50%;
                }
                
                .certificate-note {
                    font-size: 12px;
                    font-style: italic;
                    color: #7f8c8d;
                    margin: 5px 0;
                }
                
                .certificate-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-top: 60px;
                }
                
                .certificate-date {
                    min-width: 200px;
                }
                
                .certificate-signature {
                    min-width: 320px;
                }
                
                @media print {
                    body {
                        padding: 0;
                        margin: 0;
                    }
                    
                    @page {
                        margin: 1.5cm;
                    }
                }

                @font-face {
                    font-family: 'Cursive Font';
                    src: local('Brush Script MT'), 
                         local('Segoe Script'), 
                         local('Bradley Hand'), 
                         local('Comic Sans MS');
                }

                .signature-section {
                    margin-top: 20px;
                }

                .certificate-signature {
                    font-family: 'Cursive Font', cursive;
                    color: #2c3e50;
                }
            </style>
        </head>
        <body>
            ${certificateHtml}
        </body>
        </html>
    `);
    
    // Wait for images to load before printing
    printWindow.document.addEventListener('load', function() {
        printWindow.print();
        // printWindow.close();
    }, true);
    
    // If load event doesn't trigger, set timeout
    setTimeout(function() {
        printWindow.print();
        // printWindow.close();
    }, 1000);
}

// Copy certificate content
function copyCertificateContent() {
    try {
        // Create a range selection
        const range = document.createRange();
        range.selectNode(certificatePreview);
        
        // Clear current selection
        window.getSelection().removeAllRanges();
        
        // Select certificate content
        window.getSelection().addRange(range);
        
        // Copy to clipboard
        document.execCommand('copy');
        
        // Clear selection
        window.getSelection().removeAllRanges();
        
        // Show success message
        alert('Certificate content copied to clipboard');
    } catch (err) {
        // If copy fails, prompt user to copy manually
        alert('Automatic copy failed, please select and copy the content manually');
        console.error('Copy failed:', err);
    }
}

// Signature generation function
function generateSignature(name) {
    if (!name) return '';
    
    const randomRotation = Math.floor(Math.random() * 5) - 2;
    const randomSize = Math.floor(Math.random() * 6) + 20;
    
    return `<span style="font-family: 'Brush Script MT', 'Segoe Script', 'Bradley Hand', cursive; 
                     font-size: ${randomSize}px; 
                     transform: rotate(${randomRotation}deg); 
                     display: inline-block;
                     color: #000080;
                     text-align: center;
                     width: 100%;
                     text-shadow: 0.5px 0.5px 1px rgba(0,0,0,0.2);">${name}</span>`;
} 