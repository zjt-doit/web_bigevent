/*
    注意：每次调用$.get()、$.post()或$.ajax()的时候，都会优先调用ajaxPrefilter这个函数，
    在这个函数中，可以拿到我们给Ajax函数提供的配置对象
*/ 
$.ajaxPrefilter(function(options){
    // 在发起Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // 统一为有权限的接口，设置headers请求头
    
})