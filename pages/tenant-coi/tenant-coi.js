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
    copyBtn.innerHTML = '<i class="fa-solid fa-arrow-rotate-left"></i><span>Get New Certificate</span>';
    
    // 创建证书HTML - 优化布局
    const certificateHTML = `
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; background-color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 20px auto; max-width: 800px;">
            <!-- 页眉 -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px;">
                <div style="max-width: 50%;">
                    <img src="../../@photo/BrokerTeam-coi-head.png" alt="BrokerTeam Insurance Logo" style="max-width: 100%; height: auto;">
                </div>
                <div class="certificate-title" style="text-align: right;">
                    <h2 style="font-size: 20px; color: #2c3e50; font-weight: 600; margin-bottom: 8px;">TENANT INSURANCE CONFIRMATION</h2>
                    <h3 style="font-size: 14px; color: #7f8c8d; margin: 4px 0;">9560 MARKHAM RD UNIT 117, MARKHAM ON L6E 0V1</h3>
                    <h3 style="font-size: 14px; color: #7f8c8d; margin: 4px 0;">TEL: (905) 472-5666</h3>
                </div>
            </div>
            
            <!-- 认证声明 -->
            <div style="font-size: 13px; line-height: 1.4; margin-bottom: 30px;">
                This is to certify that insurance as described below has been issued to the Insured(s) named below and is in force at this date.
            </div>
            
            <!-- 表格式内容 -->
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Named Insured:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formData.insuredName}</td>
                </tr>
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Property Address:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formData.insuredLocation}</td>
                </tr>
                ${formData.riskAddress ? `
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Risk Address:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formData.riskAddress}</td>
                </tr>
                ` : ''}
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Insurer:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formData.insurer}</td>
                </tr>
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Policy Number:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formData.policyNumber}</td>
                </tr>
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Effective Date:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formData.effectiveDate}</td>
                </tr>
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Expiry Date:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formData.expiryDate}</td>
                </tr>
            </table>
            
            <!-- 水平线分隔 -->
            <div style="height: 1px; background-color: #333; margin: 8px 0; width: 100%;"></div>
            
            <!-- 保障信息 -->
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Liability:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formatCurrency(formData.liability)}</td>
                </tr>
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Contents:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formatCurrency(formData.contentValue)}</td>
                </tr>
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Deductible:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formatCurrency(formData.deductible)}</td>
                </tr>
            </table>
            
            <!-- 签名区域 -->
            <div style="margin-top: 50px;">
                <div style="width: 250px; margin-top: 20px;">
                    <div style="font-family: 'Brush Script MT', 'Dancing Script', cursive; font-size: 24px; color: #000080; margin-bottom: 5px; text-align: center;">${formData.signatureName}</div>
                    <div style="border-top: 1px solid #333; width: 100%; margin-bottom: 5px;"></div>
                    <div style="text-align: center; font-size: 12px;">
                        Authorized Representative<br>
                        Date: ${formData.signedDate}
                    </div>
                </div>
            </div>
            
            <!-- 页脚声明 -->
            <div style="margin-top: 20px; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 5px;">
                The insurance afforded is subject to the terms, conditions and exclusions of the applicable policy. This certificate is issued as a matter of information only and confers no rights on the holder and imposes no liability on Wellcare Insurance Corp.
            </div>
        </div>
    `;
    
    // 更新证书预览
    certificatePreview.innerHTML = certificateHTML;
    
    // 重新添加事件监听器
    document.getElementById('print-btn').addEventListener('click', printCertificate);
    document.getElementById('copy-btn').addEventListener('click', returnToForm);
    
    // 滚动到证书部分
    certificateContent.scrollIntoView({ behavior: 'smooth' });
}

