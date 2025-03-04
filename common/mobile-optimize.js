// 移动端输入优化
function setupMobileInputs() {
  if (window.innerWidth < 768) {
    // 自动聚焦时放大输入框
    document.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('focus', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.2s ease';
      });
      
      input.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
      });
    });

    // 优化日期选择器触摸体验
    if (typeof flatpickr !== 'undefined') {
      flatpickr.defaultConfig.touchUI = true;
      flatpickr.defaultConfig.static = false;
    }
  }
}

// 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  setupMobileInputs();
  
  // 移动端隐藏复杂表格
  if (window.innerWidth < 768) {
    document.querySelectorAll('.rate-reference table').forEach(table => {
      table.classList.add('hidden');
      table.insertAdjacentHTML('beforebegin', 
        '<p class="mobile-note">[Table content hidden on mobile]</p>'
      );
    });
  }
}); 