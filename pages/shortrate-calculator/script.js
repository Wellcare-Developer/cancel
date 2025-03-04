// 统一的 Aviva/Wawanesa 短期费率表
const standardShortRateTable = [
    { days: { min: 1, max: 3 }, rate: 8 },
    { days: { min: 4, max: 7 }, rate: 9 },
    { days: { min: 8, max: 11 }, rate: 10 },
    { days: { min: 12, max: 15 }, rate: 11 },
    { days: { min: 16, max: 19 }, rate: 12 },
    { days: { min: 20, max: 23 }, rate: 13 },
    { days: { min: 24, max: 26 }, rate: 14 },
    { days: { min: 27, max: 30 }, rate: 15 },
    { days: { min: 31, max: 34 }, rate: 16 },
    { days: { min: 35, max: 38 }, rate: 17 },
    { days: { min: 39, max: 42 }, rate: 18 },
    { days: { min: 43, max: 46 }, rate: 19 },
    { days: { min: 47, max: 49 }, rate: 20 },
    { days: { min: 50, max: 53 }, rate: 21 },
    { days: { min: 54, max: 57 }, rate: 22 },
    { days: { min: 58, max: 61 }, rate: 23 },
    { days: { min: 62, max: 65 }, rate: 24 },
    { days: { min: 66, max: 69 }, rate: 25 },
    { days: { min: 70, max: 73 }, rate: 26 },
    { days: { min: 74, max: 76 }, rate: 27 },
    { days: { min: 77, max: 80 }, rate: 28 },
    { days: { min: 81, max: 84 }, rate: 29 },
    { days: { min: 85, max: 88 }, rate: 30 },
    { days: { min: 89, max: 92 }, rate: 31 },
    { days: { min: 93, max: 96 }, rate: 32 },
    { days: { min: 97, max: 99 }, rate: 33 },
    { days: { min: 100, max: 103 }, rate: 34 },
    { days: { min: 104, max: 107 }, rate: 35 },
    { days: { min: 108, max: 111 }, rate: 36 },
    { days: { min: 112, max: 115 }, rate: 37 },
    { days: { min: 116, max: 119 }, rate: 38 },
    { days: { min: 120, max: 122 }, rate: 39 },
    { days: { min: 123, max: 126 }, rate: 40 },
    { days: { min: 127, max: 130 }, rate: 41 },
    { days: { min: 131, max: 134 }, rate: 42 },
    { days: { min: 135, max: 138 }, rate: 43 },
    { days: { min: 139, max: 142 }, rate: 44 },
    { days: { min: 143, max: 146 }, rate: 45 },
    { days: { min: 147, max: 149 }, rate: 46 },
    { days: { min: 150, max: 153 }, rate: 47 },
    { days: { min: 154, max: 157 }, rate: 48 },
    { days: { min: 158, max: 161 }, rate: 49 },
    { days: { min: 162, max: 165 }, rate: 50 },
    { days: { min: 166, max: 169 }, rate: 51 },
    { days: { min: 170, max: 172 }, rate: 52 },
    { days: { min: 173, max: 176 }, rate: 53 },
    { days: { min: 177, max: 180 }, rate: 54 },
    { days: { min: 181, max: 184 }, rate: 55 },
    { days: { min: 185, max: 188 }, rate: 56 },
    { days: { min: 189, max: 192 }, rate: 57 },
    { days: { min: 193, max: 195 }, rate: 58 },
    { days: { min: 196, max: 199 }, rate: 59 },
    { days: { min: 200, max: 203 }, rate: 60 },
    { days: { min: 204, max: 207 }, rate: 61 },
    { days: { min: 208, max: 211 }, rate: 62 },
    { days: { min: 212, max: 215 }, rate: 63 },
    { days: { min: 216, max: 219 }, rate: 64 },
    { days: { min: 220, max: 222 }, rate: 65 },
    { days: { min: 223, max: 226 }, rate: 66 },
    { days: { min: 227, max: 230 }, rate: 67 },
    { days: { min: 231, max: 234 }, rate: 68 },
    { days: { min: 235, max: 238 }, rate: 69 },
    { days: { min: 239, max: 242 }, rate: 70 },
    { days: { min: 243, max: 245 }, rate: 71 },
    { days: { min: 246, max: 249 }, rate: 72 },
    { days: { min: 250, max: 253 }, rate: 73 },
    { days: { min: 254, max: 257 }, rate: 74 },
    { days: { min: 258, max: 261 }, rate: 75 },
    { days: { min: 262, max: 265 }, rate: 76 },
    { days: { min: 266, max: 268 }, rate: 77 },
    { days: { min: 269, max: 272 }, rate: 78 },
    { days: { min: 273, max: 276 }, rate: 79 },
    { days: { min: 277, max: 280 }, rate: 80 },
    { days: { min: 281, max: 284 }, rate: 81 },
    { days: { min: 285, max: 288 }, rate: 82 },
    { days: { min: 289, max: 292 }, rate: 83 },
    { days: { min: 293, max: 296 }, rate: 84 },
    { days: { min: 297, max: 299 }, rate: 85 },
    { days: { min: 300, max: 303 }, rate: 86 },
    { days: { min: 304, max: 307 }, rate: 87 },
    { days: { min: 308, max: 311 }, rate: 88 },
    { days: { min: 312, max: 315 }, rate: 89 },
    { days: { min: 316, max: 318 }, rate: 90 },
    { days: { min: 319, max: 322 }, rate: 91 },
    { days: { min: 323, max: 326 }, rate: 92 },
    { days: { min: 327, max: 330 }, rate: 93 },
    { days: { min: 331, max: 334 }, rate: 94 },
    { days: { min: 335, max: 338 }, rate: 95 },
    { days: { min: 339, max: 341 }, rate: 96 },
    { days: { min: 342, max: 345 }, rate: 97 },
    { days: { min: 346, max: 349 }, rate: 98 },
    { days: { min: 350, max: 353 }, rate: 99 },
    { days: { min: 354, max: 365 }, rate: 100 },
  ];

