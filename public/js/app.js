window.addEventListener('load', () => {
  const el = $('#app');

  // Compile Handlebar Templates
  const errorTemplate = Handlebars.compile($('#error-template').html());
  const homeTemplate = Handlebars.compile($('#home-template').html());
  const shopTemplate = Handlebars.compile($('#shop-template').html());
  const magazineTemplate = Handlebars.compile($('#magazine-template').html());

  const router = new Router({
    mode: 'history',
    page404: (path) => {
      const html = errorTemplate({
        color: 'yellow',
        title: 'Error 404 - Page NOT Found!',
        message: `The path '/${path}' does not exist on this site`,
      });
      el.html(html);
    },
  });

  // Display Error Banner
  const showError = (error) => {
    const { title, message } = error.response.data;
    const html = errorTemplate({ color: 'red', title, message });
    el.html(html);
  };

  // Display Home
  router.add('/', async () => {
    // Display loader first
    let html = homeTemplate();
    el.html(html);
    $('li').click(filterBy);
     loadDta('');
    $('.loading').removeClass('loading');
  });
  
  // filter methods
  const filterBy =($event) =>{
    $(".container2").empty();
    loadDta($event.target.innerText);
  }
  
  // display products on home page
  const loadDta = (val) =>{
    var flickerAPI = $.getJSON( "api.json", function() {
      console.log( "success" );
    })
   .done(function( data ) {
     var container = $("<div>").addClass("container2").appendTo("#images");
     let dataIterate = data.filter(function (e) {
      return val == '' || val == e.category;
    });
     for(var i = 0; i < dataIterate.length; i++) {
       blockDiv = $("<div>").addClass("iblock").appendTo(container);
       $( "<img>" ).attr( "src", dataIterate[i].src ).appendTo(blockDiv);
       blocktextDiv = $("<div>").addClass("block").appendTo(blockDiv);
       $('<p>').text(dataIterate[i].title).appendTo(blocktextDiv);
       $( "<span>" ).text("$" + dataIterate[i].price +"").appendTo(blocktextDiv);
       $('<p>').addClass("category").text(dataIterate[i].category).appendTo(blockDiv);
       $( "<img>" ).addClass("cart").attr( "src", "cart.jpg" ).appendTo(blockDiv);
     }
   });
  }

  router.add('/shop', async () => {
    // Display loader first
    let html = shopTemplate();
    el.html(html);
    //  loader hidden
    $('.loading').removeClass('loading');
  });

  router.add('/magazine', () => {
    const html = magazineTemplate();
    el.html(html);

  });

  router.navigateTo(window.location.pathname);

  // Highlight Active Menu on Load
  const link = $(`a[href$='${window.location.pathname}']`);
  link.addClass('active');

  $('a').on('click', (event) => {
    // Block page load
    event.preventDefault();

    // Highlight Active Menu on Click
    const target = $(event.target);
    $('.item').removeClass('active');
    target.addClass('active');

    // Navigate to clicked url
    const href = target.attr('href');
    const path = href.substr(href.lastIndexOf('/'));
    router.navigateTo(path);
  });
});
