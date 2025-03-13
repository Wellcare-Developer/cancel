// Global variables
let formData = {};
let originalEffectiveDate = "";
let originalExpiryDate = "";

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
    copyBtn.innerHTML = '<i class="fa-solid fa-arrow-rotate-left"></i><span>Get New Certificate</span>';
    copyBtn.addEventListener('click', returnToForm);
    
    // Initialize date pickers
    initDatePickers();
    
    // Same address checkbox functionality
    document.getElementById('same-address').addEventListener('change', function() {
        const propertyAddress = document.getElementById('property-address');
        const riskAddress = document.getElementById('risk-address');
        
        if(this.checked) {
            riskAddress.value = propertyAddress.value;
            riskAddress.disabled = true;
        } else {
            riskAddress.disabled = false;
        }
    });
    
    // Update risk address when property address changes if checkbox is checked
    document.getElementById('property-address').addEventListener('input', function() {
        const sameAddress = document.getElementById('same-address');
        const riskAddress = document.getElementById('risk-address');
        
        if(sameAddress.checked) {
            riskAddress.value = this.value;
        }
    });
    
    // Show/hide other insurer input
    document.getElementById('insurer-select').addEventListener('change', function() {
        const otherInsurer = document.getElementById('insurer');
        otherInsurer.classList.toggle('hidden', this.value !== 'other');
    });

    // Show/hide other liability input
    document.getElementById('liability-select').addEventListener('change', function() {
        const otherInput = document.getElementById('liability');
        otherInput.classList.toggle('hidden', this.value !== 'other');
        if(this.value !== 'other') {
            otherInput.value = this.value;
        } else {
            otherInput.value = '';
        }
    });

    // Show/hide other deductible input
    document.getElementById('deductible-select').addEventListener('change', function() {
        const otherInput = document.getElementById('deductible');
        otherInput.classList.toggle('hidden', this.value !== 'other');
        if(this.value !== 'other') {
            otherInput.value = this.value;
        } else {
            otherInput.value = '';
        }
    });
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // 初始化默认值
    document.getElementById('liability-select').value = '2000000';
    document.getElementById('deductible-select').value = '1000';
    
    // 触发所有相关事件
    ['liability-select', 'deductible-select'].forEach(id => {
        const element = document.getElementById(id);
        element.dispatchEvent(new Event('change'));
    });
});

// Initialize date pickers
function initDatePickers() {
    // Flatpickr configuration for effective date
    const effectiveDatePicker = flatpickr("#effective-date", {
        dateFormat: "Y-m-d",
        allowInput: true,
        altInput: true,
        altFormat: "F j, Y",
        disableMobile: true,
        position: 'auto',
        static: true,
        appendTo: document.body,
        onChange: function(selectedDates, dateStr, instance) {
            // 保存用户看到的格式化日期文本
            const formattedDate = instance.altInput.value;
            originalEffectiveDate = formattedDate;
            
            if (selectedDates.length > 0) {
                // Calculate expiry date (1 year from effective date)
                const expiryDate = new Date(selectedDates[0]);
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                
                // Update expiry date picker
                expiryDatePicker.setDate(expiryDate);
                
                // 重要：更新expiryDate的格式化文本
                // 确保使用相同的格式
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                               'July', 'August', 'September', 'October', 'November', 'December'];
                const month = months[expiryDate.getMonth()];
                const day = expiryDate.getDate();
                const year = expiryDate.getFullYear();
                originalExpiryDate = `${month} ${day}, ${year}`;
            }
        }
    });
    
    // Flatpickr configuration for expiry date
    const expiryDatePicker = flatpickr("#expiry-date", {
        dateFormat: "Y-m-d",
        allowInput: true,
        altInput: true,
        altFormat: "F j, Y",
        disableMobile: true,
        position: 'auto',
        static: true,
        appendTo: document.body,
        onChange: function(selectedDates, dateStr, instance) {
            // 保存用户看到的格式化日期文本
            const formattedDate = instance.altInput.value;
            originalExpiryDate = formattedDate;
        }
    });
}

