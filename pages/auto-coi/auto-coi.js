// Global variables
let formData = {};
let financeType = 'none'; // 默认为none
let deductibleType = 'all-perils'; // 默认为all-perils

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
    
    // 获取Lessor/Finance Info输入行元素
    const mortgageeRow = document.getElementById('mortgagee').closest('.form-row');
    
    // 初始时隐藏Lessor/Finance输入框（因为默认选择None）
    mortgageeRow.classList.add('hidden');
    
    // 获取保险类型相关元素
    const allPerilsSection = document.getElementById('all-perils-section');
    const collisionCompSection = document.getElementById('collision-comp-section');
    
    // 处理保险类型选择
    document.getElementById('all-perils-type').addEventListener('change', function() {
        if(this.checked) {
            deductibleType = 'all-perils';
            allPerilsSection.classList.remove('hidden');
            collisionCompSection.classList.add('hidden');
        }
    });
    
    document.getElementById('collision-comp-type').addEventListener('change', function() {
        if(this.checked) {
            deductibleType = 'collision-comp';
            allPerilsSection.classList.add('hidden');
            collisionCompSection.classList.remove('hidden');
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
    
    // Show/hide other collision deductible input
    document.getElementById('collision-deductible-select').addEventListener('change', function() {
        const otherInput = document.getElementById('collision-deductible');
        otherInput.classList.toggle('hidden', this.value !== 'other');
        if(this.value !== 'other') {
            otherInput.value = this.value;
        } else {
            otherInput.value = '';
        }
    });
    
    // Show/hide other comprehensive deductible input
    document.getElementById('comprehensive-deductible-select').addEventListener('change', function() {
        const otherInput = document.getElementById('comprehensive-deductible');
        otherInput.classList.toggle('hidden', this.value !== 'other');
        if(this.value !== 'other') {
            otherInput.value = this.value;
        } else {
            otherInput.value = '';
        }
    });
    
    // 处理Lessor/Finance类型切换
    document.getElementById('none-type').addEventListener('change', function() {
        if(this.checked) {
            financeType = 'none';
            // 隐藏输入行
            mortgageeRow.classList.add('hidden');
            document.getElementById('mortgagee').value = ''; // 清空输入框
        }
    });
    
    document.getElementById('lessor-type').addEventListener('change', function() {
        if(this.checked) {
            financeType = 'lessor';
            document.getElementById('mortgagee-label').textContent = 'Lessor/Finance Info';
            document.getElementById('mortgagee').placeholder = `Please enter name on the first line, and address on separate lines below. 
For example:
ABC Leasing Company
123 Main Street
Toronto, ON M5V 1A1`;
            // 显示输入行
            mortgageeRow.classList.remove('hidden');
        }
    });
    
    document.getElementById('finance-type').addEventListener('change', function() {
        if(this.checked) {
            financeType = 'finance';
            document.getElementById('mortgagee-label').textContent = 'Lessor/Finance Info';
            document.getElementById('mortgagee').placeholder = `Please enter name on the first line, and address on separate lines below. 
For example:
ABC Finance Company
123 Main Street
Toronto, ON M5V 1A1`;
            // 显示输入行
            mortgageeRow.classList.remove('hidden');
        }
    });
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // 初始化默认值
    document.getElementById('liability-select').value = '2000000';
    document.getElementById('deductible-select').value = '1000';
    document.getElementById('collision-deductible-select').value = '1000';
    document.getElementById('comprehensive-deductible-select').value = '1000';
    
    // 触发所有相关事件
    ['liability-select', 'deductible-select', 'collision-deductible-select', 'comprehensive-deductible-select'].forEach(id => {
        const element = document.getElementById(id);
        element.dispatchEvent(new Event('change'));
    });
    
    // 确保默认情况下，mortgagee输入框是隐藏的
    if (document.getElementById('none-type').checked) {
        mortgageeRow.classList.add('hidden');
    }
});

// Initialize date pickers
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
    const namedInsured = document.getElementById('named-insured').value.trim();
    const propertyAddress = document.getElementById('property-address').value.trim();
    const mortgageeText = document.getElementById('mortgagee').value.trim();
    let mortgageeInfo = { name: '', address: '' };
    
    // 只有当financeType不是'none'时才解析mortgagee信息
    if(financeType !== 'none' && mortgageeText) {
        mortgageeInfo = parseMortgageeInfo(mortgageeText);
    }
    
    const vehicleModel = document.getElementById('vehicle-model').value.trim();
    const vehicleVin = document.getElementById('vehicle-vin').value.trim();
    
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
    
    // 获取垫底费信息，根据所选类型
    let deductible = '';
    let collisionDeductible = '';
    let comprehensiveDeductible = '';
    
    if (deductibleType === 'all-perils') {
        deductible = document.getElementById('deductible-select').value === 'other'
            ? document.getElementById('deductible').value.trim()
            : document.getElementById('deductible-select').value;
    } else {
        collisionDeductible = document.getElementById('collision-deductible-select').value === 'other'
            ? document.getElementById('collision-deductible').value.trim()
            : document.getElementById('collision-deductible-select').value;
            
        comprehensiveDeductible = document.getElementById('comprehensive-deductible-select').value === 'other'
            ? document.getElementById('comprehensive-deductible').value.trim()
            : document.getElementById('comprehensive-deductible-select').value;
    }
    
    // Get signature
    const signatureName = document.getElementById('signature-name').value.trim();
    
    // Validate required fields
    const requiredFields = [
        { value: namedInsured, name: '被保险人' },
        { value: propertyAddress, name: '邮寄地址' },
        { value: vehicleModel, name: '车辆型号' },
        { value: vehicleVin, name: '车辆VIN码' },
        { value: effectiveDateFormatted, name: '生效日期' },
        { value: expiryDateFormatted, name: '到期日期' },
        { value: insurer, name: '保险公司' },
        { value: policyNumber, name: '保单号码' },
        { value: liability, name: '责任限额' },
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
        namedInsured,
        propertyAddress,
        mortgageeInfo,
        financeType, // 保存金融机构类型
        deductibleType, // 保存保险类型
        vehicleModel,
        vehicleVin,
        effectiveDate: effectiveDateFormatted,
        expiryDate: expiryDateFormatted,
        insurer,
        policyNumber,
        liability,
        deductible,
        collisionDeductible,
        comprehensiveDeductible,
        signatureName,
        signedDate
    };
    
    // Generate certificate
    generateCertificate();
}

