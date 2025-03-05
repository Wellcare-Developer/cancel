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
        altFormat: "F j, Y",
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
        altFormat: "F j, Y",
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
        { value: propertyAddress, name: 'Mailing Address' },
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
    
    // Save form data
    formData = {
        namedInsured,
        propertyAddress,
        mortgageeInfo,
        financeType, // 保存金融机构类型
        deductibleType, // 保存保险类型
        vehicleModel,
        vehicleVin,
        effectiveDate: formatDate(effectiveDateTime),
        expiryDate: formatDate(expiryDateTime),
        insurer,
        policyNumber,
        liability,
        deductible,
        collisionDeductible,
        comprehensiveDeductible,
        signatureName
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
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
        <div class="certificate-header" style="text-align: center; margin-bottom: 20px;">
            <div class="certificate-logo" style="margin-bottom: 15px;">
                <img src="../../@photo/wellcare-coi-head.png" alt="Wellcare Insurance Logo" class="logo-image" style="max-width: 100%; height: auto;">
            </div>
        </div>
        
        <div class="certificate-body" style="margin-top: 20px; position: relative;">
            <div class="certificate-section" style="margin-bottom: 8px;">
                <h2 style="text-align: center; font-size: 18px; margin-bottom: 10px; color: #333;">Certificate of Insurance</h2>
                <p class="certificate-note" style="margin-bottom: 10px; text-align: left; font-style: normal; color: #333; font-size: 14px; line-height: 1.4;">
                This is to certify that insurance on the automobile as herein described have been issued to the Insured(s) named below and are in force at this date.
                </p>
                <div class="certificate-row" style="margin-bottom: 4px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Named Insured:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.namedInsured}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 4px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Mailing Address:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.propertyAddress}</div>
                </div>
            </div>
            
            <div class="certificate-section" style="margin-bottom: 8px;">
                <div class="certificate-row" style="margin-bottom: 4px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Vehicle Model:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.vehicleModel}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 4px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Vehicle VIN#:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.vehicleVin}</div>
                </div>
            </div>
            
            ${formData.mortgageeInfo ? `
            <div class="certificate-section" style="margin-bottom: 8px;">
                <div class="certificate-row" style="margin-bottom: 4px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">${formData.financeType === 'lessor' ? 'Lessor:' : 'Finance Company:'}</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.mortgageeInfo.name}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 4px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Address:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.mortgageeInfo.address}</div>
                </div>
            </div>
            ` : ''}
            
            <div class="certificate-section" style="margin-bottom: 8px;">
                <div class="certificate-row" style="margin-bottom: 4px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Insurer:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.insurer}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 4px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Policy Number:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.policyNumber}</div>
                </div>
            </div>
            
            <div class="certificate-section" style="margin-bottom: 8px;">
                <div class="certificate-row" style="margin-bottom: 4px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Effective Date:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.effectiveDate}</div>
                </div>
                <div class="certificate-row" style="margin-bottom: 4px; display: flex; align-items: center;">
                    <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Expiry Date:</div>
                    <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formData.expiryDate}</div>
                </div>
            </div>
            
            <div class="certificate-section" style="margin-bottom: 12px;">
                <div style="border-top: 1px solid #e2e8f0; margin: 8px 0 15px 0;"></div>
                <div style="margin-left: 0;">
                    <div class="certificate-row" style="margin-bottom: 4px; display: flex; align-items: center;">
                        <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Liability:</div>
                        <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formatCurrency(formData.liability)}</div>
                    </div>
                    ${formData.deductibleType === 'none' ? '' : 
                      formData.deductibleType === 'all-perils' ? `
                    <div class="certificate-row" style="margin-bottom: 4px; display: flex; align-items: center;">
                        <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">All Perils Deductible:</div>
                        <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formatCurrency(formData.deductible)}</div>
                    </div>
                    ` : `
                    <div>
                        ${formData.collisionDeductible !== 'none' ? `
                        <div class="certificate-row" style="margin-bottom: 4px; display: flex; align-items: center;">
                            <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Collision Deductible:</div>
                            <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formatCurrency(formData.collisionDeductible)}</div>
                        </div>
                        ` : ''}
                        ${formData.comprehensiveDeductible !== 'none' ? `
                        <div class="certificate-row" style="margin-bottom: 4px; display: flex; align-items: center;">
                            <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Comprehensive Deductible:</div>
                            <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">${formatCurrency(formData.comprehensiveDeductible)}</div>
                        </div>
                        ` : ''}
                    </div>
                    `}
                    ${formData.financeType === 'lessor' ? `
                    <div class="certificate-row" style="margin-bottom: 4px; display: flex; align-items: center;">
                        <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Coverage Form:</div>
                        <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">OPCF 5A</div>
                    </div>
                    ` : formData.financeType === 'finance' ? `
                    <div class="certificate-row" style="margin-bottom: 4px; display: flex; align-items: center;">
                        <div class="certificate-label" style="width: 180px; font-weight: 600; color: #34495e; padding-right: 15px; text-align: right;">Coverage Form:</div>
                        <div class="certificate-value" style="flex: 1; color: #2c3e50; font-weight: 500; padding-left: 10px;">OPCF 23A</div>
                    </div>
                    ` : ''}
                </div>
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
            <title>AUTO INSURANCE CONFIRMATION</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .certificate-body {
                    position: relative;
                }
                
                .certificate-section {
                    margin-bottom: 15px;
                }
                
                .certificate-row {
                    display: flex;
                    margin-bottom: 4px;
                }
                
                .certificate-footer {
                    margin-top: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                
                @media print {
                    body {
                        padding: 0;
                        margin: 0;
                    }
                    
                    .certificate-header {
                        margin-bottom: 15px;
                    }
                    
                    .certificate-section {
                        margin-bottom: 6px;
                    }
                    
                    .certificate-footer {
                        margin-top: 15px;
                        page-break-inside: avoid;
                    }
                    
                    .wellcare-bot img {
                        width: 230px;
                    }
                    
                    @page {
                        margin: 1.5cm;
                        size: letter;
                    }
                }
            </style>
        </head>
        <body>
            ${certificatePreview.innerHTML}
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
        handlePrint();
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
                    handlePrint();
                }
            } else {
                // 添加图片加载事件
                img.addEventListener('load', () => {
                    loadedImages++;
                    // 当所有图片都加载完成时打印
                    if (loadedImages === totalImages) {
                        handlePrint();
                    }
                });
                
                // 添加图片加载错误处理
                img.addEventListener('error', () => {
                    loadedImages++;
                    console.error('Image failed to load:', img.src);
                    // 即使图片加载失败也继续打印
                    if (loadedImages === totalImages) {
                        handlePrint();
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