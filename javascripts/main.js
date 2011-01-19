(function($, undefined){
  
  var opts = {
    api_key: "b516f4814ad521d197122a5dcc074272",
    maxHeight: 200,
    photos_per_page: 1000
  };
  
  var maxImgHeight = 200;
  var kFirst = true;
  var flickrData;
  var container;
  
  $.fn.flickr = function(o){
    opts = $.extend(opts, o);
    
    if (opts.photoset == undefined) {
      console.error("Missing photoset ID");
      return false;
    }
    
    container = this;
    
    maxImgHeight = container.height() - 35;
    if (opts.maxHeight != 0 && maxImgHeight > opts.maxHeight) {
      maxImgHeight = opts.maxHeight;
    }
    
    var url = get_photoset_url(opts.photoset);
    
    $.getJSON(url + "&jsoncallback=?", function(data){
      flickrData = data;
      $('.loader').remove();
      
      if (data.stat == "ok" && data.photoset.total > 0) {
        var photos = data.photoset.photo;
        for (var i in photos) {
          add_image_to_container(photos[i]);
        }
      }
    });
  };
  
  
  var add_image_to_container = function(photo){
    var img_src = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
    var img_href = 'http://www.flickr.com/photos/' + flickrData.photoset.ownername + '/' + photo.id + '/in/' + opts.photoset;
    
    var li = $('<li/>');
    var a = $('<a/>').attr('href', img_href).attr('target', '_blank');
    var img = $('<img/>').attr('src', img_src).css('maxHeight', maxImgHeight);
    
    img.appendTo(a);
    a.appendTo(li);
    
    img.one('load', function(){
      if (kFirst) {
        var width = $(this).width();
        kFirst = false;
      } else {
        var width = container.width() + $(this).width();
      }
      
      container.width(width);
    }).each(function(){
      if (this.complete) {
        $(this).load();
      }
    });
    
    li.appendTo(container);
  };
  
  
  var get_photoset_url = function(id){
    return "http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&format=json&api_key=" + opts.api_key + "&photoset_id=" + id + "&per_page=10";
  };
  
})(jQuery);
