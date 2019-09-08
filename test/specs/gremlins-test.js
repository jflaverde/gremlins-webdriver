function loadScript(callback) {
  var s = document.createElement('script');
  s.src = 'https://rawgithub.com/marmelab/gremlins.js/master/gremlins.min.js';
  if (s.addEventListener) {
    s.addEventListener('load', callback, false);
  } else if (s.readyState) {
    s.onreadystatechange = callback;
  }
  document.body.appendChild(s);
}

function unleashGremlins(ttl, callback) {
  function stop() {
    horde.stop();
    callback();
  }
  
  

 //elementos que se pueden llenar
  window.gremlins.species.formFiller()
    .canFillElement(function (element) {

	var tipos = ["text","password","email","number"]
      return (
        (
          (element.tagName === "input" && tipos.includes(element.attributes['type'])) || ( element.tagName === "textarea")
        ) &&
        !element.hidden
      );
    });


	//dar clic solo en los elementos clickeables
	window.gremlins.species.clicker().clickTypes(['click']).canClick(function (element) {
		var tiposTag=["button","a"];
      return ( tiposTag.includes(element.tagName) && !element.hidden);
    });


  
  var horde = window.gremlins.createHorde()
  .gremlin(window.gremlins.species.clicker())
  .gremlin(window.gremlins.species.formFiller());

   //Estrategia
  horde.strategy(window.gremlins.strategies.distribution()
    .delay(50)
    .distribution([
      0.6,
      0.4,
    ])
  )

  
  horde.seed(1234);

  horde.after(callback);
  window.onbeforeunload = stop;
  setTimeout(stop, ttl);
  horde.unleash();
}


describe('Monkey testing with gremlins ', function() {

  it('it should not raise any error', function() {
    browser.url('/');
    browser.click('button=Cerrar');

    browser.timeoutsAsyncScript(60000);
    browser.executeAsync(loadScript);

    browser.timeoutsAsyncScript(60000);
    browser.executeAsync(unleashGremlins, 50000);
  });

  afterAll(function() {
    browser.log('browser').value.forEach(function(log) {
      browser.logger.info(log.message.split(' ')[2]);
    });
  });

});