// Desjardins 保持独立的费率表
const desjardinsShortRateTable = [
    { days: { min: 1, max: 3 }, rate: 8 },
    { days: { min: 4, max: 7 }, rate: 9 },
    { days: { min: 8, max: 11 }, rate: 11 },
    { days: { min: 12, max: 15 }, rate: 12 },
    { days: { min: 16, max: 19 }, rate: 14 },
    { days: { min: 20, max: 23 }, rate: 16 },
    { days: { min: 24, max: 26 }, rate: 18 },
    { days: { min: 27, max: 30 }, rate: 19 },
    { days: { min: 31, max: 34 }, rate: 21 },
    { days: { min: 35, max: 38 }, rate: 22 },
    { days: { min: 39, max: 42 }, rate: 23 },
    { days: { min: 43, max: 46 }, rate: 24 },
    { days: { min: 47, max: 49 }, rate: 25 },
    { days: { min: 50, max: 53 }, rate: 26 },
    { days: { min: 54, max: 57 }, rate: 27 },
    { days: { min: 58, max: 61 }, rate: 28 },
    { days: { min: 62, max: 65 }, rate: 29 },
    { days: { min: 66, max: 69 }, rate: 30 },
    { days: { min: 70, max: 73 }, rate: 31 },
    { days: { min: 74, max: 76 }, rate: 32 },
    { days: { min: 77, max: 80 }, rate: 33 },
    { days: { min: 81, max: 84 }, rate: 34 },
    { days: { min: 85, max: 88 }, rate: 35 },
    { days: { min: 89, max: 92 }, rate: 36 },
    { days: { min: 93, max: 96 }, rate: 37 },
    { days: { min: 97, max: 99 }, rate: 38 },
    { days: { min: 100, max: 103 }, rate: 39 },
    { days: { min: 104, max: 107 }, rate: 40 },
    { days: { min: 108, max: 111 }, rate: 41 },
    { days: { min: 112, max: 115 }, rate: 42 },
    { days: { min: 116, max: 119 }, rate: 43 },
    { days: { min: 120, max: 122 }, rate: 44 },
    { days: { min: 123, max: 126 }, rate: 45 },
    { days: { min: 127, max: 130 }, rate: 46 },
    { days: { min: 131, max: 134 }, rate: 47 },
    { days: { min: 135, max: 138 }, rate: 48 },
    { days: { min: 139, max: 142 }, rate: 49 },
    { days: { min: 143, max: 146 }, rate: 50 },
    { days: { min: 147, max: 149 }, rate: 51 },
    { days: { min: 150, max: 153 }, rate: 52 },
    { days: { min: 154, max: 157 }, rate: 53 },
    { days: { min: 158, max: 161 }, rate: 54 },
    { days: { min: 162, max: 165 }, rate: 55 },
    { days: { min: 166, max: 169 }, rate: 56 },
    { days: { min: 170, max: 172 }, rate: 57 },
    { days: { min: 173, max: 176 }, rate: 58 },
    { days: { min: 177, max: 180 }, rate: 59 },
    { days: { min: 181, max: 184 }, rate: 60 },
    { days: { min: 185, max: 188 }, rate: 61 },
    { days: { min: 189, max: 192 }, rate: 62 },
    { days: { min: 193, max: 195 }, rate: 63 },
    { days: { min: 196, max: 199 }, rate: 64 },
    { days: { min: 200, max: 203 }, rate: 65 },
    { days: { min: 204, max: 207 }, rate: 66 },
    { days: { min: 208, max: 211 }, rate: 67 },
    { days: { min: 212, max: 215 }, rate: 68 },
    { days: { min: 216, max: 219 }, rate: 69 },
    { days: { min: 220, max: 222 }, rate: 70 },
    { days: { min: 223, max: 226 }, rate: 71 },
    { days: { min: 227, max: 230 }, rate: 72 },
    { days: { min: 231, max: 234 }, rate: 73 },
    { days: { min: 235, max: 238 }, rate: 74 },
    { days: { min: 239, max: 242 }, rate: 75 },
    { days: { min: 243, max: 245 }, rate: 76 },
    { days: { min: 246, max: 249 }, rate: 77 },
    { days: { min: 250, max: 253 }, rate: 78 },
    { days: { min: 254, max: 257 }, rate: 79 },
    { days: { min: 258, max: 261 }, rate: 80 },
    { days: { min: 262, max: 265 }, rate: 81 },
    { days: { min: 266, max: 268 }, rate: 82 },
    { days: { min: 269, max: 272 }, rate: 83 },
    { days: { min: 273, max: 276 }, rate: 84 },
    { days: { min: 277, max: 280 }, rate: 85 },
    { days: { min: 281, max: 284 }, rate: 86 },
    { days: { min: 285, max: 288 }, rate: 87 },
    { days: { min: 289, max: 292 }, rate: 88 },
    { days: { min: 293, max: 296 }, rate: 89 },
    { days: { min: 297, max: 299 }, rate: 90 },
    { days: { min: 300, max: 303 }, rate: 91 },
    { days: { min: 304, max: 307 }, rate: 92 },
    { days: { min: 308, max: 311 }, rate: 93 },
    { days: { min: 312, max: 315 }, rate: 94 },
    { days: { min: 316, max: 318 }, rate: 95 },
    { days: { min: 319, max: 326 }, rate: 96 },
    { days: { min: 327, max: 334 }, rate: 97 },
    { days: { min: 335, max: 341 }, rate: 98 },
    { days: { min: 342, max: 349 }, rate: 99 },
    { days: { min: 350, max: 365 }, rate: 100 },
  ];
  
