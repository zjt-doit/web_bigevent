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
                /*
                语法：form.val('filter', object);
                用于给指定表单集合的元素赋值和取值。如果 object 参数存在，则为赋值；如果 object 参数不存在，则为取值。
                作用：是为了提交按钮能够正常提交数据，在接口文档中的data有id，为了能够提交id，
                又能不让id的input输入框在页面中显示，需要设置hidden隐藏属性
                */ 
                // 作用：可以将用户的信息快速填充到表格中去
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