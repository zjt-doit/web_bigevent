$(function(){
    let layer= layui.layer
 // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)


//   为上传按钮添加点击事件
  $('#btnChooseImage').on('click', function(){
    $('#file').click()
  })

//   为文件选择框绑定change事件
  $('#file').on('change', function(e){
    let filelist = e.target.files
    if(filelist.length === 0){
        return layer.msg('请选择图片！')
    }
    let file = e.target.files[0]
    var imgURL = URL.createObjectURL(file)
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', imgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
  })

//   为确认按钮添加点击事件
  $('#btnUpload').on('click', function(){
    let dataURL = $image
      .cropper('getCroppedCanvas', { 
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       
      // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

      $.ajax({
        method:'post',
        url:'http://www.liulongbin.top:3007/my/update/avatar',
        headers:{
            Authorization:localStorage.getItem('token')
        },
        data:{
            avatar:dataURL
        },
        success:function(res){
            if(res.status !== 0){
                return layer.msg('更新头像失败！')
            }
            layer.msg('更新头像成功！')

            // 调用index页面的渲染头像的方法
            window.parent.getUserInfo()
        }
      })
  })
})