// Print certificate
function printCertificate() {
    // 创建打印窗口
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow pop-ups to print the certificate.');
        return;
    }
    
    // 写入HTML内容 - 优化布局避免分页问题
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Tenant Insurance Certificate</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.5;
                    color: #333;
                    max-width: 100%;
                    margin: 0;
                    padding: 0;
                }
                
                @media print {
                    body {
                        padding: 0;
                        margin: 0;
                    }
                    
                    @page {
                        margin: 0.7cm;
                        size: portrait;
                    }
                }
                
                .certificate-container {
                    padding: 15px;
                    page-break-inside: avoid;
                    max-width: 100%;
                }
                
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    border-bottom: 1px solid #333;
                    padding-bottom: 10px;
                }
                
                .header-logo {
                    max-width: 40%;
                }
                
                .certificate-title {
                    text-align: right;
                }
                
                .certificate-title h2 {
                    font-size: 20px;
                    color: #2c3e50;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                
                .certificate-title h3 {
                    font-size: 14px;
                    color: #7f8c8d;
                    margin: 4px 0;
                }
                
                .description {
                    font-size: 13px;
                    line-height: 1.4;
                    margin-bottom: 30px;
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                table td {
                    padding: 4px 0;
                    vertical-align: top;
                    line-height: 1.3;
                }
                
                td.label {
                    width: 40%;
                    text-align: right;
                    padding-right: 12px;
                    font-weight: bold;
                    white-space: nowrap;
                }
                
                td.value {
                    width: 60%;
                    text-align: left;
                }
                
                .horizontal-line {
                    height: 1px;
                    background-color: #333;
                    margin: 8px 0;
                    width: 100%;
                }
                
                .divider {
                    height: 1px;
                    background-color: #ccc;
                    margin: 8px 0;
                    width: 100%;
                }
                
                .signature-section {
                    margin-top: 50px;
                }
                
                .signature-container {
                    width: 250px;
                    margin-top: 20px;
                }
                
                .signature-name {
                    font-family: 'Brush Script MT', 'Dancing Script', cursive;
                    font-size: 24px;
                    color: #000080;
                    margin-bottom: 5px;
                    text-align: center;
                }
                
                .signature-line {
                    border-top: 1px solid #333;
                    width: 100%;
                    margin-bottom: 5px;
                }
                
                .signature-info {
                    text-align: center;
                    font-size: 12px;
                }
                
                .footer {
                    margin-top: 20px;
                    font-size: 10px;
                    color: #666;
                    border-top: 1px solid #ccc;
                    padding-top: 5px;
                }
                
                img {
                    max-width: 100%;
                    height: auto;
                }
            </style>
        </head>
        <body>
            <div class="certificate-container">
                <!-- 页眉 -->
                <div class="header">
                    <div class="header-logo">
                        <img src="../../@photo/BrokerTeam-coi-head.png" alt="BrokerTeam Insurance Logo">
                    </div>
                    <div class="certificate-title">
                        <h2>TENANT INSURANCE CONFIRMATION</h2>
                        <h3>9560 MARKHAM RD UNIT 117, MARKHAM ON L6E 0V1</h3>
                        <h3>TEL: (905) 472-5666</h3>
                    </div>
                </div>
                
                <!-- 认证声明 -->
                <div class="description">
                    This is to certify that insurance as described below has been issued to the Insured(s) named below and is in force at this date.
                </div>
                
                <!-- 表格式内容 -->
                <table>
                    <tr>
                        <td class="label">Named Insured:</td>
                        <td class="value">${formData.insuredName}</td>
                    </tr>
                    <tr>
                        <td class="label">Property Address:</td>
                        <td class="value">${formData.insuredLocation}</td>
                    </tr>
                    ${formData.riskAddress ? `
                    <tr>
                        <td class="label">Risk Address:</td>
                        <td class="value">${formData.riskAddress}</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td class="label">Insurer:</td>
                        <td class="value">${formData.insurer}</td>
                    </tr>
                    <tr>
                        <td class="label">Policy Number:</td>
                        <td class="value">${formData.policyNumber}</td>
                    </tr>
                    <tr>
                        <td class="label">Effective Date:</td>
                        <td class="value">${formData.effectiveDate}</td>
                    </tr>
                    <tr>
                        <td class="label">Expiry Date:</td>
                        <td class="value">${formData.expiryDate}</td>
                    </tr>
                </table>
                
                <!-- 水平线分隔 -->
                <div class="horizontal-line"></div>
                
                <!-- 保障信息 -->
                <table>
                    <tr>
                        <td class="label">Liability:</td>
                        <td class="value">${formatCurrency(formData.liability)}</td>
                    </tr>
                    <tr>
                        <td class="label">Contents:</td>
                        <td class="value">${formatCurrency(formData.contentValue)}</td>
                    </tr>
                    <tr>
                        <td class="label">Deductible:</td>
                        <td class="value">${formatCurrency(formData.deductible)}</td>
                    </tr>
                </table>
                
                <!-- 签名区域 -->
                <div class="signature-section">
                    <div class="signature-container">
                        <div class="signature-name">${formData.signatureName}</div>
                        <div class="signature-line"></div>
                        <div class="signature-info">
                            Authorized Representative<br>
                            Date: ${formData.signedDate}
                        </div>
                    </div>
                </div>
                
                <!-- 页脚声明 -->
                <div class="footer">
                    The insurance afforded is subject to the terms, conditions and exclusions of the applicable policy. This certificate is issued as a matter of information only and confers no rights on the holder and imposes no liability on Wellcare Insurance Corp.
                </div>
            </div>
            
            <script>
                // 确保所有图片加载完成后再打印
                document.addEventListener('DOMContentLoaded', function() {
                    var images = document.querySelectorAll('img');
                    var loadedImages = 0;
                    var totalImages = images.length;
                    
                    // 如果没有图片，可以直接打印
                    if (totalImages === 0) {
                        setTimeout(function() {
                            window.focus();
                            window.print();
                        }, 500);
                        return;
                    }
                    
                    // 为每个图片添加加载事件
                    images.forEach(function(img) {
                        if (img.complete) {
                            loadedImages++;
                            if (loadedImages === totalImages) {
                                setTimeout(function() {
                                    window.focus();
                                    window.print();
                                }, 500);
                            }
                        } else {
                            img.addEventListener('load', function() {
                                loadedImages++;
                                if (loadedImages === totalImages) {
                                    setTimeout(function() {
                                        window.focus();
                                        window.print();
                                    }, 500);
                                }
                            });
                            
                            img.addEventListener('error', function() {
                                loadedImages++;
                                if (loadedImages === totalImages) {
                                    setTimeout(function() {
                                        window.focus();
                                        window.print();
                                    }, 500);
                                }
                            });
                        }
                    });
                    
                    // 添加超时保护
                    setTimeout(function() {
                        if (loadedImages < totalImages) {
                            window.focus();
                            window.print();
                        }
                    }, 3000);
                });
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
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