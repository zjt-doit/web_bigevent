$(function(){
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage
    let q= {
        pagenum:1,//页码值
        pagesize:2,//每页显示多少条数据
        cate_id:'',//文章分类的 Id
        state:''   //文章发布的状态
    }

    initTable()
    initCate()

    // 获取文章列表数据的方法
    function initTable(){
        $.ajax({
            method:"get",
            url:'/my/article/list',
            headers:{
                Authorization:localStorage.getItem('token')
            },
            data:q,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败！')
                }
                // layer.msg('获取文章列表成功！')
                console.log(res)

                // 使用模板引擎来渲染页面的数据
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate(){
        $.ajax({
            method:'get',
            url:'/my/article/cates',
            headers:{
                Authorization:localStorage.getItem('token')
            },
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章分类列表失败！')
                }
                // 调用模板引擎来渲染分类的可选项
                let htmlStr = template('tpl-cate',res)
                console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr)

                // 通过layUI重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit',function(e){
        e.preventDefault()
        // 获取表单中选中项的值
        let cate_id= $('[name=cate_id]').val()
        let state = $('[name=state]').val()

        // 为查询参数对象q 中对应的属性赋值
        // 作用：通过赋值来更新对象q中的数值，来达到筛选的作用
        q.cate_id= cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格中的数据
        initTable()
    })


    // 定义渲染分页的方法
    // 问题：去哪里调用这个方法？
    // 应该是在表格渲染之后再来调用的，这样就能在表格渲染之后再来渲染底部的分页区域
    function renderPage(total){
        console.log(total)
        laypage.render({
            elem:'pageBox',//分页容器的id
            count:total,  //总数据条数
            limit:q.pagesize,//每页显示几条数据
            curr:q.pagenum, //设置默认被选中的分页
            // 自定义排版功能
            layout:['count', 'limit','prev','page','next','skip'],
            limits:[2,3,5,10],

            /*
            分页发生求换时，触发jump回调
            触发jump回调的方式有两种：
                1.点击页码的时候，会触发jump的回调
                2.只要调用了 laypage.render()方法，就会触发jump的回调
            可以通过first的值，来判断是哪种方式，触发的jump的回调
                如果first的值为true，证明是方式2触发的
                否则就是方式1 触发的
            */ 
            jump: function(obj,first){
                console.log(obj.curr)
                console.log(obj.limit)

                // 把最新的页码值，赋值到 q 这个查询参数对象中去
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable()
                if( !first){
                    initTable()
                }
            }
        })
    }

    // 通过代理的形式来为删除按钮来绑定点击事件
    $('tbody').on('click','.btn-delete', function(){
        let id = $(this).attr('data-id')
        let len = $('.btn-delete').length()
        console.log(len)
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'get',
                url:"/my/article/deletecate/" + id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')

                    /*
                    当数据删除完成之后，需要判断这一页是否还存在数据，
                    如果没有剩余的数据，则让页码值 -1 之后，
                    再调用 initTable方法 
                    */ 
                   if(len === 1){
                    // 如果len 的值等于 1，证明删除完毕之后，页面上就没有任何数据了
                    // 注意：页码值最小是1
                    q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                   }
                    initTable()
                }
            })
            
            layer.close(index)
          })
    })
})