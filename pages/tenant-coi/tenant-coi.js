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
    
    // 初始化日期选择器
    initDatePickers();
});

// 初始化日期选择器
function initDatePickers() {
    // 简化日期选择器配置，使用字符串格式
    const effectiveDatePicker = flatpickr("#effective-date", {
        dateFormat: "Y-m-d", // 内部存储格式
        altInput: true,      // 使用替代输入框显示格式化日期
        altFormat: "F j, Y", // 用户友好的显示格式
        disableMobile: true,
        position: 'auto',
        static: true,
        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates.length > 0) {
                // 直接使用字符串操作计算到期日期
                const effectiveDate = dateStr; // 格式: YYYY-MM-DD
                const [year, month, day] = effectiveDate.split('-').map(Number);
                const expiryYear = year + 1;
                
                // 构建到期日期字符串
                const expiryDate = `${expiryYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                
                // 设置到期日期
                expiryDatePicker.setDate(expiryDate);
            }
        }
    });
    
    // 到期日期选择器
    const expiryDatePicker = flatpickr("#expiry-date", {
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "F j, Y",
        disableMobile: true,
        position: 'auto',
        static: true
    });
}

// Validate form and generate certificate
function validateAndGenerateCertificate() {
    // Get all input values
    const insuredName = document.getElementById('insured-name').value.trim();
    const insuredLocation = document.getElementById('insured-location').value.trim();
    const riskAddress = document.getElementById('risk-address').value.trim();
    
    // 获取日期选择器实例
    const effectiveDateInput = document.getElementById('effective-date');
    const expiryDateInput = document.getElementById('expiry-date');
    
    // 获取日期选择器实例
    const effectiveDateInstance = effectiveDateInput._flatpickr;
    const expiryDateInstance = expiryDateInput._flatpickr;
    
    // 获取格式化的日期字符串（用于显示）
    const effectiveDateFormatted = effectiveDateInstance ? 
        effectiveDateInstance.formatDate(effectiveDateInstance.selectedDates[0], effectiveDateInstance.config.altFormat) : 
        '';
    
    const expiryDateFormatted = expiryDateInstance ? 
        expiryDateInstance.formatDate(expiryDateInstance.selectedDates[0], expiryDateInstance.config.altFormat) : 
        '';
    
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
        { value: insuredName, name: '被保险人' },
        { value: insuredLocation, name: '保险地址' },
        { value: riskAddress, name: '风险地址' },
        { value: effectiveDateFormatted, name: '生效日期' },
        { value: expiryDateFormatted, name: '到期日期' },
        { value: insurer, name: '保险公司' },
        { value: policyNumber, name: '保单号码' },
        { value: liability, name: '责任限额' },
        { value: contentValue, name: '内容物价值' },
        { value: deductible, name: '免赔额' },
        { value: signatureName, name: '授权签名' }
    ];
    
    // 检查空字段
    const emptyFields = requiredFields.filter(field => !field.value);
    if (emptyFields.length > 0) {
        const fieldNames = emptyFields.map(field => field.name).join(', ');
        alert(`请填写以下必填字段: ${fieldNames}`);
        return;
    }
    
    // 验证日期逻辑
    if (effectiveDateInstance && expiryDateInstance) {
        const effectiveDate = effectiveDateInstance.selectedDates[0];
        const expiryDate = expiryDateInstance.selectedDates[0];
        
        if (effectiveDate >= expiryDate) {
            alert('到期日期必须晚于生效日期');
            return;
        }
    }
    
    // 获取当前日期的格式化字符串（用于签名日期）
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const signedDate = today.toLocaleDateString('en-US', options);
    
    // Save form data
    formData = {
        insuredName,
        insuredLocation,
        riskAddress,
        effectiveDate: effectiveDateFormatted,
        expiryDate: expiryDateFormatted,
        insurer,
        policyNumber,
        liability,
        contentValue,
        deductible,
        signatureName,
        signedDate
    };
    
    // Generate certificate
    generateCertificate();
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
    
    // Create certificate HTML
    const certificateHTML = `
        <div class="certificate-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 0;">
            <div class="certificate-logo" style="width: 40%;">
                <img src="../../@photo/BrokerTeam-coi-head.png" alt="BrokerTeam Insurance Logo" class="logo-image" style="max-width: 200px; height: auto;">
            </div>
            <div class="company-info" style="width: 60%; text-align: right; font-size: 14px; line-height: 1.4;">
                <p style="margin: 0; font-weight: 500;">117-9560 MARKHAM RD</p>
                <p style="margin: 0; font-weight: 500;">MARKHAM, ON L6E 0V1</p>
                <p style="margin: 0; font-weight: 500;">Tel: 905.472.5666</p>
            </div>
        </div>
        
        <h2 style="text-align: center; font-size: 18px; margin: 20px 0 15px; color: #333; font-weight: 600;">TENANT INSURANCE CONFIRMATION</h2>
        
        <div class="certificate-body" style="position: relative;">
            <div class="certificate-section" style="margin-bottom: 15px;">
                <p class="certificate-note" style="margin-bottom: 15px; font-size: 12px; color: #666;">
                This binder is valid for 365 days from the effective date.
                <br>Terms and conditions are to be governed by actual policy issued by the insurer.
                </p>
                
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 200px; font-weight: 600; color: #000; text-align: left;">Insured:</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.insuredName}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 200px; font-weight: 600; color: #000; text-align: left;">Insured Location:</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.insuredLocation}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 200px; font-weight: 600; color: #000; text-align: left;">Risk Address:</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.riskAddress}</div>
                </div>
            </div>
            
            <div class="certificate-section" style="margin-bottom: 15px;">
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 200px; font-weight: 600; color: #000; text-align: left;">Insurer:</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.insurer}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 200px; font-weight: 600; color: #000; text-align: left;">Policy Number:</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.policyNumber}</div>
                </div>
            </div>
            
            <div class="certificate-section" style="margin-bottom: 15px;">
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 200px; font-weight: 600; color: #000; text-align: left;">Effective Date:</div>
                    <div class="certificate-value certificate-date-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.effectiveDate}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 200px; font-weight: 600; color: #000; text-align: left;">Expiry Date:</div>
                    <div class="certificate-value certificate-date-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.expiryDate}</div>
                </div>
            </div>
            
            <div class="certificate-section coverage-section" style="margin-top: 40px; margin-bottom: 20px;">
                <h3 style="margin-bottom: 15px; font-size: 16px; font-weight: 600; color: #2c3e50; padding-bottom: 8px; display: inline-block; border-bottom: 1px solid #000000; width: 50%;">Insurance Coverage</h3>
                
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 200px; font-weight: 600; color: #000; text-align: left;">Liability:</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formatCurrency(formData.liability)}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 200px; font-weight: 600; color: #000; text-align: left;">Content Value:</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formatCurrency(formData.contentValue)}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 200px; font-weight: 600; color: #000; text-align: left;">Deductible:</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formatCurrency(formData.deductible)}</div>
                </div>
            </div>
            
            <div class="certificate-footer" style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px;">
                <div class="certificate-date" style="font-size: 14px; color: #7f8c8d; min-width: 200px;">
                    Signed Date: ${formData.signedDate}
                </div>
                
                <div class="certificate-signature">
                    <div class="signature-box">
                        <div class="signature-label" style="text-align: center; font-size: 12px; color: #7f8c8d; margin-bottom: 5px;">Signed electronically by</div>
                        <div class="signature-content" style="text-align: center;">
                            ${generateSignature(formData.signatureName)}
                        </div>
                        <div style="text-align: center; font-size: 14px; margin-top: 5px;">${formData.signatureName}</div>
                        <div style="text-align: center; font-size: 12px; color: #7f8c8d;">Associate Broker</div>
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
            <title>TENANT INSURANCE CONFIRMATION - ${formData.insuredName}</title>
            <link rel="stylesheet" href="../../common/signature-styles.css">
            <link rel="stylesheet" href="../../common/pdf-form.css">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                @media print {
                    body {
                        padding: 0;
                        margin: 0;
                    }
                    
                    @page {
                        margin: 1cm;
                    }
                    
                    /* 确保打印时标题和内容在同一行 */
                    .certificate-row {
                        display: flex !important;
                        flex-direction: row !important;
                        flex-wrap: nowrap !important;
                        align-items: flex-start !important;
                        break-inside: avoid !important;
                    }
                }
                
                /* 确保打印时保持样式一致 */
                .certificate-header {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    margin-bottom: 20px !important;
                    padding-bottom: 0 !important;
                }
                
                .certificate-logo {
                    width: 40% !important;
                }
                
                .company-info {
                    width: 60% !important;
                    text-align: right !important;
                    font-size: 14px !important;
                    line-height: 1.4 !important;
                }
                
                .company-info p {
                    margin: 0 !important;
                    font-weight: 500 !important;
                }
                
                .certificate-row {
                    display: flex !important;
                    margin-bottom: 8px !important;
                    flex-direction: row !important;
                    align-items: flex-start !important;
                }
                
                .certificate-label {
                    width: 200px !important;
                    font-weight: 600 !important;
                    color: #000 !important;
                    text-align: left !important;
                    flex: 0 0 auto !important;
                    display: inline-block !important;
                }
                
                .certificate-value {
                    flex: 1 !important;
                    color: #000 !important;
                    font-weight: normal !important;
                    padding-left: 5px !important;
                    display: inline-block !important;
                }
                
                /* 确保日期在打印时正确显示 */
                .certificate-date-value {
                    font-weight: normal !important;
                    color: #000 !important;
                }
                
                /* 确保页脚居左显示 */
                .certificate-footer {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: flex-end !important;
                    margin-top: 40px !important;
                }
                
                /* 确保签名部分正确显示 */
                .signature-content {
                    text-align: center !important;
                }
                
                .handwritten {
                    font-family: 'Brush Script MT', 'Dancing Script', cursive !important;
                    font-size: 28px !important;
                    color: #000080 !important;
                    text-shadow: 1px 1px 1px rgba(0,0,0,0.15) !important;
                    line-height: 1.2 !important;
                    letter-spacing: 1px !important;
                    position: relative !important;
                    display: inline-block !important;
                    padding: 0 5px !important;
                }
                
                h2 {
                    text-align: center !important;
                    font-size: 18px !important;
                    margin: 20px 0 15px !important;
                    color: #333 !important;
                    font-weight: 600 !important;
                }
                
                /* 页脚角标样式 */
                .footer-disclaimer {
                    margin-top: 60px !important;
                    border-top: 1px solid #e2e8f0 !important;
                    padding-top: 15px !important;
                }
                
                .footer-content {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                }
                
                .footer-text {
                    font-size: 11px !important;
                    color: #666 !important;
                    line-height: 1.4 !important;
                    max-width: 70% !important;
                }
                
                .footer-logo {
                    text-align: right !important;
                }
                
                .footer-logo img {
                    max-width: 120px !important;
                    height: auto !important;
                }
                
                /* 确保Coverage部分正确显示 */
                .coverage-section h3 {
                    margin-bottom: 15px !important;
                    font-size: 16px !important;
                    font-weight: 600 !important;
                    color: #2c3e50 !important;
                    padding-bottom: 8px !important;
                    display: inline-block !important;
                    border-bottom: 1px solid #000000 !important;
                    width: 50% !important;
                }
                
                .coverage-section {
                    margin-top: 40px !important;
                    margin-bottom: 20px !important;
                }
            </style>
        </head>
        <body>
            ${certificateHtml}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // 处理打印
    handlePrintWithImages(printWindow);
}

// 处理带图片的打印
function handlePrintWithImages(printWindow) {
    // 打印函数
    const doPrint = () => {
        printWindow.focus();
        printWindow.print();
    };
    
    // 检查打印窗口中是否有图片
    const images = printWindow.document.querySelectorAll('img');
    
    if (images.length === 0) {
        // 没有图片，直接打印
        doPrint();
        return;
    }
    
    // 有图片，等待图片加载完成
    let loadedImages = 0;
    const totalImages = images.length;
    
    // 设置超时保护
    const timeoutId = setTimeout(() => {
        console.warn('图片加载超时，继续打印');
        doPrint();
    }, 3000);
    
    // 监听图片加载
    images.forEach(img => {
        if (img.complete) {
            loadedImages++;
            if (loadedImages === totalImages) {
                clearTimeout(timeoutId);
                doPrint();
            }
        } else {
            img.addEventListener('load', () => {
                loadedImages++;
                if (loadedImages === totalImages) {
                    clearTimeout(timeoutId);
                    doPrint();
                }
            });
            
            img.addEventListener('error', () => {
                console.error('图片加载失败:', img.src);
                loadedImages++;
                if (loadedImages === totalImages) {
                    clearTimeout(timeoutId);
                    doPrint();
                }
            });
        }
    });
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