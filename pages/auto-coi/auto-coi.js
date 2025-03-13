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
    if (generateBtn) {
        generateBtn.addEventListener('click', validateAndGenerateCertificate);
    }
    
    // Add print button event listener
    if (printBtn) {
        printBtn.addEventListener('click', printCertificate);
    }
    
    // 修改复制按钮为返回表单按钮
    if (copyBtn) {
        copyBtn.innerHTML = '<i class="fa-solid fa-arrow-rotate-left"></i><span>Get New Certificate</span>';
        copyBtn.addEventListener('click', returnToForm);
    }
    
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
    document.getElementById('none-deductible-type').addEventListener('change', function() {
        if(this.checked) {
            deductibleType = 'none';
            allPerilsSection.classList.add('hidden');
            collisionCompSection.classList.add('hidden');
        }
    });

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
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
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
    // Flatpickr configuration for effective date
    const effectiveDatePicker = flatpickr("#effective-date", {
        dateFormat: "Y-m-d",
        allowInput: true,
        altInput: true,
        altFormat: "F j, Y", // 用户友好的显示格式：例如 March 8, 2023
        disableMobile: true,
        position: 'auto',
        static: true,
        appendTo: document.body,
        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates.length > 0) {
                // Calculate expiry date (1 year from effective date)
                const expiryDate = new Date(selectedDates[0]);
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                
                // Update expiry date picker
                expiryDatePicker.setDate(expiryDate);
            }
        }
    });
    
    // Flatpickr configuration for expiry date
    const expiryDatePicker = flatpickr("#expiry-date", {
        dateFormat: "Y-m-d",
        allowInput: true,
        altInput: true,
        altFormat: "F j, Y", // 用户友好的显示格式：例如 March 8, 2023
        disableMobile: true,
        position: 'auto',
        static: true,
        appendTo: document.body
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
    
    // Collect required fields (exclude mortgagee info if financeType is 'none')
    const requiredFields = [
        { value: namedInsured, name: 'Named Insured' },
        { value: propertyAddress, name: 'Insured Location' },
        { value: vehicleModel, name: 'Vehicle Model' },
        { value: vehicleVin, name: 'Vehicle VIN#' },
        { value: effectiveDate, name: 'Effective Date' },
        { value: expiryDate, name: 'Expiry Date' },
        { value: insurer, name: 'Insurer' },
        { value: policyNumber, name: 'Policy Number' },
        { value: liability, name: 'Liability' },
        { value: signatureName, name: 'Authorized Signature Name' }
    ];
    
    // 根据所选保险类型添加不同的验证字段
    if (deductibleType === 'all-perils') {
        requiredFields.push({ value: deductible, name: 'All Perils Deductible' });
    } else {
        requiredFields.push({ value: collisionDeductible, name: 'Collision Deductible' });
        requiredFields.push({ value: comprehensiveDeductible, name: 'Comprehensive Deductible' });
    }
    
    // 如果选择了lessor或finance，则添加mortgagee信息验证
    if(financeType !== 'none') {
        if(!mortgageeText) {
            alert(`Please fill in the Lessor/Finance Info field`);
            return;
        }
        if(!mortgageeInfo.name) {
            alert(`Please provide a valid name in the Lessor/Finance Info field`);
            return;
        }
    }
    
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
    
    // 获取当前日期的格式化字符串（用于签名日期）
    const today = new Date();
    const signedDate = formatDate(today);
    
    // 直接使用原始的日期字符串进行格式化，避免时区问题
    const formattedEffectiveDate = formatDate(effectiveDate);
    const formattedExpiryDate = formatDate(expiryDate);
    
    // Save form data
    formData = {
        namedInsured,
        propertyAddress,
        mortgageeInfo,
        financeType, // 保存金融机构类型
        deductibleType, // 保存保险类型
        vehicleModel,
        vehicleVin,
        // 使用格式化后的日期字符串
        effectiveDate: formattedEffectiveDate,
        expiryDate: formattedExpiryDate,
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

// Format date to more readable format
function formatDate(date) {
    // 直接使用字符串格式化，避免时区问题
    if (typeof date === 'string') {
        // 如果已经是格式化的字符串，直接返回
        if (date.includes(',')) {
            return date;
        }
        
        // 如果是YYYY-MM-DD格式，解析并格式化
        const parts = date.split('-');
        if (parts.length === 3) {
            const year = parts[0];
            const month = parseInt(parts[1], 10);
            const day = parseInt(parts[2], 10);
            
            // 月份名称数组
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            
            return `${monthNames[month-1]} ${day}, ${year}`;
        }
    }
    
    // 如果是Date对象，使用UTC方法避免时区问题
    if (date instanceof Date) {
        if (isNaN(date.getTime())) {
            return '';
        }
        
        // 使用UTC方法获取年月日，避免时区问题
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth(); // 0-11
        const day = date.getUTCDate();
        
        // 月份名称数组
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        return `${monthNames[month]} ${day}, ${year}`;
    }
    
    return '';
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
    }).format(number).replace('USD', '').trim();
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
    
    // 更新结果标题样式
    const resultsHeader = document.querySelector('.results-header');
    if (resultsHeader) {
        resultsHeader.style.cssText = `
            text-align: center;
            margin-bottom: 20px;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        `;
        resultsHeader.querySelector('h4').style.cssText = `
            font-size: 18px;
            color: #2d3748;
            margin: 0;
        `;
    }
    
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
            margin-bottom: 20px;
            padding-bottom: 0;
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
        
        /* 确保责任险金额正确显示 */
        .certificate-row .certificate-value[style*="text-align: right"] {
            width: 120px !important;
            text-align: right !important;
            flex: 0 0 auto !important;
        }
        
        /* 确保Coverage部分正确显示 */
        .certificate-value[style*="text-indent: 20px"] {
            text-indent: 20px !important;
        }
        
        /* 确保Coverage金额靠左对齐 */
        .certificate-row .certificate-value[style*="width: 100px"] {
            width: 100px !important;
            text-align: left !important;
            flex: 0 0 auto !important;
        }
        
        /* 确保Coverage项目名称对齐 */
        .certificate-row .certificate-value[style*="width: 200px"] {
            width: 200px !important;
            flex: 0 0 auto !important;
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
        
        .signature-style {
            text-align: center !important;
        }
        
        .signature-section > div:last-child {
            text-align: center !important;
        }
    `;
    document.head.appendChild(style);
    
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
        
        <h2 style="text-align: center; font-size: 18px; margin: 20px 0 15px; color: #333; font-weight: 600;">AUTO INSURANCE CONFIRMATION</h2>
        <div style="border-top: 1px solid #333; width: 100%; margin-bottom: 20px;"></div>
        
        <div class="certificate-body" style="position: relative;">
            <div class="certificate-section" style="margin-bottom: 15px;">
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 120px; font-weight: 600; color: #000; text-align: left;">Insured</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.namedInsured}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 120px; font-weight: 600; color: #000; text-align: left;">Address</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.propertyAddress}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 120px; font-weight: 600; color: #000; text-align: left;">Vehicle</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.vehicleModel}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 120px; font-weight: 600; color: #000; text-align: left;">VIN</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.vehicleVin}</div>
                </div>
                
                ${formData.financeType !== 'none' && formData.mortgageeInfo && formData.mortgageeInfo.name ? `
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 120px; font-weight: 600; color: #000; text-align: left;">${formData.financeType === 'lessor' ? 'Lessor' : 'Lienholder'}</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.mortgageeInfo.name}</div>
                </div>
                ${formData.mortgageeInfo.address ? `
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 120px; font-weight: 600; color: #000; text-align: left;">Address</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.mortgageeInfo.address}</div>
                </div>
                ` : ''}
                ` : ''}
                
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 120px; font-weight: 600; color: #000; text-align: left;">Effective Date</div>
                    <div class="certificate-value certificate-date-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.effectiveDate}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 120px; font-weight: 600; color: #000; text-align: left;">Expiry Date</div>
                    <div class="certificate-value certificate-date-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.expiryDate}</div>
                </div>
                
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 120px; font-weight: 600; color: #000; text-align: left;">Insurer</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.insurer}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 120px; font-weight: 600; color: #000; text-align: left;">Policy No.</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px;">${formData.policyNumber}</div>
                </div>
                
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 120px; font-weight: 600; color: #000; text-align: left;">Coverage</div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px; width: 200px;">Third Party Liability</div>
                    <div class="certificate-value" style="width: 100px; color: #000; font-weight: normal; text-align: left;">${formatCurrency(formData.liability)}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 120px; font-weight: 600; color: #000; text-align: left;"></div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px; width: 200px;">Collision</div>
                    <div class="certificate-value" style="width: 100px; color: #000; font-weight: normal; text-align: left;">${formatCurrency(formData.deductibleType === 'all-perils' ? formData.deductible : formData.collisionDeductible)}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 120px; font-weight: 600; color: #000; text-align: left;"></div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px; width: 200px;">Comprehensive</div>
                    <div class="certificate-value" style="width: 100px; color: #000; font-weight: normal; text-align: left;">${formatCurrency(formData.deductibleType === 'all-perils' ? formData.deductible : formData.comprehensiveDeductible)}</div>
                </div>
                ${formData.financeType !== 'none' ? `
                <div class="certificate-row" style="margin-bottom: 8px; display: flex;">
                    <div class="certificate-label" style="width: 120px; font-weight: 600; color: #000; text-align: left;"></div>
                    <div class="certificate-value" style="flex: 1; color: #000; font-weight: normal; padding-left: 5px; width: 200px;">${formData.financeType === 'lessor' ? 'OPCF5' : 'OPCF23'}</div>
                    <div class="certificate-value" style="width: 100px; color: #000; font-weight: normal; text-align: left;"></div>
                </div>
                ` : ''}
            </div>

            <div class="certificate-footer" style="display: flex; justify-content: flex-start; align-items: flex-end; margin-top: 40px;">
                <div class="signature-section" style="width: 300px;">
                    <div class="signature-content" style="margin-bottom: 5px; text-align: center;">
                        ${generateSignature(formData.signatureName)}
                    </div>
                    <div style="border-bottom: 1px solid #333; width: 100%;"></div>
                    <div style="margin-top: 5px; font-size: 14px; text-align: center;">
                        ${formData.signatureName}<br>
                        Associate Broker
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 15px;" class="footer-disclaimer">
                <div style="display: flex; justify-content: space-between; align-items: center;" class="footer-content">
                    <div style="font-size: 11px; color: #666; line-height: 1.4; max-width: 70%;" class="footer-text">
                        <p style="margin: 0;">This binder is valid for 365 days from the effective date.</p>
                        <p style="margin: 5px 0 0;">Terms and conditions are to be governed by actual policy issued by the insurer.</p>
                    </div>
                    <div style="text-align: right;" class="footer-logo">
                        <img src="../../@photo/BrokerTeam-coi-head.png" alt="BrokerTeam Insurance" style="max-width: 120px; height: auto;">
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
    // 获取证书内容
    const certificateHtml = certificatePreview.innerHTML;
    
    // 创建打印窗口
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('请允许弹出窗口以打印证书。');
        return;
    }
    
    // 写入HTML内容
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Certificate of Insurance</title>
            <link rel="stylesheet" href="../../common/signature-styles.css">
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
                }
                
                /* 表格式布局样式 */
                .certificate-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                
                .certificate-table tr {
                    vertical-align: top;
                }
                
                .certificate-table td.label {
                    width: 30%;
                    text-align: right;
                    padding: 5px 15px 5px 0;
                    font-weight: bold;
                    color: #34495e;
                }
                
                .certificate-table td.value {
                    width: 70%;
                    text-align: left;
                    padding: 5px 0;
                }
                
                /* 标题栏样式 */
                .header-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #333;
                    padding-bottom: 10px;
                }
                
                .header-logo {
                    max-width: 50%;
                }
                
                .header-info {
                    text-align: right;
                    font-size: 15px;
                    line-height: 1.5;
                    font-weight: 600;
                }
                
                /* 标题样式 */
                .certificate-title {
                    text-align: center;
                    font-size: 18px;
                    font-weight: bold;
                    margin: 20px 0;
                }
                
                /* 签名区域样式 */
                .signature-area {
                    margin-top: 40px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-end;
                }
                
                .signature-box {
                    border-top: 1px solid #333;
                    width: 250px;
                    text-align: center;
                    padding-top: 5px;
                }
                
                .signature-name {
                    font-family: 'Brush Script MT', 'Dancing Script', cursive;
                    font-size: 24px;
                    color: #000080;
                    margin-bottom: 5px;
                }
                
                .signature-title {
                    font-size: 14px;
                }
                
                .signature-date {
                    font-size: 12px;
                    color: #666;
                    margin-top: 3px;
                }
                
                /* 页脚样式 */
                .footer {
                    margin-top: 40px;
                    padding-top: 10px;
                    border-top: 1px solid #333;
                    font-size: 11px;
                    color: #666;
                    text-align: center;
                }
                
                /* 确保日期在打印时正确显示 */
                .date-value {
                    white-space: nowrap;
                }
            </style>
        </head>
        <body>
            <div class="certificate-container">
                <!-- 页眉 -->
                <div class="header-container">
                    <div class="header-logo">
                        <img src="../../@photo/BrokerTeam-coi-head.png" alt="BrokerTeam Insurance Logo" style="max-width: 100%; height: auto;">
                    </div>
                    <div class="header-info">
                        <p style="margin: 0;">117-9560 MARKHAM RD</p>
                        <p style="margin: 0;">MARKHAM, ON L6E 0V1</p>
                        <p style="margin: 0;">Tel: 905.472.5666</p>
                    </div>
                </div>
                
                <!-- 标题 -->
                <div class="certificate-title">Certificate of Insurance</div>
                
                <!-- 主要内容表格 -->
                <table class="certificate-table">
                    <tr>
                        <td class="label">Named Insured:</td>
                        <td class="value">${formData.namedInsured}</td>
                    </tr>
                    <tr>
                        <td class="label">Insured Location:</td>
                        <td class="value">${formData.propertyAddress}</td>
                    </tr>
                    <tr>
                        <td class="label">Vehicle Model:</td>
                        <td class="value">${formData.vehicleModel}</td>
                    </tr>
                    <tr>
                        <td class="label">Vehicle VIN#:</td>
                        <td class="value">${formData.vehicleVin}</td>
                    </tr>
                    ${formData.financeType !== 'none' && formData.mortgageeInfo && formData.mortgageeInfo.name ? `
                    <tr>
                        <td class="label">${formData.financeType === 'lessor' ? 'Lessor:' : 'Lienholder:'}</td>
                        <td class="value">${formData.mortgageeInfo.name}</td>
                    </tr>
                    ${formData.mortgageeInfo.address ? `
                    <tr>
                        <td class="label">Address:</td>
                        <td class="value">${formData.mortgageeInfo.address}</td>
                    </tr>
                    ` : ''}
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
                        <td class="value date-value">${formData.effectiveDate}</td>
                    </tr>
                    <tr>
                        <td class="label">Expiry Date:</td>
                        <td class="value date-value">${formData.expiryDate}</td>
                    </tr>
                    <tr>
                        <td class="label">Liability:</td>
                        <td class="value">${formatCurrency(formData.liability)}</td>
                    </tr>
                    <tr>
                        <td class="label">Collision Deductible:</td>
                        <td class="value">${formatCurrency(formData.deductibleType === 'all-perils' ? formData.deductible : formData.collisionDeductible)}</td>
                    </tr>
                    <tr>
                        <td class="label">Comprehensive<br>Deductible:</td>
                        <td class="value">${formatCurrency(formData.deductibleType === 'all-perils' ? formData.deductible : formData.comprehensiveDeductible)}</td>
                    </tr>
                    ${formData.financeType !== 'none' ? `
                    <tr>
                        <td class="label">Coverage Form:</td>
                        <td class="value">${formData.financeType === 'lessor' ? 'OPCF5' : 'OPCF23'}</td>
                    </tr>
                    ` : ''}
                </table>
                
                <!-- 签名区域 -->
                <div class="signature-area">
                    <div class="signature-left">
                        <div class="signature-name">${formData.signatureName}</div>
                        <div class="signature-box">
                            <div class="signature-title">Authorized Representative</div>
                            <div class="signature-date">Date: ${new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
                
                <!-- 页脚 -->
                <div class="footer">
                    This binder is valid for 365 days from the effective date.<br>
                    Terms and conditions are to be governed by actual policy issued by the insurer.
                </div>
            </div>
            
            <script>
                // 强制设置正确的日期文本
                window.onload = function() {
                    // 找到所有日期行
                    var dateRows = document.querySelectorAll('.date-value');
                    
                    // 遍历所有含有日期的单元格
                    dateRows.forEach(function(cell) {
                        var cellText = cell.textContent.trim();
                        
                        // 查找与"Effective Date"相关的单元格
                        if (cell.previousElementSibling && cell.previousElementSibling.textContent.includes('Effective Date')) {
                            cell.textContent = "${formData.effectiveDate}";
                        } 
                        // 查找与"Expiry Date"相关的单元格
                        else if (cell.previousElementSibling && cell.previousElementSibling.textContent.includes('Expiry Date')) {
                            cell.textContent = "${formData.expiryDate}";
                        }
                    });
                };
                
                // 确保所有图片加载完成后再打印
                document.addEventListener('DOMContentLoaded', function() {
                    var images = document.querySelectorAll('img');
                    var loadedImages = 0;
                    var totalImages = images.length;
                    
                    // 如果没有图片，可以直接打印
                    if (totalImages === 0) {
                        // 延迟打印以确保DOM完全加载
                        setTimeout(function() {
                            window.focus();
                            window.print();
                        }, 500);
                    }
                    
                    // 为每个图片添加加载事件
                    images.forEach(function(img) {
                        if (img.complete) {
                            loadedImages++;
                            if (loadedImages === totalImages) {
                                // 所有图片已加载完成，延迟打印
                                setTimeout(function() {
                                    window.focus();
                                    window.print();
                                }, 500);
                            }
                        } else {
                            img.addEventListener('load', function() {
                                loadedImages++;
                                if (loadedImages === totalImages) {
                                    // 所有图片已加载完成，延迟打印
                                    setTimeout(function() {
                                        window.focus();
                                        window.print();
                                    }, 500);
                                }
                            });
                            
                            img.addEventListener('error', function() {
                                loadedImages++;
                                console.error('图片加载失败:', img.src);
                                if (loadedImages === totalImages) {
                                    // 即使有图片加载失败也继续打印
                                    setTimeout(function() {
                                        window.focus();
                                        window.print();
                                    }, 500);
                                }
                            });
                        }
                    });
                    
                    // 添加超时保护，避免无限等待
                    setTimeout(function() {
                        if (loadedImages < totalImages) {
                            console.warn('超时后未加载所有图片，继续打印');
                            window.focus();
                            window.print();
                        }
                    }, 3000); // 3秒超时
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