// Format date to more readable format
function formatDate(date) {
    // 将日期格式化为"月 日, 年"格式
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
}

// Validate form and generate certificate
function validateAndGenerateCertificate() {
    // Get all input values
    const namedInsured = document.getElementById('named-insured').value.trim();
    const propertyAddress = document.getElementById('property-address').value.trim();
    const riskAddress = document.getElementById('risk-address').value.trim();
    
    // 获取多个抵押权人信息
    const mortgageeInfos = [];
    const mortgageeElements = document.querySelectorAll('.mortgagee-input');
    mortgageeElements.forEach(el => {
        const mortgageeText = el.value.trim();
        if (mortgageeText) {
            mortgageeInfos.push(parseMortgageeInfo(mortgageeText));
        }
    });
    
    // 获取日期原始值用于验证
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
    const buildingValue = document.getElementById('building-value').value.trim();
    const liability = document.getElementById('liability-select').value === 'other' 
        ? document.getElementById('liability').value.trim()
        : document.getElementById('liability-select').value;
    const deductible = document.getElementById('deductible-select').value === 'other'
        ? document.getElementById('deductible').value.trim()
        : document.getElementById('deductible-select').value;
    
    const guaranteedReplacement = document.getElementById('guaranteed-replacement').checked;
    
    // Get signature
    const signatureName = document.getElementById('signature-name').value.trim();
    
    // Validate required fields
    const requiredFields = [
        { value: namedInsured, name: 'Named Insured' },
        { value: propertyAddress, name: 'Insured Location' },
        { value: riskAddress, name: 'Risk Address' },
        { value: effectiveDate, name: 'Effective Date' },
        { value: expiryDate, name: 'Expiry Date' },
        { value: insurer, name: 'Insurer' },
        { value: policyNumber, name: 'Policy Number' },
        { value: liability, name: 'Liability' },
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
    
    // 使用全局保存的格式化日期文本，这是最可靠的方式
    // 如果没有（可能是用户手动输入了日期），则回退到默认的格式化方法
    const effectiveDateDisplay = originalEffectiveDate || formatDate(effectiveDateTime);
    const expiryDateDisplay = originalExpiryDate || formatDate(expiryDateTime);
    
    // Save form data
    formData = {
        namedInsured,
        propertyAddress,
        riskAddress,
        mortgageeInfos,
        effectiveDate: effectiveDateDisplay,
        expiryDate: expiryDateDisplay,
        insurer,
        policyNumber,
        buildingValue,
        liability,
        deductible,
        guaranteedReplacement,
        signatureName
    };
    
    // Generate certificate
    generateCertificate();
}

// Parse mortgagee information
function parseMortgageeInfo(mortgageeText) {
    if (!mortgageeText) return { name: '', address: '' };
    
    const lines = mortgageeText.trim().split('\n');
    if (lines.length === 0) return { name: '', address: '' };
    
    const name = lines[0].trim();
    const address = lines.slice(1).join(', ').trim();
    
    return { name, address };
}

// Format currency
function formatCurrency(amount) {
    if (!amount) return '';
    const number = parseInt(amount.toString().replace(/[^0-9]/g, ''));
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
    copyBtn.innerHTML = '<i class="fa-solid fa-arrow-rotate-left"></i><span>Get New Certificate</span>';
    
    // 添加样式使证书内容更美观
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --certificate-section-gap: 10px;
            --certificate-row-gap: 2px;
            --coverage-top-margin: 25px;
            --coverage-bottom-margin: 15px;
            --coverage-title-margin: 15px;
            --footer-top-margin: 20px;
            --footer-padding: 15px 0;
            --certificate-max-width: 900px;
        }
        
        .certificate-preview {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 25px;
            background-color: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin: 20px auto;
            max-width: var(--certificate-max-width);
        }
        
        .certificate-section {
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .certificate-row {
            display: flex;
            margin-bottom: var(--certificate-row-gap);
        }
        
        .coverage-section {
            margin: var(--coverage-top-margin) 0 var(--coverage-bottom-margin);
        }
        
        .coverage-section h3 {
            margin-bottom: var(--coverage-title-margin);
            font-size: 16px;
            font-weight: 600;
            color: #2c3e50;
            padding-bottom: 8px;
            display: inline-block;
            border-bottom: 1px solid #000000;
            width: 50%;
        }
        
        .certificate-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: var(--footer-top-margin);
            padding: var(--footer-padding);
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
        
        .signature-section {
            width: 300px;
        }
        
        .signature-content {
            margin-bottom: 5px;
            text-align: center;
        }
        
        /* 移除所有可能导致空行的样式 */
        .certificate-section + .certificate-section {
            margin-top: 0;
            padding-top: 0;
        }
        
        /* 确保没有边距导致的空行 */
        .certificate-row:last-child {
            margin-bottom: 0;
        }
        
        /* 移除可能的边框和填充 */
        .certificate-section, .certificate-row {
            border: none;
            padding: 0;
        }
    `;
    document.head.appendChild(style);
    
    // Create certificate HTML
    const certificateHTML = `
        <div class="certificate-header" style="text-align: center; margin-bottom: 20px;">
            <div class="certificate-logo" style="margin-bottom: 15px;">
                <img src="../../@photo/wellcare-coi-head.png" alt="Wellcare Insurance Logo" class="logo-image" style="max-width: 100%; height: auto;">
            </div>
        </div>
        
        <div class="certificate-body" style="margin-top: 20px; position: relative;">
            <div class="certificate-section" style="margin-bottom: 0;">
                <h2 style="text-align: center; font-size: 18px; margin-bottom: 10px; color: #333;">HOME INSURANCE CONFIRMATION</h2>
                <p class="certificate-note" style="margin-bottom: 15px; text-align: left; font-style: normal; color: #333; font-size: 14px; line-height: 1.4;">
                This is to certify that insurance on the property as herein described have been issued to the Insured(s) named below and are in force at this date.
                </p>
                
                <div class="certificate-row" style="margin-bottom: 2px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Named Insured:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.namedInsured}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 2px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Property Address:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.propertyAddress}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 2px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Risk Address:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.riskAddress}</div>
                </div>
            </div>
            <div class="certificate-section" style="margin-bottom: 0;">
                <div class="certificate-row" style="margin-bottom: 2px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Insurer:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.insurer}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 2px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Policy Number:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.policyNumber}</div>
                </div>
            </div>
            <div class="certificate-section" style="margin-bottom: 0;">
                <div class="certificate-row" style="margin-bottom: 2px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Effective Date:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.effectiveDate}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 2px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Expiry Date:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.expiryDate}</div>
                </div>
            </div>
            
            <!-- Coverage Section with Title and Underline -->
            <div class="certificate-section coverage-section" style="margin-top: 25px; margin-bottom: 15px;">
                <h3 style="font-size: 16px; font-weight: 600; color: #2c3e50; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #000000; display: inline-block; width: 50%;">Insurance Coverage</h3>
                
                <div class="certificate-row" style="margin-bottom: 2px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Building Value:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formatCurrency(formData.buildingValue)}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 2px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Liability:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formatCurrency(formData.liability)}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 2px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Deductible:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formatCurrency(formData.deductible)}</div>
                </div>
                ${formData.guaranteedReplacement ? `
                <div class="certificate-row" style="margin-bottom: 2px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Guaranteed Building:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">Yes</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 2px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Replacement Cost</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;"></div>
                </div>
                ` : ''}
            </div>
            
            <div class="certificate-section" style="margin-bottom: 0;">
                ${formData.mortgageeInfos && formData.mortgageeInfos.length > 0 ? formData.mortgageeInfos.map((mortgageeInfo, index) => `
                <div class="certificate-row" style="margin-bottom: 2px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Mortgagee:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px; white-space: pre-line;">${mortgageeInfo.name}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 2px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Mortgagee Address:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${mortgageeInfo.address}</div>
                </div>
                `).join('') : ''}
            </div>
            <div class="certificate-footer" style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 15px;">
                <div class="signature-section" style="width: 300px;">
                    <div class="signature-content" style="margin-bottom: 5px; text-align: center;">
                        ${generateSignature(formData.signatureName)}
                    </div>
                    <div style="border-bottom: 1px solid #333; width: 100%;"></div>
                    <div style="margin-top: 5px; font-size: 14px; text-align: center;">
                        <strong style="font-weight: 700; color: #000;">Authorized Representative:</strong> <span style="font-weight: 600;">${formData.signatureName}</span>
                    </div>
                    <div style="font-size: 12px; color: #666; margin-top: 3px; text-align: center;">
                        Date: ${new Date().toLocaleDateString()}
                    </div>
                </div>
                <div class="wellcare-bot" style="margin-bottom: 10px;">
                    <img src="../../@photo/wellcare-bot.png" alt="Wellcare Bot" style="width: 230px; height: auto;">
                </div>
            </div>

            <div style="margin-top: 15px;">
                <div style="border-top: 1px solid #999; width: 100%; margin: 10px 0;"></div>
                <p style="font-size: 11px; color: #666; line-height: 1.4; margin: 0; text-align: center;">
                The insurance afforded is subject to the terms, conditions and exclusions of the applicable policy. This certificate is issued as a matter of information only and confers no rights on the holder and imposes no liability on Wellcare Insurance Corp.
                </p>
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
            <span>Get New Certificate</span>
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
            <title>Home Certificate of Insurance - ${formData.namedInsured}</title>
            <link rel="stylesheet" href="../../common/signature-styles.css">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.4;
                    color: #333;
                    margin: 0;
                    padding: 20px;
                }
                
                /* 确保日期值不会因为CSS而被修改 */
                .certificate-value {
                    flex: 1;
                    color: #2c3e50;
                    font-weight: 500;
                    padding-left: 10px;
                    white-space: normal !important;
                    text-transform: none !important;
                }
                
                /* Coverage section styles */
                .coverage-section {
                    margin: 25px 0 15px;
                }
                
                .coverage-section h3 {
                    margin-bottom: 15px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #2c3e50;
                    padding-bottom: 8px;
                    display: inline-block;
                    border-bottom: 1px solid #000000;
                    width: 50%;
                }
                
                .certificate-preview {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .certificate-header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                
                .logo-image {
                    max-width: 100%;
                    height: auto;
                }
                
                .certificate-body {
                    margin-top: 20px;
                    position: relative;
                }
                
                .certificate-row {
                    margin-bottom: 2px;
                    display: flex;
                    align-items: center;
                }
                
                .certificate-label {
                    width: 180px;
                    font-weight: 600;
                    color: #34495e;
                    padding-right: 15px;
                    text-align: right;
                }
                
                .certificate-section {
                    margin-bottom: 0;
                    padding-bottom: 0;
                }
                
                .certificate-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-top: 15px;
                }
                
                .signature-section {
                    width: 300px;
                }
                
                .signature-content {
                    margin-bottom: 5px;
                    text-align: center;
                }
                
                /* 移除所有可能导致空行的样式 */
                .certificate-section + .certificate-section {
                    margin-top: 0;
                    padding-top: 0;
                }
                
                /* 确保没有边距导致的空行 */
                .certificate-row:last-child {
                    margin-bottom: 0;
                }
                
                /* 移除可能的边框和填充 */
                .certificate-section, .certificate-row {
                    border: none;
                    padding: 0;
                }
                
                .handwritten {
                    font-family: 'Brush Script MT', 'Dancing Script', cursive;
                    font-size: 28px;
                    color: #000080;
                    text-shadow: 1px 1px 1px rgba(0,0,0,0.15);
                    line-height: 1.2;
                    letter-spacing: 1px;
                    position: relative;
                    display: inline-block;
                    padding: 0 5px;
                }
                
                .disclaimer {
                    margin-top: 15px;
                }
                
                .disclaimer-line {
                    border-top: 1px solid #999;
                    width: 100%;
                    margin: 10px 0;
                }
                
                .disclaimer-text {
                    font-size: 11px;
                    color: #666;
                    line-height: 1.4;
                    margin: 0;
                    text-align: center;
                }
                
                @media print {
                    body {
                        padding: 0;
                    }
                    
                    .certificate-preview {
                        padding: 0;
                        margin: 0;
                        max-width: 100%;
                    }
                }
            </style>
        </head>
        <body>
            <div class="certificate-preview">
                ${certificateHtml}
            </div>
            <script>
                // 强制设置正确的日期文本
                window.onload = function() {
                    // 找到所有日期行
                    var dateRows = document.querySelectorAll('.certificate-row');
                    
                    // 遍历所有行，查找包含日期标签的行
                    dateRows.forEach(function(row) {
                        var label = row.querySelector('.certificate-label');
                        var value = row.querySelector('.certificate-value');
                        
                        if (label && value) {
                            var labelText = label.textContent.trim();
                            
                            // 根据标签设置对应的日期值
                            if (labelText === 'Effective Date:') {
                                value.textContent = "${formData.effectiveDate}";
                            } 
                            else if (labelText === 'Expiry Date:') {
                                value.textContent = "${formData.expiryDate}";
                            }
                        }
                    });
                    
                    // 确保coverage标题样式正确
                    var coverageTitle = document.querySelector('.coverage-section h3');
                    if (coverageTitle) {
                        coverageTitle.style.borderBottom = '1px solid #000000';
                        coverageTitle.style.paddingBottom = '8px';
                        coverageTitle.style.marginBottom = '15px';
                        coverageTitle.style.display = 'inline-block';
                        coverageTitle.style.width = '50%';
                    }
                };
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Properly handle image loading before printing
    const handlePrint = () => {
        printWindow.focus(); // Focus ensures better printing support across browsers
        printWindow.print();
    };
    
    // 检查打印窗口中是否有图片
    const images = printWindow.document.querySelectorAll('img');
    
    if (images.length === 0) {
        // 没有图片，直接打印
        setTimeout(handlePrint, 500); // 给脚本执行一些时间
    } else {
        let loadedImages = 0;
        const totalImages = images.length;
        
        // 预加载所有图片
        images.forEach(img => {
            // 如果图片已经加载完成
            if (img.complete) {
                loadedImages++;
                // 当所有图片都加载完成时打印
                if (loadedImages === totalImages) {
                    setTimeout(handlePrint, 500); // 给脚本执行一些时间
                }
            } else {
                // 添加图片加载事件
                img.addEventListener('load', () => {
                    loadedImages++;
                    // 当所有图片都加载完成时打印
                    if (loadedImages === totalImages) {
                        setTimeout(handlePrint, 500); // 给脚本执行一些时间
                    }
                });
                
                // 添加图片加载错误处理
                img.addEventListener('error', () => {
                    loadedImages++;
                    console.error('Image failed to load:', img.src);
                    // 即使图片加载失败也继续打印
                    if (loadedImages === totalImages) {
                        setTimeout(handlePrint, 500); // 给脚本执行一些时间
                    }
                });
            }
        });
        
        // 添加超时保护，避免无限等待
        setTimeout(() => {
            if (loadedImages < totalImages) {
                console.warn('Not all images loaded after timeout, printing anyway');
                handlePrint();
            }
        }, 3000); // 3秒超时
    }
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
    
    const randomRotation = Math.floor(Math.random() * 3) - 1; // 减小旋转角度范围
    const rotationStyle = `transform: rotate(${randomRotation}deg)`;
    
    return `
        <div class="signature-style" style="${rotationStyle}; text-align: center;">
            <span class="handwritten" style="
                font-family: 'Brush Script MT', 'Dancing Script', cursive;
                font-size: 28px;
                color: #000080;
                text-shadow: 1px 1px 1px rgba(0,0,0,0.15);
                line-height: 1.2;
                letter-spacing: 1px;
                position: relative;
                display: inline-block;
                padding: 0 5px;
            ">${name}</span>
        </div>
    `;
}