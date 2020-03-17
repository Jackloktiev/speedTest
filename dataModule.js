var dataModule = (function(){

    var lineReturn = "|";

    //shuffle function
    var shuffle = function(text){
        var newArray = [];
        var randomIndex;
        while(text.length>0){
            randomIndex = Math.floor(Math.random()*text.length);
            newArray.push(text[randomIndex]);
            text.splice(randomIndex,1);
        }
        return newArray;
    }

    //capitalize random function
    String.prototype.capitalize = function(){
        var newString = "";
        var firstCharCap = this.charAt(0).toUpperCase();
        var remainingChar = this.slice(1);
        newString = firstCharCap + remainingChar;
        return newString;
    }
    var capitalizeRandom = function(arrayOfStrings){
        return arrayOfStrings.map(function(word){
            var x = Math.floor(4*Math.random());
            if(x==3){
                return word.capitalize();
            }else{
                return word;
            }
            
        })
    }

    //add random punctuation function
    var addRandomPunctuation = function(arrayOfStrings){
        arrayOfStrings.map(function(word){
            var randomPunctuation;
            var items = ["?",",",",",",",",",",",".",".",".",".","!",":","","","","","","","","","","","","","","","","","","",lineReturn];
            randomIndex = Math.floor(Math.random()*items.length);
            randomPunctuation = items[randomIndex];
            return word+randomPunctuation;
        })
    }
    //calculates # of correct characters inside the current word
    var nbCorrectCharacters; //number of correct characters
    var charCallback = function(currElem,index){
        nbCorrectCharacters+=(currElem == this.characters.user[index])?1:0;
    }

    var appData = {
        indicators: {
            testStarted: false, testEnded: false, totalTestTime: 0, timeLeft: 0
        },
        results: {
            wpm: 0, wpmChange: 0, cpm: 0, cpmChange: 0, accuracy: 0, accuracyChange: 0 ,   numOfCorrectWords: 0, numOfCorrectCharacters: 0 , numOfTestCharacters: 0
        },
        words: {
            currentWordIndex: -1, testWords: [], currentWord: {}
        },
    };


    
    //word constructor
//    {
//      value: {correct: '', user: '' , isCorrect: false },
//      characters: {correct: [], user: [], totalCorrect: 0, totalTest: 0 }
//    }

    var word = function(index){
        this.value = {
            correct:appData.words.testWords[index]+" ",
            user:"",
            isCorrect: false
        }
        this.characters = {
            correct:this.value.correct.split(""),
            user:[],
            totalCorrect: 0,
            totalTest:this.value.correct.length
        }
    };
    
    //update method
    word.prototype.update = function(value){
        this.value.user = value;
        this.value.isCorrect = (this.value.correct==this.value.user);
        this.characters.user = this.value.user.split("");

        nbCorrectCharacters=0; //number of correct characters
        
        var charCallback2 = charCallback.bind(this);
        this.characters.correct.forEach(charCallback2);
        this.characters.totalCorrect = nbCorrectCharacters;
    };
        
    return {
    //indicators - test Control
        
        setTestTime: function(x){
            appData.indicators.totalTestTime = x;
        },//sets the total test time to x

        initializeTimeLeft(){
            appData.indicators.timeLeft = appData.indicators.totalTestTime;
        },//initializes time left to the total test time

        startTest: function(){
            appData.indicators.testStarted = true;
        },//starts the test

        endTest: function(){
            appData.indicators.testEnded = true;
        },//ends the test

        getTimeLeft: function(){
            return appData.indicators.timeLeft;
        },//return the remaining test time
        
        reduceTime: function(){
            appData.indicators.timeLeft --;
            return appData.indicators.timeLeft;
        },// reduces the time by one sec

        timeLeft(){
            return appData.indicators.timeLeft==0;
        },//checks if there is time left to continue the test
        
        testEnded(){
            return appData.indicators.testEnded;
        },//checks if the test has already ended

        testStarted(){
            return appData.indicators.testStarted;
        },//checks if the test has started
        
    //results
        
        calculateWpm: function(){
            var wpmOld = appData.results.wpm;
            var numOfCorrectWords = appData.results.numOfCorrectWords;
            if(appData.indicators.timeLeft!==appData.indicators.totalTestTime){
                appData.results.wpm = Math.round(60*numOfCorrectWords/(appData.indicators.totalTestTime - appData.indicators.timeLeft));
            }else{
                appData.results.wpm = 0;
            }
            appData.results.wpmChange = appData.results.wpm - wpmOld;
            return [appData.results.wpm, appData.results.wpmChange]
        },//calculates wpm and wpmChange and updates them in appData

        calculateCpm: function(){
            var cpmOld = appData.results.cpm;
            var numOfCorrectCharacters = appData.results.numOfCorrectCharacters;
            if(appData.indicators.timeLeft!==appData.indicators.totalTestTime){
                appData.results.cpm = Math.round(60*numOfCorrectCharacters/(appData.indicators.totalTestTime - appData.indicators.timeLeft));
            }else{
                appData.results.cpm = 0;
            }
            appData.results.cpmChange = appData.results.cpm - cpmOld;
            return [appData.results.cpm, appData.results.cpmChange]
        },//calculates cpm and cpmChange and updates them in appData
        
        calculateAccuracy: function(){
            var accuracyOld = appData.results.accuracy;
            var numOfCorrectCharacters = appData.results.numOfCorrectCharacters;
            if(appData.indicators.timeLeft!==appData.indicators.totalTestTime){
                if(appData.results.numOfTestCharacters!=0){
                    appData.results.accuracy = Math.round(100*numOfCorrectCharacters/(appData.results.numOfTestCharacters));
                }else{
                    appData.results.accuracy = 0;
                }
                
            }else{
                appData.results.accuracy = 0;
            }
            appData.results.accuracyChange = appData.results.accuracy - accuracyOld;
            return [appData.results.accuracy, appData.results.accuracyChange]
        },//calculates accuracy and accuracyChange and updates them in appData

    //test words
        // fills words.testWords
        fillListOfTestWords: function(textNumber, words){
            var result = words.split(" ");
            if(textNumber==0){
                //shuffle the words
                result = shuffle(result);
                //capitalize random strings
                result = capitalizeRandom(result);
                //add random punctuation
                result = addRandomPunctuation(result);
            }
            
            appData.words.testWords = result;
        },

        getListofTestWords(){
            return appData.words.testWords; 
        },// get list of test words: words.testWords

        moveToNewWord: function(){
            if(appData.words.currentWordIndex > -1){
                if(appData.words.currentWord.value.isCorrect==true){
                    appData.results.numOfCorrectWords ++;
                }
                appData.results.numOfCorrectCharacters +=appData.words.currentWord.characters.totalCorrect;
                appData.results.numOfTestCharacters += appData.words.currentWord.characters.totalTest;
            }
            appData.words.currentWordIndex++;
            var newWord = new word(appData.words.currentWordIndex);
            appData.words.currentWord = newWord;
        },// increments the currentWordIndex - updates the current word (appData.words.currentWord) by creating a new instance of the word class - updates numOfCorrectWords, numOfCorrectCharacters and numOfTestCharacters
        
        getCurrentWordIndex(){
            return appData.words.currentWordIndex;
        },

        getCurrentWord(){
            var currentWord = appData.words.currentWord;
            return {
                value:{
                    correct:currentWord.value.correct,
                    user:currentWord.value.user
                }
            };
        },
        updateCurrentWord: function(value){
            appData.words.currentWord.update(value);
        },// updates current word using user input

        getLineReturn: function (){
            return lineReturn;
        },

        getCertificateData: function(){
            return {
                wpm:appData.results.wpm,
                accuracy:appData.results.accuracy
            }
        },

        returnData(){
            return appData;
        }


        

    }
    
})();