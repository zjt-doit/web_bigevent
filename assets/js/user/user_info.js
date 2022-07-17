$(function(){
   
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname: function(value){
            if(value.length> 6){
                return '昵称长度必须在1~6个字符'
            }
        }
    })


    initUserInfo()
    // 初始化用户信息
    function initUserInfo(){
        $.ajax({
            method:'get',
            url:'http://www.liulongbin.top:3007/my/userinfo',
            headers: {
                // 从本地存储localStorage中取值，是getItem
                Authorization: localStorage.getItem('token') || ''
            },
            success:function(res){
                // console.log(res,"res")
                if(res.status !== 0){
                    return layer.msg('获取用户信息失败！')
                }
                console.log(res)

                // 调用form.val()快速为表单赋值
                form.val('userInfo',res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click',function(e){
        e.preventDefault()
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'post',
            url:'http://www.liulongbin.top:3007/my/userinfo',
            headers:{
                Authorization: localStorage.getItem('token')
            },
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('修改用户信息失败！')
                }
                layer.msg('修改用户信息成功！')

                // 调用父页面的方法，重新渲染用户的头像和用户信息
                // 如何调用父页面的方法呢？
                window.parent.getUserInfo()
            }
        })
    })

    
})