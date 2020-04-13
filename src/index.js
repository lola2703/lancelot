import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import  './css/dashboard.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'axios-progress-bar/dist/nprogress.css'
import { loadProgressBar } from 'axios-progress-bar'
import axios from 'axios';
import LocalizedStrings from 'react-localization';



localStorage.clear();
localStorage.setItem('API_URL', 'https://lancelot.education/backend/public/');
//localStorage.setItem('API_URL', 'http://192.168.2.15:4000');

var object = [];
var Lang = '';
axios.get(localStorage.getItem('API_URL')+'/language')
    .then(function(response) {
        for (var key in response.data) {
            // skip loop if the property is from prototype
            if (!response.data.hasOwnProperty(key)) continue;
            var obj = response.data[key];
            object[key] = [];
            for (var prop in obj) {
                // skip loop if the property is from prototype
                if(!obj.hasOwnProperty(prop)) continue;
                object[key][prop] = obj[prop];
            }
        }
        Lang = new LocalizedStrings(object);

       // if (localStorage.getItem('LANGUAGE') == false) {
        if (localStorage.getItem('API_URL') == 'http://192.168.2.15:4000') {
            localStorage.setItem('LANGUAGE', 'de');
        } else {
            localStorage.setItem('LANGUAGE', 'fr');
        }

           Lang.setLanguage(localStorage.getItem('LANGUAGE'));
      //  }

        loadProgressBar();
        ReactDOM.render(<App lang={Lang} err={false}/>, document.getElementById('root'));
    })
    .catch(function (err) {
        loadProgressBar();
        ReactDOM.render(<App lang={Lang} err={true}/>, document.getElementById('root'));
    });




