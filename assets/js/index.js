$(function () {
    getUserInfo()

    // 实现退出按钮的功能
    $('#logout').on('click', function () {
        // console.log('ok')
        let layer = layui.layer
        layer.confirm('确认退出吗？', { icon: 3, title: '提示' }, function (index) {
            //do something
            localStorage.removeItem('token')
            location.href = './login.html'
            layer.close(index);
        });
    })
})

function getUserInfo() {
    $.ajax({
        method: 'get',
        url: 'http://www.liulongbin.top:3007/my/userinfo',
        headers: {
            // 从本地存储localStorage中取值，是getItem
            Authorization: localStorage.getItem('token') || ''
        },
        success: function (res) {
            if (res.status !== 0) {
                console.log(res)
                return layui.layer.msg('获取用户信息失败！')
            }
            // layui.layer.msg('获取用户信息成功！')
            console.log(res)

            // 调用renderAvatar来渲染用户的头像
            renderAvatar(res.data)
        },
        complete: function(res){
            console.log(res)
            if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
                localStorage.removeItem('token')
                location.href='./login.html'
            }
        }
    })
}


// 渲染用户头像
function renderAvatar(user) {
    let name = user.nickname || user.username
    $('.welcome').html(`欢迎  ${name}`)
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}