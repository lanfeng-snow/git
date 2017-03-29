//加载blod模型
var ModelBlog=require('../model/blog');
//微博发表
module.exports.blog={
	get:function(req,res,next){
		res.render('blog',{});
	},
	post:function(req,res,next){
		// var author=ModelUser.findById({_id:req.param("_id")},function(err,data){
		// 	if(err){console.log(err)};
		// 	console.log(data)
		// // 	// return data.name;
		// });
		var postData={
			author:req.session.user._id,
			title:req.body.title,
			content:req.body.content,
			// author:authory
		};
		ModelBlog.create(postData,function(err,data){
			if(err){console.log(err)};
			// console.log(data)
			res.render('user');

		});
	}
};
//微博列表
module.exports.list={
	get:function(req,res,next){
		ModelBlog.find({}, null, { sort:{'_id':-1} }).populate('author').exec(
				function(err,data){
					if(err){console.log(err)};
					res.render('list',{list:data});

				}
			);
	}
};
//微博页面
module.exports.view={
	get:function(req,res,next){
		var ID={ _id:req.param("_id")};
			ModelBlog.findById(ID,function(err,data){
				if(data){
					res.render('view',{view:data});
				}else{
					res.send('查询不到！');
				}
			})
	}
}