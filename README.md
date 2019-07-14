##nodejs  基础 个人博客



ajax

上传文件
var formdata = new FormData();
formdata.append('user', $('#user').val());


contentType: false,
processData: false,
data: formdata,
