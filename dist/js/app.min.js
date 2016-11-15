$(document).ready(function () {

var datasBase = [];
var datas = [];
var search = [];
var mesDatasMaterial;

//initialisation de masonry


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
      if(i < $('#nbPhotos').val()){

        photoHTML += '<div class="grid-item">';
        photoHTML += '<a href="' + photo.link + '" class="aImg animate">';
        photoHTML += '<img src="' + photo.media.m + '" class="responsive-img" ></a></div>';

      }
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



//initialisation des datas
if(sessionStorage.getItem('objet')){
  mesDatasMaterial = sessionStorage.getItem("objet");
  search = JSON.parse(mesDatasMaterial);
}
else {
  search = ["Node","CSS","HTML","PHP","Javascript"];
}

//initialisation des boutons et tags selon la datasBase
search.forEach(function(value, i){
datasBase.unshift({tag : value });
if(i < search.length -1 ){

  $('#nav-mobile').prepend('<li><a class="search" href="#">' + value + '</a></li>');

}
else{

  $('#nav-mobile').prepend('<li class="active"><a class="search" href="#">' + value + '</a></li>');
  flickr(value);
}

});

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

  //récupération des chips

  var dataChips = $('.chips').material_chip('data');
  dataChips.forEach(function(value, i){
    if(jQuery.inArray(value.tag,search) < 0)
      search.push(value.tag);
  });


  //reset de la class active
  $('li:has(a.search)').removeClass("active");


  $('#nav-mobile a.search').each(function(index){
    datas.push($(this).text());
  });

  //compteur d'élément différents
  var j = 0;

  //balaye les éléments de "search"
  search.forEach(function(value,i){
      //vérifie si l'élément n'existe pas déjà
      if(jQuery.inArray(value,datas) < 0){
        j += 1;
        //permet de lancer les recherches d'image, et d'afficher les photos et mettre la classe active sur le dernier élément
        if(i < search.length -1){

          $('#nav-mobile').prepend('<li> <a class="search" href="#">' + value + '</a></li>');

        }
        else{
          flickr(value);
          $('#nav-mobile').prepend('<li class="active"> <a class="search" href="#">' + value + '</a></li>');
        }
      }
  });

  //si aucun ajout de bouton, affichage du dernier bouton de la liste
  if(j === 0){

    $('#nav-mobile li:first-child').addClass("active");
    flickr($('#nav-mobile li:first-child').children().text());
  }

    //cache la sideNav
    $(".btn#askBtn").sideNav('hide');

    //stocke les tags sessionStorage;
    mesDatasMaterial = JSON.stringify(search);
    sessionStorage.setItem("objet",mesDatasMaterial);
});


//affiche les image quand on clique sur le bouton
$('#nav-mobile').on('click', 'a.search', function() {
		$('li:has(a.search)').removeClass("active");
		$(this).parent().addClass("active");
    flickr($(this).text());
}); //end click

//supprimme les boutons quand on supprime une chip
$('.chips').on('chip.delete', function(e, chip){

  console.log(chip);

  $('#nav-mobile a.search').each(function(index){
    console.log($(this).text());
    if($(this).text() == chip.tag){
      $(this).parent().remove();
    }
  });
});


});
