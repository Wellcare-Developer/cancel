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
    
    // 更新按钮文本，确保显示正确
    copyBtn.innerHTML = '<i class="fa-solid fa-arrow-rotate-left"></i><span>Get New Certificate</span>';
    
    // 创建证书HTML - 与打印版保持一致的表格布局
    const certificateHTML = `
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; background-color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 20px auto; max-width: 800px;">
            <!-- 页眉 -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 10px;">
                <div style="max-width: 50%;">
                    <img src="../../@photo/BrokerTeam-coi-head.png" alt="BrokerTeam Insurance Logo" style="max-width: 100%; height: auto;">
                </div>
                <div style="text-align: right; font-size: 15px; line-height: 1.5; font-weight: 600;">
                    <p style="margin: 0;">117-9560 MARKHAM RD</p>
                    <p style="margin: 0;">MARKHAM, ON L6E 0V1</p>
                    <p style="margin: 0;">Tel: 905.472.5666</p>
                </div>
            </div>
            
            <!-- 标题 -->
            <div style="text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0 15px 0;">AUTO INSURANCE CONFIRMATION</div>
            
            <!-- 认证声明 -->
            <div style="font-size: 13px; line-height: 1.4; margin-bottom: 30px;">
                This is to certify that insurance on the automobile as herein described have been issued to the Insured(s) named below and are in force at this date.
            </div>
            
            <!-- 表格式内容 -->
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Named Insured:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formData.namedInsured}</td>
                </tr>
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Insured Location:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formData.propertyAddress}</td>
                </tr>
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Vehicle Model:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formData.vehicleModel}</td>
                </tr>
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Vehicle VIN#:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formData.vehicleVin}</td>
                </tr>
                ${formData.financeType !== 'none' && formData.mortgageeInfo && formData.mortgageeInfo.name ? `
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">${formData.financeType === 'lessor' ? 'Lessor:' : 'Lienholder:'}</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formData.mortgageeInfo.name}</td>
                </tr>
                ${formData.mortgageeInfo.address ? `
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Address:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formData.mortgageeInfo.address}</td>
                </tr>
                ` : ''}
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
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Collision Deductible:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formatCurrency(formData.deductibleType === 'all-perils' ? formData.deductible : formData.collisionDeductible)}</td>
                </tr>
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Comprehensive Deductible:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formatCurrency(formData.deductibleType === 'all-perils' ? formData.deductible : formData.comprehensiveDeductible)}</td>
                </tr>
                ${formData.financeType !== 'none' ? `
                <tr>
                    <td style="width: 35%; text-align: right; padding: 4px 12px 4px 0; font-weight: bold; color: #333;">Coverage Form:</td>
                    <td style="width: 65%; text-align: left; padding: 4px 0;">${formData.financeType === 'lessor' ? 'OPCF5A' : 'OPCF23A'}</td>
                </tr>
                ` : ''}
            </table>
            
            <!-- 签名区域 -->
            <div style="margin-top: 50px;">
                <div style="width: 250px; margin-top: 20px;">
                    <div style="font-family: 'Brush Script MT', 'Dancing Script', cursive; font-size: 24px; color: #000080; margin-bottom: 5px; text-align: center;">${formData.signatureName}</div>
                    <div style="border-top: 1px solid #333; width: 100%; margin-bottom: 5px;"></div>
                    <div style="text-align: center; font-size: 12px;">
                        Authorized Representative<br>
                        Date: ${new Date().toLocaleDateString()}
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
        alert('请允许弹出窗口以打印证书。');
        return;
    }
    
    // 写入HTML内容 - 优化布局避免分页问题
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>AUTO INSURANCE CONFIRMATION</title>
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
                
                .header-info {
                    text-align: right;
                    font-size: 14px;
                    line-height: 1.4;
                    font-weight: 600;
                }
                
                .header-info p {
                    margin: 0;
                }
                
                .title {
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    margin: 20px 0 15px 0;
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
                    <div class="header-info">
                        <p>117-9560 MARKHAM RD</p>
                        <p>MARKHAM, ON L6E 0V1</p>
                        <p>Tel: 905.472.5666</p>
                    </div>
                </div>
                
                <!-- 标题 -->
                <div class="title">AUTO INSURANCE CONFIRMATION</div>
                
                <!-- 认证声明 -->
                <div class="description">
                    This is to certify that insurance on the automobile as herein described have been issued to the Insured(s) named below and are in force at this date.
                </div>
                
                <!-- 表格式内容 -->
                <table>
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
                        <td class="label">Collision Deductible:</td>
                        <td class="value">${formatCurrency(formData.deductibleType === 'all-perils' ? formData.deductible : formData.collisionDeductible)}</td>
                    </tr>
                    <tr>
                        <td class="label">Comprehensive Deductible:</td>
                        <td class="value">${formatCurrency(formData.deductibleType === 'all-perils' ? formData.deductible : formData.comprehensiveDeductible)}</td>
                    </tr>
                    ${formData.financeType !== 'none' ? `
                    <tr>
                        <td class="label">Coverage Form:</td>
                        <td class="value">${formData.financeType === 'lessor' ? 'OPCF5A' : 'OPCF23A'}</td>
                    </tr>
                    ` : ''}
                </table>
                
                <!-- 签名区域 -->
                <div class="signature-section">
                    <div class="signature-container">
                        <div class="signature-name">${formData.signatureName}</div>
                        <div class="signature-line"></div>
                        <div class="signature-info">
                            Authorized Representative<br>
                            Date: ${new Date().toLocaleDateString()}
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
