//classes
//regras de negocio
class CalcController{

    constructor(){
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        //associando o java script com o html
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this.initButtonsEvents();

        //this._displayCalc = "0"; //_private
        this._currentDate;
        this.initialize();
        this.initKeyboard();
        

    }

    pasteFromClipboard(){
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text); 


            console.log('text', text);
        });
    }

    copyToClipboard(){
        //cria elementos na tela dinamicamente
        let input = document.createElement('input');
        input.value = this.displayCalc;

        // incluindo dinamicament o elemnto criado
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();
        
    }

    initialize(){
        
        //this._displayCalcEl.innerHTML = "4567";
        //this._dateEl.innerHTML = "01/05/2018";
        //this._timeEl.innerHTML = "00:00";

        this.setDisplayDateTime();

        let interval = setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        /*
        setTimeout(() => {
            clearInterval(interval);
        }, 10000);
        */

       this.setLastNumberToDisplay();
       this.pasteFromClipboard();
       document.querySelectorAll('.btn-ac').forEach(btn=>{
           btn.addEventListener('dblclick', e=>{
               this.toggleAudio();
           })
       })

    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff;
        //this._audioOnOf = (this._audioOnOf) ? false : true;
        /*
        if(this._audioOnOff){
            this._audioOnOff = false;
        }else{
            this._audioOnOff = true;
        }
        */
         
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyboard(){

        document.addEventListener('keyup', e=>{
            //console.log(e.key);

            this.playAudio();

            switch(e.key){
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                break;
    
                case '.':
                case ',':
                    this.addDot();
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                //console.log('C',typeof value)
                //console.log('B', typeof parseInt(value));
                    this.addOperation(parseInt(e.key));
    
                    //console.log("teste142")
                    break;  
                case 'c':
                    //console.log('caseControl')
                    if (e.ctrlKey) this.copyToClipboard();
                    break;
                    
            }

        });

    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });

    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    clearEntry(){
        this._operation.pop();
        
        this.setLastNumberToDisplay();
    }

    getLastOperation(){
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value){
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1);
    }

    pushOperation(value){

        this._operation.push(value);

        if(this._operation.length > 3){
            console.log(this._operation);
            this.calc();
        }

    }

    getResult(){

        try{
        //console.log('getResult', this._operation);
        return eval(this._operation.join(""));
        }catch(e){
            //console.log(e);
            setTimeout(()=>{
                this.setError();
            }, 1);
        }
    }

    calc(){

        let last = '';
        this._lastOperator = this.getLastItem();
        
        if(this._operation.length < 3 ){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3 ){
            //remove the last item from the array
            last = this._operation.pop();
            this._lastNumber = this.getResult();

        }else if (this._operation.length == 3){
            this._lastNumber = this.getLastItem(false);
        }


        //console.log('lastOperator',this._lastOperator);
        //console.log('lastNumber',this._lastNumber);
        //inverse of split
        //eval interprets the string in a command
        let result = this.getResult();
        if (last == '%'){

            result  /= 100;
            this._operation = [result];

        }else{

            this._operation = [result];

            if (last) this._operation.push(last);
            
        }


        //atualizar o display
        this.setLastNumberToDisplay();
        
    }   

    getLastItem(isOperator = true){

        let lastItem;

        
        for (let i = this._operation.length - 1; i >= 0; i--){
                //if (isOperator){
                    
                    if(this.isOperator(this._operation[i]) ==  isOperator){
                        lastItem = this._operation[i];
                        break;
                //}
            }
        }

        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
       

        return lastItem;
    }
    
    setLastNumberToDisplay(){

        
        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;


    }

    addOperation(value){

        //console.log('addO', typeof value)
        //console.log('A', typeof this.getLastOperation());

        if (isNaN(this.getLastOperation())){
            //string
            //console.log('L112', value);
            if(this.isOperator(value)){
                //trocar o operador
                this.setLastOperation(value);
            
            }else{
                //console.log("L122")
                this.pushOperation(value);
                //atualizar o display
                this.setLastNumberToDisplay();
            }

        } else {
           // console.log('L127', value);
            //se o valor for um operador
            if(this.isOperator(value)){
                //console.log('L130', value);
                this.pushOperation(value);

            }else{

            
            //console.log('L134', value);
            //number
            //console.log("teste87");
            let newValue = this.getLastOperation().toString() + value.toString();
            //adiciona um valor ao array
            
            this.setLastOperation(newValue);

            //atualizar o display
            this.setLastNumberToDisplay();

            }
        }


        //console.log(this._operation);
        
    }

    setError(){
        this.displayCalc = "Error";
    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1 ) return;

        if (this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();

    }

    execBtn(value){

        this.playAudio();

        switch(value){
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');            
                break;
            case 'divisao':
                this.addOperation('/');            
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
            break;

            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            //console.log('C',typeof value)
            //console.log('B', typeof parseInt(value));
                this.addOperation(parseInt(value));

                //console.log("teste142")
                break;

            dafault:
                this.setError();
                break;

        }
    }

    initButtonsEvents(){
        //associa com os botoes da calculadora
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        //captura os eventos associados ao objeto
        buttons.forEach((btn, index)=>{
            this.addEventListenerAll(btn, "click drag", e=>{
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execBtn(textBtn);
            }); 
            
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e=>{
                btn.style.cursor = "pointer";
            })
        });
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    set displayTime(value){
        this._timeEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
        this._dateEl.innerHTML = value;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        if (value.toString().length > 10){
            this.setError();
            return false;

        }
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date() ;
    }

    set currentDate(value){
        this._currentDate;
    }

}