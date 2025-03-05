// DOM Elements
const calculateBtn = document.getElementById('calculate-btn');
const copyBtn = document.getElementById('copy-btn');
const autoAnnualInput = document.getElementById('auto-annual');
const homeAnnualInput = document.getElementById('home-annual');
const emptyState = document.getElementById('empty-state');
const resultsContent = document.getElementById('results-content');
const additionalInfo = document.getElementById('additional-info');

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
            alert('Please enter at least one insurance premium amount.');
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
        
        // 注意：不再自动隐藏"How to use this calculator"部分
        // 让用户通过切换按钮自行控制显示/隐藏
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
            `Insurance Monthly Payment Calculation Results Summary:\n` +
            `Auto Insurance Monthly Payment: ${autoMonthly}\n` +
            `Home Insurance Monthly Payment: ${homeMonthly}\n` +
            `Total Monthly Payment: ${totalMonthly}`;
        
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
    console.log('DOM Content Loaded');
    
    try {
        // 设置页脚年份
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
        
        // 初始化各个功能
        initializeCalculator();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// 确保在window完全加载后也尝试初始化（双重保险）
window.addEventListener('load', function() {
    console.log('Window Fully Loaded');
    
    try {
        // 修改检查逻辑，不再依赖toggle-how-to-use
        if (!window._calculatorInitialized) {
            console.log('Initializing on window load');
            initializeCalculator();
        }
    } catch (error) {
        console.error('Window load initialization error:', error);
    }
});

// 集中初始化所有功能
function initializeCalculator() {
    // 初始化输入框
    setupPremiumInputs();
    
    // 设置事件监听器
    setupCalculateButton();
    setupCopyButton();
    
    // 标记已初始化
    window._calculatorInitialized = true;
    
    console.log('Calculator initialization complete');
} 