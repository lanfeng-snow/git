//加载user模型
var ModelUser=require('../model/user');
var ModelBlog=require('../model/blog');

//登陆
module.exports.login={
	get:function(req,res,next){
		res.render('login',{});
	},
	post:function(req,res,next){
		var postData={
			name:req.body.username
		};
		var regData={
			status:false,
			msg:""
		}
		//服务器查找用户信息
		ModelUser.findOne(postData,function(err,data){
			if(err){console.log(err)};
			if(data){
				if(data.password==req.body.password){
					req.session.user = data;
					regData.status=true;
					res.send(regData);
					// return res.redirect('/');
					
				}else{
					regData.msg="密码错误!"
					res.send(regData);
				};
			}else{
				regData.msg="没有此用户!"
				res.send(regData);
			};
		});
	}
};

//注册
module.exports.reg={
	get:function(req,res,next){
		res.render('reg', {});
	},
	post:function(req,res,next){
		var regData={
			status:false,
			msg:""
		}
		//判断第一次的密码和第二次的密码是否一致
		if(req.body['password']!=req.body['passwordRepeat']){
			regData.msg="两次密码不一致!";
			res.send(regData);
		}else{
			//创建接收模型
			var postData={
				name:req.body.username,
				password:req.body.password
			};
			//数据库中查找用户名是否存在
			ModelUser.findOne({name:req.body.username},function(err,data){
				if(err){console.log(err)};
				if(data){
					regData.msg="此用户已被注册!";
					res.send(regData);
				}else{
					//数据库存储用户信息
					ModelUser.create(postData,function(err,data){
						if(err){console.log(err)};
						//添加session信息
						req.session.user = data;
						regData.status=true;
						regData.msg="注册成功!";
					    res.send(regData);

						//返回的主页面
						// res.redirect('/');
					});
				};
			});
		};
	}
};

//退出登陆
module.exports.logout={
	get:function(req,res,next){
		//删除session信息
		delete req.session.user;
		res.redirect('/');
	}
};

//个人中心
module.exports.user={
	get:function(req,res,next){

		var ID={ _id:req.param("_id")};

		if(ID._id){
			ModelUser.findById(ID,function(err,data){
				if(err){console.log(err)};
				if(data){
					// res.render('user',{view:data});

					//-------------------------------------------------------

					ModelBlog.find({"author":req.session.user._id},function(err,data){

							if(err){console.log(err)};
							res.render('user',{view:data,list:data});
							// res.render('user',{list:data});
							// console.log(req.session.user._id)
							// console.log(data+"111111111")
						
					})
					//-------------------------------------------------------
				}else{
					res.send('查询不到！');
				}
			})
		}else{
			res.send("用户不存在");
		}
		
	}
};

//如果不存在session 进入登陆页面  存在继续执行下面的 
module.exports.loginYes=function(req,res,next){
	var user=req.session.user;
	if(!user){
		res.redirect('/login');
	}else{
		next();
	}
};
//如果存在session  进入个人中心  不存在则进行下一步
module.exports.loginNo=function(req,res,next){
	var user=req.session.user;
	if(user){
		res.redirect('/user/'+user._id);
	}else{
		next();
	}
}