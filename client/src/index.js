import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import UserContext from './context/userContext';

import '../src/css/index.css';

//Components
import ToolBar from './components/toolBar';
import SideDrawer from './components/sideDrawer';
import BackDrop from './components/backDrop';
import Map from './components/map';
import AdminPanel from './components/adminPanel';

function App(){
  const [sideDrawerOpen,setSideDrawer] = useState(false);
  const [hamburger,setHamburger] = useState('hamburger');
  const [terms, setTerms] = useState(true);
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined
  })

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem('auth-token');
      if(token === null){
        localStorage.setItem('auth-token', '');
        token = '';
      }
      //Checking if access token valid
      const tokenRes = await axios.post('/api/users/tokenIsValid', null, {headers: {
        'x-auth-token': token
      }}).catch( err => {
        setUserData({token: null, user: null})
      })
      //Creating new access token if the previous access token and the refresh token are valid
      if(tokenRes){
        if(tokenRes.data.isValid){
          const id = tokenRes.data.id;
          axios.post('/api/users/newToken', {id}).then(res => {
            localStorage.setItem('auth-token', res.data.token);
            setUserData({
              token: res.data.token,
              user: res.data.user
            });
          })
        }
      }
      else{
        setUserData({
          token: undefined,
          user: undefined
        });
        localStorage.setItem('auth-token', '');
      }
    };
    try{
    checkLoggedIn();
    } catch(err) {
      console.log(err)
    }
  })
  

  const drawerToggleClickHandler = () => {
    if(sideDrawerOpen){
      setHamburger('hamburger')
      setSideDrawer(false)
    }
    else{
      setHamburger('hamburger is-active')
      setSideDrawer(true)
    }
  }
 const backDropClickHandler = () => {
    setSideDrawer(false);
  }

  let backDrop;
  if(sideDrawerOpen){
    backDrop = <BackDrop click={backDropClickHandler} />;
  }

  return(
    <div>
      <BrowserRouter>
      <UserContext.Provider value={{userData, setUserData}}>
      <ToolBar drawerClickHandler={drawerToggleClickHandler} hamburger={hamburger}/>
      <SideDrawer show={sideDrawerOpen}  drawerClickHandler={drawerToggleClickHandler}/>
      {backDrop}
        <Switch>
          <Route path='/' exact render={(props) => <Map {...props} terms={terms} setTerms={setTerms}/>}/>
          <Route path='/login' component={AdminPanel}/>
        </Switch>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  )
}

ReactDOM.render(<App/>,document.querySelector('#root'));
