$(function(){
    let form = layui.form
    let layer = layui.layer

    // 给表单提交验证规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        samePwd:function(value){
            if(value === $('[name=oldPwd]').val()){
                return '新旧密码不能相同！'
            }
        },
        rePwd:function(value){
            if(value !== $('[name=newPwd]').val()){
                return '两次密码不一致！'
            }
        }
    })


    // 为form表单添加提交事件的监听
    $('.layui-form').on('submit', function(e){
        e.preventDefault()
        let oldPwd= $('[name=oldPwd]').val()
        let newPwd= $('[name=newPws]').val()
        $.ajax({
            method:'post',
            url:'http://www.liulongbin.top:3007/my/updatepwd',
            headers:{
                Authorization:localStorage.getItem('token')
            },
            // data:$(this).serialize(),
            data:{
                oldPwd: oldPwd,
                newPwd: newPwd
            },
            success:function(res){
                if(res.status !== 0){
                    return layui.layer.msg('更新密码失败！')
                }
                
                layui.layer.msg('更新密码成功！')
                $(".layui-form")[0].reset()
                console.log(res)
            }
        })
    })
})