var $newGame = $('.new-game')
var ID;

$newGame.click(function () {
  playerHand = [];
  dealerHand = [];
  $(".box").html("")
  getJSON('http://deckofcardsapi.com/api/shuffle/?deck_count=1', function (d) {
  // console.log(d.deck_id)
  ID = d.deck_id;
  $("button").attr("disabled", false)
  $(".win-bust").html("").removeClass("bust").removeClass("win")
  startGame(ID)
  });
});

var dealerHand = [];
var playerHand = [];


function displayCard (character, image) {
  $(character).append("<img src=" + image + ">")
};

function totaler (hand) {
  var total = 0;
  hand.forEach(function (card, index) {
    var actualValue;
    if (parseInt(card.value)) {actualValue = parseInt(card.value)}
    else if (index === (hand.length - 1) && card.value === "ACE" && total > 10) {
      actualValue = 1;
    } else if (index ===(hand.length -1) && card.value === "ACE") {
        actualValue = 11;
    } else if (card.value === "ACE") {
        console.log("1:", hand)
        hand.push(hand.splice(index, 1)[0])
        console.log("2:", hand);
    } else {
      actualValue = 10;
    }
    total += actualValue
  });
  if (total>21) {
    endState(hand, "bust", "BUST!");
    return 'bust'
  } else {return total}
}

function endState (han, clas, strin) {
    $(".button-box > button").attr("disabled", true);
    if (han === playerHand) {
      $(".win-bust").addClass(clas).html(strin)}
    else {
      $(".win-bust").addClass("win").html("YOU WIN!")
    };
}

function startGame (id) {
  var drawUrl = "http://deckofcardsapi.com/api/draw/" + id + "/?count=3"
  getJSON(drawUrl, function (data) {
    for (var i=0; i<3; i++) {
      if (i%2 === 0) {
        playerHand.push(data.cards[i])
        displayCard(".player-box", data.cards[i].image)
        totaler(playerHand);
      }
      else {
        dealerHand.push(data.cards[i])
        displayCard(".dealer-box", data.cards[i].image)
      };
    }
  })
}



//HIT BUTTON

$(".hit").click(function () {
  $(this).css("margin-top", "20px")
  hit(playerHand, ".player-box");
});

function hit (hand, div) {
  getJSON("http://deckofcardsapi.com/api/draw/" + ID + "/?count=1", function (data) {
    hand.push(data.cards[0])
    displayCard(div, data.cards[0].image);
    totaler(hand)
  });
}

//STAND BUTTON
$(".stand").click(function () {
  $(".button-box > button").attr("disabled", true);
  getIt(dealerHand, ".dealer-box")
})

function getIt (hand, div) {
  getJSON("http://deckofcardsapi.com/api/draw/" + ID + "/?count=1", function (data) {
    hand.push(data.cards[0])
    displayCard(div, data.cards[0].image);
    dealer(totaler(hand))
  });
}


function dealer (value) {
  if ( value === 'bust') {
    $(".win-bust").addClass("win").html("YOU WIN!")
  } else if (value < 17) {
    getIt(dealerHand, ".dealer-box");
  } else {
    if (totaler(dealerHand) >= totaler(playerHand)) {
      $(".win-bust").addClass("bust").html("LOSE!")
    } else {
      $(".win-bust").addClass("win").html("YOU WIN!")
    }
  }
}


//Get JSON OBJECT

function getJSON(url, cb) {
  var JSONP_PROXY = 'https://jsonp.afeld.me/?url='
  // THIS WILL ADD THE CROSS ORIGIN HEADERS

  var request = new XMLHttpRequest();

  request.open('GET', JSONP_PROXY + url);

  request.onload = function() {
   if (request.status >= 200 && request.status < 400) {
     cb(JSON.parse(request.responseText));
   }
  };

  request.send();
}