// Parse mortgagee information (now lessor/finance information)
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
            --certificate-section-gap: 15px;
            --certificate-row-gap: 8px;
            --coverage-top-margin: 40px;
            --coverage-bottom-margin: 20px;
            --coverage-title-top-margin: 25px;
            --coverage-title-bottom-margin: 15px;
            --footer-top-margin: 40px;
            --footer-padding: 15px 0;
            --certificate-max-width: 900px;
            /* 签名样式变量已移至signature-styles.css */
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
        
        .certificate-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .logo-image {
            max-width: 200px;
            max-height: 80px;
        }
        
        .certificate-title {
            text-align: right;
        }
        
        .certificate-section {
            margin-bottom: var(--certificate-section-gap);
        }
        
        .certificate-row {
            display: flex;
            margin-bottom: var(--certificate-row-gap);
        }
        
        .certificate-label {
            font-weight: 600;
            color: #34495e;
            width: 200px;
            flex-shrink: 0;
        }
        
        .certificate-value {
            color: #2c3e50;
        }
        
        .coverage-section {
            margin-top: var(--coverage-top-margin);
        }
        
        .coverage-section h3 {
            margin-bottom: var(--coverage-title-bottom-margin);
            color: #2c3e50;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
            display: inline-block;
            width: 50%;
        }
        
        .certificate-footer {
            margin-top: var(--footer-top-margin);
            padding: var(--footer-padding);
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        
        .results-header {
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
        
        /* 签名框样式已移至signature-styles.css */
    `;
    document.head.appendChild(style);
    
    // Create certificate HTML
    const certificateHTML = `
        <div class="certificate-header">
            <div class="certificate-logo">
                <img src="../../@photo/BrokerTeamInsurance_BT20-Colored.png" alt="Insurance Logo" class="logo-image">
            </div>
            <div class="certificate-title">
                <h2 style="font-size: 20px; color: #2c3e50; font-weight: 600; margin-bottom: 8px;">AUTO INSURANCE CONFIRMATION</h2>
                <h3 style="font-size: 14px; color: #7f8c8d; margin: 4px 0;">9560 MARKHAM RD UNIT 117, MARKHAM ON L6E 0V1</h3>
                <h3 style="font-size: 14px; color: #7f8c8d; margin: 4px 0;">TEL: (905) 472-5666</h3>
            </div>
        </div>
        
        <div class="certificate-body">
            <div class="certificate-section">
                <p class="certificate-note" style="margin-bottom: 15px;">
                This binder is valid for 365 days from the effective date.
                <br>Terms and conditions are to be governed by actual policy issued by the insurer.
                </p>
                <div class="certificate-row">
                    <div class="certificate-label">Named Insured:</div>
                    <div class="certificate-value">${formData.namedInsured}</div>
                </div>
                <div class="certificate-row">
                    <div class="certificate-label">Mailing Address:</div>
                    <div class="certificate-value">${formData.propertyAddress}</div>
                </div>
            </div>
            
            <div class="certificate-section vehicle-section">
                <div class="certificate-row">
                    <div class="certificate-label">Vehicle Model:</div>
                    <div class="certificate-value">${formData.vehicleModel}</div>
                </div>
                <div class="certificate-row">
                    <div class="certificate-label">Vehicle VIN#:</div>
                    <div class="certificate-value">${formData.vehicleVin}</div>
                </div>
                ${formData.financeType !== 'none' && formData.mortgageeInfo.name ? `
                <div class="certificate-row">
                    <div class="certificate-label">${formData.financeType === 'lessor' ? 'Lessor:' : 'lienholder:'}</div>
                    <div class="certificate-value">${formData.mortgageeInfo.name}</div>
                </div>
                ` : ''}
                ${formData.financeType !== 'none' && formData.mortgageeInfo.address ? `
                <div class="certificate-row">
                    <div class="certificate-label">${formData.financeType === 'lessor' ? 'Lessor Address:' : 'lienholder Address:'}</div>
                    <div class="certificate-value">${formData.mortgageeInfo.address}</div>
                </div>
                ` : ''}
            </div>
            
            <div class="certificate-section">
                <div class="certificate-row">
                    <div class="certificate-label">Insurance Company:</div>
                    <div class="certificate-value">${formData.insurer}</div>
                </div>
                <div class="certificate-row">
                    <div class="certificate-label">Policy Number:</div>
                    <div class="certificate-value">${formData.policyNumber}</div>
                </div>
                <div class="certificate-row">
                    <div class="certificate-label">Effective Date:</div>
                    <div class="certificate-value">${formData.effectiveDate}</div>
                </div>
                <div class="certificate-row">
                    <div class="certificate-label">Expiry Date:</div>
                    <div class="certificate-value">${formData.expiryDate}</div>
                </div>
            </div>
            
            <div class="certificate-section coverage-section">
                <h3>Insurance Coverage</h3>
                
                <div class="certificate-row">
                    <div class="certificate-label">Liability:</div>
                    <div class="certificate-value">${formatCurrency(formData.liability)}</div>
                </div>
                
                ${formData.deductibleType === 'all-perils' ? `
                <div class="certificate-row">
                    <div class="certificate-label">All Perils Deductible:</div>
                    <div class="certificate-value">${formatCurrency(formData.deductible)}</div>
                </div>
                ` : `
                ${formData.collisionDeductible ? `
                <div class="certificate-row">
                    <div class="certificate-label">Collision Deductible:</div>
                    <div class="certificate-value">${formatCurrency(formData.collisionDeductible)}</div>
                </div>
                ` : ''}
                ${formData.comprehensiveDeductible ? `
                <div class="certificate-row">
                    <div class="certificate-label">Comprehensive Deductible:</div>
                    <div class="certificate-value">${formatCurrency(formData.comprehensiveDeductible)}</div>
                </div>
                ` : ''}
                `}
            </div>
            
            <div class="certificate-footer">
                <div class="certificate-date" style="font-size: 14px; color: #7f8c8d; min-width: 200px;">
                    Signed Date: ${formData.signedDate}
                </div>
                
                <div class="certificate-signature">
                    <div class="signature-box">
                        <div class="signature-label">Signed electronically by</div>
                        <div class="signature-content">
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
            <title>AUTO INSURANCE CONFIRMATION - ${formData.namedInsured}</title>
            <link rel="stylesheet" href="../../common/signature-styles.css">
            <link rel="stylesheet" href="../../common/pdf-form.css">
            <style>
                @media print {
                    body {
                        padding: 0;
                        margin: 0;
                    }
                    
                    @page {
                        margin: 1cm;
                    }
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
    
    const randomRotation = Math.floor(Math.random() * 5) - 2;
    const rotationClass = `rotate-${randomRotation < 0 ? 'neg-' : 'pos-'}${Math.abs(randomRotation)}`;
    
    return `<span class="dynamic-signature handwritten ${rotationClass}">${name}</span>`;
}