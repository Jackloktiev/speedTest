var eventsModule = (function(dModule, uModule, cModule, wModule){
    var addEventListeners = function(){
        // create event listener
        uModule.getDOMElements().textInput.addEventListener("keydown",function(event){
            if(dModule.testEnded()){
                return;
            }
            //check is the user paressed Enter
            var key = event.keyCode;
            if(key==13){
                uModule.getDOMElements().textInput.value += dModule.getLineReturn() + " ";
                // create new input event
                var inputEvent = new Event("input");
                //dispatch the event
                uModule.getDOMElements().textInput.dispatchEvent(inputEvent);
            }
        })

        //character typing event listener
        uModule.getDOMElements().textInput.addEventListener("input",function(event){
            if(dModule.testEnded()){
                return;
            }
            if(!dModule.testStarted()){
                //start the test
                dModule.startTest();
                //start counter
                var b = setInterval(function(){
                    //calculate results
                    var results = {};
                    [results.wpm, results.wpmChange]=dataModule.calculateWpm();
                    [results.cpm, results.cpmChange]=dataModule.calculateCpm();
                    [results.accuracy, results.accuracyChange]=dataModule.calculateAccuracy();
                    uModule.updateResults(results);

                    //check if there is any time left
                    if(!dModule.timeLeft()){
                        var timeLeft = dModule.reduceTime();
                        uModule.updateTimeLeft(timeLeft);  
                    }else{
                        clearInterval(b);
                        dModule.endTest();

                        //fill modal
                        uModule.fillModal(results.wpm);

                        //show th module
                        uModule.showModal();
                    }
                },1000)
            }
            var typedWord = uModule.getTypedWord();
            dModule.updateCurrentWord(typedWord);
            //format the word
            var currentWord = dModule.getCurrentWord();
            uModule.formatWord(currentWord);
            //check if space or enter was pressed
            if(uModule.spacePressed(event)||uModule.enterPressed(dModule.getLineReturn())){
                uModule.emptyInput();
                uModule.deactivateCurrentWord();
                //move to a new word - data module
                dModule.moveToNewWord();
                //set active word - UI module
                var index = dModule.getCurrentWordIndex();
                uModule.setActiveWord(index);
                //format the active word - UI module
                var currentWord = dModule.getCurrentWord();
                uModule.formatWord(currentWord);
                uModule.scroll();

            }
            console.log(dModule.returnData());
        })
        //resize the window listener - scroll into middle view
        window.addEventListener("resize",uModule.scroll);

        //click on download button event listener
        UIModule.getDOMElements().download.addEventListener("click",function(event){
            if(uModule.isNameEmpty()){
                //style input in red border
                uModule.flagNameInput();
            }else{
                var results = dModule.getCertificateData();
                var name = uModule.getDOMElements().nameInput.value;
                certificateModule.generateCertificate(results, name);
            }
        })
        
        //click on restart button event listener

    };

                    
    return {
        //init function, initializes the test before start
        init: function(duration, textNumber){

            //fill the list of test words - data module
            var words = wModule.getWords(textNumber);
            dModule.fillListOfTestWords(textNumber, words);

            //fill the list of test words - UI module
            var lineReturn = dModule.getLineReturn();
            var testWords = dataModule.getListofTestWords();
            uModule.fillContent(testWords, lineReturn);

            // set total test time - duration param
            dModule.setTestTime(duration);

            //update time left - data module
            dModule.initializeTimeLeft();

            //update time left - UI module
            var timeLeft = dModule.getTimeLeft();
            uModule.updateTimeLeft(timeLeft);

            //move to a new word - data module
            dModule.moveToNewWord();

            //set active word - UI module
            var index = dModule.getCurrentWordIndex();
            uModule.setActiveWord(index);

            //format the active word - UI module
            var currentWord = dModule.getCurrentWord();
            uModule.formatWord(currentWord);

            //focus on the input - UI module
            uModule.inputFocus();

            //add event listeners
            addEventListeners();
        }
    };
             
        
})(dataModule, UIModule, certificateModule, wordsModule);