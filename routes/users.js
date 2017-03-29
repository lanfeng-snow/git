//加载user插件
var PluginUser=require('../plugin/user');
//加载blog插件
var PluginBlog=require('../plugin/blog');

module.exports = function (app){
	//判断session中是否保存了用户
	app.use(function(req,res,next){
		var user=req.session.user;
		if(user){
			//将user返回给前端
			app.locals.user=user;
		}else{
			app.locals.user="";
		};
		//继续执行下面的函数
		next();
	});

	//首页
	app.get('/',function(req,res,next){
		res.render('index', {});
	});

	//注册
	app.get('/reg',PluginUser.loginNo,PluginUser.reg.get);

	//获取post来的信息
	app.post('/reg',PluginUser.reg.post);

	//登陆页面
	app.get('/login',PluginUser.loginNo,PluginUser.login.get);

	//获取登录信息
	app.post('/login',PluginUser.login.post);

	//退出登录
	app.get('/logout',PluginUser.loginYes,PluginUser.logout.get);

	//进入用户界面
	app.get('/user/:_id',PluginUser.loginYes,PluginUser.user.get);
	//进入用户界面
	app.get('/user',PluginUser.loginYes,PluginUser.user.get);

	//写博客页面
	app.get('/blog',PluginUser.loginYes,PluginBlog.blog.get);

	//获取博客内容
	app.post('/blog',PluginBlog.blog.post);

	//获取博客文本
	app.get('/list',PluginBlog.list.get);

	//文章页面
	app.get("/view/:_id",PluginBlog.view.get)

}
