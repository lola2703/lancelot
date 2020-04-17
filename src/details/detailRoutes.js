import React from "react";
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {Histoire,Geographie,Chemie,Biologie,Physique,Art,Sport,Litterature,CultureGeneral} from '.'
import GoBack from "./goBack";
import HistoryDetail from '../page/historyDetail';
function DetailRoute() {
  return (
    <div className="DetailRoute">
      <Router>
        <Route path="/histoireDetail" component={HistoryDetail} />
        <GoBack/>
        <Route path="/detailRoute/histoire" component={Histoire} />
        <Route path='/detailRoute/geographie' component={Geographie}/>
        <Route path='/detailRoute/chemie' component={Chemie}/>
        <Route path='/detailRoute/biologie' component={Biologie}/>
        <Route path='/detailRoute/physique' component={Physique}/>
        <Route path='/detailRoute/art' component={Art}/>
        <Route path='/detailRoute/sport' component={Sport}/>
        <Route path='/detailRoute/litterature' component={Litterature}/>
        <Route path='/detailRoute/cultureGeneral' component={CultureGeneral}/>
      </Router>
    </div>
  );
}

export default DetailRoute;
