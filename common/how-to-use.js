// 统一的How to Use交互功能
document.addEventListener('DOMContentLoaded', function() {
    const howToUseToggle = document.getElementById('how-to-use-toggle');
    const howToUseContent = document.getElementById('how-to-use-content');
    
    if (howToUseToggle && howToUseContent) {
        // 点击切换显示/隐藏
        howToUseToggle.addEventListener('click', function() {
            toggleHowToUse();
        });
        
        // 键盘访问支持
        howToUseToggle.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleHowToUse();
            }
        });
        
        function toggleHowToUse() {
            const isHidden = howToUseContent.classList.toggle('hidden');
            
            // 添加动画效果
            if (!isHidden) {
                howToUseContent.style.animation = 'fadeIn 0.3s ease';
                howToUseToggle.querySelector('i').style.transform = 'rotate(180deg)';
            } else {
                howToUseContent.style.animation = 'fadeOut 0.2s ease';
                howToUseToggle.querySelector('i').style.transform = 'rotate(0deg)';
            }
            
            // 保存状态到本地存储
            localStorage.setItem('howToUseVisible', !isHidden);
        }
        
        // 检查本地存储中的状态
        const savedState = localStorage.getItem('howToUseVisible');
        if (savedState === 'true') {
            howToUseContent.classList.remove('hidden');
            howToUseToggle.querySelector('i').style.transform = 'rotate(180deg)';
        }
    }
}); 