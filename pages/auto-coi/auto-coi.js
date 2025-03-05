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
                    Signed Date: ${new Date().toLocaleDateString('en-US')}
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
            <style>
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
                
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.5;
                    color: #333;
                    margin: 0;
                    padding: 15px;
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
                    font-size: 14px;
                }
                
                .certificate-value {
                    color: #2c3e50;
                    font-weight: 500;
                    font-size: 14px;
                }
                
                .coverage-section {
                    margin: var(--coverage-top-margin) 0 var(--coverage-bottom-margin);
                }
                
                .coverage-section h3 {
                    margin: var(--coverage-title-top-margin) 0 var(--coverage-title-bottom-margin);
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
                    margin-top: var(--footer-top-margin);
                    padding: var(--footer-padding);
                }
                
                .certificate-date {
                    min-width: 200px;
                    font-size: 14px;
                    color: #7f8c8d;
                }
                
                /* .certificate-signature 样式已移至signature-styles.css */
                
                /* .signature-box 样式已移至signature-styles.css */
                
                /* .signature-label 样式已移至signature-styles.css */
                
                /* .signature-content 样式已移至signature-styles.css */
                
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
                        margin: 1cm;
                    }
                }

                @font-face {
                    font-family: 'Cursive Font';
                    src: local('Brush Script MT'), 
                         local('Segoe Script'), 
                         local('Bradley Hand'), 
                         local('Comic Sans MS');
                }

                /* .certificate-signature 样式已移至signature-styles.css */
            </style>
        </head>
        <body>
            ${certificateHtml}
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
    
    const randomRotation = Math.floor(Math.random() * 5) - 2;
    const rotationClass = `rotate-${randomRotation < 0 ? 'neg-' : 'pos-'}${Math.abs(randomRotation)}`;
    
    return `<span class="dynamic-signature ${rotationClass}">${name}</span>`;
}