// DOM Elements
const calculateBtn = document.getElementById('calculate-btn');
const copyBtn = document.getElementById('copy-btn');
const autoAnnualInput = document.getElementById('auto-annual');
const homeAnnualInput = document.getElementById('home-annual');
const emptyState = document.getElementById('empty-state');
const resultsContent = document.getElementById('results-content');
const additionalInfo = document.getElementById('additional-info');
const howToUseSection = document.getElementById('how-to-use');

// Toggle button for How to Use section
const toggleHowToUseBtn = document.getElementById('toggle-how-to-use');

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

// 设置How to Use切换按钮功能
function setupToggleHowToUse() {
    // 确保在DOM完全加载后再次尝试获取元素
    const toggleBtn = document.getElementById('toggle-how-to-use');
    const howToUseBox = document.getElementById('how-to-use');
    
    // 添加调试信息
    console.log('Toggle button found:', !!toggleBtn);
    console.log('How to use section found:', !!howToUseBox);
    
    // 检查元素是否存在
    if (!toggleBtn || !howToUseBox) {
        console.error('Toggle button or How to use section not found in DOM');
        // 如果元素不存在，尝试延迟再次查找
        setTimeout(setupToggleHowToUse, 500);
        return;
    }
    
    // 确保移除任何现有的事件监听器，防止重复绑定
    toggleBtn.removeEventListener('click', toggleHowToUseHandler);
    
    // 添加事件监听器
    toggleBtn.addEventListener('click', toggleHowToUseHandler);
    
    // 确保初始状态正确
    if (howToUseBox.style.display === '') {
        howToUseBox.style.display = 'none';
    }
    
    // 更新按钮初始文本
    updateToggleButtonText();
    
    console.log('Toggle functionality setup complete');
}

// 将事件处理逻辑分离为独立函数，便于移除和添加
function toggleHowToUseHandler() {
    const howToUseBox = document.getElementById('how-to-use');
    if (!howToUseBox) return;
    
    // 检查当前显示状态
    const isVisible = howToUseBox.style.display !== 'none';
    
    // 切换显示状态
    howToUseBox.style.display = isVisible ? 'none' : 'block';
    
    // 更新按钮文本
    updateToggleButtonText();
}

// 更新按钮文本的函数
function updateToggleButtonText() {
    const toggleBtn = document.getElementById('toggle-how-to-use');
    const howToUseBox = document.getElementById('how-to-use');
    if (!toggleBtn || !howToUseBox) return;
    
    const isVisible = howToUseBox.style.display !== 'none';
    toggleBtn.innerHTML = isVisible ? 
        '<i class="fas fa-times-circle"></i> Hide How to Use' : 
        '<i class="fas fa-info-circle"></i> Show How to Use';
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
        console.error('初始化过程中发生错误:', error);
    }
});

// 确保在window完全加载后也尝试初始化（双重保险）
window.addEventListener('load', function() {
    console.log('Window Fully Loaded');
    
    try {
        // 检查是否已经初始化
        const toggleBtn = document.getElementById('toggle-how-to-use');
        if (toggleBtn && !toggleBtn._initialized) {
            console.log('Initializing on window load');
            initializeCalculator();
        }
    } catch (error) {
        console.error('Window load初始化过程中发生错误:', error);
    }
});

// 集中初始化所有功能
function initializeCalculator() {
    // 初始化输入框
    setupPremiumInputs();
    
    // 设置事件监听器
    setupCalculateButton();
    setupCopyButton();
    
    // 最后设置折叠功能（确保DOM已完全加载）
    setTimeout(setupToggleHowToUse, 100);
    
    console.log('Calculator initialization complete');
}

// 修改后
const howToUseToggle = document.getElementById('how-to-use-toggle');
const howToUseContent = document.getElementById('how-to-use-content');

// 更新事件监听器
howToUseToggle.addEventListener('click', function() {
    const isVisible = howToUseContent.style.display !== 'none';
    howToUseContent.style.display = isVisible ? 'none' : 'block';
    this.innerHTML = isVisible ? 
        '<i class="fas fa-info-circle"></i> Show Instructions' : 
        '<i class="fas fa-times-circle"></i> Hide Instructions';
});

// 添加键盘事件支持
document.getElementById('how-to-use-toggle').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        this.click();
    }
}); 