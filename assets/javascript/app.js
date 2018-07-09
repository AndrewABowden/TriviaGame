$(document).ready(function(){
  
    // event listeners
   $("#remaining-time").hide();
    $("#start").on('click', quiz.startGame);
    $(document).on('click' , '.option', quiz.guessChecker);
    
  })
  
  var quiz = {
    // trivia properties
    right: 0,
    wrong: 0,
    unanswered: 0,
    currentGame: 0,
    timer: 20,
    timerOn: false,
    timerId : '',
    // questions options and answers data
    questions: {
        question1: 'Who wields a purple lightsaber?',
        question2: 'Who is the chosen that brings balance to the force?',
        question3: 'Who starts the New Jedi Order after the original falls?',
        question4: 'Who is the oldest jedi that has ever lived?',
        questoin5: 'What is the name of Hans Solos ship?',
        question6: 'Why does Darth Vader wear a mask?',
        question7: 'Who is the most powerful sith to have ever ruled?',
    },
    options: {
        question1: ['MaceWindu', 'DarthMaul', 'LukeSkywalker', 'Yoda'],
        question2: ['Luke', 'Anakin', 'Sidius', 'Old Ben Kenobi'],
        question3: ['Yoda', 'Luke', 'Leah', 'Ren'],
        question4: ['Sidius', 'Yoda', 'Luke', 'Percival'],
        question5: ['The Enterprise', 'Voyager', 'Millenium Falcon', 'Destroyer'],
        question6: ['Burns','Defense','Force Powers','Mind Reading'],
        question7: ['DarthMaul', 'DarthVader', 'LordSidius', 'DarthPlagueis']
      },
      answers: {
        question1: 'MaceWindu',
        question2: 'Anakin',
        question3: 'Luke',
        question4: 'Yoda',
        question5: 'Millenium Falcon',
        question6: 'Burns',
        question7: 'LordSidius'
      },
  
    // method to initialize game
    startGame: function(){
      // restarting game results
      quiz.currentGame = 0;
      quiz.right = 0;
      quiz.wrong = 0;
      quiz.unanswered = 0;
      clearInterval(quiz.timerId);
      
      // show game section
      $('#game').show();

      
      $('#remaining-time').show();
      
      //  empty last results
      $('#results').html('');
      
      // show timer
      $('#timer').text(quiz.timer);
      
      // remove start button
      $('#start').hide();
  
      
      // ask first question
      quiz.nextQuestion();
      
    },
    // method to loop through and display questions and options 
    nextQuestion : function(){
      
      // set timer to 8 seconds each question
      quiz.timer = 10;
       $('#timer').removeClass('last-seconds');
      $('#timer').text(quiz.timer);
      
      // to prevent timer speed up
      if(!quiz.timerOn){
        quiz.timerId = setInterval(quiz.timerRunning, 1000);
      }
      
      // gets all the questions then indexes the current questions
      var questionContent = Object.values(quiz.questions)[quiz.currentGame];
      $('#question').text(questionContent);
      
      // an array of all the user options for the current question
      var questionOptions = Object.values(quiz.options)[quiz.currentGame];
      
      // creates all the trivia guess options in the html
      $.each(questionOptions, function(index, key){
        $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
      })
      
    },
    // method to decrement counter and count unanswered if timer runs out
    timerRunning : function(){
      // if timer still has time left and there are still questions left to ask
      if(quiz.timer > -1 && quiz.currentGame < Object.keys(quiz.questions).length){
        $('#timer').text(quiz.timer);
        quiz.timer--;
          if(quiz.timer === 4){
            $('#timer').addClass('last-seconds');
          }
      }
      // the time has run out and increment unanswered, run result
      else if(quiz.timer === -1){
        quiz.unanswered++;
        quiz.result = false;
        clearInterval(quiz.timerId);
        resultId = setTimeout(quiz.guessResult, 1000);
        $('#results').html('     <h3>Out of time! The answer was '+ Object.values(quiz.answers)[quiz.currentGame] +'</h3>');
      }
      // if all the questions have been shown end the game, show results
      else if(quiz.currentGame === Object.keys(quiz.questions).length){
        
        // adds results of game (correct, incorrect, unanswered) to the page
        $('#results')
          .html('<h3>Good game!</h3>'+
          '<p>Right: '+ quiz.right +'</p>'+
          '<p>Wrong: '+ quiz.wrong +'</p>'+
          '<p>Unaswered: '+ quiz.unanswered +'</p>'+
          '<p>Try again!</p>');
        
        // hide game sction
        $('#game').hide();
        
        // show start button to begin a new game
        $('#start').show();
      }
      
    },
    // method to evaluate the option clicked
    guessChecker : function() {
      
      // timer ID for gameResult setTimeout
      var resultId;
      
      // the answer to the current question being asked
      var currentAnswer = Object.values(quiz.answers)[quiz.currentGame];
      
      // if the text of the option picked matches the answer of the current question, increment correct
      if($(this).text() === currentAnswer){
        // turn button green for correct
        $(this).addClass('btn-success').removeClass('btn-info');
        
        quiz.right++;
        clearInterval(quiz.timerId);
        resultId = setTimeout(quiz.guessResult, 1000);
        $('#results').html('<h3>Right Answer!</h3>');
      }
      // else the user picked the wrong option, increment incorrect
      else{
        // turn button clicked red for incorrect
        $(this).addClass('btn-danger').removeClass('btn-info');
        
        quiz.wrong++;
        clearInterval(quiz.timerId);
        resultId = setTimeout(quiz.guessResult, 1000);
        $('#results').html('<h3>Better luck next time! '+ currentAnswer +'</h3>');
      }
      
    },
    // method to remove previous question results and options
    guessResult : function(){
      
      // increment to next question set
      quiz.currentGame++;
      
      // remove the options and results
      $('.option').remove();
      $('#results h3').remove();
      
      // begin next question
      quiz.nextQuestion();
       
    }
  
  }