// Global variables for date pickers
let startDatePicker, cancelDatePicker;

// DOM Elements
const calculateBtn = document.getElementById('calculate-btn');
const copyBtn = document.getElementById('copy-btn');
const companySelect = document.getElementById('insurance-company');
const annualPremiumInput = document.getElementById('annual-premium');
const startDateInput = document.getElementById('start-date');
const cancelDateInput = document.getElementById('cancel-date');
const emptyState = document.getElementById('empty-state');
const resultsContent = document.getElementById('results-content');

// Result Elements
const resultAnnualPremium = document.getElementById('result-annual-premium');
const resultDaysInsured = document.getElementById('result-days-insured');
const resultShortRate = document.getElementById('result-short-rate');
const resultProRata = document.getElementById('result-pro-rata');
const resultPenalty = document.getElementById('result-penalty');
const resultEarned = document.getElementById('result-earned');
const resultReturn = document.getElementById('result-return');

// Detail Elements
const detailDays = document.getElementById('detail-days');
const detailProRataFactor = document.getElementById('detail-pro-rata-factor');
const detailShortRateFactor = document.getElementById('detail-short-rate-factor');
const detailPenalty = document.getElementById('detail-penalty');
const referenceText = document.getElementById('reference-text');
const referenceCompany = document.getElementById('reference-company');

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Get short rate percentage based on days insured and selected company
function getShortRatePercent(days, company) {
    // Desjardins使用自己的费率表，Aviva、Wawanesa、Other和其他公司使用标准费率表
    const useDesjardinsTable = company === "desjardins";
    const table = useDesjardinsTable ? desjardinsShortRateTable : standardShortRateTable;
    const entry = table.find(item => days >= item.days.min && days <= item.days.max);
    return entry ? entry.rate : 100;
}

