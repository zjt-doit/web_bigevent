$(function(){
    let layer= layui.layer
    let form = layui.form
    initArtList()

    // 获取文章分类的列表
    function initArtList(){
        $.ajax({
            method:'get',
            url:'/my/article/cates',
            headers:{
                Authorization:localStorage.getItem('token')
            },
            success:function(res){
                console.log(res)
                let htmlStr = template('tpl-artcate',res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加分类按钮绑定点击事件
    let indexAdd = null
    $('#btnAddCate').on('click', function(){
        // 使用layUI的open方法来实现弹出框
        indexAdd = layer.open({
            title: '添加文章分类',
            type:1,
            area:['500px','250px'],
    // 一般来说在js中写html结构没有提示很麻烦的，那如何在js获取html结构呢？
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的方式来，为form-add表单提交submit事件
    // 因为form-add表单只有通过点击事件的发生，才会生成，原本是在页面中没有这个元素的
    // 所以直接拿form-add的id来绑定submit事件，事件是无效的，所以只能绑定到已存在的父元素
        $('body').on('submit','#form-add', function(e){
            e.preventDefault()
            let name = $('#form-add [name=name]').val()
            let alias = $('#form-add [name=alias]').val()
            $.ajax({
                method:'post',
                url:"/my/article/addcates",
                headers:{
                    Authorization:localStorage.getItem('token') || ''
                },
                data: {
                    name:name,
                    alias:alias
                },
                success:function(res){
                    if(res.status !== 0){
                        console.log(res)
                        layer.close(indexAdd)
                        return layer.msg('新增文章分类失败！')
                    }
                    console.log(res)
                    initArtList()
                    layer.msg('新增文章分类成功！')
                    // 根据索引来关闭弹出层
                    layer.close(indexAdd)
                }
            })
        })

        // 通过代理的形式来为btn-edit来绑定点击事件
        let indexedit = null
        $('tbody').on('click','.btn-edit',function(){
            
            indexedit = layer.open({
                title: '修改文章分类',
                type:1,
                area:['500px','250px'],
        // 一般来说在js中写html结构没有提示很麻烦的，那如何在js获取html结构呢？
                content: $('#dialog-edit').html()
            })

            let id = $(this).attr('data-id')
            $.ajax({
                method:'get',
                url:'/my/article/cates/'+ id,
                headers:{
                    Authorization:localStorage.getItem('token') || ''
                },
                success:function(res){
                    console.log(res)
                    initArtList()
                }
            })
        })


        // 通过代理的方式来为修改分类的表单绑定submit事件
        $('body').on('submit','#form-edit', function(e){
            e.preventDefault()
            $.ajax({
                method:'post',
                url:'/my/article/updatecate/',
                data: $(this).serialize(),
                headers:{
                    Authorization:localStorage.getItem('token')
                },
                
                success:function(res){
                    console.log(res)
                }
            })
        })


        // 通过代理的形式来为删除按钮来绑定点击事件
        $('body').on('click','.btn-delete', function(){
            // console.log('ok')
            let id= $(this).attr('data-id')
            layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
                //do something
                $.ajax({
                    method:'get',
                    url:'/my/article/deletecate/'+ id,
                    headers:{
                        Authorization:localStorage.getItem('token')
                    },
                    success:function(res){
                        if(res.status !== 0){

                            return layer.msg('删除文章分类失败！')
                        }
                        layer.msg('删除文章分类成功！')
                        layer.close(index)
                        initArtList()
                    }
                })
                
                
              })
        })
    
})