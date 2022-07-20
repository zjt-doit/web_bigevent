$(function () {
    let layer = layui.layer
    let form = layui.form

    initCate()
    // 初始化富文本编辑器
    initEditor()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res)
                    return layer.msg('获取文章分类列表失败！')
                }
                // 调用模板引擎来渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // cropper区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为选择封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 为coverFile绑定change监听事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        let files = e.target.files
        if (files.length === 0) {
            return
        }
        let newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    let state = '已发布'
    // 为草稿按钮绑定点击事件
    $('#btnSave').on('click', function () {
        state = '草稿'
    })


    // 为表单form-pub绑定submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        let fd = new FormData($(this)[0])
        fd.append('state', state)
        // fd.forEach(function(v, k){
        //     console.log(v,k)
        // })
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img',blob)

                publishArticle(fd)
            })
    })

    function publishArticle(fd){
        $.ajax({
            method:'post',
            url:'/my/article/add',
            data:fd,
            contentType:false,
            processData:false,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                location.href = './art_list.html'
            }
        })
    }
})