// Format currency values
function formatCurrency(value) {
    return '$' + parseFloat(value).toFixed(2);
}

// Setup premium input validation and formatting
function setupPremiumInput() {
        const premiumInput = document.getElementById('annual-premium');
    
    premiumInput.addEventListener('input', function(e) {
        // 移除非数字字符（保留小数点）
        let value = e.target.value.replace(/[^\d.]/g, '');
        
        // 确保只有一个小数点
        const decimalCount = (value.match(/\./g) || []).length;
        if (decimalCount > 1) {
            value = value.replace(/\.(?=.*\.)/g, '');
        }
        
        // 限制小数位数为2位
        if (value.includes('.')) {
            const parts = value.split('.');
            value = parts[0] + '.' + parts[1].slice(0, 2);
        }
        
        // 移除前导零
        value = value.replace(/^0+(?=\d)/, '');
        
        // 更新输入框的值
        e.target.value = value;
    });
    
    premiumInput.addEventListener('blur', function(e) {
        // 如果有值，确保显示两位小数
        if (e.target.value) {
            e.target.value = parseFloat(e.target.value).toFixed(2);
        }
    });
    
    premiumInput.addEventListener('focus', function(e) {
        // 选中所有文本
        e.target.select();
    });
}

// Initialize date pickers
function initDatePickers() {
    const today = new Date();
    
    // Common flatpickr config
    const datePickerConfig = {
        dateFormat: "Y-m-d",
        allowInput: true,
        altInput: true,
        altFormat: "F j, Y",
        disableMobile: true,
        position: 'auto center',
        static: true,
        appendTo: document.body,
        positionElement: null
    };
    
    // Initialize start date picker
    startDatePicker = flatpickr("#start-date", {
        ...datePickerConfig,
        defaultDate: today,
        maxDate: today,
        onChange: function(selectedDates, dateStr) {
            // Update the minimum date for the cancel date picker
            cancelDatePicker.set('minDate', dateStr);
            
            // If cancel date is before start date, update it
            if (cancelDatePicker.selectedDates[0] < selectedDates[0]) {
                cancelDatePicker.setDate(selectedDates[0]);
            }
        }
    });
    
    // Initialize cancel date picker
    cancelDatePicker = flatpickr("#cancel-date", {
        ...datePickerConfig,
        defaultDate: today,
        minDate: today,
        maxDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
    });
}

