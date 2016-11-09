$(document).ready(function () {
var datas = [];
var flickr = function(recherche){
  console.log(recherche);
  //AJAX
  var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

  var param = recherche;

  var flickrOptions = {
    tags: param,
    format: "json"
  };

  function displayPhotos(data){

    var photoHTML = '';

    $.each( data.items, function(i, photo){
      if(i%4 === 0 ){
        photoHTML += '</div><div class="row valign-wrapper">';
      }

      photoHTML += '<div class="col s3 valign">';
      photoHTML += '<a href="' + photo.link + '" class="img">';
      photoHTML += '<img src="' + photo.media.m + '" class="responsive-img" ></a></div>';
      // if(i%4 === 0 ){
      //   photoHTML += '</div>';
      // }
    });


    $('.container .row #photos').html(photoHTML);
  }

  $.getJSON(flickrAPI, flickrOptions, displayPhotos);
};





  $("#askBtn").sideNav();

  $(".btn#addBtn").click(function(){

    var search = $('.chip').text().split("close");
    $('li:has(a.search)').removeClass("active");

      if (search.length === 1 && search[0].length > 0  && jQuery.inArray(search[0], datas) < 0) {
        datas.push(search[0]);
      flickr(search[0]);
      $('#nav-mobile').prepend('<li class="active"><a class="search" href="#">' + search[0] + '</a></li>');
    }
    else if(search.length > 1){

      search.forEach(function(value,i){
        if(jQuery.inArray(value, datas) < 0){
          if(i===0){
            flickr(value);
            $('#nav-mobile').prepend('<li class="active"> <a class="search" href="#">' + value + '</a></li>');
          }
          else{
            $('#nav-mobile').prepend('<li> <a class="search" href="#">' + value + '</a></li>');
          }
        }
      });
    }


      $(".btn#askBtn").sideNav('hide');

  });

  $('#nav-mobile').on('click', 'a.search', function() {
  		$('li:has(a.search)').removeClass("active");
  		$(this).parent().addClass("active");
      flickr($(this).text());
  }); //end click

  $('.chips').material_chip();

});
