(function(){

    var app = angular.module('showcaseModule',[]);

    app.factory('goodsService', function(){
   
        var goodsFactory = {
            currentGoods: {},
            goodsList: [
                { title:"商品名１", description:"これは商品１の説明です。", images: ["img/noimage_s.jpg"], reputation: 3, comments: [{user: "testuser1", comment: "とてもいい商品", stars: 5}, {user: "testuser2", comment: "使い勝手がよくない", stars: 1}] },
                { title:"商品名２", description:"これは商品２の説明です。", images: ["img/noimage_s.jpg"], reputation: 0, comments: [] },
                { title:"商品名３", description:"これは商品３の説明です。", images: ["img/noimage_s.jpg"], reputation: 0, comments: [] },
                { title:"商品名４", description:"これは商品４の説明です。", images: ["img/noimage_s.jpg"], reputation: 0, comments: [] },
            ]
        };

        return goodsFactory;
    });

    app.factory('userService', function(){
        var userFactory = {
            user: {name: "matildatilda", authority: 1}    
        };
        return userFactory;        
    });

    app.controller('pageController', function(goodsService, userService)
    {
        this.userService = userService;

        this.checkAuthority = function()
        {
            return (userService.user.authority === 1);
        };
        
        this.checkUser = function(userName)
        {
            return(userService.user.name === userName);
        };

        this.setNewGoods = function()
        {
            goodsService.currentGoods = {};
            goodsService.isNew = true;
        };
        
        this.mode = {
            list: true,
            detail: false
        };

        this.showDetail = function()
        {
            this.mode.list = false;
            this.mode.detail = true;
        };
        
        this.showList = function()
        {
            this.mode.list = true;
            this.mode.detail = false;
        };
        
    });

    app.controller('goodsListController', function(goodsService)
    {
        this.goodsList = goodsService.goodsList;
        
        this.setCurrentGoods = function(goods)
        {
            goodsService.currentGoods = goods;
            goodsService.isNew = false;
        };
    });
    
    app.controller('goodsController', function(goodsService)
    {
        this.goodsService = goodsService;
        this.readOnly = true;
        this.image = "";

        this.addGoods = function(goods)
        {
            goods.images = goods.images || [];
            goods.images[0] = "img/noimage_s.jpg";
            goods.reputation = 0;
            goods.comments = [];
            goodsService.goodsList.push(goods);
            this.goodsService.currentGoods = {};
        };
        
        this.deleteGoods = function(goods)
        {
            var index = goodsService.goodsList.indexOf(goods);
            if (0 <= index)
            {
                goodsService.goodsList.splice(index, 1);
                this.goodsService.currentGoods = {};
            }
        };
        
        this.switchReadOnly = function()
        {
            this.readOnly = !this.readOnly;
        };

        this.setImage = function()
        {
            /*
            this.goodsService.currentGoods.images = this.goodsService.currentGoods.images || [];
            this.goodsService.currentGoods.images[0] = this.image;
            this.image = "";
            */
            this.image = $('#imageFiles')[0].files[0].name;
            this.msg = "selected: " + this.image;
        };
    });
    
    app.controller('commentController', function()
    {
        this.comment = {};

        this.setStars = function(star)
        {
            this.comment.stars = star;    
        };
        
        this.addComment = function(goods)
        {
            this.comment.stars = this.comment.stars || 1;
            goods.comments.push(this.comment);

            //評価の再計算
            var totalStars = 0;
            for(var i = 0; i < goods.comments.length; i++)
            {
                totalStars += goods.comments[i].stars;    
            }
            if (0 < goods.comments.length)
            {
                goods.reputation = totalStars / goods.comments.length;
                goods.reputation = Math.round(goods.reputation * 10) / 10;
            }
            else
            {
                goods.reputation = 0;    
            }
            this.comment = {};
        };
        
        this.commentReadOnly = true;
        this.switchCommentReadOnly = function()
        {
            this.commentReadOnly = !this.commentReadOnly;        
        };
        
        this.deleteComment = function(goods, comment)
        {
            var index = goods.comments.indexOf(comment);
            if (0 <= index)
            {
                goods.comments.splice(index, 1);
            }
        };
    });
    
})();