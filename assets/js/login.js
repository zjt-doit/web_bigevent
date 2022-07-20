$(function () {
    $('#link-reg').on('click', function () {
        $('.login').hide()
        $('.register').show()
    })

    $('#link-login').on('click', function () {
        $('.login').show()
        $('.register').hide()
    })

    // 自定义一个pwd的校验规则
    // 注意form不能直接使用，而是需要从layui导出出来，然后用一个变量来接收
    let form = layui.form
    let layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            let pwd = $('.register [name=password]').val()
            if (pwd != value) {
                return '两次密码不一致！'
            }
        }
    })


    // 先进行监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认的提交行为
        e.preventDefault()
        // 发起Ajax的post请求
        let username = $('.register [name=username]').val()
        let password = $('.register [name=password]').val()
        $.post('/api/reguser', { username: username, password: password }, function (res) {
            if (res.status !== 0) {
                // return console.log(res.message)
                return layer.msg(res.message)
            }
            // console.log('注册成功！')
            layer.msg('注册成功！')
            // 模拟人的点击行为
            $('#link-login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e){
        e.preventDefault()
        let username = $('.login [name=username]').val()
        let password = $('.login [name=password]').val()
        $.ajax({
            url:'/api/login',
            method:'post',
            data:{ username: username, password: password },
            success:function(res){
                if(res.status !==0){
                    return layer.msg(res.message)
                }
                layer.msg('登录成功！')
                console.log(res.token)
                // 将token保存到localStorage本地存储中去
                localStorage.setItem('token', res.token)
                // 跳转到后台页面
                location.href='./index.html'
                
            }
        })
    })
})

