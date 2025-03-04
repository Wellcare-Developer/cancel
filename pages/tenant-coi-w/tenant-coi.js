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
    
    // 修改复制按钮为返回表单按钮
    copyBtn.innerHTML = '<i class="fa-solid fa-arrow-rotate-left"></i><span>Get New Confirmation</span>';
    copyBtn.addEventListener('click', returnToForm);
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
    // 获取DOM元素
    const inputsSection = document.querySelector('.calculator-inputs');
    const resultsSection = document.querySelector('.calculator-results');
    const calculatorContainer = document.querySelector('.calculator-container');
    
    // 隐藏输入表单
    inputsSection.style.display = 'none';
    
    // 调整结果区域样式，使其占满整个容器
    resultsSection.style.cssText = `
        flex: 1;
        max-width: 100%;
        width: 100%;
        padding: 0 20px;
        margin: 0 auto;
    `;
    
    // 调整容器样式
    calculatorContainer.style.cssText = `
        display: block;
        width: 100%;
    `;
    
    // 隐藏空状态，显示证书内容
    emptyState.classList.add('hidden');
    certificateContent.classList.remove('hidden');
    
    // 更新按钮文本，确保显示正确
    copyBtn.innerHTML = '<i class="fa-solid fa-arrow-rotate-left"></i><span>Get New Confirmation</span>';
    
    // 添加样式使证书内容更美观
    const style = document.createElement('style');
    style.textContent = `
        .certificate-preview {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 25px;
            background-color: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin: 20px auto;
            max-width: 900px;
        }
        
        .results-header {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .download-options {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }
        
        .secondary-button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s ease;
        }
        
        .secondary-button:hover {
            background-color: #3182ce;
        }
        
        @media print {
            .certificate-preview {
                border: none;
                box-shadow: none;
                padding: 0;
                margin: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Create certificate HTML
    const certificateHTML = `
        <div class="certificate-header">
            <div class="certificate-logo">
                <img src="cropped-cropped-cropped-well-care-log1-e1622044439563.jpg" alt="Well Care Insurance Logo" class="logo-image">
            </div>
            <div class="certificate-title">
                <h2 style="font-size: 20px; color: #2c3e50; font-weight: 600; margin-bottom: 8px;">TENANT INSURANCE CONFIRMATION</h2>
                <h3 style="font-size: 14px; color: #7f8c8d; margin: 4px 0;">200 Town Centre Blvd Unit 101, Markham, ON L3R 8G5</h3>
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
    
    // 调换按钮位置
    const downloadOptions = document.querySelector('.download-options');
    downloadOptions.innerHTML = `
        <button id="copy-btn" class="secondary-button">
            <i class="fa-solid fa-arrow-rotate-left"></i>
            <span>Get New Confirmation</span>
        </button>
        <button id="print-btn" class="secondary-button">
            <i class="fas fa-print"></i>
            <span>Generate PDF / Print Form</span>
        </button>
    `;
    
    // 重新添加事件监听器
    document.getElementById('print-btn').addEventListener('click', printCertificate);
    document.getElementById('copy-btn').addEventListener('click', returnToForm);
    
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
                    max-height: 100px;
                    object-fit: contain;
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
                    
                    .calculator-inputs {
                        display: none !important;
                    }
                    
                    .calculator-results {
                        flex: 1 0 100% !important;
                        max-width: 100% !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    
                    .calculator-container {
                        display: block !important;
                        width: 100% !important;
                    }
                    
                    .certificate-preview {
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        max-width: 100% !important;
                    }
                    
                    .results-header, .download-options {
                        display: none !important;
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

// 返回表单页面
function returnToForm() {
    // 获取DOM元素
    const inputsSection = document.querySelector('.calculator-inputs');
    const resultsSection = document.querySelector('.calculator-results');
    const calculatorContainer = document.querySelector('.calculator-container');
    
    // 显示输入表单
    inputsSection.style.display = 'block';
    
    // 重置容器样式为默认的flex布局
    calculatorContainer.style.cssText = `
        display: flex;
        width: 100%;
    `;
    
    // 重置结果区域样式
    resultsSection.style.cssText = `
        flex: 1;
    `;
    
    // 隐藏证书内容，显示空状态
    certificateContent.classList.add('hidden');
    emptyState.classList.remove('hidden');
    
    // 滚动到表单顶部
    inputsSection.scrollIntoView({ behavior: 'smooth' });
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