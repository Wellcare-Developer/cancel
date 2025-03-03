// DOM Elements
const calculateBtn = document.getElementById('calculate-btn');
const copyBtn = document.getElementById('copy-btn');
const autoAnnualInput = document.getElementById('auto-annual');
const homeAnnualInput = document.getElementById('home-annual');
const emptyState = document.getElementById('empty-state');
const resultsContent = document.getElementById('results-content');
const additionalInfo = document.getElementById('additional-info');
const howToUseSection = document.getElementById('how-to-use');

// Result Elements
const resultAutoMonthly = document.getElementById('result-auto-monthly');
const resultHomeMonthly = document.getElementById('result-home-monthly');
const resultTotalMonthly = document.getElementById('result-total-monthly');

// Detail Elements
const detailAutoPremium = document.getElementById('detail-auto-premium');
const detailAutoInterest = document.getElementById('detail-auto-interest');
const detailHomePremium = document.getElementById('detail-home-premium');
const detailHomeTax = document.getElementById('detail-home-tax');
const detailHomeInterest = document.getElementById('detail-home-interest');

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Format currency values
function formatCurrency(value) {
    return '$' + parseFloat(value).toFixed(2) + ' CAD';
}

// Setup premium input validation and formatting
function setupPremiumInputs() {
    const premiumInputs = [autoAnnualInput, homeAnnualInput];
    
    premiumInputs.forEach(input => {
        input.addEventListener('input', function(e) {
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
        
        input.addEventListener('blur', function(e) {
            // 如果有值，确保显示两位小数
            if (e.target.value) {
                e.target.value = parseFloat(e.target.value).toFixed(2);
            }
        });
        
        input.addEventListener('focus', function(e) {
            // 选中所有文本
            e.target.select();
        });
    });
}

// Calculate monthly payments
function setupCalculateButton() {
    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', function() {
        // 获取输入值
        const autoAnnual = parseFloat(autoAnnualInput.value) || 0;
        const homeAnnual = parseFloat(homeAnnualInput.value) || 0;

        // 验证输入
        if (autoAnnual === 0 && homeAnnual === 0) {
            alert('请至少输入一个保费金额。');
            return;
        }

        // 利率和税率
        const autoInterestRate = 0.013;  // 1.3% 汽车保险月利率
        const homeTaxRate = 0.08;        // 8% 房屋保险税率
        const homeInterestRate = 0.03;   // 3% 房屋保险月利率

        // 计算汽车保险月付
        let autoMonthlyCost = 0;
        let autoMonthlyPremium = 0;
        let autoMonthlyInterest = 0;
        
        if (autoAnnual > 0) {
            autoMonthlyPremium = autoAnnual / 12;
            autoMonthlyInterest = autoMonthlyPremium * autoInterestRate;
            autoMonthlyCost = autoMonthlyPremium + autoMonthlyInterest;
        }

        // 计算房屋保险月付
        let homeMonthlyCost = 0;
        let homeMonthlyPremium = 0;
        let homeMonthlyTax = 0;
        let homeMonthlyInterest = 0;
        
        if (homeAnnual > 0) {
            homeMonthlyPremium = homeAnnual / 12;
            homeMonthlyTax = homeMonthlyPremium * homeTaxRate;
            homeMonthlyInterest = homeMonthlyPremium * homeInterestRate;
            homeMonthlyCost = homeMonthlyPremium + homeMonthlyTax + homeMonthlyInterest;
        }

        // 计算总月付
        const totalMonthlyCost = autoMonthlyCost + homeMonthlyCost;

        // 显示结果
        resultAutoMonthly.textContent = formatCurrency(autoMonthlyCost);
        resultHomeMonthly.textContent = formatCurrency(homeMonthlyCost);
        resultTotalMonthly.textContent = formatCurrency(totalMonthlyCost);
        
        // 显示详细信息
        detailAutoPremium.textContent = formatCurrency(autoMonthlyPremium);
        detailAutoInterest.textContent = formatCurrency(autoMonthlyInterest);
        detailHomePremium.textContent = formatCurrency(homeMonthlyPremium);
        detailHomeTax.textContent = formatCurrency(homeMonthlyTax);
        detailHomeInterest.textContent = formatCurrency(homeMonthlyInterest);
        
        // 显示结果区域，隐藏空状态
        emptyState.classList.add('hidden');
        resultsContent.classList.remove('hidden');
        additionalInfo.classList.remove('hidden');
        
        // 显示复制按钮
        copyBtn.classList.remove('hidden');
        
        // 隐藏"How to use this calculator"部分
        if (howToUseSection) {
            howToUseSection.style.display = 'none';
        }
    });
}

// Copy summary functionality
function setupCopyButton() {
    let copyTimeout;
    copyBtn.addEventListener('click', function() {
        const autoMonthly = resultAutoMonthly.textContent;
        const homeMonthly = resultHomeMonthly.textContent;
        const totalMonthly = resultTotalMonthly.textContent;
        
        const summaryText = 
            `保险月付计算结果摘要:\n` +
            `汽车保险月付: ${autoMonthly}\n` +
            `房屋保险月付: ${homeMonthly}\n` +
            `每月总付款: ${totalMonthly}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(summaryText).then(function() {
            // Update button text
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> 已复制';
            
            // Reset after 2 seconds
            clearTimeout(copyTimeout);
            copyTimeout = setTimeout(function() {
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        }).catch(function(err) {
            console.error('复制文本失败:', err);
        });
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 设置页脚年份
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Setup premium inputs
    setupPremiumInputs();
    
    // Setup event listeners
    setupCalculateButton();
    setupCopyButton();
}); 