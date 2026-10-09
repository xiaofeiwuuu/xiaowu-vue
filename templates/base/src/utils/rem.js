// rem 等比适配配置
const baseSize = 37.5 // 基准大小
const iphone6Ratio = 0.56221889 // iPhone 6 的宽高比 375:667

// 设置 rem 函数
const setRem = () => {
  const clientWidth = document.documentElement.clientWidth
  
  // 在大屏幕下（>768px），根据手机容器宽度计算
  if (clientWidth >= 768) {
    // 根据视口高度和手机比例计算容器宽度
    const containerWidth = window.innerHeight * iphone6Ratio
    // 根据容器宽度计算字根大小
    const scale = containerWidth / 375
    document.documentElement.style.fontSize = baseSize * scale + 'px'
  } else {
    // 在小屏幕下，根据屏幕宽度计算
    const scale = clientWidth / 375
    document.documentElement.style.fontSize = baseSize * scale + 'px'
  }
}

// 初始化
setRem()

// 改变窗口大小时重新设置 rem
window.addEventListener('resize', setRem)

// 页面显示/切换时重新计算
document.addEventListener('DOMContentLoaded', setRem)
window.addEventListener('orientationchange', setRem) 