// Calculate the short rate
function setupCalculateButton() {
    const calculateBtn = document.getElementById('calculate-btn');
    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', function() {
        // 获取输入值
        const annualPremium = parseFloat(document.getElementById('annual-premium').value);
        const startDate = document.getElementById('start-date').value;
        const cancelDate = document.getElementById('cancel-date').value;
        const company = document.getElementById('insurance-company').value;
        
        // 获取其他公司名称（如果选择了"other"）
        let companyName = "";
        if (company === "other") {
            companyName = document.getElementById('other-company').value.trim() || "Other Company";
        } else {
            // 根据选择的值获取显示名称
            const companySelect = document.getElementById('insurance-company');
            const selectedOption = companySelect.options[companySelect.selectedIndex];
            companyName = selectedOption.textContent;
        }

        // 验证输入
        if (!annualPremium || isNaN(annualPremium) || annualPremium <= 0) {
            alert('Please enter a valid annual premium amount.');
            return;
        }

        if (!startDate) {
            alert('Please select a policy start date.');
            return;
        }

        if (!cancelDate) {
            alert('Please select a cancellation date.');
            return;
        }

        if (!company) {
            alert('Please select an insurance company.');
            return;
        }

        // 计算日期差异
        const start = new Date(startDate);
        const cancel = new Date(cancelDate);
        
        // 验证日期
        if (cancel < start) {
            alert('Cancellation date cannot be before the policy start date.');
            return;
        }

        // 计算保单持续的天数
        const timeDiff = cancel.getTime() - start.getTime();
        const daysInsured = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // 包括开始和结束日
        
        // 计算按比例的因子（天数/365）
        const proRataFactor = (daysInsured / 365) * 100;
        
        // 获取短期费率因子
        const shortRateFactor = getShortRatePercent(daysInsured, company);
        
        // 计算保费
        const proRataPremium = (annualPremium * proRataFactor / 100).toFixed(2);
        const shortRatePremium = (annualPremium * shortRateFactor / 100).toFixed(2);
        const returnPremium = (annualPremium - shortRatePremium).toFixed(2);
        const penaltyAmount = (shortRatePremium - proRataPremium).toFixed(2);
        
        // 显示结果
        document.getElementById('result-annual-premium').textContent = formatCurrency(annualPremium);
        document.getElementById('result-days-insured').textContent = daysInsured + " days";
        document.getElementById('result-short-rate').textContent = shortRateFactor + "%";
        document.getElementById('result-pro-rata').textContent = formatCurrency(proRataPremium);
        document.getElementById('result-penalty').textContent = formatCurrency(penaltyAmount);
        document.getElementById('result-earned').textContent = formatCurrency(shortRatePremium);
        document.getElementById('result-return').textContent = formatCurrency(returnPremium);
        
        // 显示详细信息
        document.getElementById('detail-days').textContent = daysInsured;
        document.getElementById('detail-pro-rata-factor').textContent = proRataFactor.toFixed(2);
        document.getElementById('detail-short-rate-factor').textContent = shortRateFactor.toFixed(2);
        document.getElementById('detail-penalty').textContent = penaltyAmount;
        
        // 显示参考信息
        document.getElementById('reference-text').textContent = 
            `This calculation uses the standard short rate table for ${daysInsured} days, resulting in a ${shortRateFactor}% earned premium.`;
        document.getElementById('reference-company').textContent = 
            `Based on ${companyName} short rate cancellation guidelines.`;
        
        // 显示结果部分
        document.getElementById('results-content').classList.remove('hidden');
        document.getElementById('empty-state').classList.add('hidden');
        document.getElementById('copy-btn').classList.remove('hidden');
    });
}

// Copy summary functionality
function setupCopyButton() {
    let copyTimeout;
    copyBtn.addEventListener('click', function() {
        const premium = resultAnnualPremium.textContent;
        const days = resultDaysInsured.textContent;
        const shortRate = resultShortRate.textContent;
        const proRata = resultProRata.textContent;
        const penalty = resultPenalty.textContent;
        const earned = resultEarned.textContent;
        const returnPremium = resultReturn.textContent;
        
        const summaryText = 
            `Short Rate Calculation Summary:\n` +
            `Annual Premium: ${premium}\n` +
            `Days Insured: ${days}\n` +
            `Short Rate Factor: ${shortRate}\n` +
            `Pro-rata Premium: ${proRata}\n` +
            `Penalty Amount: ${penalty}\n` +
            `Earned Premium: ${earned}\n` +
            `Return Premium: ${returnPremium}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(summaryText).then(function() {
            // Update button text
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
            
            // Reset after 2 seconds
            clearTimeout(copyTimeout);
            copyTimeout = setTimeout(function() {
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy text:', err);
        });
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 设置页脚年份
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize date pickers
    initDatePickers();
    
    // Setup premium input
    setupPremiumInput();
    
    // Setup event listeners
    setupCalculateButton();
    setupCopyButton();
});

// 在现有JavaScript中添加切换功能
document.getElementById('how-to-use-toggle').addEventListener('click', function() {
    const content = document.getElementById('how-to-use-content');
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
});

// 添加键盘支持
document.getElementById('how-to-use-toggle').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        this.click();
    }
});