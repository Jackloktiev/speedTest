var UIModule = (function(){
    
    //classes used to select HTML elements
    var DOMElements = {
        //indicators - test control
        timeLeft:document.getElementById("time_left"), //HTML element displaying time left
        //test results
        wpm:document.getElementById("wpm"),
        wpmChange:document.getElementById("wpmChange"),
        cpm:document.getElementById("cpm"),
        cpmChange:document.getElementById("cpmChange"),
        accuracy:document.getElementById("accuracy"),
        accuracyChange:document.getElementById("accuracyChange"),
        //user input
        textInput:document.getElementById("input"),
        nameInput:document.getElementById("name"),
        //test words
        content:document.getElementById("content"),
        activeWord:"",
        //modal
        modal:$("#myModal"),
        downloadButton:document.getElementById("download")
    };

    var splitArray = function(string){
        return string.split("");
    }
    var addSpace = function(array){
        array.push(" ");
        return array;
    }
    var addSpanTags = function(array){
        return array.map(function(elem){
            return "<span>"+elem+"</span>";
        })
    }
    var addWordSpanTags = function(array){
        array.push("</span>");
        array.unshift("<span>");
        return array; 
    }
    var joinEachWord = function(array){
        return array.join("");
    }
    var userValue;
    var returnCharacterClass = function(currentChar,index){
        if(index<userValue.length){
            return (currentChar==userValue[index])?"correctCharacter":"wrongCharacter"
        }else{
            return "0"
        }
        
    }
    var updateChange = function (value, changeElement){
        var classToAdd, html;
        [classToAdd,html] = (value>=0)?["scoreUp","+"+value]:["scoreDown",value];

        //add percentage to % change
        if(changeElement==DOMElements.accuracyChange){
            html +="%";
        }

        //update change element
        changeElement.innerHTML = html;
        changeElement.removeAttribute("class");
        changeElement.className = classToAdd;
    }
    return {
        
    //get DOM elements
        
        getDOMElements(){
            return{
                textInput:DOMElements.textInput,
                download:DOMElements.downloadButton,
                nameInput:DOMElements.nameInput
            }
        },
        
    //Indicators - Test Control
    
        updateTimeLeft: function(x){
            DOMElements.timeLeft.innerHTML=x;
        },
        
    //results
        
        updateResults: function(results){
            // update wpm
            DOMElements.wpm.innerHTML = results.wpm;
            DOMElements.cpm.innerHTML = results.cpm;
            DOMElements.accuracy.innerHTML = results.accuracy + "%";
            //update changes
            updateChange(results.wpmChange,DOMElements.wpmChange);
            updateChange(results.cpmChange,DOMElements.cpmChange);
            updateChange(results.accuracyChange,DOMElements.accuracyChange);
        }, 
        
        fillModal: function(wpm){
            var results = {};
                if (wpm < 40){
                    results = {
                        type:"turtle",
                        image:"turtle.jpg",
                        level:"Beginner"
                    }
                }else if (wpm <70){
                    results = {
                        type:"horse",
                        image:"horse.jpg",
                        level:"Average"
                    }
                }else{
                    results = {
                        type:"puma",
                        image:"puma.jpg",
                        level:"Expert"
                    }
                }
            var html = "<div><p>You are a %type%!</p><p>You type at a speed of %wpm% words per minute!</p><img width = '300' height = '200' class = 'rounded-circle' src = 'images/%image%' alt = %alt%/></div>";
            html = html.replace("%type%",results.type);
            html = html.replace("%wpm%",wpm);
            html = html.replace("%image%",results.image);
            html = html.replace("%alt%",results.type);

            //inser html before form group into the modal
            DOMElements.nameInput.insertAdjacentHTML("beforebegin",html);
            
            //store level in the download button
            DOMElements.downloadButton.setAttribute("level",results.level);
        }, 
        
        showModal: function(){
            DOMElements.modal.modal("show");
        },
        
    //user input
    
        inputFocus: function(){
            DOMElements.textInput.focus();
        }, 
        
        isNameEmpty: function(){
            return DOMElements.nameInput.value=="";
        },
        
        flagNameInput: function(){
            DOMElements.nameInput.style.borderColor = "red";
        },   
    
        spacePressed: function(event){
            return event.data==" ";
        }, 
        
        enterPressed: function(lineReturn){
            return this.getTypedWord().includes(lineReturn + " ");
        }, 
        
        emptyInput: function(){
            DOMElements.textInput.value="";
        },  
    
        getTypedWord: function(){
            return DOMElements.textInput.value;
        },
        
    //test words
    
        fillContent: function(array, lineReturn){
            var content = array.map(splitArray);
            content = content.map(addSpace);
            content = content.map(addSpanTags);
            content = content.map(addWordSpanTags);
            content = content.map(joinEachWord);
            content = content.join("");
            content = content.split("<span>"+lineReturn+"</span>");
            content = content.join("<span>&crarr</span>");
            DOMElements.content.innerHTML = content;
        }, 
        
        formatWord: function(wordObject){
            var activeWord = DOMElements.activeWord;
            activeWord.className = "activeWord";

            //format individual characters
            var correctValue = wordObject.value.correct;
            userValue = wordObject.value.user;
            var classes = Array.prototype.map.call(correctValue, returnCharacterClass);
            var activeWord = DOMElements.activeWord;
            var characters = activeWord.children;

            //add classes to children
            for(var i=0; i<characters.length;i++){
                characters[i].removeAttribute("class");
                characters[i].className = classes[i];
            }
        }, 
        
        setActiveWord: function(index){
            DOMElements.activeWord = DOMElements.content.children[index];
        }, 
        
        deactivateCurrentWord: function(){
            DOMElements.activeWord.removeAttribute("class");
        }, 
        
        scroll: function(){
            var activeWord = DOMElements.activeWord;
            var top1 = activeWord.offsetTop;
            var top2 = DOMElements.content.offsetTop;
            var diff= top1-top2-40;
            //scroll content box
            DOMElements.content.scrollTop = diff;
        }
        
    }
})();