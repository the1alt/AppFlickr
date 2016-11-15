$(document).ready(function () {

var datasBase = [];
var datas = [];
var search = [];
var mesDatasMaterial;

//initialisation des datas
if(sessionStorage.getItem('objet')){
  mesDatasMaterial = sessionStorage.getItem("objet");
  search = JSON.parse(mesDatasMaterial);
  search.forEach(function(value, i){
    datasBase.unshift({tag : value });
  });
}
else {
  search = ["Node","CSS","HTML","PHP","Javascript"];
  search.forEach(function(value, i){
    datasBase.unshift({tag : value });
  });
}

//fonction d'initialisation des boutons et tags selon la datasBase
var affichageBoutons = function(){
  search.forEach(function(value, i){
  if(i < search.length -1 ){
    $('#nav-mobile').prepend('<li><a class="search" href="#">' + value + '</a></li>');
  }
  else{

    $('#nav-mobile').prepend('<li class="active"><a class="search" href="#">' + value + '</a></li>');
    flickr(value);
  }

  });
};

//fonction Flickr
var flickr = function(recherche){

  //AJAX
  var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?&per_page=100";

  var param = recherche;

  var flickrOptions = {
    tags: param,
    format: "json",
    per_page:1,
  };

  function displayPhotos(data){

    var photoHTML = '<div class="grid-sizer"></div>';


    $.each( data.items, function(i, photo){
      $('.preloader-wrapper').removeClass('hide');
      $('.grid').addClass('hide');
      photoHTML += '<div class="grid-item">';
      photoHTML += '<a href="' + photo.link + '" class="aImg animate">';
      photoHTML += '<img src="' + photo.media.m + '" class="responsive-img" ></a></div>';

    });

    $('#photos').html(photoHTML);
  }

  $.getJSON(flickrAPI, flickrOptions, displayPhotos).done(function(){
    $('.grid').masonry('destroy');
    $('.grid').imagesLoaded(function(){
      $('.preloader-wrapper').addClass('hide');
      $('.grid').removeClass('hide');
      $('.grid').masonry({
      itemSelector: '.grid-item',
      columnWidth: '.grid-sizer',
      percentPosition: true,
      gutter:10,
      fitWidth: true,
      });

    });
  });
};




affichageBoutons();


// new AnimOnScroll( document.getElementById( 'grid' ), {
// 		minDuration : 0.4,
// 		maxDuration : 0.7,
// 		viewportFactor : 0.2
// 	} );



// initialise SideBar
$("#askBtn").sideNav();

// initialise Chips
$('.chips').material_chip({
  data: datasBase,
});



//gestion des chips et d'ajout de boutons par l'utilisateur
$(".btn#addBtn").click(function(){

  //reset de la class active
  $('li:has(a.search)').removeClass("active");

  //récupération des chips
  var dataChips = $('.chips').material_chip('data');
  dataChips.forEach(function(value, i){
    console.log(value.tag);
    if(jQuery.inArray(value.tag,search) < 0)
      search.push(value.tag);
  });

  $('#nav-mobile').empty();

  affichageBoutons();

  var firstChild = '#nav-mobile:first-child';

  flickr(firstChild);
  $(firstChild).addClass(active);

  $('#nav-mobile a.search').each(function(index){
    datas.push($(this).text());
  });

    //cache la sideNav
    $(".btn#askBtn").sideNav('hide');

    //stocke les tags sessionStorage;
    mesDatasMaterial = JSON.stringify(search);
    sessionStorage.setItem("objet",mesDatasMaterial);
});

$('#nbPhotos').mouseleave(function(){
  $('.grid-item').each(function(index, value){
    if(index+1 <= $('#nbPhotos').val()){
      $(this).removeClass('hide');
    }
    else{
      $(this).addClass('hide');
    }
  });



});

//affiche les image quand on clique sur le bouton
$('#nav-mobile').on('click', 'a.search', function() {
		$('li:has(a.search)').removeClass("active");
		$(this).parent().addClass("active");
    flickr($(this).text());
}); //end click

//supprimme les boutons quand on supprime une chip

$('.chips').on('chip.delete', function(e, chip){

  console.log(chip.tag);
  var positionSearch = jQuery.inArray(chip.tag, search);
  if(positionSearch > -1){
    search.splice(positionSearch, 1);
  }
  var positionDatas = jQuery.inArray(chip.tag, datas);
  if(positionDatas > -1){
    datas.splice(positionDatas, 1);
  }
  console.log('après suppression : ' + search);
  $('#nav-mobile a.search').each(function(index){

    if($(this).text() == chip.tag){
      $(this).parent().remove();
    }
  });
});


});
