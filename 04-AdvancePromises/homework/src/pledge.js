'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise(executor) {
    if(typeof executor !== 'function') throw new TypeError('executor function');   //Si lo q recibe por parámetro es algo diferente a una func da err

    this._state = 'pending';         //Siempre la promesa debe estar inicialmente en pending
    this._value = undefined;
    this._handlerGroups=[];
    this.downstreamPromise= 
    executor(this._internalResolve.bind(this), this._internalReject.bind(this));   //Se bindea para q una new promise pueda acceder a ese metodo pasado como parametro
}
$Promise.prototype._internalResolve = function(value){                   
    if (this._state === 'pending') {                        // Si se resuelve cambia el estado de pending a fulfiled
        this._state = 'fulfilled';
        this._value =  value;                               // este value se realiza dentro de pending porq solo se puede dar valor 1 sola vez
        this._callHandlers ();                              // 
    }
};

$Promise.prototype._internalReject = function(value){
    if (this._state === 'pending') {                   //Si no se resuelve cambia el estado de pending a rejected
        this._state = 'rejected';
        this._value =  value;
        this._callHandlers ();
    }
};
$Promise.prototype.then = function (successCb, errorCb) {
  
    if(typeof successCb !== 'function') successCb = false;
    if(typeof errorCb !== 'function') errorCb = false;
    
    
    this._handlerGroups.push({successCb: successCb, errorCb: errorCb});

    if (this._state !== 'pending') this._callHandlers();                //Si el estado no está pending llama al callHandler


};
$Promise.prototype._callHandlers = function () {
    while (this._handlerGroups.length > 0) {

        let current = this._handlerGroups.shift();              //Sacar el primer elemento del array mientrasa tenga elementos

        if (this._state === 'fulfilled') {
            current.successCb && current.successCb(this._value);           //Chequea que la promesa  no esté pending
        } else if (this._state === 'rejected') {
            current.errorCb && current.errorCb(this._value);
        }
    };
    

};
$Promise.prototype.catch = function (errorCb) {
    return this.then(null, errorCb);
}




module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
